import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle } from 'lucide-react';

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
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Khởi tạo bản đồ
    map.current = L.map(mapContainer.current).setView([16.0544, 108.2022], 13);

    // Thêm tile layer từ OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Thêm các marker
    addMarkers();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const addMarkers = () => {
    if (!map.current) return;

    // Xóa markers cũ
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Thêm markers mới
    violationLocations.forEach(location => {
      if (!map.current) return;

      const isHighlighted = detectedPlate === location.plate;

      // Tạo custom icon
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full shadow-lg ${isHighlighted ? 'ring-4 ring-yellow-400 animate-pulse' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" x2="12" y1="8" y2="12"/>
              <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Tạo marker
      const marker = L.marker([location.lat, location.lng], { icon })
        .bindPopup(`
          <div class="p-2">
            <div class="font-bold text-sm">${location.plate}</div>
            <div class="text-xs text-red-500">${location.type}</div>
          </div>
        `)
        .addTo(map.current);

      // Nếu là biển số được phát hiện, mở popup và fly đến vị trí
      if (isHighlighted) {
        marker.openPopup();
        map.current.flyTo([location.lat, location.lng], 15, {
          duration: 1.5,
        });
      }

      markers.current.push(marker);
    });
  };

  // Cập nhật markers khi detectedPlate thay đổi
  useEffect(() => {
    if (map.current) {
      addMarkers();
    }
  }, [detectedPlate]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium">Bản đồ vi phạm Đà Nẵng</h3>
        <p className="text-sm text-muted-foreground">
          Sử dụng OpenStreetMap - Hoàn toàn miễn phí, không cần API key
        </p>
      </div>
      
      <div className="relative aspect-[16/9]">
        <div 
          ref={mapContainer} 
          className="w-full h-full z-0"
        />
      </div>
      
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
    </div>
  );
};

export default DaNangMap;
