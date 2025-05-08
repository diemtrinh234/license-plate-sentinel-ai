// Simulated model parameters
export const detectionConfidenceThreshold = 0.75; // Minimum confidence for plate detection
export const recognitionConfidenceThreshold = 0.85; // Minimum confidence for plate recognition

// Mock quality assessment values
export const qualityThresholds = {
  good: 0.8,
  medium: 0.6,
  poor: 0
};

// Types
export type ImageQuality = 'good' | 'medium' | 'poor' | null;
export type PlateBox = {x: number, y: number, width: number, height: number} | null;
export type ProcessingStage = 'idle' | 'detecting' | 'recognizing';

// First stage: Detect if there's a license plate in the image
export const detectLicensePlate = (imageData: ImageData): {
  detected: boolean; 
  confidence: number; 
  box?: {x: number, y: number, width: number, height: number};
} => {
  // This is a simulated detection model
  // In a real app, you'd use a trained ML model for plate detection
  
  // For simulation, generate a detection confidence based on image quality
  const qualityScore = assessImageQuality(imageData);
  
  // Increase detection probability for better demo experience
  let detectionProbability = Math.min(0.98, qualityScore * 0.9 + Math.random() * 0.2);
  
  if (detectionProbability >= detectionConfidenceThreshold) {
    // Simulate detected plate position - in a real app this would come from the model
    const canvasWidth = imageData.width;
    const canvasHeight = imageData.height;
    
    // Generate a box in the center-ish area of the image
    // This simulates where a license plate might typically be found
    const centerX = canvasWidth * (0.4 + Math.random() * 0.2); // somewhere in the middle section
    const centerY = canvasHeight * (0.4 + Math.random() * 0.2); // somewhere in the middle section
    
    const boxWidth = canvasWidth * (0.2 + Math.random() * 0.15); // ~20-35% of image width
    const boxHeight = boxWidth * (0.3 + Math.random() * 0.1); // aspect ratio ~3:1 to 4:1
    
    const box = {
      x: centerX - boxWidth/2,
      y: centerY - boxHeight/2,
      width: boxWidth,
      height: boxHeight
    };
    
    return {
      detected: true,
      confidence: detectionProbability,
      box: box
    };
  }
  
  return {
    detected: false,
    confidence: detectionProbability
  };
};

// Second stage: Recognize text in the detected license plate
export const recognizeLicensePlateText = (
  plateConfidence: number,
  qualityScore: number
): { text: string | null; confidence: number } => {
  // This is a simulated recognition model
  // In a real app, you'd use OCR or a specialized recognition model
  
  // Only recognize with high enough detection confidence and quality
  if (plateConfidence >= detectionConfidenceThreshold) {
    // Generate a simulated recognition confidence
    // Better quality and detection = higher recognition chance
    const recognitionProbability = Math.min(
      0.98, 
      plateConfidence * 0.8 + qualityScore * 0.2 + Math.random() * 0.12
    );
    
    if (recognitionProbability >= recognitionConfidenceThreshold) {
      // Generate a random but realistic Vietnamese license plate
      // Prioritize plates from the vehicle database to increase "hit" rate
      const useSamplePlate = Math.random() > 0.3; // 70% chance to use a plate from database
      
      if (useSamplePlate) {
        // Import and use the vehicle database
        const { vehicleDatabase } = require('./vehicleUtils');
        if (vehicleDatabase && vehicleDatabase.length > 0) {
          const randomIndex = Math.floor(Math.random() * vehicleDatabase.length);
          const plate = vehicleDatabase[randomIndex].licensePlate;
          
          return {
            text: plate,
            confidence: recognitionProbability
          };
        }
      }
      
      // Otherwise generate a random plate
      const provinces = ['43A', '51G', '92C', '74D', '38H', '43B'];
      const province = provinces[Math.floor(Math.random() * provinces.length)];
      const numbers = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
      const formattedNumbers = numbers.substring(0, 3) + '.' + numbers.substring(3);
      const plate = `${province}-${formattedNumbers}`;
      
      return {
        text: plate,
        confidence: recognitionProbability
      };
    }
  }
  
  return {
    text: null,
    confidence: 0
  };
};

// Assess image quality
export const assessImageQuality = (imageData: ImageData): number => {
  // This is a simulated quality assessment
  // In a real app, you would analyze contrast, brightness, blur, etc.
  
  // Simulate quality assessment based on image properties
  const data = imageData.data;
  
  // Calculate average brightness
  let brightness = 0;
  for (let i = 0; i < data.length; i += 4) {
    brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  brightness /= (data.length / 4);
  
  // Calculate contrast (simplified)
  let minVal = 255;
  let maxVal = 0;
  
  for (let i = 0; i < data.length; i += 20) { // Sample every 20th pixel for performance
    const pixelValue = (data[i] + data[i + 1] + data[i + 2]) / 3;
    minVal = Math.min(minVal, pixelValue);
    maxVal = Math.max(maxVal, pixelValue);
  }
  
  const contrast = Math.min(1, (maxVal - minVal) / 255);
  
  // Normalize brightness (0-255) to quality score (0-1) and combine with contrast
  const normalizedBrightness = brightness / 255;
  const qualityScore = (normalizedBrightness * 0.6) + (contrast * 0.4);
  
  // Slightly boost quality score for better demo experience
  return Math.min(1, qualityScore * 1.3);
};
