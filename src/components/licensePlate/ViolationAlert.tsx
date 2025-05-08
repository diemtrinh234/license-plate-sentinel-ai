
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Violation } from '@/utils/vehicleUtils';
import { AlertTriangle, MapPin, Clock, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from '@/utils/formatUtils';

interface ViolationAlertProps {
  violation: Violation | null;
  isLoading: boolean;
}

const ViolationAlert: React.FC<ViolationAlertProps> = ({ 
  violation, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Thông tin vi phạm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2 text-muted-foreground">Đang kiểm tra vi phạm...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!violation) {
    return (
      <Card className="w-full bg-green-500/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 mr-2">
              OK
            </Badge>
            Thông tin vi phạm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-green-500 font-medium">Không phát hiện vi phạm</p>
            <p className="text-sm text-muted-foreground mt-1">Phương tiện này không có vi phạm giao thông gần đây</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-destructive/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Badge variant="destructive" className="mr-2">
            <AlertTriangle size={12} className="mr-1" />
            Vi phạm
          </Badge>
          Thông tin vi phạm
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-destructive">{violation.description}</h3>
            <div className="flex items-center mt-1">
              <Clock size={14} className="text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">{violation.date} lúc {violation.time}</span>
            </div>
          </div>
          
          {violation.evidenceImageUrl && (
            <div className="w-full overflow-hidden rounded-md">
              <img 
                src={violation.evidenceImageUrl} 
                alt="Hình ảnh vi phạm" 
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          <div className="flex flex-col">
            <div className="flex items-center text-sm mb-1">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              Địa điểm
            </div>
            <p className="text-sm">{violation.location}</p>
          </div>
          
          <Separator />
          
          <div className="bg-card p-3 rounded-md border border-border">
            <div className="flex justify-between items-center">
              <span className="font-medium">Mức phạt:</span>
              <span className="font-bold text-destructive">{formatCurrency(violation.fine)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Theo Nghị định 100/2019/NĐ-CP về xử phạt vi phạm hành chính trong lĩnh vực giao thông đường bộ
            </p>
          </div>
          
          <Button className="w-full" variant="destructive">
            Xem chi tiết vi phạm
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViolationAlert;
