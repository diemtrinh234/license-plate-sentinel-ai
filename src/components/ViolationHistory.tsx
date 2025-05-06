
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Search, Loader2 } from "lucide-react";

interface ViolationRecord {
  id: number;
  plate: string;
  time: string;
  date: string;
  location: string;
  type: string;
  status: "violation" | "normal";
}

// Dữ liệu mẫu về lịch sử vi phạm
const violationHistoryData: ViolationRecord[] = [
  {
    id: 1,
    plate: "43A-123.45",
    time: "15:30:22",
    date: "02/05/2025",
    location: "Ngã tư Nguyễn Văn Linh - Hùng Vương, Đà Nẵng",
    type: "Vượt đèn đỏ",
    status: "violation",
  },
  {
    id: 2,
    plate: "92C-437.19",
    time: "09:15:45",
    date: "28/04/2025",
    location: "Cầu Rồng, Đà Nẵng",
    type: "Quá tốc độ",
    status: "violation",
  },
  {
    id: 3,
    plate: "43B-592.73",
    time: "14:22:10",
    date: "25/04/2025",
    location: "Đường Bạch Đằng, Đà Nẵng",
    type: "Đỗ sai quy định",
    status: "violation",
  },
  {
    id: 4,
    plate: "51G-246.81",
    time: "11:05:33",
    date: "20/04/2025",
    location: "Đường 2/9, Đà Nẵng",
    type: "Vượt đèn đỏ",
    status: "violation",
  },
  {
    id: 5,
    plate: "74D-555.32",
    time: "18:45:12",
    date: "15/04/2025",
    location: "Đại lộ Nguyễn Tất Thành, Đà Nẵng",
    type: "Quá tốc độ",
    status: "violation",
  },
];

interface ViolationHistoryProps {
  licensePlate: string | null;
  onSelectViolation?: (violation: ViolationRecord) => void;
}

const ViolationHistory: React.FC<ViolationHistoryProps> = ({ 
  licensePlate, 
  onSelectViolation 
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [violationRecords, setViolationRecords] = useState<ViolationRecord[]>([]);
  const [hasRecords, setHasRecords] = useState<boolean | null>(null);

  // Tìm kiếm lịch sử vi phạm khi biển số thay đổi
  useEffect(() => {
    if (!licensePlate) {
      setViolationRecords([]);
      setHasRecords(null);
      return;
    }

    const searchViolations = async () => {
      setIsSearching(true);
      setHasRecords(null);
      
      // Mô phỏng truy vấn cơ sở dữ liệu
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Lọc các bản ghi vi phạm khớp với biển số
      const records = violationHistoryData.filter(
        record => record.plate === licensePlate
      );
      
      setViolationRecords(records);
      setHasRecords(records.length > 0);
      setIsSearching(false);
    };

    searchViolations();
  }, [licensePlate]);

  // Nếu không có biển số được chọn
  if (!licensePlate) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-1">Chưa có biển số được quét</h3>
        <p className="text-sm text-muted-foreground">
          Quét biển số xe để kiểm tra lịch sử vi phạm
        </p>
      </div>
    );
  }

  // Đang tìm kiếm
  if (isSearching) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium mb-1">Đang kiểm tra lịch sử vi phạm</h3>
        <p className="text-sm text-muted-foreground">
          Đang tìm kiếm dữ liệu cho biển số {licensePlate}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Lịch sử vi phạm</h3>
          <p className="text-sm text-muted-foreground">Biển số: {licensePlate}</p>
        </div>
        
        {hasRecords !== null && (
          <Badge 
            variant={hasRecords ? "destructive" : "outline"} 
            className={hasRecords ? "" : "bg-green-500/10 text-green-500 border-green-500/20"}
          >
            {hasRecords ? (
              <AlertCircle className="h-3 w-3 mr-1" />
            ) : (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            )}
            {hasRecords ? "Có vi phạm" : "Không có vi phạm"}
          </Badge>
        )}
      </div>
      
      {violationRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Lịch sử vi phạm của biển số {licensePlate}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Loại vi phạm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {violationRecords.map((record) => (
                <TableRow 
                  key={record.id} 
                  className={onSelectViolation ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onSelectViolation && onSelectViolation(record)}
                >
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.time}</TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <AlertCircle size={12} />
                      {record.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (hasRecords === false) ? (
        <div className="p-8 text-center">
          <CheckCircle2 className="h-10 w-10 mx-auto text-green-500 mb-3" />
          <h3 className="text-lg font-medium text-green-600 mb-1">Không có vi phạm</h3>
          <p className="text-sm text-muted-foreground">
            Biển số {licensePlate} chưa có lịch sử vi phạm trong hệ thống
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ViolationHistory;
