
import React from 'react';
import { RefreshCw } from "lucide-react";
import { ProcessingStage } from '@/utils/licensePlateUtils';

interface ScanningOverlayProps {
  isProcessing: boolean;
  processingStage: ProcessingStage;
  plateDetected: boolean;
}

const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ 
  isProcessing, 
  processingStage, 
  plateDetected 
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Target frame for plate scanning */}
      <div className={`w-64 h-16 border-2 ${plateDetected ? 'border-green-500' : 'border-primary'} rounded-md flex items-center justify-center mb-2 transition-colors`}>
        <span className={`text-xs ${plateDetected ? 'text-green-500' : 'text-primary'} font-medium`}>
          {processingStage === 'detecting' ? 'Đang phát hiện biển số...' : 
           processingStage === 'recognizing' ? 'Đang nhận dạng biển số...' : 
           'Đặt biển số xe vào khung này'}
        </span>
      </div>
      
      {/* Processing indicator */}
      {isProcessing && (
        <div className="mt-2">
          <RefreshCw className="animate-spin text-primary" size={24} />
        </div>
      )}
      
      {/* Detection status information */}
      {plateDetected && (
        <div className="mt-2 text-center bg-background/80 p-2 rounded-md">
          <p className="text-sm font-medium text-green-500">Đã phát hiện biển số xe</p>
          <p className="text-xs">Đang nhận dạng nội dung...</p>
        </div>
      )}
    </div>
  );
};

export default ScanningOverlay;
