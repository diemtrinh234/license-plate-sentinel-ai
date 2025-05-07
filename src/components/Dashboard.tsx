
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CarFront,
  Monitor,
  Search,
  Route,
  AlertTriangle,
  AlertCircle,
  MapPin,
  BarChart4,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { toast } = useToast();
  const [showNotification, setShowNotification] = useState(false);
  
  // Simulate real-time notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
      toast({
        title: "Traffic Alert",
        description: "Heavy traffic detected on Nguyen Van Linh - Bach Dang intersection",
        variant: "destructive",
      });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <section id="dashboard" className="section bg-secondary/10">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">Dashboard</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Smart Traffic Monitoring System</h2>
          <p className="text-muted-foreground text-lg">
            Visual management interface to monitor all traffic activities and receive instant alerts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Active Cameras</h3>
              <CarFront className="text-primary" size={20} />
            </div>
            <p className="text-3xl font-bold">120/145</p>
            <div className="w-full bg-secondary/50 h-2 rounded-full mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '83%' }}></div>
            </div>
            <p className="text-muted-foreground text-sm mt-2">83% operational</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Violations Today</h3>
              <AlertCircle className="text-destructive" size={20} />
            </div>
            <p className="text-3xl font-bold text-destructive">27</p>
            <div className="flex items-center gap-2 mt-2">
              <ArrowUpRight className="text-destructive" size={16} />
              <p className="text-destructive text-sm">+12% from yesterday</p>
            </div>
            <Button variant="link" className="mt-2 p-0 h-auto text-sm">View all violations</Button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Traffic Status</h3>
              <BarChart4 className="text-amber-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-amber-500">Moderate</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Low: 12 areas
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                Medium: 8 areas
              </Badge>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                Heavy: 3 areas
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl mb-8">
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor size={20} className="text-primary" />
                <h3 className="font-medium">Traffic Monitoring Dashboard</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Online
                </Badge>
                <span className="text-xs text-muted-foreground">Last update: 1 minute ago</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <h4 className="font-medium mb-4">System Overview</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Active monitoring stations</span>
                      <span className="font-medium">24/30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Active cameras</span>
                      <span className="font-medium">120/145</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">License plates detected today</span>
                      <span className="font-medium">4,285</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Alerts today</span>
                      <span className="text-orange-500 font-medium">27</span>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Recent Alerts</h4>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                      27 new
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      {time: '09:45', plate: '51F-238.91', type: 'Running red light'},
                      {time: '09:32', plate: '38H-456.78', type: 'Speeding'},
                      {time: '09:27', plate: '43A-123.45', type: 'Parking violation'},
                    ].map((alert, i) => (
                      <div key={i} className="p-3 bg-background rounded-md border border-border">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <CarFront size={14} className="text-orange-500" />
                            <span className="font-medium">{alert.plate}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{alert.type}</div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full">
                      View all alerts
                    </Button>
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Traffic Incidents</h4>
                    <Badge variant="destructive">
                      3 Active
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-destructive/10 rounded-md border border-destructive/20">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className="text-destructive" />
                          <span className="font-medium">Accident</span>
                        </div>
                        <span className="text-xs text-muted-foreground">10:15</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">Nguyen Van Linh - Bach Dang intersection</div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
                        Police dispatched
                      </Badge>
                    </div>
                    
                    <div className="p-3 bg-amber-500/10 rounded-md border border-amber-500/20">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-amber-500" />
                          <span className="font-medium">Heavy Traffic</span>
                        </div>
                        <span className="text-xs text-muted-foreground">09:30</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Dragon Bridge - Main route</div>
                    </div>
                    
                    <div className="p-3 bg-amber-500/10 rounded-md border border-amber-500/20">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-amber-500" />
                          <span className="font-medium">Road Work</span>
                        </div>
                        <span className="text-xs text-muted-foreground">08:15</span>
                      </div>
                      <div className="text-sm text-muted-foreground">3/2 Street, Hai Chau District</div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="w-full">
                      View all incidents
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main content - Camera feeds */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Live Camera Feeds</h4>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Route size={14} className="mr-1" /> View Map
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search size={14} className="mr-1" /> Search
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-secondary/30 rounded-lg overflow-hidden border border-border">
                      <div className="aspect-video bg-background/50 relative">
                        <img 
                          src={`https://images.unsplash.com/photo-1577687710332-deec52d35ff9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} 
                          alt={`Camera feed ${item}`} 
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute top-2 left-2 bg-background/80 text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                          Camera #{item}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center">
                          <span className="h-2 w-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                          Live
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">Nguyen Trai - Khuat Duy Tien Intersection</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                            Active
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          105 license plates detected in the past hour
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="default" className="w-full">
                  View all cameras
                </Button>
                
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <h4 className="font-medium mb-4">Traffic Density Map</h4>
                  <div className="aspect-video bg-background/50 rounded-lg relative overflow-hidden border border-border">
                    <img 
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                      alt="Traffic map" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-background/80 rounded-lg p-3 backdrop-blur-sm">
                      <h5 className="font-medium text-sm mb-2">Legend</h5>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Low traffic</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span>Moderate</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Heavy</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="absolute top-4 right-4">
                      Open full map
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
