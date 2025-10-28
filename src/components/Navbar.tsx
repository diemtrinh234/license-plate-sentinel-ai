
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="text-2xl font-bold gradient-text">
          SmartTraffic
        </Link>
        
        <nav className="flex items-center gap-2 md:gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hidden md:block text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Hello, <span className="font-medium text-foreground">{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="md:hidden">
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
