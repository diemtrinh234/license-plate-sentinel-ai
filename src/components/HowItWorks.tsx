
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    title: "Thu thập dữ liệu",
    description: "Camera giám sát chất lượng cao thu thập hình ảnh và video liên tục từ các điểm giao thông quan trọng.",
    image: "https://images.unsplash.com/photo-1617897711385-df94739142c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Xử lý AI",
    description: "Thuật toán CNN phân tích hình ảnh, nhận diện phương tiện và trích xuất thông tin biển số xe với độ chính xác cao.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Phân tích dữ liệu",
    description: "Hệ thống phân tích và so sánh thông tin biển số với cơ sở dữ liệu để xác định các trường hợp vi phạm hoặc đáng ngờ.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Báo cáo và cảnh báo",
    description: "Gửi thông báo và báo cáo tự động đến bộ phận giám sát, hỗ trợ ra quyết định nhanh chóng và chính xác.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">Quy trình hoạt động</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Cách Hệ Thống Hoạt Động</h2>
          <p className="text-muted-foreground text-lg">
            Công nghệ AI CNN tiên tiến giúp hệ thống nhận dạng biển số xe với độ chính xác cao, 
            hỗ trợ đắc lực cho công tác quản lý giao thông
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image section - alternating left/right */}
              <div className={`order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative">
                  <div className="bg-card border border-border rounded-lg p-2 shadow-lg relative z-10">
                    <div className="overflow-hidden rounded-md">
                      <img 
                        src={step.image} 
                        alt={step.title} 
                        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 h-40 w-40 bg-primary/10 rounded-full blur-2xl -z-10"></div>
                  <div className="absolute -top-4 -left-4 h-20 w-20 bg-primary/5 rounded-full blur-xl -z-10"></div>
                </div>
              </div>
              
              {/* Content section */}
              <div className={`order-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                    <div className="p-4 bg-secondary/20 border border-border rounded-md">
                      <div className="text-sm font-medium mb-2">Công nghệ được sử dụng:</div>
                      <div className="flex flex-wrap gap-2">
                        {['AI CNN', 'Deep Learning', 'OpenCV', 'Camera IP'].map((tech, i) => (
                          <span key={i} className="inline-block px-3 py-1 bg-secondary rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
