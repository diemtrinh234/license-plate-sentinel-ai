
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
    
    // Simple validation for Vietnamese license plates
    const plateRegex = /^\d{2}[A-Za-z]{1,2}[-]?\d{3}[.]?\d{2}$|^\d{2}[A-Za-z]{1,2}[-]?\d{4}$|^\d{2}[A-Za-z]{1,2}[-]?\d{3}$/;
    let formattedPlate = manualPlate.trim().toUpperCase();
    
    if (!plateRegex.test(formattedPlate)) {
      // Try to automatically format common input patterns
      if (formattedPlate.length >= 7) {
        // Extract province code (first 2-3 characters)
        let provinceCode = formattedPlate.substring(0, 2);
        let remaining = formattedPlate.substring(2);
        
        // Check if there's a letter after the province code
        if (/[A-Z]/.test(remaining[0])) {
          const letterPart = remaining.match(/^[A-Z]+/)?.[0] || '';
          remaining = remaining.substring(letterPart.length);
          provinceCode += letterPart;
        }
        
        // Format the rest as numbers
        if (remaining.length >= 3) {
          formattedPlate = `${provinceCode}-${remaining}`;
        }
      }
      
      if (!plateRegex.test(formattedPlate)) {
        toast({
          variant: "destructive",
          title: "Định dạng biển số không hợp lệ",
          description: "Vui lòng nhập theo định dạng: 43A-123.45 hoặc 30E55567",
        });
        return;
      }
    }
    
    onManualSearch(formattedPlate);
  };

  return (
    <div className="p-4 border-t border-border">
      <h3 className="text-sm font-medium mb-2">Kiểm tra biển số</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Nhập biển số xe (VD: 43A-123.45)"
          value={manualPlate}
          onChange={(e) => setManualPlate(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleManualSearch();
            }
          }}
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
