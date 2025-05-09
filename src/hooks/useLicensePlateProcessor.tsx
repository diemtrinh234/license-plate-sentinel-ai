
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  detectLicensePlate, 
  recognizeLicensePlateText, 
  assessImageQuality,
  qualityThresholds,
  ImageQuality,
  ProcessingStage,
  PlateBox
} from '@/utils/licensePlateUtils';

interface UseLicensePlateProcessorProps {
  onDetection?: (plate: string, confidence: number) => void;
}

export function useLicensePlateProcessor({ onDetection } = {}) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const recognitionIntervalRef = useRef(null);

  const [licensePlate, setLicensePlate] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [imageQuality, setImageQuality] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [plateDetected, setPlateDetected] = useState(false);
  const [plateDetectionConfidence, setPlateDetectionConfidence] = useState(0);
  const [processingStage, setProcessingStage] = useState("idle");
  const [plateBox, setPlateBox] = useState(null);

  const processUploadedImage = () => {
    if (!imageRef.current || !canvasRef.current) return;
    setIsProcessing(true);
    setProcessingStage("detecting");

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) {
      setIsProcessing(false);
      return;
    }

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qualityScore = assessImageQuality(imageData);

      let qualityCategory =
        qualityScore >= qualityThresholds.good
          ? "good"
          : qualityScore >= qualityThresholds.medium
          ? "medium"
          : "poor";
      setImageQuality(qualityCategory);

      setTimeout(() => {
        const plateDetection = detectLicensePlate(imageData);
        setPlateDetected(plateDetection.detected);
        setPlateDetectionConfidence(plateDetection.confidence);

        if (plateDetection.box) {
          setPlateBox(plateDetection.box);
          if (context && plateDetection.detected) {
            context.drawImage(img, 0, 0, img.width, img.height);
            context.strokeStyle = "#10b981";
            context.lineWidth = 3;
            context.strokeRect(
              plateDetection.box.x,
              plateDetection.box.y,
              plateDetection.box.width,
              plateDetection.box.height
            );
          }
        }

        if (plateDetection.detected) {
          toast({
            title: "Phát hiện biển số xe",
            description: `Độ tin cậy: ${(plateDetection.confidence * 100).toFixed(1)}%`,
          });

          setProcessingStage("recognizing");
          setTimeout(() => {
            const recognitionResult = recognizeLicensePlateText(
              plateDetection.confidence,
              qualityScore
            );
            if (recognitionResult.text) {
              setLicensePlate(recognitionResult.text);
              setConfidence(recognitionResult.confidence);
              if (onDetection) onDetection(recognitionResult.text, recognitionResult.confidence);
              toast({
                title: "Biển số được nhận diện",
                description: `Đã xác định biển số: ${recognitionResult.text}`,
              });
            } else {
              toast({
                variant: "destructive",
                title: "Không thể đọc biển số",
                description: "Hệ thống đã phát hiện biển số nhưng không thể đọc được nội dung.",
              });
            }
            setProcessingStage("idle");
            setIsProcessing(false);
          }, 1000);
        } else {
          toast({
            variant: "destructive",
            title: "Không phát hiện biển số xe",
            description: "Hãy đảm bảo ảnh có chứa biển số xe và rõ nét.",
          });
          setProcessingStage("idle");
          setIsProcessing(false);
        }
      }, 1000);
    } catch (err) {
      console.error("Error processing image:", err);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Lỗi xử lý ảnh",
        description: "Không thể xử lý ảnh. Vui lòng thử lại với ảnh khác.",
      });
    }
  };

  const recognizeLicensePlateFromVideo = (videoRef) => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    setIsProcessing(true);
    setProcessingStage("detecting");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context || video.videoWidth === 0 || video.videoHeight === 0) {
      setIsProcessing(false);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qualityScore = assessImageQuality(imageData);

      let qualityCategory =
        qualityScore >= qualityThresholds.good
          ? "good"
          : qualityScore >= qualityThresholds.medium
          ? "medium"
          : "poor";
      setImageQuality(qualityCategory);

      setTimeout(() => {
        const plateDetection = detectLicensePlate(imageData);
        setPlateDetected(plateDetection.detected);
        setPlateDetectionConfidence(plateDetection.confidence);
        if (plateDetection.box) setPlateBox(plateDetection.box);

        if (plateDetection.detected) {
          console.log(`License plate detected with confidence: ${(plateDetection.confidence * 100).toFixed(1)}%`);
          setProcessingStage("recognizing");

          if (context && plateDetection.box) {
            context.lineWidth = 3;
            context.strokeStyle = "#10b981";
            context.strokeRect(
              plateDetection.box.x,
              plateDetection.box.y,
              plateDetection.box.width,
              plateDetection.box.height
            );
            context.font = "16px sans-serif";
            context.fillStyle = "#10b981";
            context.fillText(
              `Detection: ${(plateDetection.confidence * 100).toFixed(1)}%`,
              plateDetection.box.x,
              plateDetection.box.y - 10
            );
          }

          setTimeout(() => {
            if (qualityScore >= qualityThresholds.medium) {
              const recognitionResult = recognizeLicensePlateText(
                plateDetection.confidence,
                qualityScore
              );
              if (recognitionResult.text) {
                setLicensePlate(recognitionResult.text);
                setConfidence(recognitionResult.confidence);
                if (onDetection) onDetection(recognitionResult.text, recognitionResult.confidence);
                toast({
                  title: "Biển số được nhận diện",
                  description: `Đã xác định biển số: ${recognitionResult.text}`,
                });
                if (recognitionIntervalRef.current !== null) {
                  window.clearInterval(recognitionIntervalRef.current);
                  recognitionIntervalRef.current = null;
                }
              }
            } else {
              console.log(`Image quality too low: ${(qualityScore * 100).toFixed(2)}%`);
              if (qualityCategory === "poor") {
                toast({
                  variant: "destructive",
                  title: "Chất lượng hình ảnh kém",
                  description: "Hãy đảm bảo ánh sáng tốt và camera đủ gần với biển số.",
                });
              }
            }
            setProcessingStage("idle");
            setIsProcessing(false);
          }, 500);
        } else {
          console.log("No license plate detected in this frame");
          setProcessingStage("idle");
          setIsProcessing(false);
        }
      }, 500);
    } catch (err) {
      console.error("Error processing image:", err);
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setLicensePlate(null);
    setPlateDetected(false);
    setPlateDetectionConfidence(0);
    setProcessingStage("idle");
    setPlateBox(null);

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      processUploadedImage();
    };
    img.src = imageUrl;

    toast({
      title: "Hình ảnh đã được tải lên",
      description: "Đang xử lý biển số xe...",
    });
  };

  const handleManualSearch = (manualPlate) => {
    let formattedPlate = manualPlate.trim().toUpperCase();
    const plateRegex = /^(\d{2}[A-Z]|\d{2}-\d{3}|\d{2}[A-Z]-\d{3}|\d{2}[A-Z]-\d{3}\.\d{2})$/;
    if (!plateRegex.test(formattedPlate) && !formattedPlate.includes("-")) {
      if (formattedPlate.length >= 5) {
        const province = formattedPlate.substring(0, 3);
        const numbers = formattedPlate.substring(3);
        formattedPlate = `${province}-${numbers}`;
      }
    }
    setLicensePlate(formattedPlate);
    setConfidence(0.9);
    setImageQuality("good");
    setPlateDetected(true);
    setPlateDetectionConfidence(1.0);
    if (onDetection) onDetection(formattedPlate, 0.9);
    toast({
      title: "Biển số đã nhập",
      description: `Đang kiểm tra biển số: ${formattedPlate}`,
    });
  };

  const handleRetake = () => {
    setLicensePlate(null);
    setConfidence(0);
    setImageQuality(null);
    setPlateDetected(false);
    setPlateDetectionConfidence(0);
    setPlateBox(null);
    setProcessingStage("idle");
    if (uploadedImage) processUploadedImage();
  };

  return {
    canvasRef,
    licensePlate,
    confidence,
    imageQuality,
    isProcessing,
    uploadedImage,
    plateDetected,
    plateDetectionConfidence,
    processingStage,
    plateBox,
    processUploadedImage,
    recognizeLicensePlateFromVideo,
    handleImageUpload,
    handleManualSearch,
    handleRetake,
    handleCancelUpload,
    setupRecognitionInterval,
    clearRecognitionInterval,
    setUploadedImage,
    setLicensePlate,
    cleanup
  };
}
