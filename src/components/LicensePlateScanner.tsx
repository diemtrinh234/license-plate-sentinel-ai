
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Camera, Check, Upload, ImageIcon, CameraOff, Trash2 } from "lucide-react";

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

// Hàm phân tích biển số xe từ dữ liệu hình ảnh (mô phỏng)
const analyzeLicensePlate = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    // Tạo một giá trị hash đơn giản từ URL để luôn trả về cùng một kết quả cho cùng một hình ảnh
    let hash = 0;
    for (let i = 0; i < imageUrl.length; i++) {
      hash = ((hash << 5) - hash) + imageUrl.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Lấy biển số xe dựa trên hash để kết quả nhất quán cho cùng một hình ảnh
    const plateIndex = Math.abs(hash) % sampleLicensePlates.length;
    
    // Trả về kết quả sau một khoảng thời gian để mô phỏng thời gian xử lý
    setTimeout(() => {
      resolve(sampleLicensePlates[plateIndex]);
    }, 2000);
  });
};

const LicensePlateScanner: React.FC<LicensePlateScannerProps> = ({ onDetectPlate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [customPlate, setCustomPlate] = useState("");
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);

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
      setScanResult(null); // Xóa kết quả quét trước đó
    }
  };

  // Cập nhật trạng thái phân tích
  const updateAnalysisStep = (step: string) => {
    setAnalysisSteps(prev => [...prev, step]);
  };

  // Mô phỏng quét biển số từ ảnh đã tải lên
  const scanUploadedImage = async () => {
    if (!uploadedImage) return;
    
    setIsScanning(true);
    setScanResult(null);
    setConfidence(0);
    setAnalysisSteps([]);
    
    // Mô phỏng các bước phân tích
    updateAnalysisStep("Khởi tạo mô hình AI...");
    
    // Mô phỏng quá trình nhận diện
    const recognitionInterval = setInterval(() => {
      setConfidence((prev) => {
        const newValue = Math.min(prev + Math.random() * 10, 99);
        
        // Thêm các bước phân tích dựa vào tiến độ
        if (prev < 20 && newValue >= 20) {
          updateAnalysisStep("Xử lý ảnh và cải thiện độ tương phản...");
        } else if (prev < 40 && newValue >= 40) {
          updateAnalysisStep("Phát hiện vùng chứa biển số...");
        } else if (prev < 60 && newValue >= 60) {
          updateAnalysisStep("Trích xuất ký tự từ biển số...");
        } else if (prev < 80 && newValue >= 80) {
          updateAnalysisStep("Nhận dạng các ký tự...");
        } else if (prev < 95 && newValue >= 95) {
          updateAnalysisStep("Xác minh định dạng biển số...");
        }
        
        return newValue;
      });
    }, 300);
    
    try {
      // Phân tích biển số dựa trên URL hình ảnh để có kết quả nhất quán
      const detectedPlate = await analyzeLicensePlate(uploadedImage);
      
      // Dừng đếm sau khi có kết quả
      clearInterval(recognitionInterval);
      setConfidence(100);
      updateAnalysisStep("Phân tích hoàn tất!");
      
      // Cập nhật kết quả
      setScanResult(detectedPlate);
      setIsScanning(false);
      
      // Gọi hàm callback để thêm biển số mới
      onDetectPlate(detectedPlate);
    } catch (error) {
      clearInterval(recognitionInterval);
      setIsScanning(false);
      updateAnalysisStep("Lỗi khi phân tích biển số.");
      console.error("Lỗi phân tích biển số:", error);
    }
  };

  // Mô phỏng quá trình quét biển số xe qua camera
  const startScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    setConfidence(0);
    setAnalysisSteps([]);
    
    updateAnalysisStep("Đang xử lý hình ảnh từ camera...");
    
    // Mô phỏng quá trình nhận diện
    const recognitionInterval = setInterval(() => {
      setConfidence((prev) => {
        const newValue = Math.min(prev + Math.random() * 10, 99);
        
        // Thêm các bước phân tích dựa vào tiến độ
        if (prev < 20 && newValue >= 20) {
          updateAnalysisStep("Xử lý khung hình video...");
        } else if (prev < 40 && newValue >= 40) {
          updateAnalysisStep("Phát hiện vùng chứa biển số...");
        } else if (prev < 60 && newValue >= 60) {
          updateAnalysisStep("Trích xuất ký tự từ biển số...");
        } else if (prev < 80 && newValue >= 80) {
          updateAnalysisStep("Nhận dạng các ký tự...");
        } else if (prev < 95 && newValue >= 95) {
          updateAnalysisStep("Xác minh định dạng biển số...");
        }
        
        return newValue;
      });
    }, 300);
    
    try {
      // Tạo một "mã hash" giả từ thời gian hiện tại để có kết quả khác nhau mỗi lần quét
      const timestamp = new Date().getTime().toString();
      const detectedPlate = await analyzeLicensePlate(timestamp);
      
      // Dừng đếm sau khi có kết quả
      clearInterval(recognitionInterval);
      setConfidence(100);
      updateAnalysisStep("Phân tích hoàn tất!");
      
      // Cập nhật kết quả
      setScanResult(detectedPlate);
      setIsScanning(false);
      
      // Gọi hàm callback để thêm biển số mới
      onDetectPlate(detectedPlate);
    } catch (error) {
      clearInterval(recognitionInterval);
      setIsScanning(false);
      updateAnalysisStep("Lỗi khi phân tích biển số.");
      console.error("Lỗi phân tích biển số:", error);
    }
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
      setScanResult(null); // Xóa kết quả quét trước đó
      
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

  // Xóa ảnh đã tải lên và kết quả
  const clearUploadedImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
      setUploadedImage(null);
      setScanResult(null);
      setAnalysisSteps([]);
    }
  };

  // Kích hoạt tải ảnh lên
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
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
              <Trash2 size={16} />
            </Button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <CameraOff size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Camera đang tắt</p>
              <Button variant="outline" className="mt-4" onClick={triggerFileUpload}>
                <Upload className="mr-2 h-4 w-4" /> Tải ảnh lên
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                id="license-plate-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
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
            
            <div className="mt-4 max-w-md w-full">
              <div className="bg-secondary/30 rounded p-2 max-h-32 overflow-y-auto">
                {analysisSteps.map((step, index) => (
                  <p key={index} className="text-xs mb-1 text-muted-foreground flex items-center">
                    {index === analysisSteps.length - 1 && (
                      <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                    )}
                    {index !== analysisSteps.length - 1 && (
                      <Check className="h-3 w-3 mr-1.5 text-green-500" />
                    )}
                    {step}
                  </p>
                ))}
              </div>
            </div>
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
          {cameraActive ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" /> Tắt Camera
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" /> Bật Camera
            </>
          )}
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
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center"
              disabled={isScanning}
              onClick={triggerFileUpload}
            >
              <Upload className="mr-2 h-4 w-4" /> Tải ảnh lên
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              id="license-plate-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
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
