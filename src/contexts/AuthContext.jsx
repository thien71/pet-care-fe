// src/contexts/AuthContext.jsx (FINAL VERSION)
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import authService from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ==================== ĐĂNG KÝ ====================

  const register = useCallback(async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // ==================== XÁC THỰC EMAIL ====================

  const verifyEmail = useCallback(async (token) => {
    try {
      const response = await authService.verifyEmail(token);

      // Cập nhật user state nếu đang đăng nhập
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        currentUser.emailVerified = true;
        localStorage.setItem("user", JSON.stringify(currentUser));
        setUser(currentUser);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    try {
      const response = await authService.resendVerification(email);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // ==================== ĐĂNG NHẬP ====================

  const login = useCallback(async (email, matKhau) => {
    try {
      const response = await authService.login(email, matKhau);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async (googleProfile) => {
    try {
      const response = await authService.loginWithGoogle(googleProfile);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // ==================== QUÊN / ĐẶT LẠI MẬT KHẨU ====================

  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // ==================== ĐĂNG XUẤT ====================

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // ==================== HELPERS ====================

  const hasRole = useCallback(
    (roleName) => {
      if (!user?.VaiTros) return false;
      return user.VaiTros.some((vt) => vt.tenVaiTro === roleName);
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roleNames) => {
      if (!user?.VaiTros) return false;
      return user.VaiTros.some((vt) => roleNames.includes(vt.tenVaiTro));
    },
    [user]
  );

  const getRoles = useCallback(() => {
    return user?.VaiTros?.map((vt) => vt.tenVaiTro) || [];
  }, [user]);

  const getPrimaryRole = useCallback(() => {
    const roles = getRoles();
    if (roles.includes("QUAN_TRI_VIEN")) return "QUAN_TRI_VIEN";
    if (roles.includes("CHU_CUA_HANG")) return "CHU_CUA_HANG";
    if (roles.includes("LE_TAN")) return "LE_TAN";
    if (roles.includes("KY_THUAT_VIEN")) return "KY_THUAT_VIEN";
    if (roles.includes("KHACH_HANG")) return "KHACH_HANG";
    return null;
  }, [getRoles]);

  const canAccess = useCallback(
    (requiredRoles) => {
      if (!requiredRoles || requiredRoles.length === 0) return true;
      return hasAnyRole(requiredRoles);
    },
    [hasAnyRole]
  );

  const hasShop = useCallback(() => {
    return user?.maCuaHang !== null && user?.maCuaHang !== undefined;
  }, [user]);

  const getShopInfo = useCallback(() => {
    return user?.CuaHang || null;
  }, [user]);

  const isEmailVerified = useCallback(() => {
    return user?.emailVerified === true;
  }, [user]);

  // Context value
  const value = {
    user,
    loading,

    // Auth actions
    register,
    login,
    loginWithGoogle,
    logout,

    // Email verification
    verifyEmail,
    resendVerification,
    isEmailVerified,

    // Password reset
    forgotPassword,
    resetPassword,

    // Role helpers
    hasRole,
    hasAnyRole,
    getRoles,
    getPrimaryRole,
    canAccess,

    // Shop helpers
    hasShop,
    getShopInfo,

    // Status
    isAuthenticated: authService.isAuthenticated(),
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
