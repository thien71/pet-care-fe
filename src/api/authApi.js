// src/api/authApi.js
import apiClient, { decodeToken, isTokenExpired } from "./apiClient";

export const authService = {
  // Đăng nhập
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
        tokenInfo: decoded, // Lưu thông tin từ token
      };

      localStorage.setItem("user", JSON.stringify(userData));
    }

    return response;
  },

  // Đăng ký
  register: async (userData) => {
    return await apiClient.post("/auth/register", userData);
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // Lấy thông tin user từ localStorage
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

  // Kiểm tra đã login chưa
  isAuthenticated: () => {
    const token = localStorage.getItem("accessToken");
    return token && !isTokenExpired(token);
  },

  // Lấy thông tin từ token
  getTokenInfo: () => {
    const token = localStorage.getItem("accessToken");
    return decodeToken(token);
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await apiClient.post("/auth/refresh", { refreshToken });

    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
    }

    return response;
  },
};

export default authService;
