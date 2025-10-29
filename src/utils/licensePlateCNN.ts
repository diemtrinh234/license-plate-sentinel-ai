import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let ocrPipeline: any = null;

// Initialize OCR pipeline
async function initOCRPipeline() {
  if (!ocrPipeline) {
    console.log('Initializing OCR pipeline with WebGPU...');
    try {
      ocrPipeline = await pipeline(
        'image-to-text',
        'Xenova/trocr-small-printed',
        { device: 'webgpu' }
      );
      console.log('OCR pipeline initialized successfully');
    } catch (error) {
      console.warn('WebGPU not available, falling back to WASM:', error);
      ocrPipeline = await pipeline(
        'image-to-text',
        'Xenova/trocr-small-printed'
      );
    }
  }
  return ocrPipeline;
}

// Preprocess image for better OCR results
function preprocessImage(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert to grayscale and increase contrast
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    // Increase contrast
    const contrast = 1.5;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const adjusted = factor * (gray - 128) + 128;
    const final = Math.max(0, Math.min(255, adjusted));
    
    data[i] = data[i + 1] = data[i + 2] = final;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Clean and format detected text
function cleanPlateText(text: string): string {
  // Remove spaces and special characters
  let cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Common OCR corrections for Vietnamese license plates
  cleaned = cleaned
    .replace(/O/g, '0')  // O to 0
    .replace(/I/g, '1')  // I to 1
    .replace(/S/g, '5')  // S to 5
    .replace(/B/g, '8')  // B to 8
    .replace(/Z/g, '2'); // Z to 2
  
  return cleaned;
}

// Validate Vietnamese license plate format
function isValidVietnamesePlate(text: string): boolean {
  // Vietnamese license plate patterns:
  // XX-Y ZZZZ (old format)
  // XXY-ZZZZ (new format)
  // Where X = number, Y = letter, Z = number
  const patterns = [
    /^\d{2}[A-Z]\d{4,5}$/,     // 29A12345
    /^\d{2}[A-Z]{1,2}\d{4}$/,  // 29AB1234
  ];
  
  return patterns.some(pattern => pattern.test(text));
}

export interface CNNRecognitionResult {
  success: boolean;
  plate: string | null;
  confidence: number;
  message?: string;
  rawText?: string;
}

export async function recognizePlateWithCNN(
  canvas: HTMLCanvasElement
): Promise<CNNRecognitionResult> {
  try {
    console.log('Starting CNN-based license plate recognition...');
    
    // Initialize pipeline
    const ocr = await initOCRPipeline();
    
    // Preprocess image
    const processedCanvas = document.createElement('canvas');
    processedCanvas.width = canvas.width;
    processedCanvas.height = canvas.height;
    const ctx = processedCanvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get canvas context');
    
    ctx.drawImage(canvas, 0, 0);
    preprocessImage(processedCanvas);
    
    // Convert to base64
    const imageData = processedCanvas.toDataURL('image/jpeg', 0.9);
    
    console.log('Processing with OCR model...');
    
    // Run OCR
    const result = await ocr(imageData);
    console.log('OCR raw result:', result);
    
    if (!result || !result[0]?.generated_text) {
      return {
        success: false,
        plate: null,
        confidence: 0,
        message: 'Không phát hiện được văn bản'
      };
    }
    
    const rawText = result[0].generated_text;
    const cleanedText = cleanPlateText(rawText);
    
    console.log('Raw text:', rawText);
    console.log('Cleaned text:', cleanedText);
    
    // Validate format
    const isValid = isValidVietnamesePlate(cleanedText);
    
    if (!isValid || cleanedText.length < 6) {
      return {
        success: false,
        plate: cleanedText || null,
        confidence: 0.3,
        message: 'Biển số không hợp lệ hoặc không rõ ràng',
        rawText
      };
    }
    
    // Calculate confidence based on validation
    const confidence = isValid ? 0.85 : 0.5;
    
    return {
      success: true,
      plate: cleanedText,
      confidence,
      message: 'Nhận dạng thành công',
      rawText
    };
    
  } catch (error) {
    console.error('CNN recognition error:', error);
    return {
      success: false,
      plate: null,
      confidence: 0,
      message: error instanceof Error ? error.message : 'Lỗi không xác định'
    };
  }
}

// Preload model for faster first recognition
export async function preloadCNNModel(): Promise<void> {
  try {
    console.log('Preloading CNN model...');
    await initOCRPipeline();
    console.log('CNN model preloaded successfully');
  } catch (error) {
    console.error('Failed to preload CNN model:', error);
  }
}
