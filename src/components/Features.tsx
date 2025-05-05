
import { Camera, CarFront, Cctv, Monitor, Route, Search } from "lucide-react";

const featuresData = [
  {
    title: "Nhận Dạng Biển Số",
    description: "Sử dụng AI CNN để nhận dạng và trích xuất biển số xe với độ chính xác lên đến 99.5%",
    icon: CarFront,
  },
  {
    title: "Giám Sát Thời Gian Thực",
    description: "Hệ thống camera giám sát hoạt động 24/7, cung cấp dữ liệu thời gian thực cho trung tâm điều khiển",
    icon: Cctv,
  },
  {
    title: "Phân Tích Dữ Liệu AI",
    description: "Phân tích dữ liệu thông minh giúp nhận diện các hành vi vi phạm và tình trạng giao thông",
    icon: Search,
  },
  {
    title: "Tích Hợp Đa Camera",
    description: "Kết nối và quản lý nhiều camera giám sát từ các vị trí khác nhau trên một hệ thống thống nhất",
    icon: Camera,
  },
  {
    title: "Dashboard Trực Quan",
    description: "Giao diện quản lý trực quan, dễ sử dụng với khả năng tùy chỉnh và truy xuất dữ liệu nhanh chóng",
    icon: Monitor,
  },
  {
    title: "Bản Đồ Theo Dõi",
    description: "Hiển thị vị trí và tình trạng của các điểm giám sát giao thông trên bản đồ tương tác",
    icon: Route,
  },
];

const Features = () => {
  return (
    <section id="features" className="section bg-secondary/10">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tính Năng Nổi Bật</h2>
          <p className="text-muted-foreground text-lg">
            Hệ thống giám sát giao thông thông minh của chúng tôi tích hợp các công nghệ tiên tiến
            để mang lại hiệu quả cao trong quản lý và giám sát giao thông
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                <feature.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
