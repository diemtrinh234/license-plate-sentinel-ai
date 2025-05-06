
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
  ZoomIn
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

// Simulated CNN model parameters
const cnnConfidenceThreshold = 0.85;

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
  const [isScanning, setIsScanning] = useState(false);
  const [licensePlate, setLicensePlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [imageQuality, setImageQuality] = useState<'good' | 'medium' | 'poor' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionIntervalRef = useRef<number | null>(null);

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

  // Assess image quality
  const assessImageQuality = (imageData: ImageData): number => {
    // This is a simulated quality assessment
    // In a real app, you would analyze contrast, brightness, blur, etc.
    
    // Simulate quality assessment based on image properties
    // For example, checking brightness, contrast, blur level, etc.
    const data = imageData.data;
    
    // Calculate average brightness
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    brightness /= (data.length / 4);
    
    // Normalize brightness (0-255) to quality score (0-1)
    // This is simplified - a real implementation would be more complex
    const normalizedBrightness = brightness / 255;
    
    // Return a quality score (0-1)
    // This is a very simplified approach
    return Math.min(1, normalizedBrightness * 1.5);
  };

  // Simulate CNN recognition with quality assessment
  const recognizeLicensePlate = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current || isProcessing) return;
    
    setIsProcessing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
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
    
    // Simulate CNN processing time
    setTimeout(() => {
      // Only proceed if quality is sufficient
      if (qualityScore >= qualityThresholds.medium) {
        // Simulate CNN recognition
        // In a real app, you would pass the image to a trained CNN model
        
        // Generate a simulated confidence score based on quality
        // Better quality = more likely to have higher confidence
        const simulatedConfidence = Math.min(0.98, qualityScore * 0.9 + Math.random() * 0.1);
        
        // Only accept results with high enough confidence
        if (simulatedConfidence >= cnnConfidenceThreshold) {
          // Generate a random but realistic Vietnamese license plate
          // In real app, this would be the output from the CNN
          const provinces = ['43A', '51G', '92C', '74D', '38H', '43B'];
          const province = provinces[Math.floor(Math.random() * provinces.length)];
          const numbers = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
          const formattedNumbers = numbers.substring(0, 3) + '.' + numbers.substring(3);
          const plate = `${province}-${formattedNumbers}`;
          
          setLicensePlate(plate);
          setConfidence(simulatedConfidence);
          
          // Call the onDetection callback if provided
          if (onDetection) {
            onDetection(plate, simulatedConfidence);
          }
          
          toast({
            title: "Biển số được nhận diện",
            description: `Đã xác định biển số: ${plate}`,
          });
          
          // Stop recognition after successful detection
          if (recognitionIntervalRef.current !== null) {
            window.clearInterval(recognitionIntervalRef.current);
            recognitionIntervalRef.current = null;
          }
          
          // Stop camera after successful detection (optional)
          // stopCamera();
        } else {
          console.log(`Recognition confidence too low: ${(simulatedConfidence * 100).toFixed(2)}%`);
        }
      } else {
        console.log(`Image quality too low for accurate recognition: ${(qualityScore * 100).toFixed(2)}%`);
        
        // If quality is poor, show guidance toast
        if (qualityCategory === 'poor') {
          toast({
            variant: "warning",
            title: "Chất lượng hình ảnh kém",
            description: "Hãy đảm bảo ánh sáng tốt và camera đủ gần với biển số.",
          });
        }
      }
      
      setIsProcessing(false);
    }, 1000); // Simulate processing delay
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
    
    // Start continuous recognition again
    if (isScanning && recognitionIntervalRef.current === null) {
      recognitionIntervalRef.current = window.setInterval(recognizeLicensePlate, 2000);
    }
  };

  // Set up continuous recognition when camera is active
  useEffect(() => {
    if (isScanning && !licensePlate) {
      // Clear any existing interval first
      if (recognitionIntervalRef.current !== null) {
        window.clearInterval(recognitionIntervalRef.current);
      }
      
      // Start a new recognition interval
      recognitionIntervalRef.current = window.setInterval(recognizeLicensePlate, 2000);
      
      // Call recognition once immediately
      recognizeLicensePlate();
    }
    
    return () => {
      // Clean up interval on component unmount or when scanning stops
      if (recognitionIntervalRef.current !== null) {
        window.clearInterval(recognitionIntervalRef.current);
        recognitionIntervalRef.current = null;
      }
    };
  }, [isScanning]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className={`overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Video element for camera feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full ${isFullscreen ? 'h-screen object-cover' : 'aspect-video'}`}
            onCanPlay={() => videoRef.current?.play()}
          />
          
          {/* Canvas for image processing (hidden) */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* License plate detection overlay */}
          {isScanning && !licensePlate && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-64 h-16 border-2 border-primary rounded-md flex items-center justify-center mb-2">
                <span className="text-xs text-primary font-medium">Đặt biển số xe vào khung này</span>
              </div>
              {isProcessing && (
                <div className="mt-2">
                  <RefreshCw className="animate-spin text-primary" size={24} />
                </div>
              )}
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
                    <span className="text-muted-foreground">Độ tin cậy:</span>
                    <Badge variant={confidence > 0.9 ? "default" : "outline"}>
                      {(confidence * 100).toFixed(1)}%
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
          
          {/* Camera controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              size="icon" 
              variant="secondary"
              onClick={toggleFullscreen}
              className="rounded-full shadow-lg"
            >
              <ZoomIn size={18} />
            </Button>
            
            <Button 
              size="icon" 
              variant={isScanning ? "destructive" : "default"}
              onClick={toggleCamera}
              className="rounded-full shadow-lg"
            >
              {isScanning ? <CameraOff size={18} /> : <Camera size={18} />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicensePlateScanner;
