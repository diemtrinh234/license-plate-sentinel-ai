
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
            License Plate Information: {vehicle.plate}
          </DialogTitle>
          <DialogDescription>
            Details about the status and violations of the vehicle
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">Status:</h3>
            {vehicle.status === "violation" ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle size={12} />
                Violation
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Normal
              </Badge>
            )}
          </div>

          <div className="space-y-3 bg-secondary/20 p-3 rounded-md">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{vehicle.location}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{vehicle.time}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{vehicle.date}</p>
              </div>
            </div>
          </div>

          {vehicle.status === "violation" && (
            <div className="border-t border-border pt-3">
              <h3 className="font-medium mb-2">Violation Details:</h3>
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="font-medium text-destructive">{vehicle.type}</p>
                <p className="text-sm mt-1">
                  {(() => {
                    switch(vehicle.type) {
                      case "Running Red Light":
                        return "Red light violation at intersection, posing a risk of serious accidents.";
                      case "Speeding":
                        return "Vehicle moving above the permitted speed limit on the road.";
                      case "Illegal Parking":
                        return "Vehicle parked in a prohibited area, causing traffic obstruction.";
                      default:
                        return "Violation recorded by the surveillance camera system.";
                    }
                  })()}
                </p>
                <div className="mt-3 text-sm text-muted-foreground">
                  <span>Estimated fine: </span>
                  <span className="font-medium">
                    {(() => {
                      switch(vehicle.type) {
                        case "Running Red Light":
                          return "4,000,000đ - 6,000,000đ";
                        case "Speeding":
                          return "3,000,000đ - 5,000,000đ";
                        case "Illegal Parking":
                          return "2,000,000đ - 3,000,000đ";
                        default:
                          return "To be determined";
                      }
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-border pt-3">
            <h3 className="font-medium mb-2">Image:</h3>
            <div className="bg-black/50 rounded-md aspect-video flex items-center justify-center overflow-hidden">
              <img 
                src={`https://source.unsplash.com/random/800x450/?traffic,car&id=${vehicle.id}`} 
                alt={`Vehicle image ${vehicle.plate}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Export Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViolationDetails;
