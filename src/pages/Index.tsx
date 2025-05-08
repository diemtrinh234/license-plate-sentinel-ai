
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Dashboard from "@/components/Dashboard";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { X } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [dismissedCTA, setDismissedCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling down 500px
      if (window.scrollY > 500 && !dismissedCTA) {
        setShowFloatingCTA(true);
      } else {
        setShowFloatingCTA(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissedCTA]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <Hero />
      
      <div className="container mx-auto text-center py-8">
        {isAuthenticated ? (
          <Link to="/dashboard">
            <Button size="lg" className="animate-pulse-slow">
              Access Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button size="lg" className="animate-pulse-slow">
              Sign in to access Dashboard
            </Button>
          </Link>
        )}
      </div>
      
      <Features />
      <HowItWorks />
      <Dashboard />
      <ContactSection />
      <Footer />
      
      {/* Floating CTA */}
      {showFloatingCTA && !isAuthenticated && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-xs">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold">Ready to get started?</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setDismissedCTA(true)}
              >
                <X size={16} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Sign up now and get 30 days free access to all premium features.
            </p>
            <Link to="/auth">
              <Button size="sm" className="w-full">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
