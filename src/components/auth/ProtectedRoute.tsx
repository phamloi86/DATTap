// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

// src/components/ProtectedRoute.tsx
const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
    const { user } = useAuth();

    if (user === null) {
      return <div>Đang tải...</div>;
    }
  
    console.log("User trong ProtectedRoute:", user); // Kiểm tra user
  
    if (!user) {
      console.log("Chưa đăng nhập, chuyển về /login");
      return <Navigate to="/login" replace />;
    }
  
    if (adminOnly && user.role !== "admin") {
        return <div>Bạn không được ủy quyền để truy cập trang này!</div>;
    }
  
    return <>{children}</>;
  };

export default ProtectedRoute