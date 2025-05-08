import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';

// Import our utilities and types
import { 
  detectLicensePlate, 
  recognizeLicensePlateText, 
  assessImageQuality,
  qualityThresholds,
  ImageQuality,
  ProcessingStage
} from '@/utils/licensePlateUtils';

// Import our components
import CameraControl from './licensePlate/CameraControl';
import ImageUploader from './licensePlate/ImageUploader';
import ManualPlateInput from './licensePlate/ManualPlateInput';
import PlateResult from './licensePlate/PlateResult';
import ScanningOverlay from './licensePlate/ScanningOverlay';
import ProcessingOverlay from './licensePlate/ProcessingOverlay';
import EmptyState from './licensePlate/EmptyState';
import ErrorDisplay from './licensePlate/ErrorDisplay';

interface LicensePlateProps {
  onDetection?: (plate: string, confidence: number) => void;
}

const LicensePlateScanner: React.FC<LicensePlateProps> = ({ onDetection }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [licensePlate, setLicensePlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [imageQuality, setImageQuality] = useState<ImageQuality>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const recognitionIntervalRef = useRef<number | null>(null);
  
  // States for plate detection
  const [plateDetected, setPlateDetected] = useState(false);
  const [plateDetectionConfidence, setPlateDetectionConfidence] = useState(0);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [plateBox, setPlateBox] = useState<{x: number, y: number, width: number, height: number} | null>(null);

  // Start the camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setError(null);
        setUploadedImage(null); // Clear any uploaded image
        setPlateDetected(false); // Reset plate detection state
        setPlateDetectionConfidence(0);
        setProcessingStage('idle');
        setPlateBox(null);
        
        toast({
          title: "Camera kích hoạt thành công",
          description: "Đang quét biển số xe...",
        });
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera của trình duyệt.');
      toast({
        variant: "destructive",
        title: "Lỗi camera",
        description: "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.",
      });
    }
  };

  // Stop the camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
      setVideoLoaded(false);
      setPlateDetected(false);
      setPlateDetectionConfidence(0);
      setProcessingStage('idle');
      setPlateBox(null);
      
      // Clear recognition interval
      if (recognitionIntervalRef.current !== null) {
        window.clearInterval(recognitionIntervalRef.current);
        recognitionIntervalRef.current = null;
      }
    }
  };

  // Toggle fullscreen mode for the camera view
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle image upload
  const handleImageUpload = (file: File) => {
    // Stop camera if it's running
    if (isScanning) {
      stopCamera();
    }

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
            title: "Phát hi���n biển số xe",
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
  const recognizeLicensePlateFromVideo = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current || isProcessing || !videoLoaded) return;
    
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
    } else if (isScanning) {
      // If camera is active, restart continuous recognition
      if (recognitionIntervalRef.current === null) {
        recognitionIntervalRef.current = window.setInterval(recognizeLicensePlateFromVideo, 2000);
      }
    }
  };

  // Handle video loaded metadata
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  };

  // Set up continuous recognition when camera is active
  useEffect(() => {
    if (isScanning && !licensePlate && videoLoaded) {
      // Clear any existing interval first
      if (recognitionIntervalRef.current !== null) {
        window.clearInterval(recognitionIntervalRef.current);
      }
      
      // Start a new recognition interval
      recognitionIntervalRef.current = window.setInterval(recognizeLicensePlateFromVideo, 2000);
      
      // Call recognition once immediately
      recognizeLicensePlateFromVideo();
    }
    
    return () => {
      // Clean up interval on component unmount or when scanning stops
      if (recognitionIntervalRef.current !== null) {
        window.clearInterval(recognitionIntervalRef.current);
        recognitionIntervalRef.current = null;
      }
    };
  }, [isScanning, videoLoaded, licensePlate]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
      
      // Clean up object URLs
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  return (
    <Card className={`overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Video element for camera feed */}
          {isScanning && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full ${isFullscreen ? 'h-screen object-cover' : 'aspect-video'}`}
              onLoadedMetadata={handleVideoLoaded}
            />
          )}
          
          {/* Uploaded image display */}
          {uploadedImage && !isScanning && (
            <div className={`w-full ${isFullscreen ? 'h-screen' : 'aspect-video'} flex items-center justify-center bg-black`}>
              <img 
                src={uploadedImage} 
                alt="Uploaded license plate" 
                className="max-w-full max-h-full" 
              />
            </div>
          )}
          
          {/* Default state - no camera or upload */}
          {!isScanning && !uploadedImage && !licensePlate && (
            <EmptyState onStartCamera={startCamera} />
          )}
          
          {/* Canvas for image processing (hidden) */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* License plate detection overlay for camera mode */}
          {isScanning && !licensePlate && (
            <ScanningOverlay 
              isProcessing={isProcessing}
              processingStage={processingStage}
              plateDetected={plateDetected}
            />
          )}
          
          {/* Processing indicator for uploaded images */}
          {uploadedImage && !licensePlate && (
            <ProcessingOverlay
              isProcessing={isProcessing}
              processingStage={processingStage}
            />
          )}
          
          {/* Error message */}
          <ErrorDisplay error={error} onRetry={error && error.toLowerCase().includes('camera') ? startCamera : undefined} />
          
          {/* License plate result */}
          <PlateResult
            licensePlate={licensePlate}
            confidence={confidence}
            plateDetectionConfidence={plateDetectionConfidence}
            imageQuality={imageQuality}
            onRetake={handleRetake}
          />
          
          {/* Manual input section */}
          {!isScanning && !uploadedImage && !licensePlate && (
            <ManualPlateInput onManualSearch={handleManualSearch} />
          )}
          
          {/* Camera controls */}
          {(isScanning || uploadedImage) && !licensePlate && (
            <CameraControl 
              isScanning={isScanning}
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          )}
          
          {/* Image upload controls */}
          {uploadedImage && !isScanning && !licensePlate && (
            <ImageUploader 
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
              onCancelUpload={() => setUploadedImage(null)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LicensePlateScanner;
