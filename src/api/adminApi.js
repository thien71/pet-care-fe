// src/api/adminApi.js
import apiClient from "./apiClient";

export const adminService = {
  // ==================== NGƯỜI DÙNG ====================
  getUsers: async (params) => {
    return await apiClient.get("/admin/users", { params });
  },

  getUserById: async (id) => {
    return await apiClient.get(`/admin/users/${id}`);
  },

  updateUser: async (id, userData) => {
    return await apiClient.put(`/admin/users/${id}`, userData);
  },

  deleteUser: async (id) => {
    return await apiClient.delete(`/admin/users/${id}`);
  },

  addRoleToUser: async (data) => {
    return await apiClient.post("/admin/users/add-role", data);
  },

  removeRoleFromUser: async (data) => {
    return await apiClient.post("/admin/users/remove-role", data);
  },

  // ==================== VAI TRÒ ====================
  getRoles: async () => {
    return await apiClient.get("/admin/roles");
  },

  createRole: async (roleData) => {
    return await apiClient.post("/admin/roles", roleData);
  },

  updateRole: async (id, roleData) => {
    return await apiClient.put(`/admin/roles/${id}`, roleData);
  },

  deleteRole: async (id) => {
    return await apiClient.delete(`/admin/roles/${id}`);
  },

  // ==================== LOẠI THÚ CƯNG ====================
  getPetTypes: async () => {
    return await apiClient.get("/admin/pet-types");
  },

  createPetType: async (petTypeData) => {
    return await apiClient.post("/admin/pet-types", petTypeData);
  },

  updatePetType: async (id, petTypeData) => {
    return await apiClient.put(`/admin/pet-types/${id}`, petTypeData);
  },

  deletePetType: async (id) => {
    return await apiClient.delete(`/admin/pet-types/${id}`);
  },

  // ==================== DỊCH VỤ HỆ THỐNG ====================
  getServices: async () => {
    return await apiClient.get("/admin/services");
  },

  createService: async (serviceData) => {
    return await apiClient.post("/admin/services", serviceData);
  },

  updateService: async (id, serviceData) => {
    return await apiClient.put(`/admin/services/${id}`, serviceData);
  },

  deleteService: async (id) => {
    return await apiClient.delete(`/admin/services/${id}`);
  },

  // ==================== CỬA HÀNG ====================
  getShops: async (params) => {
    return await apiClient.get("/admin/shops", { params });
  },

  getShopApprovals: async () => {
    return await apiClient.get("/admin/shop-approvals");
  },

  getShopById: async (id) => {
    return await apiClient.get(`/admin/shops/${id}`);
  },

  updateShop: async (id, shopData) => {
    return await apiClient.put(`/admin/shops/${id}`, shopData);
  },

  deleteShop: async (id) => {
    return await apiClient.delete(`/admin/shops/${id}`);
  },

  approveShop: async (id, note) => {
    return await apiClient.put(`/admin/shops/${id}/approve`, { note });
  },

  rejectShop: async (id, lyDoTuChoi) => {
    return await apiClient.put(`/admin/shops/${id}/reject`, { lyDoTuChoi });
  },

  // ==================== ĐỀ XUẤT DỊCH VỤ ====================
  getServiceProposals: async () => {
    return await apiClient.get("/admin/service-proposals");
  },

  approveServiceProposal: async (id) => {
    return await apiClient.put(`/admin/service-proposals/${id}/approve`);
  },

  rejectServiceProposal: async (id, lyDoTuChoi) => {
    return await apiClient.put(`/admin/service-proposals/${id}/reject`, {
      lyDoTuChoi,
    });
  },

  // ==================== GÓI THANH TOÁN ====================
  getPaymentPackages: async () => {
    return await apiClient.get("/admin/payment-packages");
  },

  createPaymentPackage: async (packageData) => {
    return await apiClient.post("/admin/payment-packages", packageData);
  },

  updatePaymentPackage: async (id, packageData) => {
    return await apiClient.put(`/admin/payment-packages/${id}`, packageData);
  },

  deletePaymentPackage: async (id) => {
    return await apiClient.delete(`/admin/payment-packages/${id}`);
  },

  // ==================== XÁC NHẬN THANH TOÁN ====================
  getPaymentConfirmations: async () => {
    return await apiClient.get("/admin/payment-confirmations");
  },

  confirmPayment: async (id) => {
    return await apiClient.put(`/admin/payment-confirmations/${id}/confirm`);
  },

  rejectPayment: async (id, lyDoTuChoi) => {
    return await apiClient.put(`/admin/payment-confirmations/${id}/reject`, {
      lyDoTuChoi,
    });
  },
};

export default adminService;
