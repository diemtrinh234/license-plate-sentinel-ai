
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Camera, Check, Upload, ImageIcon } from "lucide-react";

interface LicensePlateScannerProps {
  onDetectPlate: (plate: string) => void;
}

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

// Danh sách biển số xe mẫu để mô phỏng
const sampleLicensePlates = [
  "29A-123.45", "30E-678.90", "51G-246.81", "43B-592.73", 
  "34H-875.62", "92C-437.19", "51F-789.21", "36E-358.46",
  "99A-888.99", "74D-555.32", "20H-762.81", "60B-391.05"
];

const LicensePlateScanner: React.FC<LicensePlateScannerProps> = ({ onDetectPlate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [customPlate, setCustomPlate] = useState("");
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Xử lý khi tải ảnh lên
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra xem file có phải là ảnh không
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng tải lên một file ảnh');
        return;
      }

      // Chuyển đổi file thành URL để hiển thị
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setCameraActive(false); // Tắt camera nếu đang bật
    }
  };

  // Mô phỏng quét biển số từ ảnh đã tải lên
  const scanUploadedImage = () => {
    if (!uploadedImage) return;
    
    setIsScanning(true);
    setScanResult(null);
    setConfidence(0);
    
    // Mô phỏng quá trình nhận diện
    const recognitionInterval = setInterval(() => {
      setConfidence((prev) => Math.min(prev + Math.random() * 20, 99));
    }, 500);
    
    // Sau 3 giây sẽ có kết quả
    setTimeout(() => {
      clearInterval(recognitionInterval);
      setConfidence(100);
      
      // Lấy ngẫu nhiên một biển số từ danh sách mẫu
      const randomPlate = sampleLicensePlates[Math.floor(Math.random() * sampleLicensePlates.length)];
      setScanResult(randomPlate);
      setIsScanning(false);
      
      // Gọi hàm callback để thêm biển số mới
      onDetectPlate(randomPlate);
    }, 3000);
  };

  // Mô phỏng quá trình quét biển số xe qua camera
  const startScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setConfidence(0);
    
    // Mô phỏng quá trình nhận diện
    const recognitionInterval = setInterval(() => {
      setConfidence((prev) => Math.min(prev + Math.random() * 20, 99));
    }, 500);
    
    // Sau 3 giây sẽ có kết quả
    setTimeout(() => {
      clearInterval(recognitionInterval);
      setConfidence(100);
      
      // Lấy ngẫu nhiên một biển số từ danh sách mẫu
      const randomPlate = sampleLicensePlates[Math.floor(Math.random() * sampleLicensePlates.length)];
      setScanResult(randomPlate);
      setIsScanning(false);
      
      // Gọi hàm callback để thêm biển số mới
      onDetectPlate(randomPlate);
    }, 3000);
  };
  
  // Xử lý gửi biển số tùy chỉnh
  const handleSubmitCustomPlate = () => {
    if (customPlate.trim()) {
      onDetectPlate(customPlate);
      setCustomPlate("");
      setScanResult(customPlate);
    }
  };

  // Mô phỏng bật camera
  const toggleCamera = () => {
    if (!cameraActive) {
      setCameraActive(true);
      setUploadedImage(null); // Xóa ảnh đã tải lên (nếu có)
      
      // Giả lập kết nối camera
      if (videoRef.current) {
        // Trong trường hợp thực tế, chúng ta sẽ kết nối với camera thật
        // Ở đây chỉ là mô phỏng nên không yêu cầu quyền truy cập
        videoRef.current.play().catch(() => {
          console.log("Video không thể phát vì đây chỉ là mô phỏng");
        });
      }
    } else {
      setCameraActive(false);
    }
  };

  // Xóa ảnh đã tải lên
  const clearUploadedImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
      setUploadedImage(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">AI Camera Scanner</h2>
        <p className="text-muted-foreground mb-4">
          Hệ thống nhận dạng biển số xe tự động sử dụng AI
        </p>
      </div>

      <div className="relative aspect-video bg-black/90 rounded-md overflow-hidden">
        {cameraActive ? (
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1577687710332-deec52d35ff9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-rainy-night-4221-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : uploadedImage ? (
          <div className="w-full h-full flex items-center justify-center relative">
            <img 
              src={uploadedImage} 
              alt="Uploaded license plate" 
              className="max-w-full max-h-full object-contain" 
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 opacity-80 hover:opacity-100"
              onClick={clearUploadedImage}
            >
              ×
            </Button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Camera size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Camera đang tắt</p>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm">Đang quét... {Math.round(confidence)}%</p>
          </div>
        )}

        {scanResult && !isScanning && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-3">
            <div className="flex items-center gap-2">
              <Check className="text-green-500" />
              <p>
                <span className="font-medium">Kết quả: </span> 
                <span className="text-primary font-bold">{scanResult}</span>
              </p>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Button 
          onClick={toggleCamera} 
          variant={cameraActive ? "destructive" : "outline"}
          className="flex-1"
          disabled={isScanning}
        >
          <Camera className="mr-2 h-4 w-4" /> 
          {cameraActive ? "Tắt Camera" : "Bật Camera"}
        </Button>
        
        {cameraActive ? (
          <Button 
            onClick={startScan} 
            disabled={isScanning || !cameraActive}
            className="flex-1"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang quét...
              </>
            ) : (
              <>Quét biển số</>
            )}
          </Button>
        ) : uploadedImage ? (
          <Button 
            onClick={scanUploadedImage} 
            disabled={isScanning}
            className="flex-1"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang phân tích...
              </>
            ) : (
              <>Phân tích ảnh</>
            )}
          </Button>
        ) : (
          <div className="relative flex-1">
            <Input
              type="file"
              id="license-plate-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isScanning}
            />
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center"
              disabled={isScanning}
              asChild
            >
              <label htmlFor="license-plate-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Tải ảnh lên
              </label>
            </Button>
          </div>
        )}
      </div>
      
      <div className="border-t border-border pt-4 mt-4">
        <p className="text-sm text-muted-foreground mb-2">Hoặc nhập biển số xe thủ công:</p>
        <div className="flex gap-2">
          <Input 
            value={customPlate} 
            onChange={(e) => setCustomPlate(e.target.value)} 
            placeholder="Ví dụ: 30E-555.67"
          />
          <Button onClick={handleSubmitCustomPlate} disabled={!customPlate.trim()}>
            Thêm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LicensePlateScanner;
