
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, History, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import ViolationHistory from "./ViolationHistory";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { validateLicensePlate, normalizePlate } from "@/utils/licensePlateValidation";
import { useAuth } from "@/hooks/useAuth";

interface PlateCheckerProps {
  onCheck?: (plate: string) => void;
}

const PlateChecker: React.FC<PlateCheckerProps> = ({ onCheck }) => {
  const [plateInput, setPlateInput] = useState("");
  const [checkedPlate, setCheckedPlate] = useState<string | null>(null);
  const [validation, setValidation] = useState<ReturnType<typeof validateLicensePlate> | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Real-time validation on input change
  useEffect(() => {
    if (plateInput.trim().length > 0) {
      const result = validateLicensePlate(plateInput);
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [plateInput]);

  // Handle click outside autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheck = async () => {
    const currentValidation = validateLicensePlate(plateInput);
    
    if (!currentValidation.isValid && !currentValidation.suggestion) {
      toast({
        variant: "destructive",
        title: "Biển số không hợp lệ",
        description: currentValidation.message,
      });
      return;
    }
    
    // Use suggestion if available
    const formattedPlate = currentValidation.suggestion || normalizePlate(plateInput);
    
    setCheckedPlate(formattedPlate);
    setShowAutocomplete(false);
    
    // Save to history if user is logged in
    if (user) {
      await addToHistory(formattedPlate);
    }
    
    if (onCheck) {
      onCheck(formattedPlate);
    }
    
    toast({
      title: "Đang kiểm tra biển số",
      description: `Biển số: ${formattedPlate}`,
    });
  };

  const handleSelectFromHistory = (plate: string) => {
    setPlateInput(plate);
    setShowAutocomplete(false);
    setCheckedPlate(plate);
    
    if (onCheck) {
      onCheck(plate);
    }
  };

  const handleApplySuggestion = () => {
    if (validation?.suggestion) {
      setPlateInput(validation.suggestion);
    }
  };

  const handleClearHistory = async () => {
    await clearHistory();
    toast({
      title: "Đã xóa lịch sử",
      description: "Lịch sử tìm kiếm đã được xóa",
    });
  };

  const filteredHistory = history.filter(item =>
    item.plate_number.toLowerCase().includes(plateInput.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Kiểm tra Vi phạm Biển số</CardTitle>
        {user && history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearHistory}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={16} className="mr-1" />
            Xóa lịch sử
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Nhập biển số (VD: 51F-238.91)"
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleCheck()}
                onFocus={() => setShowAutocomplete(true)}
                className={
                  validation
                    ? validation.isValid
                      ? "border-green-500 focus-visible:ring-green-500"
                      : "border-amber-500 focus-visible:ring-amber-500"
                    : ""
                }
              />
              
              {/* Validation indicator */}
              {validation && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validation.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              )}
            </div>
            <Button onClick={handleCheck} disabled={!plateInput.trim()}>
              <Search size={18} className="mr-2" />
              Kiểm tra
            </Button>
          </div>

          {/* Real-time validation message */}
          {validation && plateInput.trim().length > 0 && (
            <div className="mt-2 space-y-2">
              <div className={`text-sm flex items-center gap-2 ${
                validation.isValid ? "text-green-600" : "text-amber-600"
              }`}>
                {validation.isValid ? (
                  <CheckCircle size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                {validation.message}
              </div>
              
              {/* Suggestion */}
              {validation.suggestion && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                    Gợi ý: {validation.suggestion}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleApplySuggestion}
                    className="h-6 text-xs"
                  >
                    Áp dụng
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Autocomplete dropdown */}
          {showAutocomplete && user && filteredHistory.length > 0 && (
            <div
              ref={autocompleteRef}
              className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              <div className="p-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
                <History size={12} />
                Lịch sử tìm kiếm
              </div>
              {filteredHistory.map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left px-4 py-2 hover:bg-accent transition-colors flex items-center justify-between"
                  onClick={() => handleSelectFromHistory(item.plate_number)}
                >
                  <span className="font-mono font-medium">{item.plate_number}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.searched_at).toLocaleDateString('vi-VN')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Format examples */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="font-medium">Format hợp lệ:</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="font-mono">51F-238.91</Badge>
            <Badge variant="outline" className="font-mono">43A-12345</Badge>
            <Badge variant="outline" className="font-mono">30E-55567</Badge>
          </div>
        </div>
        
        {checkedPlate && (
          <ViolationHistory licensePlate={checkedPlate} />
        )}
      </CardContent>
    </Card>
  );
};

export default PlateChecker;
