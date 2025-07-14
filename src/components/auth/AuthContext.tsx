// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Iuser } from "../../interfaces/user";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

interface AuthContextType {
  user: Iuser | null;
  login: (userData: Iuser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Iuser | null>(null);
  const navigate = useNavigate();

  const login = (userData: Iuser) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login"); // Chuyển hướng về trang đăng nhập sau khi logout
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Polling kiểm tra trạng thái user mỗi 5s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/users/${user.id}`);
        if (data.isDeleted) {
          message.error("Tài khoản đã bị xoá hoặc khoá!");
          logout();
        }
      } catch {
        // Có thể xử lý lỗi nếu cần
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng trong AuthProvider");
  }
  return context;
};