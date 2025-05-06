
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Filter, Search } from "lucide-react";
import { DashboardChart } from "@/components/DashboardChart";
import LicensePlateScanner from "@/components/LicensePlateScanner";
import { useToast } from "@/hooks/use-toast";
import ViolationDetails from "@/components/ViolationDetails";
import ViolationHistory from "@/components/ViolationHistory";
import DaNangMap from "@/components/DaNangMap";

// Định nghĩa kiểu dữ liệu cho trạng thái của xe
interface Vehicle {
  id: number;
  plate: string;
  time: string;
  date: string;
  location: string;
  type: string;
  status: "violation" | "normal";
}

// Dữ liệu mẫu cho biển số xe
const sampleVehicleData: Vehicle[] = [
  {
    id: 1,
    plate: "51F-238.91",
    time: "09:45:12",
    date: "05/05/2025",
    location: "Ngã tư Nguyễn Trãi - Khuất Duy Tiến",
    type: "Vượt đèn đỏ",
    status: "violation",
  },
  {
    id: 2,
    plate: "38H-456.78",
    time: "09:32:05",
    date: "05/05/2025",
    location: "Đại lộ Thăng Long",
    type: "Quá tốc độ",
    status: "violation",
  },
  {
    id: 3,
    plate: "43A-123.45",
    time: "09:27:32",
    date: "05/05/2025",
    location: "Cầu Long Biên",
    type: "Đỗ sai quy định",
    status: "violation",
  },
  {
    id: 4,
    plate: "30E-555.67",
    time: "09:15:28",
    date: "05/05/2025",
    location: "Quốc lộ 1A",
    type: "Bình thường",
    status: "normal",
  },
  {
    id: 5,
    plate: "29B-789.12",
    time: "08:56:14",
    date: "05/05/2025",
    location: "Đường Láng",
    type: "Bình thường",
    status: "normal",
  },
  {
    id: 6,
    plate: "33H-901.23",
    time: "08:45:33",
    date: "05/05/2025",
    location: "Đường Giải Phóng",
    type: "Bình thường",
    status: "normal",
  },
  {
    id: 7,
    plate: "36G-234.56",
    time: "08:32:07",
    date: "05/05/2025",
    location: "Cầu Nhật Tân",
    type: "Quá tốc độ",
    status: "violation",
  },
  {
    id: 8,
    plate: "99A-789.45",
    time: "08:20:51",
    date: "05/05/2025",
    location: "Đại lộ Thăng Long",
    type: "Bình thường",
    status: "normal",
  },
];

const Dashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(sampleVehicleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);
  const { toast } = useToast();

  // Hàm lọc và tìm kiếm biển số xe
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && vehicle.status === filterStatus;
  });

  // Thêm biển số xe mới từ scanner
  const handleAddNewPlate = (newPlate: string) => {
    const randomLocations = [
      "Ngã tư Nguyễn Văn Linh - Hùng Vương, Đà Nẵng",
      "Cầu Rồng, Đà Nẵng",
      "Đường Bạch Đằng, Đà Nẵng",
      "Đường 2/9, Đà Nẵng",
      "Đại lộ Nguyễn Tất Thành, Đà Nẵng"
    ];
    
    const violations = ["Vượt đèn đỏ", "Quá tốc độ", "Đỗ sai quy định", "Bình thường"];
    const location = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    const violation = violations[Math.floor(Math.random() * violations.length)];
    const status = violation !== "Bình thường" ? "violation" : "normal" as "violation" | "normal";
    
    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN');
    const date = now.toLocaleDateString('vi-VN');
    
    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      plate: newPlate,
      time,
      date,
      location,
      type: violation,
      status,
    };
    
    setVehicles([newVehicle, ...vehicles]);
    
    // Cập nhật biển số được chọn để kiểm tra lịch sử vi phạm
    setSelectedPlate(newPlate);
    
    toast({
      title: "Phát hiện biển số mới",
      description: `Biển số ${newPlate} đã được nhận diện tại ${location}`,
      variant: status === "violation" ? "destructive" : "default",
    });
  };

  // Hiển thị chi tiết xe
  const handleShowDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsOpen(true);
  };

  // Đóng dialog chi tiết
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  // Chọn biển số để kiểm tra lịch sử vi phạm
  const handleSelectPlate = (plate: string) => {
    setSelectedPlate(plate);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Bảng Điều Khiển</h1>
        <p className="text-muted-foreground mb-8">Quản lý và giám sát giao thông thông minh tại Đà Nẵng</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-medium mb-2">Tổng số phương tiện</h3>
            <p className="text-3xl font-bold">{vehicles.length}</p>
            <p className="text-muted-foreground text-sm mt-2">Cập nhật: Hôm nay</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-medium mb-2">Vi phạm phát hiện</h3>
            <p className="text-3xl font-bold text-destructive">
              {vehicles.filter(v => v.status === "violation").length}
            </p>
            <p className="text-muted-foreground text-sm mt-2">Cập nhật: Hôm nay</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-medium mb-2">Tỷ lệ tuân thủ</h3>
            <p className="text-3xl font-bold text-green-500">
              {Math.round((vehicles.filter(v => v.status === "normal").length / vehicles.length) * 100)}%
            </p>
            <p className="text-muted-foreground text-sm mt-2">Cập nhật: Hôm nay</p>
          </div>
        </div>
        
        <Tabs defaultValue="plates" className="w-full mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="plates">Biển Số Xe</TabsTrigger>
            <TabsTrigger value="scanner">Scanner AI (CNN)</TabsTrigger>
            <TabsTrigger value="map">Bản Đồ Đà Nẵng</TabsTrigger>
            <TabsTrigger value="history">Kiểm Tra Vi Phạm</TabsTrigger>
            <TabsTrigger value="analytics">Thống Kê</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plates" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Tìm kiếm biển số, địa điểm, loại vi phạm..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-muted-foreground" />
                <select
                  className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="violation">Vi phạm</option>
                  <option value="normal">Bình thường</option>
                </select>
              </div>
            </div>
            
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableCaption>Danh sách biển số xe đã được phát hiện hôm nay</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Biển số</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">
                        <button
                          className="hover:text-primary hover:underline transition-colors"
                          onClick={() => handleSelectPlate(vehicle.plate)}
                        >
                          {vehicle.plate}
                        </button>
                      </TableCell>
                      <TableCell>{vehicle.time}</TableCell>
                      <TableCell>{vehicle.date}</TableCell>
                      <TableCell>{vehicle.location}</TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleShowDetails(vehicle)}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="scanner" className="space-y-4">
            <LicensePlateScanner onDetectPlate={handleAddNewPlate} />
          </TabsContent>
          
          <TabsContent value="map" className="space-y-4">
            <DaNangMap detectedPlate={selectedPlate} />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <ViolationHistory 
              licensePlate={selectedPlate} 
              onSelectViolation={(violation) => {
                const matchingVehicle = vehicles.find(v => v.plate === violation.plate);
                if (matchingVehicle) {
                  handleShowDetails(matchingVehicle);
                }
              }}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-medium mb-4">Thống kê vi phạm theo thời gian</h3>
              <DashboardChart data={vehicles} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Component hiển thị chi tiết vi phạm */}
      <ViolationDetails 
        vehicle={selectedVehicle}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
      
      <Footer />
    </div>
  );
};

export default Dashboard;
