
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

// Import our hooks
import { useLicensePlateCamera } from '@/hooks/useLicensePlateCamera';
import { useLicensePlateProcessor } from '@/hooks/useLicensePlateProcessor';
import { useFullscreen } from '@/hooks/useFullscreen';

// Import our components
import CameraControl from './CameraControl';
import ImageUploader from './ImageUploader';
import ManualPlateInput from './ManualPlateInput';
import PlateResult from './PlateResult';
import ScanningOverlay from './ScanningOverlay';
import ProcessingOverlay from './ProcessingOverlay';
import EmptyState from './EmptyState';
import ErrorDisplay from './ErrorDisplay';
import { CNNLoadingIndicator } from './CNNLoadingIndicator';

interface LicensePlateScannerProps {
  onDetection?: (plate: string, confidence: number) => void;
}

const LicensePlateScannerContainer: React.FC<LicensePlateScannerProps> = ({ onDetection }) => {
  // Initialize our hooks
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  const { 
    canvasRef, licensePlate, confidence, imageQuality, isProcessing,
    uploadedImage, plateDetected, plateDetectionConfidence,
    processingStage, plateBox, handleImageUpload, handleManualSearch,
    handleRetake, handleCancelUpload, setupRecognitionInterval,
    clearRecognitionInterval, setUploadedImage, cleanup
  } = useLicensePlateProcessor({ onDetection });
  
  const onVideoLoad = () => {
    setupRecognitionInterval(videoRef);
  };
  
  const {
    videoRef, isScanning, videoLoaded, error,
    startCamera, stopCamera, handleVideoLoaded, setError
  } = useLicensePlateCamera({ onVideoLoad });
  
  // Setup continuous recognition when camera is active
  useEffect(() => {
    if (isScanning && !licensePlate && videoLoaded) {
      setupRecognitionInterval(videoRef);
    }
    
    return () => {
      clearRecognitionInterval();
    };
  }, [isScanning, videoLoaded, licensePlate]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
      cleanup();
    };
  }, []);

  return (
    <>
      <CNNLoadingIndicator />
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
          <ErrorDisplay 
            error={error} 
            onRetry={error && error.toLowerCase().includes('camera') ? startCamera : undefined} 
          />
          
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
              onCancelUpload={handleCancelUpload}
            />
          )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LicensePlateScannerContainer;
