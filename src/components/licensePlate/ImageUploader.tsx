
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, Image } from "lucide-react";
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
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Định dạng file không hỗ trợ",
        description: "Vui lòng tải lên file hình ảnh (JPG, PNG, etc.)",
      });
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File quá lớn",
        description: "Vui lòng tải lên hình ảnh nhỏ hơn 10MB",
      });
      return;
    }
    
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
