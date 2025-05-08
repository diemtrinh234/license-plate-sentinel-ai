
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ManualPlateInputProps {
  onManualSearch: (plate: string) => void;
}

const ManualPlateInput: React.FC<ManualPlateInputProps> = ({ onManualSearch }) => {
  const [manualPlate, setManualPlate] = useState("");

  const handleManualSearch = () => {
    if (!manualPlate || manualPlate.trim().length < 5) {
      toast({
        variant: "destructive",
        title: "Biển số không hợp lệ",
        description: "Vui lòng nhập biển số xe hợp lệ.",
      });
      return;
    }
    
    onManualSearch(manualPlate);
  };

  return (
    <div className="p-4 border-t border-border">
      <h3 className="text-sm font-medium mb-2">Kiểm tra biển số</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Nhập biển số xe (VD: 43A-123.45)"
          value={manualPlate}
          onChange={(e) => setManualPlate(e.target.value)}
        />
        <Button onClick={handleManualSearch}>
          <Search size={18} className="mr-2" />
          Kiểm tra
        </Button>
      </div>
    </div>
  );
};

export default ManualPlateInput;
