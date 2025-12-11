// src/contexts/AuthContext.jsx (FRONTEND - UPDATED)
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        authApi.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Đăng nhập
  const login = useCallback(
    async (email, matKhau) => {
      try {
        const response = await authApi.login(email, matKhau);
        setUser(response.user);

        // ⭐ Lấy danh sách vai trò từ user
        const roles = response.user.VaiTros?.map((vt) => vt.tenVaiTro) || [];
        console.log("🔐 User roles after login:", roles);

        // ⭐ Điều hướng dựa trên vai trò ƯU TIÊN
        if (roles.includes("QUAN_TRI_VIEN")) {
          navigate("/admin/dashboard");
        } else if (roles.includes("CHU_CUA_HANG")) {
          navigate("/owner/dashboard");
        } else if (roles.includes("LE_TAN")) {
          navigate("/staff/dashboard");
        } else if (roles.includes("KY_THUAT_VIEN")) {
          navigate("/tech/dashboard");
        } else if (roles.includes("KHACH_HANG")) {
          navigate("/");
        } else {
          navigate("/");
        }

        return response;
      } catch (error) {
        throw error;
      }
    },
    [navigate]
  );

  // Đăng ký
  const register = useCallback(async (userData) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Đăng xuất
  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // ⭐ Chuyển về giao diện khách hàng
  const switchToCustomerView = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // ⭐ Chuyển về giao diện quản lý shop
  const switchToOwnerView = useCallback(() => {
    navigate("/owner/dashboard");
  }, [navigate]);

  // ⭐ Kiểm tra user có shop không
  const hasShop = useCallback(() => {
    return user?.maCuaHang !== null && user?.maCuaHang !== undefined;
  }, [user]);

  // ⭐ Kiểm tra user có vai trò cụ thể
  const hasRole = useCallback(
    (roleName) => {
      if (!user?.VaiTros) return false;
      return user.VaiTros.some((vt) => vt.tenVaiTro === roleName);
    },
    [user]
  );

  // ⭐ Kiểm tra user có ít nhất 1 trong các vai trò
  const hasAnyRole = useCallback(
    (roleNames) => {
      if (!user?.VaiTros) return false;
      return user.VaiTros.some((vt) => roleNames.includes(vt.tenVaiTro));
    },
    [user]
  );

  // ⭐ Lấy tất cả vai trò của user
  const getRoles = useCallback(() => {
    return user?.VaiTros?.map((vt) => vt.tenVaiTro) || [];
  }, [user]);

  // ⭐ Lấy vai trò chính (ưu tiên: Admin > Owner > Staff > Customer)
  const getPrimaryRole = useCallback(() => {
    const roles = getRoles();
    if (roles.includes("QUAN_TRI_VIEN")) return "QUAN_TRI_VIEN";
    if (roles.includes("CHU_CUA_HANG")) return "CHU_CUA_HANG";
    if (roles.includes("LE_TAN")) return "LE_TAN";
    if (roles.includes("KY_THUAT_VIEN")) return "KY_THUAT_VIEN";
    if (roles.includes("KHACH_HANG")) return "KHACH_HANG";
    return null;
  }, [getRoles]);

  // ⭐ Kiểm tra quyền truy cập (cho ProtectedRoute)
  const canAccess = useCallback(
    (requiredRoles) => {
      if (!requiredRoles || requiredRoles.length === 0) return true;
      return hasAnyRole(requiredRoles);
    },
    [hasAnyRole]
  );

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    getRoles,
    getPrimaryRole,
    canAccess,
    hasShop,
    switchToCustomerView,
    switchToOwnerView,
    isAuthenticated: authApi.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
