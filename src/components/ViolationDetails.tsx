
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, MapPin, Clock, Calendar, Car } from "lucide-react";

interface Vehicle {
  id: number;
  plate: string;
  time: string;
  date: string;
  location: string;
  type: string;
  status: "violation" | "normal";
}

interface ViolationDetailsProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViolationDetails: React.FC<ViolationDetailsProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Car className="h-5 w-5" />
            Thông tin biển số: {vehicle.plate}
          </DialogTitle>
          <DialogDescription>
            Chi tiết về trạng thái và các vi phạm của phương tiện
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">Trạng thái:</h3>
            {vehicle.status === "violation" ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle size={12} />
                Vi phạm
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Bình thường
              </Badge>
            )}
          </div>

          <div className="space-y-3 bg-secondary/20 p-3 rounded-md">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Địa điểm</p>
                <p className="font-medium">{vehicle.location}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Thời gian</p>
                <p className="font-medium">{vehicle.time}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày</p>
                <p className="font-medium">{vehicle.date}</p>
              </div>
            </div>
          </div>

          {vehicle.status === "violation" && (
            <div className="border-t border-border pt-3">
              <h3 className="font-medium mb-2">Chi tiết vi phạm:</h3>
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="font-medium text-destructive">{vehicle.type}</p>
                <p className="text-sm mt-1">
                  {(() => {
                    switch(vehicle.type) {
                      case "Vượt đèn đỏ":
                        return "Vi phạm vượt đèn đỏ tại giao lộ, tiềm ẩn nguy cơ gây tai nạn nghiêm trọng.";
                      case "Quá tốc độ":
                        return "Phương tiện di chuyển vượt quá tốc độ cho phép trên tuyến đường.";
                      case "Đỗ sai quy định":
                        return "Phương tiện đỗ xe không đúng nơi quy định, gây cản trở giao thông.";
                      default:
                        return "Vi phạm được ghi nhận bởi hệ thống camera giám sát.";
                    }
                  })()}
                </p>
                <div className="mt-3 text-sm text-muted-foreground">
                  <span>Mức phạt dự kiến: </span>
                  <span className="font-medium">
                    {(() => {
                      switch(vehicle.type) {
                        case "Vượt đèn đỏ":
                          return "4.000.000đ - 6.000.000đ";
                        case "Quá tốc độ":
                          return "3.000.000đ - 5.000.000đ";
                        case "Đỗ sai quy định":
                          return "2.000.000đ - 3.000.000đ";
                        default:
                          return "Đang xác định";
                      }
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-border pt-3">
            <h3 className="font-medium mb-2">Hình ảnh:</h3>
            <div className="bg-black/50 rounded-md aspect-video flex items-center justify-center overflow-hidden">
              <img 
                src={`https://source.unsplash.com/random/800x450/?traffic,car&id=${vehicle.id}`} 
                alt={`Hình ảnh xe ${vehicle.plate}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button>
            Xuất báo cáo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViolationDetails;
