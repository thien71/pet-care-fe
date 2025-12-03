// src/contexts/AuthContext.jsx
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

        // Điều hướng dựa trên role
        const role = response.user.VaiTro?.tenVaiTro;

        switch (role) {
          case "QUAN_TRI_VIEN":
            navigate("/admin/dashboard");
            break;
          case "CHU_CUA_HANG":
            navigate("/owner/dashboard");
            break;
          case "LE_TAN":
          case "KY_THUAT_VIEN":
            navigate("/staff/schedule");
            break;
          default: // KHACH_HANG
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

  // Kiểm tra role
  const hasRole = useCallback(
    (roles) => {
      if (!user?.VaiTro?.tenVaiTro) return false;
      const userRole = user.VaiTro.tenVaiTro;
      return Array.isArray(roles)
        ? roles.includes(userRole)
        : roles === userRole;
    },
    [user]
  );

  // Lấy thông tin role
  const getRole = useCallback(() => {
    return user?.VaiTro?.tenVaiTro || null;
  }, [user]);

  // Kiểm tra quyền truy cập
  const canAccess = useCallback(
    (requiredRoles) => {
      if (!requiredRoles || requiredRoles.length === 0) return true;
      return hasRole(requiredRoles);
    },
    [hasRole]
  );

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    getRole,
    canAccess,
    isAuthenticated: authApi.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
