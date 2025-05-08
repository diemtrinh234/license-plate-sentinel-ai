
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload, Image } from "lucide-react";

interface EmptyStateProps {
  onStartCamera: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onStartCamera }) => {
  return (
    <div className="w-full aspect-video bg-muted flex flex-col items-center justify-center p-6">
      <Image className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Quét biển số xe</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Tải lên ảnh biển số hoặc sử dụng camera để quét
      </p>
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
        <Button 
          onClick={onStartCamera}
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
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default EmptyState;
