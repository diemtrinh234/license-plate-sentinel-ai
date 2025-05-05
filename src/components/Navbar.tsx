
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-primary">LicenseSentinel</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Tính năng
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Cách hoạt động
              </a>
              <a href="#dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Dashboard
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Liên hệ
              </a>
              <Button variant="default" size="sm">Dùng thử</Button>
            </div>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b border-border">
            <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white">
              Tính năng
            </a>
            <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white">
              Cách hoạt động
            </a>
            <a href="#dashboard" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white">
              Dashboard
            </a>
            <a href="#contact" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white">
              Liên hệ
            </a>
            <div className="pt-2">
              <Button className="w-full" variant="default">Dùng thử</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
