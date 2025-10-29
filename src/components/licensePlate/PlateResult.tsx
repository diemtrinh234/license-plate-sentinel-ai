
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, ShieldAlert } from "lucide-react";
import { ImageQuality } from '@/utils/licensePlateUtils';
import VehicleInfoPanel from './VehicleInfoPanel';
import { useViolationCheck } from '@/hooks/useViolationCheck';
import { formatCurrency } from '@/utils/formatUtils';

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
  const { violations, unpaidViolations, totalFine, hasViolations, loading } = useViolationCheck(licensePlate);
  
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
          {/* Violation Check Result */}
          <Card className={`${
            loading ? 'border-muted' :
            hasViolations ? 'border-destructive' : 'border-green-500'
          }`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                {loading ? (
                  <>
                    <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span>Đang kiểm tra vi phạm...</span>
                  </>
                ) : hasViolations ? (
                  <>
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                    <span className="text-destructive">Phát hiện vi phạm</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <span className="text-green-500">Không có vi phạm</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            
            {hasViolations && !loading && (
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Số vi phạm:</span>
                    <p className="font-medium">{violations.length}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Chưa thanh toán:</span>
                    <p className="font-medium text-destructive">{unpaidViolations.length}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Tổng phạt chưa nộp:</span>
                    <p className="font-medium text-destructive">{formatCurrency(totalFine)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Danh sách vi phạm:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {violations.map((v) => (
                      <div key={v.id} className="border border-border rounded-md p-2 text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{v.violation_type}</span>
                          <Badge variant={v.status === 'unpaid' ? 'destructive' : 'outline'} className="text-xs">
                            {v.status === 'unpaid' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                          </Badge>
                        </div>
                        {v.location && <p className="text-muted-foreground">{v.location}</p>}
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground">
                            {new Date(v.violation_date).toLocaleDateString('vi-VN')}
                          </span>
                          {v.fine_amount && (
                            <span className="font-medium">{formatCurrency(Number(v.fine_amount))}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
            
            {!hasViolations && !loading && (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Phương tiện này không có vi phạm giao thông trong hệ thống.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onRetake}
        >
          Quét biển số khác
        </Button>
      </div>
    </div>
  );
};

export default PlateResult;
