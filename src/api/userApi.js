// src/api/userApi.js
import apiClient from "./apiClient";

export const userService = {
  // ==================== PROFILE ====================
  getProfile: async () => {
    return await apiClient.get("/users/profile");
  },

  updateProfile: async (userData) => {
    if (userData instanceof FormData) {
      return await apiClient.put("/users/profile", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return await apiClient.put("/users/profile", userData);
  },

  changePassword: async (passwordData) => {
    return await apiClient.put("/users/change-password", passwordData);
  },

  // ==================== ADMIN - USERS ====================
  getUsers: async (params) => {
    return await apiClient.get("/users", { params });
  },

  getUserById: async (id) => {
    return await apiClient.get(`/users/${id}`);
  },

  updateUser: async (id, userData) => {
    return await apiClient.put(`/users/${id}`, userData);
  },

  deleteUser: async (id) => {
    return await apiClient.delete(`/users/${id}`);
  },

  addRoleToUser: async (data) => {
    return await apiClient.post("/users/add-role", data);
  },

  removeRoleFromUser: async (data) => {
    return await apiClient.post("/users/remove-role", data);
  },
};

export default userService;
