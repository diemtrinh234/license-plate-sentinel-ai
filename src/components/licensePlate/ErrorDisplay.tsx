
import React from 'react';
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
      <div className="text-center p-4">
        <AlertCircle className="mx-auto mb-2 text-destructive" size={32} />
        <h3 className="font-medium text-lg">Lỗi kết nối camera</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
