
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  email: string;
  name: string;
} | null;

interface AuthContextType {
  user: User;
  login: (email: string) => void;
  logout: () => void;
  register: (email: string, name: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const navigate = useNavigate();

  // Kiểm tra người dùng đã đăng nhập từ localStorage khi trang web tải
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Đăng nhập
  const login = (email: string) => {
    // Trong một ứng dụng thực tế, bạn sẽ gọi API ở đây
    const userData = {
      email,
      name: email.split('@')[0], // Lấy tên từ email cho đơn giản
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Đăng ký
  const register = (email: string, name: string) => {
    // Trong một ứng dụng thực tế, bạn sẽ gọi API ở đây
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
