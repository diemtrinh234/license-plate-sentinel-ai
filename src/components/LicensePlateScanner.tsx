
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Camera, Check, Upload, ImageIcon, CameraOff, Trash2, Scan } from "lucide-react";
import { toast } from "sonner";

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

// Class mô phỏng cho mô hình CNN để nhận dạng biển số xe
class CNNLicensePlateDetector {
  private readonly MODEL_ACCURACY = 0.95; // Độ chính xác mô phỏng của mô hình 95%
  private readonly PROCESSING_STEPS = [
    "Khởi tạo mô hình CNN...",
    "Tiền xử lý hình ảnh...",
    "Chuẩn hóa độ sáng và tương phản...",
    "Phát hiện vùng chứa biển số...",
    "Áp dụng phân đoạn ảnh...",
    "Trích xuất đặc trưng CNN...",
    "Dò tìm cạnh và góc của biển số...",
    "Xử lý phân đoạn ký tự...",
    "Nhận dạng ký tự bằng mạng CNN...",
    "Chỉnh sửa hậu kỳ và kiểm tra định dạng...",
    "Xác minh kết quả với độ tin cậy cao..."
  ];

  // Phân tích ảnh và trả về kết quả cùng các bước xử lý
  async analyzeImage(imageUrl: string, updateStep: (step: string) => void): Promise<string> {
    // Tạo một giá trị hash đơn giản từ URL để luôn trả về cùng một kết quả cho cùng một hình ảnh
    let hash = 0;
    for (let i = 0; i < imageUrl.length; i++) {
      hash = ((hash << 5) - hash) + imageUrl.charCodeAt(i);
      hash |= 0; // Chuyển đổi thành số nguyên 32-bit
    }
    
    // Lấy biển số xe dựa trên hash để kết quả nhất quán cho cùng một hình ảnh
    const plateIndex = Math.abs(hash) % sampleLicensePlates.length;
    
    // Mô phỏng các bước xử lý của CNN
    for (const step of this.PROCESSING_STEPS) {
      await new Promise(resolve => setTimeout(resolve, 300));
      updateStep(step);
    }
    
    // Áp dụng nhiễu ngẫu nhiên để mô phỏng kết quả với độ chính xác của mô hình
    const accuracy = Math.random();
    if (accuracy <= this.MODEL_ACCURACY) {
      // Kết quả chính xác
      return sampleLicensePlates[plateIndex];
    } else {
      // Mô phỏng lỗi nhận dạng (5% khả năng)
      const errorCharPosition = Math.floor(Math.random() * sampleLicensePlates[plateIndex].length);
      const possibleChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-.";
      const originalChar = sampleLicensePlates[plateIndex][errorCharPosition];
      let newChar = originalChar;
      
      // Đảm bảo ký tự mới khác ký tự ban đầu
      while (newChar === originalChar) {
        newChar = possibleChars[Math.floor(Math.random() * possibleChars.length)];
      }
      
      // Thay thế một ký tự trong biển số để mô phỏng lỗi nhận dạng
      const plateWithError = 
        sampleLicensePlates[plateIndex].substring(0, errorCharPosition) + 
        newChar + 
        sampleLicensePlates[plateIndex].substring(errorCharPosition + 1);
      
      return plateWithError;
    }
  }

  // Đánh giá độ tin cậy của kết quả
  getConfidenceScore(): number {
    // Mô phỏng độ tin cậy dựa trên xác suất với phân phối chuẩn quanh MODEL_ACCURACY
    const mean = this.MODEL_ACCURACY * 100;
    const stdDev = 5; // Độ lệch chuẩn 5%
    
    // Tạo giá trị ngẫu nhiên theo phân phối chuẩn
    let sum = 0;
    for (let i = 0; i < 6; i++) { // Xấp xỉ phân phối chuẩn bằng định lý giới hạn trung tâm
      sum += Math.random();
    }
    
    // Chuyển đổi thành giá trị theo phân phối chuẩn
    const normalRandom = ((sum - 3) / 3) * stdDev + mean;
    
    // Giới hạn trong khoảng [0-100]
    return Math.max(0, Math.min(100, normalRandom));
  }
}

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
  const [detectionQuality, setDetectionQuality] = useState<"high" | "medium" | "low" | null>(null);

  // Khởi tạo đối tượng mô phỏng CNN
  const cnnDetector = new CNNLicensePlateDetector();

  // Xử lý khi tải ảnh lên
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra xem file có phải là ảnh không
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng tải lên một file ảnh');
        return;
      }

      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file quá lớn. Tối đa 5MB');
        return;
      }

      // Chuyển đổi file thành URL để hiển thị
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setCameraActive(false); // Tắt camera nếu đang bật
      setScanResult(null); // Xóa kết quả quét trước đó
      setDetectionQuality(null); // Xóa thông tin chất lượng nhận diện
      toast.success('Đã tải ảnh lên thành công');
    }
  };

  // Cập nhật trạng thái phân tích
  const updateAnalysisStep = (step: string) => {
    setAnalysisSteps(prev => [...prev, step]);
  };

  // Quét biển số từ ảnh đã tải lên bằng mô hình CNN mô phỏng
  const scanUploadedImage = async () => {
    if (!uploadedImage) return;
    
    setIsScanning(true);
    setScanResult(null);
    setConfidence(0);
    setAnalysisSteps([]);
    setDetectionQuality(null);
    
    try {
      // Cập nhật tiến trình nhận diện qua thời gian
      let recognitionInterval = setInterval(() => {
        setConfidence(prev => {
          const newValue = Math.min(prev + Math.random() * 3, 99);
          return newValue;
        });
      }, 200);
      
      // Phân tích biển số bằng CNN mô phỏng
      const detectedPlate = await cnnDetector.analyzeImage(uploadedImage, updateAnalysisStep);
      
      // Dừng đếm sau khi có kết quả
      clearInterval(recognitionInterval);
      
      // Lấy điểm độ tin cậy từ mô hình
      const confidenceScore = cnnDetector.getConfidenceScore();
      setConfidence(confidenceScore);
      
      // Xác định chất lượng nhận diện dựa trên điểm độ tin cậy
      if (confidenceScore >= 90) {
        setDetectionQuality("high");
      } else if (confidenceScore >= 75) {
        setDetectionQuality("medium");
      } else {
        setDetectionQuality("low");
      }
      
      // Thêm bước cuối cùng
      updateAnalysisStep("Phân tích hoàn tất!");
      
      // Cập nhật kết quả
      setScanResult(detectedPlate);
      setIsScanning(false);
      
      // Hiển thị thông báo thành công
      toast.success(`Đã nhận diện biển số: ${detectedPlate}`);
      
      // Gọi hàm callback để thêm biển số mới
      onDetectPlate(detectedPlate);
    } catch (error) {
      clearInterval(recognitionInterval);
      setIsScanning(false);
      updateAnalysisStep("Lỗi khi phân tích biển số.");
      toast.error("Không thể nhận diện biển số xe trong ảnh");
      console.error("Lỗi phân tích biển số:", error);
    }
  };

  // Mô phỏng quá trình quét biển số xe qua camera với mô hình CNN mô phỏng
  const startScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    setConfidence(0);
    setAnalysisSteps([]);
    setDetectionQuality(null);
    
    try {
      // Cập nhật tiến trình nhận diện qua thời gian
      let recognitionInterval = setInterval(() => {
        setConfidence(prev => {
          const newValue = Math.min(prev + Math.random() * 3, 99);
          return newValue;
        });
      }, 200);
      
      // Tạo một "mã hash" giả từ thời gian hiện tại để có kết quả khác nhau mỗi lần quét
      const timestamp = new Date().getTime().toString();
      
      // Phân tích biển số bằng CNN mô phỏng
      const detectedPlate = await cnnDetector.analyzeImage(timestamp, updateAnalysisStep);
      
      // Dừng đếm sau khi có kết quả
      clearInterval(recognitionInterval);
      
      // Lấy điểm độ tin cậy từ mô hình
      const confidenceScore = cnnDetector.getConfidenceScore();
      setConfidence(confidenceScore);
      
      // Xác định chất lượng nhận diện dựa trên điểm độ tin cậy
      if (confidenceScore >= 90) {
        setDetectionQuality("high");
      } else if (confidenceScore >= 75) {
        setDetectionQuality("medium");
      } else {
        setDetectionQuality("low");
      }
      
      // Thêm bước cuối cùng
      updateAnalysisStep("Phân tích hoàn tất!");
      
      // Cập nhật kết quả
      setScanResult(detectedPlate);
      setIsScanning(false);
      
      // Hiển thị thông báo thành công
      toast.success(`Đã nhận diện biển số: ${detectedPlate}`);
      
      // Gọi hàm callback để thêm biển số mới
      onDetectPlate(detectedPlate);
    } catch (error) {
      clearInterval(recognitionInterval);
      setIsScanning(false);
      updateAnalysisStep("Lỗi khi phân tích biển số.");
      toast.error("Không thể nhận diện biển số xe");
      console.error("Lỗi phân tích biển số:", error);
    }
  };
  
  // Xử lý gửi biển số tùy chỉnh
  const handleSubmitCustomPlate = () => {
    if (customPlate.trim()) {
      onDetectPlate(customPlate);
      setCustomPlate("");
      setScanResult(customPlate);
      toast.success(`Đã thêm biển số: ${customPlate}`);
    }
  };

  // Mô phỏng bật camera
  const toggleCamera = () => {
    if (!cameraActive) {
      setCameraActive(true);
      setUploadedImage(null); // Xóa ảnh đã tải lên (nếu có)
      setScanResult(null); // Xóa kết quả quét trước đó
      setDetectionQuality(null); // Xóa thông tin chất lượng nhận diện
      
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
      setDetectionQuality(null);
    }
  };

  // Kích hoạt tải ảnh lên
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Render badge chỉ thị chất lượng nhận diện
  const renderQualityBadge = () => {
    if (!detectionQuality) return null;
    
    switch (detectionQuality) {
      case "high":
        return (
          <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            Nhận diện chính xác cao
          </div>
        );
      case "medium":
        return (
          <div className="absolute top-2 left-2 bg-yellow-500/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            Nhận diện độ tin cậy trung bình
          </div>
        );
      case "low":
        return (
          <div className="absolute top-2 left-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            Nhận diện độ tin cậy thấp
          </div>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">AI Camera Scanner (CNN)</h2>
        <p className="text-muted-foreground mb-4">
          Hệ thống nhận dạng biển số xe tự động sử dụng mạng CNN
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
            {renderQualityBadge()}
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
              <div>
                <p>
                  <span className="font-medium">Biển số: </span> 
                  <span className="text-primary font-bold">{scanResult}</span>
                </p>
                {detectionQuality && (
                  <p className="text-xs text-muted-foreground">
                    Độ tin cậy: {Math.round(confidence)}% - 
                    {detectionQuality === "high" && " Chất lượng cao"}
                    {detectionQuality === "medium" && " Chất lượng trung bình"}
                    {detectionQuality === "low" && " Chất lượng thấp"}
                  </p>
                )}
              </div>
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
              <>
                <Scan className="mr-2 h-4 w-4" /> Quét biển số (CNN)
              </>
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
              <>
                <Scan className="mr-2 h-4 w-4" /> Phân tích ảnh (CNN)
              </>
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
