
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  CameraOff, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  ZoomIn,
  Upload,
  Image,
  Search
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";

// Simulated model parameters
const detectionConfidenceThreshold = 0.75; // Minimum confidence for plate detection
const recognitionConfidenceThreshold = 0.85; // Minimum confidence for plate recognition

// Mock quality assessment values
const qualityThresholds = {
  good: 0.8,
  medium: 0.6,
  poor: 0
};

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
  const [imageQuality, setImageQuality] = useState<'good' | 'medium' | 'poor' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [manualPlate, setManualPlate] = useState("");
  const recognitionIntervalRef = useRef<number | null>(null);
  
  // New states for plate detection
  const [plateDetected, setPlateDetected] = useState(false);
  const [plateDetectionConfidence, setPlateDetectionConfidence] = useState(0);
  const [processingStage, setProcessingStage] = useState<'idle' | 'detecting' | 'recognizing'>('idle');
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

  // Toggle camera on/off
  const toggleCamera = () => {
    if (isScanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  // First stage: Detect if there's a license plate in the image
  const detectLicensePlate = (imageData: ImageData): {
    detected: boolean; 
    confidence: number; 
    box?: {x: number, y: number, width: number, height: number};
  } => {
    // This is a simulated detection model
    // In a real app, you'd use a trained ML model for plate detection
    
    // For simulation, generate a detection confidence based on image quality
    const qualityScore = assessImageQuality(imageData);
    
    // Adjust probability based on quality
    let detectionProbability = Math.min(0.98, qualityScore * 0.9 + Math.random() * 0.15);
    
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
  const recognizeLicensePlateText = (
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
        plateConfidence * 0.8 + qualityScore * 0.2 + Math.random() * 0.08
      );
      
      if (recognitionProbability >= recognitionConfidenceThreshold) {
        // Generate a random but realistic Vietnamese license plate
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
      let qualityCategory: 'good' | 'medium' | 'poor';
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
  const recognizeLicensePlateFromVideo = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current || isProcessing || !videoLoaded) return;
    
    setIsProcessing(true);
    setProcessingStage('detecting');
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
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
      let qualityCategory: 'good' | 'medium' | 'poor';
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

  // Handle manual plate input
  const handleManualSearch = () => {
    if (!manualPlate || manualPlate.trim().length < 5) {
      toast({
        variant: "destructive",
        title: "Biển số không hợp lệ",
        description: "Vui lòng nhập biển số xe hợp lệ.",
      });
      return;
    }
    
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

  // Assess image quality
  const assessImageQuality = (imageData: ImageData): number => {
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
    
    // Normalize brightness (0-255) to quality score (0-1)
    const normalizedBrightness = brightness / 255;
    
    // Return a quality score (0-1)
    // This is a very simplified approach
    return Math.min(1, normalizedBrightness * 1.5);
  };

  // Toggle full screen mode for the camera view
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
          {!isScanning && !uploadedImage && (
            <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center p-6">
              <Image className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Quét biển số xe</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Tải lên ảnh biển số hoặc sử dụng camera để quét
              </p>
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                <Button 
                  onClick={startCamera}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </Button>
                <label className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => document.getElementById('license-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Tải ảnh
                  </Button>
                  <input
                    id="license-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
          
          {/* Canvas for image processing (hidden) */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* License plate detection overlay for camera mode */}
          {isScanning && !licensePlate && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-64 h-16 border-2 border-primary rounded-md flex items-center justify-center mb-2">
                <span className="text-xs text-primary font-medium">
                  {processingStage === 'detecting' ? 'Đang phát hiện biển số...' : 
                   processingStage === 'recognizing' ? 'Đang nhận dạng biển số...' : 
                   'Đặt biển số xe vào khung này'}
                </span>
              </div>
              {isProcessing && (
                <div className="mt-2">
                  <RefreshCw className="animate-spin text-primary" size={24} />
                </div>
              )}
              
              {/* Show detection stage information */}
              {plateDetected && !licensePlate && (
                <div className="mt-2 text-center bg-background/80 p-2 rounded-md">
                  <p className="text-sm font-medium text-green-500">Đã phát hiện biển số xe</p>
                  <p className="text-xs">Đang nhận dạng nội dung...</p>
                </div>
              )}
            </div>
          )}
          
          {/* Processing indicator for uploaded images */}
          {uploadedImage && isProcessing && !licensePlate && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <div className="flex flex-col items-center bg-background/80 p-4 rounded-lg">
                <RefreshCw className="animate-spin text-primary mb-2" size={32} />
                <p className="text-sm font-medium mb-1">
                  {processingStage === 'detecting' ? 'Đang phát hiện biển số xe...' : 
                   processingStage === 'recognizing' ? 'Đang nhận dạng nội dung biển số...' : 
                   'Đang xử lý ảnh...'}
                </p>
                
                {/* Show processing progress */}
                {processingStage === 'detecting' && (
                  <p className="text-xs text-muted-foreground">Giai đoạn 1/2: Phát hiện biển số</p>
                )}
                
                {processingStage === 'recognizing' && (
                  <p className="text-xs text-muted-foreground">Giai đoạn 2/2: Nhận dạng nội dung</p>
                )}
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center p-4">
                <AlertCircle className="mx-auto mb-2 text-destructive" size={32} />
                <h3 className="font-medium text-lg">Lỗi kết nối camera</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}
          
          {/* License plate result */}
          {licensePlate && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-4">
              <div className="bg-card border border-border rounded-lg p-4 max-w-xs w-full">
                <div className="text-center mb-4">
                  <CheckCircle2 className="text-green-500 mx-auto mb-2" size={32} />
                  <h3 className="text-lg font-medium">Biển số xe đã xác định</h3>
                </div>
                
                <div className="border border-border rounded-lg p-3 mb-4 text-center">
                  <span className="font-mono text-2xl font-bold">{licensePlate}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Độ tin cậy nhận dạng:</span>
                    <Badge variant={confidence > 0.9 ? "default" : "outline"}>
                      {(confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Độ tin cậy phát hiện:</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {(plateDetectionConfidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Chất lượng hình ảnh:</span>
                    <Badge 
                      variant={
                        imageQuality === 'good' ? "default" : 
                        imageQuality === 'medium' ? "outline" : 
                        "destructive"
                      }
                    >
                      {imageQuality === 'good' ? 'Tốt' : 
                       imageQuality === 'medium' ? 'Trung bình' : 
                       'Kém'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleRetake}
                  >
                    Quét lại
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Manual input section */}
          {!isScanning && !uploadedImage && !licensePlate && (
            <div className="p-4 border-t border-border">
              <h3 className="text-sm font-medium mb-2">Kiểm tra biển số</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập biển số xe (VD: 43A-123.45)"
                  value={manualPlate}
                  onChange={(e) => setManualPlate(e.target.value)}
                />
                <Button onClick={handleManualSearch}>
                  <Search size={18} className="mr-2" />
                  Kiểm tra
                </Button>
              </div>
            </div>
          )}
          
          {/* Camera controls */}
          {(isScanning || uploadedImage) && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button 
                size="icon" 
                variant="secondary"
                onClick={toggleFullscreen}
                className="rounded-full shadow-lg"
              >
                <ZoomIn size={18} />
              </Button>
              
              {isScanning && (
                <Button 
                  size="icon" 
                  variant="destructive"
                  onClick={toggleCamera}
                  className="rounded-full shadow-lg"
                >
                  <CameraOff size={18} />
                </Button>
              )}
              
              {uploadedImage && !isScanning && (
                <Button 
                  size="icon" 
                  variant="destructive"
                  onClick={() => setUploadedImage(null)}
                  className="rounded-full shadow-lg"
                >
                  <AlertCircle size={18} />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LicensePlateScanner;
