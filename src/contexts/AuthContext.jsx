// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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

  // ==================== AUTH METHODS ====================

  /**
   * Đăng ký
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Xác thực OTP
   */
  const verifyOTP = async (email, otp) => {
    try {
      const response = await authService.verifyOTP(email, otp);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Gửi lại OTP
   */
  const resendOTP = async (email) => {
    try {
      const response = await authService.resendOTP(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Đăng nhập
   */
  const login = async (email, matKhau) => {
    try {
      const response = await authService.login(email, matKhau);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Đăng nhập bằng Google
   */
  const loginWithGoogle = async (googleProfile) => {
    try {
      const response = await authService.loginWithGoogle(googleProfile);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Quên mật khẩu
   */
  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Đặt lại mật khẩu
   */
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Đăng xuất
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Chuyển sang giao diện khách hàng
   */
  const switchToCustomerView = () => {
    window.location.href = "/";
  };

  // ==================== ROLE CHECKING ====================

  /**
   * Kiểm tra user có vai trò cụ thể
   */
  const hasRole = (roleName) => {
    return authService.hasRole(roleName);
  };

  /**
   * Kiểm tra user có ít nhất 1 trong các vai trò
   */
  const canAccess = (allowedRoles) => {
    return authService.hasAnyRole(allowedRoles);
  };

  /**
   * Lấy tất cả vai trò
   */
  const getRoles = () => {
    return authService.getRoles();
  };

  /**
   * Lấy vai trò chính
   */
  const getPrimaryRole = () => {
    return authService.getPrimaryRole();
  };

  /**
   * Kiểm tra user có shop không
   */
  const hasShop = () => {
    return authService.hasShop();
  };

  /**
   * Lấy thông tin shop
   */
  const getShopInfo = () => {
    return authService.getShopInfo();
  };

  // ==================== CONTEXT VALUE ====================

  const value = {
    user,
    loading,
    isAuthenticated: !!user && authService.isAuthenticated(),

    // Auth methods
    register,
    verifyOTP,
    resendOTP,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    resetPassword,
    switchToCustomerView,

    // Role methods
    hasRole,
    canAccess,
    getRoles,
    getPrimaryRole,
    hasShop,
    getShopInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
