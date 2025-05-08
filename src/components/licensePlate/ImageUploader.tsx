
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  uploadedImage: string | null;
  onCancelUpload: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload,
  uploadedImage,
  onCancelUpload
}) => {
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImageUpload(file);
  };

  return (
    <>
      {/* Upload button */}
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
      
      {/* Cancel upload button */}
      {uploadedImage && (
        <Button 
          size="icon" 
          variant="destructive"
          onClick={onCancelUpload}
          className="rounded-full shadow-lg absolute bottom-4 right-4"
        >
          <AlertCircle size={18} />
        </Button>
      )}
    </>
  );
};

export default ImageUploader;
