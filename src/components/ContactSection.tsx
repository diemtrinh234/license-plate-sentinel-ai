
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  return (
    <section id="contact" className="section">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-muted-foreground mb-8">
              Hãy liên hệ ngay để được tư vấn chi tiết về giải pháp giám sát giao thông thông minh
              phù hợp với nhu cầu của bạn
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Thông Tin Liên Hệ</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start">
                    <div className="font-medium w-24">Địa chỉ:</div>
                    <div>Tầng 10, Tòa nhà ABC, Số 123 Đường XYZ, Quận 1, TP. Hồ Chí Minh</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium w-24">Email:</div>
                    <div>info@licensesentinel.com</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium w-24">Hotline:</div>
                    <div>1800 1234</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Giờ Làm Việc</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center">
                    <div className="font-medium w-24">T2 - T6:</div>
                    <div>8:00 - 17:30</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium w-24">T7:</div>
                    <div>8:00 - 12:00</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium w-24">CN:</div>
                    <div>Nghỉ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Gửi Yêu Cầu Tư Vấn</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Họ và tên</label>
                  <Input id="name" placeholder="Nhập họ và tên" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="Nhập địa chỉ email" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Số điện thoại</label>
                  <Input id="phone" placeholder="Nhập số điện thoại" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-medium">Tổ chức</label>
                  <Input id="organization" placeholder="Nhập tên tổ chức" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Tiêu đề</label>
                <Input id="subject" placeholder="Nhập tiêu đề" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Nội dung</label>
                <Textarea id="message" rows={5} placeholder="Nhập nội dung chi tiết về nhu cầu của bạn" />
              </div>
              
              <Button type="submit" className="w-full">Gửi yêu cầu</Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Bằng cách nhấn nút gửi, bạn đồng ý với điều khoản bảo mật thông tin của chúng tôi.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
