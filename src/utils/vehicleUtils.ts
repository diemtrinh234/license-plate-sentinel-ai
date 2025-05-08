
// Vehicle and violation types
export interface VehicleInfo {
  licensePlate: string;
  ownerName: string;
  ownerID: string;
  vehicleType: string;
  vehicleModel: string;
  registrationDate: string;
  address: string;
  phone?: string;
}

export interface Violation {
  id: number;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  fine: number;
  status: "pending" | "paid" | "appealed";
  evidenceImageUrl?: string;
}

// Sample data for demonstration
const vehicleDatabase: VehicleInfo[] = [
  {
    licensePlate: "43A-123.45",
    ownerName: "Nguyễn Văn Nam",
    ownerID: "123456789012",
    vehicleType: "Xe máy",
    vehicleModel: "Honda Wave",
    registrationDate: "15/03/2022",
    address: "123 Nguyễn Văn Linh, Đà Nẵng",
    phone: "0901234567"
  },
  {
    licensePlate: "92C-437.19",
    ownerName: "Trần Thị Hương",
    ownerID: "234567890123",
    vehicleType: "Xe hơi",
    vehicleModel: "Toyota Vios",
    registrationDate: "20/07/2023",
    address: "456 Trần Phú, Đà Nẵng",
    phone: "0912345678"
  },
  {
    licensePlate: "43B-592.73",
    ownerName: "Phạm Văn Hoàng",
    ownerID: "345678901234",
    vehicleType: "Xe máy",
    vehicleModel: "Yamaha Sirius",
    registrationDate: "05/11/2021",
    address: "789 Lê Duẩn, Đà Nẵng",
    phone: "0923456789"
  },
  {
    licensePlate: "51G-246.81",
    ownerName: "Lê Thị Mai",
    ownerID: "456789012345",
    vehicleType: "Xe hơi",
    vehicleModel: "Honda Civic",
    registrationDate: "12/12/2022",
    address: "235 Nguyễn Tất Thành, TP.HCM",
    phone: "0934567890"
  },
  {
    licensePlate: "74D-555.32",
    ownerName: "Hoàng Minh Tuấn",
    ownerID: "567890123456",
    vehicleType: "Xe hơi",
    vehicleModel: "Mazda CX-5",
    registrationDate: "03/05/2023",
    address: "422 Phan Chu Trinh, Huế",
    phone: "0945678901"
  },
];

export const violationFines = {
  "Chạy quá tốc độ": {
    "Under 10km/h": 250000, // In VND
    "10-20km/h": 500000,
    "Over 20km/h": 1200000
  },
  "Vượt đèn đỏ": 1200000,
  "Đi ngược chiều": 1000000,
  "Không đội mũ bảo hiểm": 400000,
  "Đỗ xe sai quy định": 350000,
  "Vi phạm làn đường": 500000
};

// Function to look up vehicle information
export const getVehicleInfo = (licensePlate: string): VehicleInfo | null => {
  const vehicle = vehicleDatabase.find(v => v.licensePlate === licensePlate);
  return vehicle || null;
};

// Function to get appropriate fine amount for violation type
export const getViolationFine = (violationType: string, severity?: string): number => {
  if (violationType === "Chạy quá tốc độ" && severity) {
    const speedFines = violationFines["Chạy quá tốc độ"] as Record<string, number>;
    return speedFines[severity] || 0;
  }
  
  // Make sure we're returning a number even for non-speeding violations
  const fine = violationFines[violationType as keyof typeof violationFines];
  return typeof fine === "number" ? fine : 0;
};

// Function to simulate violation detection from license plate scanning
export const detectViolation = (licensePlate: string): Violation | null => {
  // This is a simulation. In a real system, this would connect to a database or API
  
  // Randomly determine if there's a violation (50% chance for demo)
  if (Math.random() > 0.5) {
    return null;
  }
  
  const violationTypes = ["Chạy quá tốc độ", "Vượt đèn đỏ", "Đi ngược chiều", "Không đội mũ bảo hiểm", "Đỗ xe sai quy định", "Vi phạm làn đường"];
  const randomType = violationTypes[Math.floor(Math.random() * violationTypes.length)];
  
  const locations = [
    "Nguyễn Văn Linh - Hùng Vương, Đà Nẵng",
    "Cầu Rồng, Đà Nẵng",
    "Trần Phú - Lê Duẩn, Đà Nẵng",
    "Nguyễn Tất Thành - Ngô Quyền, Đà Nẵng",
    "2/9 - Hùng Vương, Đà Nẵng"
  ];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  
  const now = new Date();
  const dateStr = now.toLocaleDateString("vi-VN");
  const timeStr = now.toLocaleTimeString("vi-VN");
  
  let severity: string | undefined;
  if (randomType === "Chạy quá tốc độ") {
    const severityOptions = ["Under 10km/h", "10-20km/h", "Over 20km/h"];
    severity = severityOptions[Math.floor(Math.random() * severityOptions.length)];
  }
  
  return {
    id: Math.floor(Math.random() * 10000),
    type: randomType,
    description: severity 
      ? `${randomType} (${severity})` 
      : randomType,
    date: dateStr,
    time: timeStr,
    location: randomLocation,
    fine: getViolationFine(randomType, severity),
    status: "pending",
    evidenceImageUrl: "https://images.unsplash.com/photo-1577687710332-deec52d35ff9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  };
};
