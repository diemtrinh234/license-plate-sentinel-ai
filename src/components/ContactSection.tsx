
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        subject: "",
        message: ""
      });
      
      toast({
        title: "Request sent",
        description: "We will contact you as soon as possible.",
      });
    }, 1500);
  };

  return (
    <section id="contact" className="section">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="text-muted-foreground mb-8">
              Contact us now for detailed consultation on smart traffic monitoring solutions
              tailored to your needs
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start">
                    <div className="font-medium w-24">Address:</div>
                    <div>137 Ky Dong, Thanh Khe Dong, Thanh Khe, Da Nang, Vietnam</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium w-24">Email:</div>
                    <div>diemtrinhho03@gmail.com</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium w-24">Hotline:</div>
                    <div>0865126189</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center">
                    <div className="font-medium w-24">Mon - Fri:</div>
                    <div>8:00 - 17:30</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium w-24">Sat:</div>
                    <div>8:00 - 12:00</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium w-24">Sun:</div>
                    <div>Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Send Consultation Request</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <Input 
                    id="phone" 
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-medium">Organization</label>
                  <Input 
                    id="organization" 
                    placeholder="Enter organization name"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input 
                  id="subject" 
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="message" 
                  rows={5} 
                  placeholder="Enter details about your requirements"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By clicking submit, you agree to our privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
