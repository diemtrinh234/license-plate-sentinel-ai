
import { Camera, CarFront, Cctv, Monitor, Route, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const featuresData = [
  {
    title: "License Plate Recognition",
    description: "Using AI CNN to recognize and extract license plates with up to 99.5% accuracy",
    icon: CarFront,
  },
  {
    title: "Real-time Monitoring",
    description: "24/7 surveillance camera system providing real-time data to the control center",
    icon: Cctv,
  },
  {
    title: "AI Data Analysis",
    description: "Intelligent data analysis helps identify traffic violations and traffic conditions",
    icon: Search,
  },
  {
    title: "Multi-Camera Integration",
    description: "Connect and manage multiple surveillance cameras from different locations on a unified system",
    icon: Camera,
  },
  {
    title: "Intuitive Dashboard",
    description: "User-friendly management interface with customization capabilities and quick data retrieval",
    icon: Monitor,
  },
  {
    title: "Tracking Map",
    description: "Display the location and status of traffic monitoring points on an interactive map",
    icon: Route,
  },
];

const Features = () => {
  return (
    <section id="features" className="section bg-secondary/10">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground text-lg">
            Our smart traffic monitoring system integrates advanced technologies
            to deliver high efficiency in traffic management and monitoring
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
        
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto bg-card p-6 rounded-lg border border-border shadow-md">
            <h3 className="text-2xl font-bold mb-3">Ready to experience these features?</h3>
            <p className="text-muted-foreground mb-6">Get started with our smart traffic monitoring system today and revolutionize your traffic management.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
