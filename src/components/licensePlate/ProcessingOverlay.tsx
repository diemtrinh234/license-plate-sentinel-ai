
import React from 'react';
import { RefreshCw } from "lucide-react";
import { ProcessingStage } from '@/utils/licensePlateUtils';

interface ProcessingOverlayProps {
  isProcessing: boolean;
  processingStage: ProcessingStage;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ isProcessing, processingStage }) => {
  if (!isProcessing) return null;
  
  return (
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
  );
};

export default ProcessingOverlay;
