
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleInfo } from '@/utils/vehicleUtils';
import { User, Car, Calendar, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface VehicleInfoPanelProps {
  vehicleInfo: VehicleInfo | null;
  isLoading: boolean;
}

const VehicleInfoPanel: React.FC<VehicleInfoPanelProps> = ({ 
  vehicleInfo, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Thông tin phương tiện</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2 text-muted-foreground">Đang tải thông tin...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!vehicleInfo) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Thông tin phương tiện</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">Không tìm thấy thông tin phương tiện</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Thông tin phương tiện</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="flex items-center text-lg font-medium mb-1">
              <Car className="mr-2 h-5 w-5 text-primary" />
              {vehicleInfo.licensePlate}
            </div>
            <p className="text-sm text-muted-foreground">{vehicleInfo.vehicleType} - {vehicleInfo.vehicleModel}</p>
          </div>
          
          <Separator />
          
          <div className="flex flex-col">
            <div className="flex items-center font-medium mb-1">
              <User className="mr-2 h-4 w-4 text-primary" />
              Chủ sở hữu
            </div>
            <p className="text-sm">{vehicleInfo.ownerName}</p>
            <p className="text-xs text-muted-foreground">CMND/CCCD: {vehicleInfo.ownerID}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center text-sm mb-1">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                Số điện thoại
              </div>
              <p className="text-sm">{vehicleInfo.phone || "Không có"}</p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center text-sm mb-1">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                Ngày đăng ký
              </div>
              <p className="text-sm">{vehicleInfo.registrationDate}</p>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center text-sm mb-1">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              Địa chỉ
            </div>
            <p className="text-sm">{vehicleInfo.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInfoPanel;
