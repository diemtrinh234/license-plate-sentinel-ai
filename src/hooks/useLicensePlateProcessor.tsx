
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  detectLicensePlate, 
  recognizeLicensePlateText, 
  assessImageQuality,
  qualityThresholds,
  ImageQuality,
  ProcessingStage,
  PlateBox
} from '@/utils/licensePlateUtils';

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

  // Process uploaded image with two-stage recognition
  const processUploadedImage = () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    setProcessingStage('detecting');
    
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
      // Get image data for processing
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Assess image quality
      const qualityScore = assessImageQuality(imageData);
      
      // Determine quality category
      let qualityCategory: ImageQuality;
      if (qualityScore >= qualityThresholds.good) {
        qualityCategory = 'good';
      } else if (qualityScore >= qualityThresholds.medium) {
        qualityCategory = 'medium';
      } else {
        qualityCategory = 'poor';
      }
      
      setImageQuality(qualityCategory);
      
      // FIRST STAGE: Detect if there's a license plate in the image
      setTimeout(() => {
        // Detect license plate in the image
        const plateDetection = detectLicensePlate(imageData);
        setPlateDetected(plateDetection.detected);
        setPlateDetectionConfidence(plateDetection.confidence);
        
        if (plateDetection.box) {
          setPlateBox(plateDetection.box);
          
          // Draw bounding box on canvas if detected
          if (context && plateDetection.detected) {
            // Clear canvas and redraw image
            context.drawImage(img, 0, 0, img.width, img.height);
            
            // Draw bounding box
            context.strokeStyle = '#10b981'; // Green color
            context.lineWidth = 3;
            context.strokeRect(
              plateDetection.box.x, 
              plateDetection.box.y, 
              plateDetection.box.width, 
              plateDetection.box.height
            );
          }
        }
        
        if (plateDetection.detected) {
          toast({
            title: "Phát hiện biển số xe",
            description: `Độ tin cậy: ${(plateDetection.confidence * 100).toFixed(1)}%`,
          });
          
          // Move to stage 2: recognize the text
          setProcessingStage('recognizing');
          
          // SECOND STAGE: Recognize the text in the detected plate
          setTimeout(() => {
            const recognitionResult = recognizeLicensePlateText(
              plateDetection.confidence,
              qualityScore
            );
            
            if (recognitionResult.text) {
              setLicensePlate(recognitionResult.text);
              setConfidence(recognitionResult.confidence);
              
              // Call the onDetection callback if provided
              if (onDetection) {
                onDetection(recognitionResult.text, recognitionResult.confidence);
              }
              
              toast({
                title: "Biển số được nhận diện",
                description: `Đã xác định biển số: ${recognitionResult.text}`,
              });
            } else {
              toast({
                variant: "destructive",
                title: "Không thể đọc biển số",
                description: "Hệ thống đã phát hiện biển số nhưng không thể đọc được nội dung.",
              });
            }
            
            setProcessingStage('idle');
            setIsProcessing(false);
          }, 1000);
        } else {
          toast({
            variant: "destructive",
            title: "Không phát hiện biển số xe",
            description: "Hãy đảm bảo ảnh có chứa biển số xe và rõ nét.",
          });
          setProcessingStage('idle');
          setIsProcessing(false);
        }
      }, 1000);
    } catch (err) {
      console.error("Error processing image:", err);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Lỗi xử lý ảnh",
        description: "Không thể xử lý ảnh. Vui lòng thử lại với ảnh khác.",
      });
    }
  };

  // Recognize license plate from video with two-stage model
  const recognizeLicensePlateFromVideo = (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    
    setIsProcessing(true);
    setProcessingStage('detecting');
    
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
      // Get image data for processing
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Assess image quality
      const qualityScore = assessImageQuality(imageData);
      
      // Determine quality category
      let qualityCategory: ImageQuality;
      if (qualityScore >= qualityThresholds.good) {
        qualityCategory = 'good';
      } else if (qualityScore >= qualityThresholds.medium) {
        qualityCategory = 'medium';
      } else {
        qualityCategory = 'poor';
      }
      
      setImageQuality(qualityCategory);
      
      // FIRST STAGE: Detect if there's a license plate in the image
      setTimeout(() => {
        // Detect license plate in the frame
        const plateDetection = detectLicensePlate(imageData);
        setPlateDetected(plateDetection.detected);
        setPlateDetectionConfidence(plateDetection.confidence);
        
        if (plateDetection.box) {
          setPlateBox(plateDetection.box);
        }
        
        if (plateDetection.detected) {
          console.log(`License plate detected with confidence: ${(plateDetection.confidence * 100).toFixed(1)}%`);
          
          // Move to stage 2: recognize the text
          setProcessingStage('recognizing');
          
          // Draw bounding box on video overlay if detected
          if (context && plateDetection.box && plateDetection.detected) {
            // Draw detection box
            context.lineWidth = 3;
            context.strokeStyle = '#10b981'; // Green color
            context.strokeRect(
              plateDetection.box.x, 
              plateDetection.box.y, 
              plateDetection.box.width, 
              plateDetection.box.height
            );
            
            // Add detection confidence text
            context.font = '16px sans-serif';
            context.fillStyle = '#10b981';
            context.fillText(
              `Detection: ${(plateDetection.confidence * 100).toFixed(1)}%`,
              plateDetection.box.x,
              plateDetection.box.y - 10
            );
          }
          
          // SECOND STAGE: Recognize the text in the detected plate
          setTimeout(() => {
            if (qualityScore >= qualityThresholds.medium) {
              const recognitionResult = recognizeLicensePlateText(
                plateDetection.confidence,
                qualityScore
              );
              
              if (recognitionResult.text) {
                setLicensePlate(recognitionResult.text);
                setConfidence(recognitionResult.confidence);
                
                // Call the onDetection callback if provided
                if (onDetection) {
                  onDetection(recognitionResult.text, recognitionResult.confidence);
                }
                
                toast({
                  title: "Biển số được nhận diện",
                  description: `Đã xác định biển số: ${recognitionResult.text}`,
                });
                
                // Stop recognition after successful detection
                if (recognitionIntervalRef.current !== null) {
                  window.clearInterval(recognitionIntervalRef.current);
                  recognitionIntervalRef.current = null;
                }
              }
            } else {
              console.log(`Image quality too low for accurate recognition: ${(qualityScore * 100).toFixed(2)}%`);
              
              // If quality is poor, show guidance toast
              if (qualityCategory === 'poor') {
                toast({
                  variant: "destructive",
                  title: "Chất lượng hình ảnh kém",
                  description: "Hãy đảm bảo ánh sáng tốt và camera đủ gần với biển số.",
                });
              }
            }
            
            setProcessingStage('idle');
            setIsProcessing(false);
          }, 500);
        } else {
          console.log("No license plate detected in this frame");
          setProcessingStage('idle');
          setIsProcessing(false);
        }
      }, 500);
    } catch (err) {
      console.error("Error processing image:", err);
      setIsProcessing(false);
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
