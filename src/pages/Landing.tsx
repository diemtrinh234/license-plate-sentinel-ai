import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  TrendingDown, 
  Shield, 
  BarChart3, 
  Camera, 
  Map, 
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/its-hero-dashboard.jpg";
import smartCamera from "@/assets/smart-camera.jpg";
import trafficMap from "@/assets/traffic-map.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(220_70%_12%)_100%)]" />
        
        {/* Hero content */}
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content */}
            <div className="space-y-8 z-10">
              <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                <span className="text-accent font-semibold text-sm">
                  🚀 Công nghệ ITS Thế hệ mới
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-foreground">Kiểm Soát Giao Thông.</span>
                <span className="block text-foreground">Tối Ưu Hóa Tuyến Đường.</span>
                <span className="block bg-gradient-to-r from-[hsl(var(--its-primary))] to-[hsl(var(--its-accent))] bg-clip-text text-transparent">
                  Nâng Cao An Toàn.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Giải pháp theo dõi, phân tích và điều khiển giao thông thời gian thực, 
                giúp giảm ùn tắc và bảo vệ an toàn cho mọi người tham gia giao thông.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/auth?mode=register">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-[hsl(var(--its-primary))] hover:bg-[hsl(var(--its-primary-dark))] text-primary-foreground shadow-[0_0_40px_hsl(var(--its-accent)/0.3)] transition-all duration-300 hover:shadow-[0_0_60px_hsl(var(--its-accent)/0.5)]"
                  >
                    Yêu Cầu Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="#solutions">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
                  >
                    Xem Giải Pháp Chi Tiết
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>Triển khai 15+ Tỉnh/Thành phố</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>1M+ Vi phạm phát hiện</span>
                </div>
              </div>
            </div>
            
            {/* Right column - Hero image */}
            <div className="relative lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_hsl(var(--its-accent)/0.2)] border border-accent/20">
                <img 
                  src={heroImage} 
                  alt="ITS Control Center Dashboard" 
                  className="w-full h-auto"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {/* Floating stats */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-card/90 backdrop-blur-sm border-accent/30">
                    <div className="text-2xl font-bold text-accent">98%</div>
                    <div className="text-xs text-muted-foreground">Độ chính xác</div>
                  </Card>
                  <Card className="p-4 bg-card/90 backdrop-blur-sm border-accent/30">
                    <div className="text-2xl font-bold text-accent">24/7</div>
                    <div className="text-xs text-muted-foreground">Giám sát</div>
                  </Card>
                  <Card className="p-4 bg-card/90 backdrop-blur-sm border-accent/30">
                    <div className="text-2xl font-bold text-accent">-30%</div>
                    <div className="text-xs text-muted-foreground">Ùn tắc</div>
                  </Card>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-[hsl(var(--its-primary))]/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="solutions" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lợi Ích & Tính Năng Nổi Bật
            </h2>
            <p className="text-lg text-muted-foreground">
              Giải pháp toàn diện giúp cơ quan quản lý kiểm soát giao thông hiệu quả hơn
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <TrendingDown className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Giảm Ùn Tắc 30%</h3>
              <p className="text-muted-foreground leading-relaxed">
                Phân tích luồng giao thông thời gian thực và tối ưu hóa tín hiệu đèn giao thông thông minh, 
                giảm thiểu thời gian chờ đợi trung bình 30%.
              </p>
            </Card>
            
            {/* Benefit 2 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Camera className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Phát Hiện Vi Phạm Tự Động</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI nhận diện biển số xe và phát hiện vi phạm tự động với độ chính xác 98%, 
                xử phạt nhanh chóng và công bằng.
              </p>
            </Card>
            
            {/* Benefit 3 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <BarChart3 className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Phân Tích Dữ Liệu Big Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                Xử lý hàng triệu điểm dữ liệu mỗi ngày, cung cấp báo cáo thống kê chi tiết 
                và dự báo xu hướng giao thông.
              </p>
            </Card>
            
            {/* Benefit 4 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Shield className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Nâng Cao An Toàn</h3>
              <p className="text-muted-foreground leading-relaxed">
                Phát hiện sớm tình huống nguy hiểm, cảnh báo người tham gia giao thông 
                và hỗ trợ lực lượng cứu hộ phản ứng nhanh.
              </p>
            </Card>
            
            {/* Benefit 5 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Map className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bản Đồ Thời Gian Thực</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hiển thị trực quan tình trạng giao thông toàn thành phố trên bản đồ số, 
                giúp điều phối nguồn lực hiệu quả.
              </p>
            </Card>
            
            {/* Benefit 6 */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-300 group hover:shadow-[0_0_30px_hsl(var(--its-accent)/0.2)]">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Clock className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Giám Sát 24/7</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hệ thống hoạt động liên tục không ngừng nghỉ, đảm bảo kiểm soát giao thông 
                mọi lúc mọi nơi, kể cả ban đêm.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Features Section */}
      <section className="py-20 md:py-32 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <img 
                src={smartCamera} 
                alt="Smart Traffic Camera" 
                className="rounded-2xl shadow-[0_0_40px_hsl(var(--its-accent)/0.2)] border border-accent/20"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                <span className="text-accent font-semibold text-sm">Camera AI</span>
              </div>
              <h3 className="text-3xl font-bold">
                Hệ Thống Camera Thông Minh
              </h3>
              <p className="text-lg text-muted-foreground">
                Camera AI tích hợp công nghệ nhận diện tiên tiến, tự động phát hiện biển số xe, 
                phân loại phương tiện và ghi nhận vi phạm giao thông 24/7.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>Nhận diện biển số xe với độ chính xác 98%</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>Phát hiện tự động các vi phạm: vượt đèn đỏ, quá tốc độ, đi sai làn</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>Hoạt động ổn định trong mọi điều kiện thời tiết và ánh sáng</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                <span className="text-accent font-semibold text-sm">Bản Đồ Số</span>
              </div>
              <h3 className="text-3xl font-bold">
                Trung Tâm Điều Hành Thông Minh
              </h3>
              <p className="text-lg text-muted-foreground">
                Bản đồ số hiển thị toàn cảnh giao thông thành phố với dữ liệu thời gian thực, 
                hỗ trợ ra quyết định nhanh chóng và chính xác.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>Hiển thị trực quan mật độ giao thông theo màu sắc</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>Cảnh báo khu vực ùn tắc và sự cố giao thông ngay lập tức</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <span>Tích hợp dữ liệu từ nhiều nguồn: camera, cảm biến, GPS</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src={trafficMap} 
                alt="Traffic Map Visualization" 
                className="rounded-2xl shadow-[0_0_40px_hsl(var(--its-accent)/0.2)] border border-accent/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--its-primary-dark)),hsl(var(--its-primary)))] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-4xl mx-auto p-12 bg-card/80 backdrop-blur-sm border-accent/30 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sẵn sàng trải nghiệm ITS?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Đăng ký ngay để được tư vấn và trải nghiệm demo miễn phí hệ thống 
              Giám sát Giao thông Thông minh của chúng tôi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=register">
                <Button 
                  size="lg" 
                  className="bg-[hsl(var(--its-primary))] hover:bg-[hsl(var(--its-primary-dark))] text-primary-foreground shadow-[0_0_40px_hsl(var(--its-accent)/0.3)] transition-all duration-300 hover:shadow-[0_0_60px_hsl(var(--its-accent)/0.5)]"
                >
                  Đăng Ký Ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-accent/50 text-accent hover:bg-accent/10 hover:border-accent"
                >
                  Đã có tài khoản? Đăng nhập
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2024 Hệ Thống Giám Sát Giao Thông Thông Minh (ITS)</p>
            <p className="text-sm">Giải pháp công nghệ cho giao thông an toàn và hiệu quả</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
