// src/api/userApi.js
import apiClient from "./apiClient";

export const userService = {
  // Lấy thông tin profile
  getProfile: async () => {
    return await apiClient.get("/users/profile");
  },

  // Cập nhật profile
  updateProfile: async (userData) => {
    return await apiClient.put("/users/profile", userData);
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    return await apiClient.put("/users/change-password", passwordData);
  },
};

export default userService;
