
import { Button } from "@/components/ui/button";
import { Camera, CarFront, Cctv } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-28 pb-20 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMEYxNzJBIi8+CjxyZWN0IHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiIgeD0iOSIgeT0iOSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-10" />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-secondary/50 rounded-full">
              <span className="text-primary font-medium">Hệ thống giám sát mới nhất</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Hệ Thống Giám Sát Giao Thông 
              <span className="gradient-text"> Thông Minh</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Tối ưu hóa quản lý giao thông với hệ thống AI nhận dạng biển số xe thông minh, 
              giúp nâng cao an ninh và giám sát hiệu quả.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="sm:w-auto">
                Tìm hiểu thêm
              </Button>
              <Button size="lg" variant="secondary" className="sm:w-auto">
                Đặt lịch demo
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Camera size={20} className="text-primary" />
                </div>
                <span>Nhận dạng chính xác 99.5%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Cctv size={20} className="text-primary" />
                </div>
                <span>Giám sát 24/7</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-card rounded-xl p-1 border border-border shadow-xl">
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-video bg-secondary/30 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <div className="relative">
                        <div className="relative z-10">
                          <img 
                            src="https://images.unsplash.com/photo-1597762117709-859f744b84c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                            alt="Traffic monitoring system" 
                            className="w-full h-full object-cover rounded-md opacity-90"
                          />
                        </div>
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-primary/20 to-transparent rounded-md"></div>
                        <div className="absolute bottom-4 left-4 right-4 p-3 bg-background/90 border border-border rounded-md backdrop-blur-sm flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <CarFront size={16} className="text-primary" />
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Nhận dạng biển số</div>
                              <div className="font-medium">43A-123.45</div>
                            </div>
                          </div>
                          <div className="text-xs bg-primary/20 px-2 py-1 rounded-full text-primary animate-pulse-slow">
                            Đang xử lý...
                          </div>
                        </div>
                      </div>
                      <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/30 rounded-full blur-3xl"></div>
                      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full bg-primary/5 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
