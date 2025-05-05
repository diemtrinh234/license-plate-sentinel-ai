
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CarFront,
  Monitor,
  Search,
  Route
} from "lucide-react";

const Dashboard = () => {
  return (
    <section id="dashboard" className="section bg-secondary/10">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">Dashboard</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trung Tâm Điều Khiển Trực Quan</h2>
          <p className="text-muted-foreground text-lg">
            Giao diện quản lý trực quan, dễ dàng theo dõi tất cả các hoạt động giao thông và nhận cảnh báo tức thì
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
          <div className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor size={20} className="text-primary" />
                <h3 className="font-medium">Dashboard Giám Sát</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Online
                </Badge>
                <span className="text-xs text-muted-foreground">Cập nhật: 1 phút trước</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <h4 className="font-medium mb-4">Tổng quan hệ thống</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Trạm giám sát hoạt động</span>
                      <span className="font-medium">24/30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Camera đang hoạt động</span>
                      <span className="font-medium">120/145</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Biển số đã nhận diện hôm nay</span>
                      <span className="font-medium">4,285</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cảnh báo hôm nay</span>
                      <span className="text-orange-500 font-medium">27</span>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Cảnh báo gần đây</h4>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                      27 mới
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      {time: '09:45', plate: '51F-238.91', type: 'Vượt đèn đỏ'},
                      {time: '09:32', plate: '38H-456.78', type: 'Quá tốc độ'},
                      {time: '09:27', plate: '43A-123.45', type: 'Đỗ sai quy định'},
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
                      Xem tất cả cảnh báo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main content - Camera feeds */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Camera giám sát trực tiếp</h4>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Route size={14} className="mr-1" /> Xem bản đồ
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search size={14} className="mr-1" /> Tìm kiếm
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
                          <span className="h-2 w-2 bg-red-500 rounded-full mr-1 animate-pulse-slow"></span>
                          Trực tiếp
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">Ngã tư Nguyễn Trãi - Khuất Duy Tiến</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                            Hoạt động
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          105 biển số đã nhận diện trong giờ qua
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="default" className="w-full">
                  Xem tất cả camera
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
