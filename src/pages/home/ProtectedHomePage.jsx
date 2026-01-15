import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HomePage from "./HomePage";

const ProtectedHomePage = () => {
  const { user, loading, getRoles } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Nếu user không đăng nhập, cho phép xem trang chủ
  if (!user) {
    return <HomePage />;
  }

  // Lấy tất cả roles của user
  const userRoles = getRoles();

  // Các roles không được phép xem trang chủ công khai
  const restrictedRoles = ["QUAN_TRI_VIEN", "LE_TAN", "KY_THUAT_VIEN"];

  // Kiểm tra nếu user có role bị hạn chế
  if (userRoles.some((role) => restrictedRoles.includes(role))) {
    const primaryRole = userRoles[0];

    // Chuyển hướng dựa trên role chính
    switch (primaryRole) {
      case "QUAN_TRI_VIEN":
        return <Navigate to="/admin/dashboard" replace />;
      case "LE_TAN":
        return <Navigate to="/staff/dashboard" replace />;
      case "KY_THUAT_VIEN":
        return <Navigate to="/tech/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // User là CUSTOMER, OWNER, hoặc role khác, cho phép xem trang chủ
  return <HomePage />;
};

export default ProtectedHomePage;
