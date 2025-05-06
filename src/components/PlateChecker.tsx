
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import ViolationHistory from "./ViolationHistory";

interface PlateCheckerProps {
  onCheck?: (plate: string) => void;
}

const PlateChecker: React.FC<PlateCheckerProps> = ({ onCheck }) => {
  const [plateInput, setPlateInput] = useState("");
  const [checkedPlate, setCheckedPlate] = useState<string | null>(null);

  const handleCheck = () => {
    if (!plateInput || plateInput.trim().length < 5) {
      toast({
        variant: "destructive",
        title: "Biển số không hợp lệ",
        description: "Vui lòng nhập biển số xe hợp lệ.",
      });
      return;
    }
    
    // Format the manual input to match plate format (if needed)
    let formattedPlate = plateInput.trim().toUpperCase();
    
    // Simple regex validation for Vietnamese license plate
    const plateRegex = /^(\d{2}[A-Z]|\d{2}-\d{3}|\d{2}[A-Z]-\d{3}|\d{2}[A-Z]-\d{3}\.\d{2})$/;
    if (!plateRegex.test(formattedPlate) && !formattedPlate.includes('-')) {
      // Try to format it properly
      if (formattedPlate.length >= 5) {
        const province = formattedPlate.substring(0, 3);
        const numbers = formattedPlate.substring(3);
        formattedPlate = `${province}-${numbers}`;
      }
    }
    
    setCheckedPlate(formattedPlate);
    
    if (onCheck) {
      onCheck(formattedPlate);
    }
    
    toast({
      title: "Đang kiểm tra biển số",
      description: `Biển số: ${formattedPlate}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Kiểm Tra Vi Phạm Biển Số</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nhập biển số xe (VD: 43A-123.45)"
            value={plateInput}
            onChange={(e) => setPlateInput(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleCheck()}
          />
          <Button onClick={handleCheck}>
            <Search size={18} className="mr-2" />
            Kiểm tra
          </Button>
        </div>
        
        {checkedPlate && (
          <ViolationHistory licensePlate={checkedPlate} />
        )}
      </CardContent>
    </Card>
  );
};

export default PlateChecker;
