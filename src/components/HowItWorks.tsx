
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Data Collection",
    description: "High-quality surveillance cameras continuously collect images and videos from key traffic points.",
    image: "https://images.unsplash.com/photo-1617897711385-df94739142c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "AI Processing",
    description: "CNN algorithms analyze images, recognize vehicles and extract license plate information with high accuracy.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Data Analysis",
    description: "The system analyzes and compares license plate information with databases to identify violations or suspicious cases.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Reporting and Alerts",
    description: "Send automatic notifications and reports to monitoring units, supporting quick and accurate decision making.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">How it works</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How The System Works</h2>
          <p className="text-muted-foreground text-lg">
            Advanced AI CNN technology helps the system recognize license plates with high accuracy, 
            effectively supporting traffic management operations
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
                      <div className="text-sm font-medium mb-2">Technologies used:</div>
                      <div className="flex flex-wrap gap-2">
                        {['AI CNN', 'Deep Learning', 'OpenCV', 'IP Camera'].map((tech, i) => (
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
        
        <div className="mt-28 flex flex-col items-center">
          <div className="w-full max-w-4xl bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-8 border border-border shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="outline" className="mb-2">Get Started Today</Badge>
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Traffic Management?</h3>
                <p className="text-muted-foreground mb-6">
                  Start using our advanced AI-powered traffic monitoring system and see immediate improvements in your traffic management efficiency.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">✓</div>
                    <span className="text-sm">Quick deployment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">✓</div>
                    <span className="text-sm">30-day money back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">✓</div>
                    <span className="text-sm">24/7 technical support</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <Link to="/auth" className="w-full">
                  <Button size="lg" className="w-full">
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link to="/dashboard" className="w-full">
                  <Button variant="outline" size="lg" className="w-full">
                    Explore Dashboard Demo
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  No credit card required. Start your 30-day free trial today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
