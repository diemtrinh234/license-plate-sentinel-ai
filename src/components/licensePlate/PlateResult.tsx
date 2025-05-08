
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { ImageQuality } from '@/utils/licensePlateUtils';
import { getVehicleInfo, detectViolation, VehicleInfo, Violation } from '@/utils/vehicleUtils';
import VehicleInfoPanel from './VehicleInfoPanel';
import ViolationAlert from './ViolationAlert';
import { toast } from '@/hooks/use-toast';

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
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [violation, setViolation] = useState<Violation | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isLoadingViolation, setIsLoadingViolation] = useState(false);

  useEffect(() => {
    if (licensePlate) {
      // Look up vehicle information
      setIsLoadingInfo(true);
      setTimeout(() => {
        const info = getVehicleInfo(licensePlate);
        setVehicleInfo(info);
        setIsLoadingInfo(false);
        
        if (info) {
          toast({
            title: "Biển số hợp lệ",
            description: `Đã tìm thấy thông tin xe ${info.vehicleModel} của ${info.ownerName}`,
            variant: "default"
          });
        } else {
          toast({
            title: "Biển số không tìm thấy",
            description: "Không tìm thấy thông tin phương tiện trong hệ thống",
            variant: "destructive"
          });
        }
      }, 1000);
      
      // Check for violations
      setIsLoadingViolation(true);
      setTimeout(() => {
        const detectedViolation = detectViolation(licensePlate);
        setViolation(detectedViolation);
        setIsLoadingViolation(false);
        
        if (detectedViolation) {
          toast({
            title: "Phát hiện vi phạm",
            description: `${detectedViolation.type} tại ${detectedViolation.location}`,
            variant: "destructive"
          });
        }
      }, 1500);
    }
  }, [licensePlate]);

  if (!licensePlate) return null;
  
  return (
    <div className="absolute inset-0 flex flex-col bg-background/95 p-4 overflow-y-auto">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-6">
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
        
        <div className="space-y-4 mb-4">
          <VehicleInfoPanel 
            vehicleInfo={vehicleInfo} 
            isLoading={isLoadingInfo} 
          />
          
          <ViolationAlert 
            violation={violation} 
            isLoading={isLoadingViolation} 
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onRetake}
          >
            Quét biển số khác
          </Button>
          
          <Button 
            variant="default" 
            className="flex-1"
            disabled={!vehicleInfo}
          >
            Xem lịch sử
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlateResult;
