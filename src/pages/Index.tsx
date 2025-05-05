
import React from "react";
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

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <Hero />
      
      <div className="container mx-auto text-center py-8">
        {isAuthenticated ? (
          <Link to="/dashboard">
            <Button size="lg" className="animate-pulse-slow">
              Truy cập Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button size="lg" className="animate-pulse-slow">
              Đăng nhập để truy cập Dashboard
            </Button>
          </Link>
        )}
      </div>
      
      <Features />
      <HowItWorks />
      <Dashboard />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
