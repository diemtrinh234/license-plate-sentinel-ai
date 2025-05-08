
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, ZoomIn } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface CameraControlProps {
  isScanning: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const CameraControl: React.FC<CameraControlProps> = ({ 
  isScanning, 
  onStartCamera, 
  onStopCamera, 
  isFullscreen, 
  onToggleFullscreen 
}) => {
  const toggleCamera = () => {
    if (isScanning) {
      onStopCamera();
    } else {
      onStartCamera();
    }
  };

  return (
    <>
      {/* Camera toggle button - only shown when not actively processing a result */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button 
          size="icon" 
          variant="secondary"
          onClick={onToggleFullscreen}
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
      </div>
    </>
  );
};

export default CameraControl;
