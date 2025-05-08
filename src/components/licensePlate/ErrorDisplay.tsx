
import React from 'react';
import { AlertCircle, Camera, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  if (!error) return null;
  
  // Determine error type for better UI feedback
  const isCameraError = error.toLowerCase().includes('camera') || error.toLowerCase().includes('stream');
  const isConnectionError = error.toLowerCase().includes('network') || error.toLowerCase().includes('kết nối');
  
  // Choose appropriate icon based on error type
  const ErrorIcon = isCameraError ? Camera : isConnectionError ? Wifi : AlertCircle;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/90">
      <div className="text-center p-6 max-w-xs">
        <ErrorIcon className="mx-auto mb-4 text-destructive" size={40} />
        <h3 className="font-medium text-lg mb-2">
          {isCameraError ? "Lỗi kết nối camera" : 
           isConnectionError ? "Lỗi kết nối mạng" : 
           "Đã xảy ra lỗi"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Thử lại
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
