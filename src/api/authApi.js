// src/api/authApi.js
import apiClient, { decodeToken, isTokenExpired } from "./apiClient";

export const authService = {
  // ==================== ĐĂNG KÝ ====================

  /**
   * Đăng ký tài khoản mới
   * Sẽ gửi email OTP
   */
  register: async (userData) => {
    return await apiClient.post("/auth/register", userData);
  },

  // ==================== XÁC THỰC EMAIL ====================

  /**
   * Xác thực email bằng OTP
   * @param {string} email
   * @param {string} otp - Mã OTP 6 số
   */
  verifyOTP: async (email, otp) => {
    return await apiClient.post("/auth/verify-otp", { email, otp });
  },

  /**
   * Gửi lại mã OTP
   */
  resendOTP: async (email) => {
    return await apiClient.post("/auth/resend-otp", { email });
  },

  // ==================== ĐĂNG NHẬP ====================

  /**
   * Đăng nhập thường (email/password)
   */
  login: async (email, matKhau) => {
    const response = await apiClient.post("/auth/login", { email, matKhau });

    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      const decoded = decodeToken(response.accessToken);

      const userData = {
        ...response.user,
        tokenInfo: decoded,
      };

      localStorage.setItem("user", JSON.stringify(userData));
    }

    return response;
  },

  /**
   * Đăng nhập bằng Google
   */
  loginWithGoogle: async (googleProfile) => {
    const response = await apiClient.post("/auth/google", { googleProfile });

    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      const decoded = decodeToken(response.accessToken);

      const userData = {
        ...response.user,
        tokenInfo: decoded,
      };

      localStorage.setItem("user", JSON.stringify(userData));
    }

    return response;
  },

  // ==================== QUÊN / ĐẶT LẠI MẬT KHẨU ====================

  /**
   * Gửi email reset password
   */
  forgotPassword: async (email) => {
    return await apiClient.post("/auth/forgot-password", { email });
  },

  /**
   * Đặt lại mật khẩu bằng token
   */
  resetPassword: async (token, newPassword) => {
    return await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
  },

  // ==================== ĐĂNG XUẤT ====================

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  // ==================== REFRESH TOKEN ====================

  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await apiClient.post("/auth/refresh", { refreshToken });

    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
    }

    return response;
  },

  // ==================== HELPERS ====================

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      const token = localStorage.getItem("accessToken");
      if (!token || isTokenExpired(token)) {
        authService.logout();
        return null;
      }
      return user;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("accessToken");
    return token && !isTokenExpired(token);
  },

  isEmailVerified: () => {
    const user = authService.getCurrentUser();
    return user?.emailVerified === true;
  },

  getTokenInfo: () => {
    const token = localStorage.getItem("accessToken");
    return decodeToken(token);
  },

  hasRole: (roleName) => {
    const user = authService.getCurrentUser();
    if (!user?.VaiTros) return false;
    return user.VaiTros.some((vt) => vt.tenVaiTro === roleName);
  },

  hasAnyRole: (roleNames) => {
    const user = authService.getCurrentUser();
    if (!user?.VaiTros) return false;
    return user.VaiTros.some((vt) => roleNames.includes(vt.tenVaiTro));
  },

  getRoles: () => {
    const user = authService.getCurrentUser();
    return user?.VaiTros?.map((vt) => vt.tenVaiTro) || [];
  },

  getPrimaryRole: () => {
    const roles = authService.getRoles();
    if (roles.includes("QUAN_TRI_VIEN")) return "QUAN_TRI_VIEN";
    if (roles.includes("CHU_CUA_HANG")) return "CHU_CUA_HANG";
    if (roles.includes("LE_TAN")) return "LE_TAN";
    if (roles.includes("KY_THUAT_VIEN")) return "KY_THUAT_VIEN";
    if (roles.includes("KHACH_HANG")) return "KHACH_HANG";
    return null;
  },

  hasShop: () => {
    const user = authService.getCurrentUser();
    return user?.maCuaHang !== null && user?.maCuaHang !== undefined;
  },

  getShopInfo: () => {
    const user = authService.getCurrentUser();
    return user?.CuaHang || null;
  },
};

export default authService;
