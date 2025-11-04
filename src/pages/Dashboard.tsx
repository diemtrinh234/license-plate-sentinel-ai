import React, { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Filter, Search, MapPin, Bell, Clock, Calendar, ChartBar, Activity } from "lucide-react";
import { DashboardChart } from "@/components/DashboardChart";
import LicensePlateScanner from "@/components/LicensePlateScanner";
import { useToast } from "@/hooks/use-toast";
import ViolationDetails from "@/components/ViolationDetails";
import ViolationHistory from "@/components/ViolationHistory";
import DaNangMap from "@/components/DaNangMap";
import PlateChecker from "@/components/PlateChecker";
import { normalizePlate } from "@/utils/licensePlateValidation";

// Define vehicle data type
interface Vehicle {
  id: number;
  plate: string;
  time: string;
  date: string;
  location: string;
  type: string;
  status: "violation" | "normal";
}

// Sample vehicle data
const sampleVehicleData: Vehicle[] = [
  {
    id: 1,
    plate: "51F-238.91",
    time: "09:45:12",
    date: "05/05/2025",
    location: "Nguyen Trai - Khuat Duy Tien Intersection",
    type: "Red Light Violation",
    status: "violation",
  },
  {
    id: 2,
    plate: "38H-456.78",
    time: "09:32:05",
    date: "05/05/2025",
    location: "Thang Long Boulevard",
    type: "Speeding",
    status: "violation",
  },
  {
    id: 3,
    plate: "43A-123.45",
    time: "09:27:32",
    date: "05/05/2025",
    location: "Long Bien Bridge",
    type: "Illegal Parking",
    status: "violation",
  },
  {
    id: 4,
    plate: "30E-555.67",
    time: "09:15:28",
    date: "05/05/2025",
    location: "National Highway 1A",
    type: "Normal",
    status: "normal",
  },
  {
    id: 5,
    plate: "29B-789.12",
    time: "08:56:14",
    date: "05/05/2025",
    location: "Lang Road",
    type: "Normal",
    status: "normal",
  },
  {
    id: 6,
    plate: "33H-901.23",
    time: "08:45:33",
    date: "05/05/2025",
    location: "Giai Phong Road",
    type: "Normal",
    status: "normal",
  },
  {
    id: 7,
    plate: "36G-234.56",
    time: "08:32:07",
    date: "05/05/2025",
    location: "Nhat Tan Bridge",
    type: "Speeding",
    status: "violation",
  },
  {
    id: 8,
    plate: "99A-789.45",
    time: "08:20:51",
    date: "05/05/2025",
    location: "Thang Long Boulevard",
    type: "Normal",
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
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const { toast } = useToast();

  // Filter vehicles based on search term and status
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && vehicle.status === filterStatus;
  });

  // Normalize license plate format (moved to imported function)
  // Add new license plate from scanner
  const handleAddNewPlate = (newPlate: string) => {
    // Normalize the plate format
    const formattedPlate = normalizePlate(newPlate);
    
    const randomLocations = [
      "Nguyen Van Linh - Hung Vuong Intersection, Da Nang",
      "Dragon Bridge, Da Nang",
      "Bach Dang Street, Da Nang",
      "2/9 Street, Da Nang",
      "Nguyen Tat Thanh Avenue, Da Nang"
    ];
    
    const violations = ["Red Light Violation", "Speeding", "Illegal Parking", "Normal"];
    const location = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    const violation = violations[Math.floor(Math.random() * violations.length)];
    const status = violation !== "Normal" ? "violation" : "normal" as "violation" | "normal";
    
    const now = new Date();
    const time = now.toLocaleTimeString('en-US');
    const date = now.toLocaleDateString('en-US');
    
    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      plate: formattedPlate,
      time,
      date,
      location,
      type: violation,
      status,
    };
    
    setVehicles([newVehicle, ...vehicles]);
    
    // Update selected plate for violation check
    setSelectedPlate(formattedPlate);
    
    // Show toast notification
    toast({
      title: "New License Plate Detected",
      description: `Plate ${formattedPlate} detected at ${location}`,
      variant: status === "violation" ? "destructive" : "default",
    });
    
    if (status === "violation") {
      setNotificationCount(prev => prev + 1);
    }
  };

  // Show vehicle details
  const handleShowDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsOpen(true);
  };

  // Close details dialog
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  // Select plate for violation history check
  const handleSelectPlate = (plate: string) => {
    const formattedPlate = normalizePlate(plate);
    setSelectedPlate(formattedPlate);
  };
  
  // Handle notifications
  const handleClearNotifications = () => {
    setNotificationCount(0);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read",
    });
  };
  
  // Toggle live mode
  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
    toast({
      title: isLiveMode ? "Live Mode Disabled" : "Live Mode Enabled",
      description: isLiveMode 
        ? "Real-time updates have been disabled" 
        : "Real-time updates are now active",
    });
  };
  
  // Simulate live data updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLiveMode) {
      interval = setInterval(() => {
        const randomPlates = [
          "43B-553.22", "92C-123.45", "74D-987.65", 
          "51G-332.18", "30K-776.91", "88M-445.67"
        ];
        const randomPlate = randomPlates[Math.floor(Math.random() * randomPlates.length)];
        handleAddNewPlate(randomPlate);
      }, 15000); // Add new plate every 15 seconds in live mode
    }
    
    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Add initial system notification
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "System Alert",
        description: "Heavy traffic detected at Dragon Bridge area",
        variant: "destructive",
      });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Traffic Monitoring Dashboard</h1>
            <p className="text-muted-foreground">Smart traffic management and monitoring in Da Nang</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button 
              variant={isLiveMode ? "destructive" : "outline"} 
              onClick={toggleLiveMode}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              {isLiveMode ? "Disable Live Mode" : "Enable Live Mode"}
            </Button>
            
            <div className="relative">
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </div>
            
            <Button variant="ghost" onClick={handleClearNotifications}>
              Clear All
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{vehicles.length}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <ChartBar className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Updated today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Detected Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-destructive">
                  {vehicles.filter(v => v.status === "violation").length}
                </div>
                <div className="p-2 bg-destructive/10 rounded-full">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Updated today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-500">
                  {Math.round((vehicles.filter(v => v.status === "normal").length / vehicles.length) * 100)}%
                </div>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Updated today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Cameras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">24/30</div>
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full mt-3">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="plates" className="w-full mb-8">
          <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="plates" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              License Plates
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              AI Scanner
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Da Nang Map
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Violation Check
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="plates" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Search by plate number, location, violation type..."
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
                      <option value="all">All Vehicles</option>
                      <option value="violation">Violations Only</option>
                      <option value="normal">Normal Only</option>
                    </select>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableCaption>License plates detected today: {filteredVehicles.length}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>License Plate</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="hidden md:table-cell">Location</TableHead>
                        <TableHead className="hidden md:table-cell">Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVehicles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No vehicles found matching your search criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredVehicles.map((vehicle) => (
                          <TableRow key={vehicle.id} className={vehicle.status === "violation" ? "bg-destructive/5" : ""}>
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
                            <TableCell className="hidden md:table-cell max-w-[200px] truncate" title={vehicle.location}>
                              {vehicle.location}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{vehicle.type}</TableCell>
                            <TableCell>
                              {vehicle.status === "violation" ? (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  Violation
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1">
                                  <CheckCircle2 size={12} />
                                  Normal
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleShowDetails(vehicle)}
                                className="hover:bg-primary/10"
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scanner" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI License Plate Scanner</CardTitle>
              </CardHeader>
              <CardContent>
                <LicensePlateScanner onDetection={handleAddNewPlate} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Da Nang Traffic Map</CardTitle>
              </CardHeader>
              <CardContent>
                <DaNangMap detectedPlate={selectedPlate} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>License Plate Violation History</CardTitle>
              </CardHeader>
              <CardContent>
                <PlateChecker onCheck={handleSelectPlate} />
                {selectedPlate && (
                  <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Results for: {selectedPlate}</h3>
                    <ViolationHistory licensePlate={selectedPlate} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/30 p-6 rounded-lg">
                  <DashboardChart data={vehicles} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Vehicle details dialog */}
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
