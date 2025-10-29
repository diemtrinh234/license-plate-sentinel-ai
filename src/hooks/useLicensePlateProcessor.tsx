
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  ImageQuality,
  ProcessingStage,
  PlateBox
} from '@/utils/licensePlateUtils';
import { recognizePlate, saveScanToDatabase } from '@/utils/licensePlateAI';
import { preloadCNNModel } from '@/utils/licensePlateCNN';

interface UseLicensePlateProcessorProps {
  onDetection?: (plate: string, confidence: number) => void;
}

export function useLicensePlateProcessor({ onDetection }: UseLicensePlateProcessorProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const recognitionIntervalRef = useRef<number | null>(null);
  
  const [licensePlate, setLicensePlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [imageQuality, setImageQuality] = useState<ImageQuality>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [plateDetected, setPlateDetected] = useState(false);
  const [plateDetectionConfidence, setPlateDetectionConfidence] = useState(0);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [plateBox, setPlateBox] = useState<PlateBox>(null);

  // Process uploaded image with AI recognition
  const processUploadedImage = async () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    setProcessingStage('recognizing');
    
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      setIsProcessing(false);
      return;
    }
    
    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image to canvas
    context.drawImage(img, 0, 0, img.width, img.height);
    
    try {
      // Use CNN to recognize license plate
      const result = await recognizePlate(canvas, 'cnn');
      
      if (result.success && result.plate) {
        setLicensePlate(result.plate);
        setConfidence(result.confidence);
        setImageQuality('good');
        setPlateDetected(true);
        setPlateDetectionConfidence(result.confidence);
        
        // Save to database
        const saved = await saveScanToDatabase(result.plate, result.confidence, 'upload');
        
        // Call the onDetection callback if provided
        if (onDetection) {
          onDetection(result.plate, result.confidence);
        }
        
        toast({
          title: "Biển số được nhận diện",
          description: `Đã xác định biển số: ${result.plate}${saved ? ' và lưu vào lịch sử' : ''}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Không phát hiện biển số xe",
          description: result.message || "Hãy đảm bảo ảnh có chứa biển số xe và rõ nét.",
        });
      }
      
      setProcessingStage('idle');
      setIsProcessing(false);
    } catch (err) {
      console.error("Error processing image:", err);
      setIsProcessing(false);
      setProcessingStage('idle');
      toast({
        variant: "destructive",
        title: "Lỗi xử lý ảnh",
        description: "Không thể xử lý ảnh. Vui lòng thử lại với ảnh khác.",
      });
    }
  };

  // Recognize license plate from video with AI
  const recognizeLicensePlateFromVideo = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    
    setIsProcessing(true);
    setProcessingStage('recognizing');
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      setIsProcessing(false);
      return;
    }
    
    // Check if video has metadata loaded and dimensions are valid
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.log("Video dimensions not ready yet");
      setIsProcessing(false);
      return;
    }
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      // Use CNN to recognize license plate
      const result = await recognizePlate(canvas, 'cnn');
      
      if (result.success && result.plate) {
        setLicensePlate(result.plate);
        setConfidence(result.confidence);
        setImageQuality('good');
        setPlateDetected(true);
        setPlateDetectionConfidence(result.confidence);
        
        // Save to database
        const saved = await saveScanToDatabase(result.plate, result.confidence, 'camera');
        
        // Call the onDetection callback if provided
        if (onDetection) {
          onDetection(result.plate, result.confidence);
        }
        
        toast({
          title: "Biển số được nhận diện",
          description: `Đã xác định biển số: ${result.plate}${saved ? ' và lưu vào lịch sử' : ''}`,
        });
        
        // Stop recognition after successful detection
        if (recognitionIntervalRef.current !== null) {
          window.clearInterval(recognitionIntervalRef.current);
          recognitionIntervalRef.current = null;
        }
      } else {
        console.log("No license plate detected in this frame");
      }
      
      setProcessingStage('idle');
      setIsProcessing(false);
    } catch (err) {
      console.error("Error processing video frame:", err);
      setIsProcessing(false);
      setProcessingStage('idle');
    }
  };

  // Handle image upload
  const handleImageUpload = (file: File) => {
    // Create object URL for the uploaded image
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setLicensePlate(null);
    setPlateDetected(false);
    setPlateDetectionConfidence(0);
    setProcessingStage('idle');
    setPlateBox(null);
    
    // Load the image
    const img = new window.Image();
    img.onload = () => {
      imageRef.current = img;
      // Process the image after it's loaded
      processUploadedImage();
    };
    img.src = imageUrl;

    toast({
      title: "Hình ảnh đã được tải lên",
      description: "Đang xử lý biển số xe...",
    });
  };

  // Handle manual plate input
  const handleManualSearch = (manualPlate: string) => {
    // Format the manual input to match plate format (if needed)
    let formattedPlate = manualPlate.trim().toUpperCase();
    
    // Simple regex validation for Vietnamese license plate
    const plateRegex = /^(\d{2}[A-Z]|\d{2}-\d{3}|\d{2}[A-Z]-\d{3}|\d{2}[A-Z]-\d{3}\.\d{2})$/;
    if (!plateRegex.test(formattedPlate) && !formattedPlate.includes('-')) {
      // Try to format it properly
      if (formattedPlate.length >= 5) {
        const province = formattedPlate.substring(0, 3);
        const numbers = formattedPlate.substring(3);
        formattedPlate = `${province}-${numbers}`;
      }
    }
    
    setLicensePlate(formattedPlate);
    setConfidence(0.9); // High confidence for manual input
    setImageQuality('good');
    setPlateDetected(true); // Assume plate is valid for manual input
    setPlateDetectionConfidence(1.0);
    
    // Call the onDetection callback if provided
    if (onDetection) {
      onDetection(formattedPlate, 0.9);
    }
    
    toast({
      title: "Biển số đã nhập",
      description: `Đang kiểm tra biển số: ${formattedPlate}`,
    });
  };

  // Retake/rescan license plate
  const handleRetake = () => {
    setLicensePlate(null);
    setConfidence(0);
    setImageQuality(null);
    setPlateDetected(false);
    setPlateDetectionConfidence(0);
    setPlateBox(null);
    setProcessingStage('idle');
    
    if (uploadedImage) {
      // If we have an uploaded image, process it again
      processUploadedImage();
    }
  };

  // Cancel image upload
  const handleCancelUpload = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
      setUploadedImage(null);
    }
  };

  // Setup/clear recognition interval
  const setupRecognitionInterval = (videoRef: React.RefObject<HTMLVideoElement>) => {
    // Clear any existing interval first
    if (recognitionIntervalRef.current !== null) {
      window.clearInterval(recognitionIntervalRef.current);
    }
    
    // Start a new recognition interval
    recognitionIntervalRef.current = window.setInterval(() => {
      recognizeLicensePlateFromVideo(videoRef);
    }, 2000);
    
    // Call recognition once immediately
    recognizeLicensePlateFromVideo(videoRef);
  };

  // Clear recognition interval
  const clearRecognitionInterval = () => {
    if (recognitionIntervalRef.current !== null) {
      window.clearInterval(recognitionIntervalRef.current);
      recognitionIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  const cleanup = () => {
    clearRecognitionInterval();
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
  };
  return {
    canvasRef,
    licensePlate,
    confidence,
    imageQuality,
    isProcessing,
    uploadedImage,
    plateDetected,
    plateDetectionConfidence,
    processingStage,
    plateBox,
    processUploadedImage,
    recognizeLicensePlateFromVideo,
    handleImageUpload,
    handleManualSearch,
    handleRetake,
    handleCancelUpload,
    setupRecognitionInterval,
    clearRecognitionInterval,
    setUploadedImage,
    setLicensePlate,
    cleanup
  };
}
