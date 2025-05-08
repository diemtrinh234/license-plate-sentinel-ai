
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { ImageQuality } from '@/utils/licensePlateUtils';

interface PlateResultProps {
  licensePlate: string | null;
  confidence: number;
  plateDetectionConfidence: number;
  imageQuality: ImageQuality;
  onRetake: () => void;
}

const PlateResult: React.FC<PlateResultProps> = ({ 
  licensePlate, 
  confidence, 
  plateDetectionConfidence, 
  imageQuality, 
  onRetake 
}) => {
  if (!licensePlate) return null;
  
  return (
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
            <span className="text-muted-foreground">Độ tin cậy nhận dạng:</span>
            <Badge variant={confidence > 0.9 ? "default" : "outline"}>
              {(confidence * 100).toFixed(1)}%
            </Badge>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Độ tin cậy phát hiện:</span>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              {(plateDetectionConfidence * 100).toFixed(1)}%
            </Badge>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Chất lượng hình ảnh:</span>
            <Badge 
              variant={
                imageQuality === 'good' ? "default" : 
                imageQuality === 'medium' ? "outline" : 
                imageQuality === 'poor' || imageQuality === null ? "destructive" : "outline"
              }
            >
              {imageQuality === 'good' ? 'Tốt' : 
               imageQuality === 'medium' ? 'Trung bình' : 
               imageQuality === 'poor' || imageQuality === null ? 'Kém' : 'Không xác định'}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onRetake}
          >
            Quét lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlateResult;
