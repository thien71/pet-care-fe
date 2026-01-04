// src/api/authApi.js (UPDATED - COMPLETE VERSION)
import apiClient, { decodeToken, isTokenExpired } from "./apiClient";

export const authService = {
  // ==================== ĐĂNG KÝ ====================

  /**
   * Đăng ký tài khoản mới
   * Sẽ gửi email verification
   */
  register: async (userData) => {
    return await apiClient.post("/auth/register", userData);
  },

  // ==================== XÁC THỰC EMAIL ====================

  /**
   * Xác thực email bằng token
   */
  verifyEmail: async (token) => {
    return await apiClient.get(`/auth/verify-email?token=${token}`);
  },

  /**
   * Gửi lại email xác thực
   */
  resendVerification: async (email) => {
    return await apiClient.post("/auth/resend-verification", { email });
  },

  // ==================== ĐĂNG NHẬP ====================

  /**
   * Đăng nhập thường (email/password)
   */
  login: async (email, matKhau) => {
    const response = await apiClient.post("/auth/login", { email, matKhau });

    if (response.accessToken) {
      // Lưu tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      // Decode token để lấy thông tin user
      const decoded = decodeToken(response.accessToken);

      // Merge decoded info với user data từ server
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
   * @param {Object} googleProfile - { id, email, name, picture }
   */
  loginWithGoogle: async (googleProfile) => {
    const response = await apiClient.post("/auth/google", { googleProfile });

    if (response.accessToken) {
      // Lưu tokens
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      // Decode token
      const decoded = decodeToken(response.accessToken);

      // Merge data
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

  /**
   * Lấy thông tin user từ localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);

      // Kiểm tra token còn hạn không
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

  /**
   * Kiểm tra đã login chưa
   */
  isAuthenticated: () => {
    const token = localStorage.getItem("accessToken");
    return token && !isTokenExpired(token);
  },

  /**
   * Kiểm tra email đã verify chưa
   */
  isEmailVerified: () => {
    const user = authService.getCurrentUser();
    return user?.emailVerified === true;
  },

  /**
   * Lấy thông tin từ token
   */
  getTokenInfo: () => {
    const token = localStorage.getItem("accessToken");
    return decodeToken(token);
  },

  /**
   * Kiểm tra user có vai trò cụ thể
   */
  hasRole: (roleName) => {
    const user = authService.getCurrentUser();
    if (!user?.VaiTros) return false;
    return user.VaiTros.some((vt) => vt.tenVaiTro === roleName);
  },

  /**
   * Kiểm tra user có ít nhất 1 trong các vai trò
   */
  hasAnyRole: (roleNames) => {
    const user = authService.getCurrentUser();
    if (!user?.VaiTros) return false;
    return user.VaiTros.some((vt) => roleNames.includes(vt.tenVaiTro));
  },

  /**
   * Lấy tất cả vai trò
   */
  getRoles: () => {
    const user = authService.getCurrentUser();
    return user?.VaiTros?.map((vt) => vt.tenVaiTro) || [];
  },

  /**
   * Lấy vai trò chính (ưu tiên cao nhất)
   */
  getPrimaryRole: () => {
    const roles = authService.getRoles();
    if (roles.includes("QUAN_TRI_VIEN")) return "QUAN_TRI_VIEN";
    if (roles.includes("CHU_CUA_HANG")) return "CHU_CUA_HANG";
    if (roles.includes("LE_TAN")) return "LE_TAN";
    if (roles.includes("KY_THUAT_VIEN")) return "KY_THUAT_VIEN";
    if (roles.includes("KHACH_HANG")) return "KHACH_HANG";
    return null;
  },

  /**
   * Kiểm tra user có shop không
   */
  hasShop: () => {
    const user = authService.getCurrentUser();
    return user?.maCuaHang !== null && user?.maCuaHang !== undefined;
  },

  /**
   * Lấy thông tin shop
   */
  getShopInfo: () => {
    const user = authService.getCurrentUser();
    return user?.CuaHang || null;
  },
};

export default authService;
