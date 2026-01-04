// src/api/userApi.js
import apiClient from "./apiClient";

export const userService = {
  // Lấy thông tin profile
  getProfile: async () => {
    return await apiClient.get("/users/profile");
  },

  // Cập nhật profile (hỗ trợ FormData khi có upload file)
  updateProfile: async (userData) => {
    // Nếu userData là FormData (có file upload)
    if (userData instanceof FormData) {
      return await apiClient.put("/users/profile", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    // Nếu userData là JSON object
    return await apiClient.put("/users/profile", userData);
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    return await apiClient.put("/users/change-password", passwordData);
  },
};

export default userService;
