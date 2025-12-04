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

        const role = response.user.VaiTro?.tenVaiTro;
        const hasShop = response.user.maCuaHang !== null;

        // Điều hướng dựa trên role và shop ownership
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
          case "KHACH_HANG":
            // ⭐ Nếu khách hàng có shop -> vào owner dashboard
            if (hasShop) {
              navigate("/owner/dashboard");
            } else {
              navigate("/");
            }
            break;
          default:
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

  // ⭐ Kiểm tra quyền truy cập (cập nhật để support shop owner)
  const canAccess = useCallback(
    (requiredRoles) => {
      if (!requiredRoles || requiredRoles.length === 0) return true;

      const userRole = user?.VaiTro?.tenVaiTro;
      const userHasShop = hasShop();

      // Nếu yêu cầu CHU_CUA_HANG và user là KHACH_HANG có shop -> cho phép
      if (
        requiredRoles.includes("CHU_CUA_HANG") &&
        userRole === "KHACH_HANG" &&
        userHasShop
      ) {
        return true;
      }

      return hasRole(requiredRoles);
    },
    [hasRole, hasShop, user]
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
    hasShop,
    switchToCustomerView,
    switchToOwnerView,
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
