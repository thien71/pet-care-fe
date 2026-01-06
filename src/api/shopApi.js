// src/api/shopApi.js
import apiClient from "./apiClient";

export const shopService = {
  // ==================== PUBLIC ROUTES ====================
  getPublicShops: async () => {
    return await apiClient.get("/shops/public");
  },

  getTopShops: async (limit = 6) => {
    return await apiClient.get("/shops/public/top", {
      params: { limit },
    });
  },

  getShopProfile: async (shopId) => {
    return await apiClient.get(`/shops/public/${shopId}`);
  },

  // ==================== CUSTOMER ====================
  registerShop: async (formData) => {
    return await apiClient.post("/shops/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // ==================== ADMIN - SHOPS ====================
  getShops: async (params) => {
    return await apiClient.get("/shops", { params });
  },

  getShopApprovals: async (params) => {
    return await apiClient.get("/shops/approvals", { params });
  },

  getShopById: async (id) => {
    return await apiClient.get(`/shops/${id}`);
  },

  updateShop: async (id, shopData) => {
    return await apiClient.put(`/shops/${id}`, shopData);
  },

  deleteShop: async (id) => {
    return await apiClient.delete(`/shops/${id}`);
  },

  approveShop: async (id, note) => {
    return await apiClient.put(`/shops/${id}/approve`, { note });
  },

  rejectShop: async (id, lyDoTuChoi) => {
    return await apiClient.put(`/shops/${id}/reject`, { lyDoTuChoi });
  },

  // ==================== OWNER ====================
  getShopStatus: async () => {
    return await apiClient.get("/shops/my/status");
  },

  getShopInfo: async () => {
    return await apiClient.get("/shops/my/info");
  },

  updateShopInfo: async (shopData) => {
    if (shopData instanceof FormData) {
      return await apiClient.put("/shops/my/info", shopData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return await apiClient.put("/shops/my/info", shopData);
  },

  // ==================== STAFF ====================
  getShopCustomers: async () => {
    return await apiClient.get("/shops/my/customers");
  },
};

export default shopService;
