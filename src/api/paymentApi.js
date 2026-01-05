// src/api/paymentApi.js
import apiClient from "./apiClient";

export const paymentService = {
  // ==================== PACKAGES ====================
  getPaymentPackages: async (params) => {
    return await apiClient.get("/payments/packages", { params });
  },

  // ==================== ADMIN - PACKAGES ====================
  createPaymentPackage: async (packageData) => {
    return await apiClient.post("/payments/packages", packageData);
  },

  updatePaymentPackage: async (id, packageData) => {
    return await apiClient.put(`/payments/packages/${id}`, packageData);
  },

  deletePaymentPackage: async (id) => {
    return await apiClient.delete(`/payments/packages/${id}`);
  },

  // ==================== ADMIN - CONFIRMATIONS ====================
  getPaymentConfirmations: async (params) => {
    return await apiClient.get("/payments/confirmations", { params });
  },

  confirmPayment: async (id) => {
    return await apiClient.put(`/payments/confirmations/${id}/confirm`);
  },

  rejectPayment: async (id, lyDoTuChoi) => {
    return await apiClient.put(`/payments/confirmations/${id}/reject`, {
      lyDoTuChoi,
    });
  },

  // ==================== OWNER ====================
  getMyPayments: async (params) => {
    return await apiClient.get("/payments/my", { params });
  },

  purchasePackage: async (purchaseData) => {
    return await apiClient.post("/payments/purchase", purchaseData);
  },
};

export default paymentService;
