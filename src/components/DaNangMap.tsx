
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertCircle, Loader2, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ViolationLocation {
  id: number;
  plate: string;
  lat: number;
  lng: number;
  type: string;
}

// Mô phỏng các địa điểm vi phạm tại Đà Nẵng
const violationLocations: ViolationLocation[] = [
  { id: 1, plate: "43A-123.45", lat: 16.0544, lng: 108.2022, type: "Vượt đèn đỏ" },
  { id: 2, plate: "92C-437.19", lat: 16.0650, lng: 108.2236, type: "Quá tốc độ" },
  { id: 3, plate: "43B-592.73", lat: 16.0478, lng: 108.1893, type: "Đỗ sai quy định" },
  { id: 4, plate: "20H-762.81", lat: 16.0758, lng: 108.2241, type: "Vượt đèn đỏ" },
  { id: 5, plate: "74D-555.32", lat: 16.0811, lng: 108.2130, type: "Quá tốc độ" },
];

interface DaNangMapProps {
  detectedPlate?: string | null;
}

const DaNangMap: React.FC<DaNangMapProps> = ({ detectedPlate }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenSubmitted, setTokenSubmitted] = useState<boolean>(false);

  const initializeMap = async (token: string) => {
    if (!mapContainer.current) return;
    
    try {
      setIsLoading(true);
      
      // Use the provided Mapbox token
      mapboxgl.accessToken = token;
      
      // Khởi tạo bản đồ với trung tâm là Đà Nẵng
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [108.2022, 16.0544], // Tọa độ trung tâm Đà Nẵng
        zoom: 13,
      });

      // Thêm các điều khiển điều hướng
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Xử lý khi bản đồ đã tải xong
      map.current.on('load', () => {
        setIsLoading(false);
        
        // Thêm các điểm vi phạm lên bản đồ
        addViolationMarkers();
      });
      
      // Xử lý lỗi tải bản đồ
      map.current.on('error', (e) => {
        console.error('Map load error:', e);
        setError('Không thể tải bản đồ. Vui lòng kiểm tra Mapbox token của bạn.');
        setIsLoading(false);
        setTokenSubmitted(false);
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Không thể tải bản đồ. Vui lòng thử lại sau.');
      setIsLoading(false);
      setTokenSubmitted(false);
    }
  };

  const handleSubmitToken = () => {
    if (!mapboxToken.trim()) {
      toast({
        variant: "destructive",
        title: "Token không hợp lệ",
        description: "Vui lòng nhập Mapbox token của bạn",
      });
      return;
    }
    
    // Cleanup previous map instance if exists
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    setTokenSubmitted(true);
    setError(null);
    toast({
      title: "Đang tải bản đồ",
      description: "Vui lòng đợi trong giây lát...",
    });
    
    // Initialize the map with the provided token
    initializeMap(mapboxToken);
  };

  // Thêm các điểm vi phạm lên bản đồ
  const addViolationMarkers = () => {
    if (!map.current) return;
    
    // Xóa các markers cũ
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Thêm markers mới cho các điểm vi phạm
    violationLocations.forEach(location => {
      // Tạo element cho popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2';
      popupContent.innerHTML = `
        <div class="font-bold text-sm">${location.plate}</div>
        <div class="text-xs text-red-500">${location.type}</div>
      `;
      
      // Tạo element cho marker
      const markerElement = document.createElement('div');
      markerElement.className = 'flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full shadow-lg';
      
      // Thêm icon vào marker
      const alertCircle = document.createElement('div');
      alertCircle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
      markerElement.appendChild(alertCircle);
      
      // Highlight nếu khớp với biển số đã phát hiện
      const isDetectedPlate = detectedPlate && location.plate === detectedPlate;
      if (isDetectedPlate) {
        markerElement.className += ' ring-4 ring-yellow-400 animate-pulse';
      }
      
      // Tạo popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true
      }).setDOMContent(popupContent);
      
      // Tạo marker và thêm vào bản đồ
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'bottom'
      })
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map.current as mapboxgl.Map);
      
      // Nếu là biển số đã phát hiện, mở popup và di chuyển bản đồ đến vị trí đó
      if (isDetectedPlate && map.current) {
        popup.addTo(map.current);
        map.current.flyTo({
          center: [location.lng, location.lat],
          zoom: 15,
          speed: 1.5,
          curve: 1.5
        });
      }
      
      // Lưu marker để có thể xóa sau này
      markers.current.push(marker);
    });
  };

  // Cập nhật markers khi biển số được phát hiện thay đổi
  useEffect(() => {
    if (map.current && !isLoading && tokenSubmitted) {
      addViolationMarkers();
    }
  }, [detectedPlate, tokenSubmitted]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      // Xóa tất cả markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium">Bản đồ vi phạm Đà Nẵng</h3>
        <p className="text-sm text-muted-foreground">Hiển thị các vị trí vi phạm giao thông</p>
      </div>
      
      {!tokenSubmitted && (
        <div className="p-4">
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium mb-2">Nhập Mapbox Token</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Để sử dụng bản đồ, bạn cần nhập Mapbox public token. 
              Bạn có thể lấy token miễn phí từ <a href="https://mapbox.com/" target="_blank" rel="noreferrer" className="text-primary underline">mapbox.com</a>.
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nhập Mapbox public token của bạn..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={handleSubmitToken}>
                <Map className="mr-2 h-4 w-4" />
                Tải bản đồ
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative aspect-[16/9]">
        {isLoading && tokenSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm">Đang tải bản đồ...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10">
            <div className="flex flex-col items-center text-center p-4">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-destructive font-medium">{error}</p>
              <p className="text-sm text-muted-foreground mt-2">Vui lòng kiểm tra lại Mapbox token của bạn</p>
              {!tokenSubmitted && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setError(null)}
                >
                  Thử lại
                </Button>
              )}
            </div>
          </div>
        )}
        
        {!tokenSubmitted && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 z-10">
            <div className="flex flex-col items-center text-center p-4">
              <Map className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nhập Mapbox token để tải bản đồ</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Bản đồ Đà Nẵng sẽ hiển thị các vị trí vi phạm giao thông và giúp bạn dễ dàng theo dõi.
              </p>
            </div>
          </div>
        )}
        
        <div 
          ref={mapContainer} 
          className="w-full h-full" 
        />
      </div>
      
      {tokenSubmitted && !isLoading && !error && (
        <div className="p-3 bg-muted/40 border-t border-border">
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1.5"></div>
            <span>Vị trí vi phạm</span>
            
            {detectedPlate && (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full ring-2 ring-yellow-400 ml-4 mr-1.5"></div>
                <span>Biển số đang tìm: {detectedPlate}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaNangMap;
