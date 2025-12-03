// src/services/api/authApi.js
import apiClient from "./apiClient";

export const authApi = {
  // Đăng nhập
  login: async (email, matKhau) => {
    const response = await apiClient.post("/auth/login", { email, matKhau });

    // Lưu tokens
    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
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
    return userStr ? JSON.parse(userStr) : null;
  },

  // Kiểm tra đã login chưa
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },
};

export default authApi;
