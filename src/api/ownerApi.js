// src/api/ownerApi.js
import apiClient from "./apiClient";

export const ownerService = {
  // ==================== THÔNG TIN CỬA HÀNG ====================
  getShopInfo: async () => {
    return await apiClient.get("/owner/shop-info");
  },

  updateShopInfo: async (shopData) => {
    return await apiClient.put("/owner/shop-info", shopData);
  },

  // ==================== DỊCH VỤ ====================
  getSystemServices: async () => {
    return await apiClient.get("/owner/system-services");
  },

  getShopServices: async () => {
    return await apiClient.get("/owner/shop-services");
  },

  addServiceToShop: async (serviceData) => {
    return await apiClient.post("/owner/shop-services", serviceData);
  },

  updateShopService: async (id, serviceData) => {
    return await apiClient.put(`/owner/shop-services/${id}`, serviceData);
  },

  deleteShopService: async (id) => {
    return await apiClient.delete(`/owner/shop-services/${id}`);
  },

  proposeNewService: async (proposalData) => {
    return await apiClient.post("/owner/propose-service", proposalData);
  },

  // ==================== NHÂN VIÊN ====================
  getEmployees: async () => {
    return await apiClient.get("/owner/employees");
  },

  addEmployee: async (employeeData) => {
    return await apiClient.post("/owner/employees", employeeData);
  },

  deleteEmployee: async (id) => {
    return await apiClient.delete(`/owner/employees/${id}`);
  },

  // ==================== CA LÀM ====================
  getShifts: async (params) => {
    return await apiClient.get("/owner/shifts", { params });
  },

  assignShift: async (shiftData) => {
    return await apiClient.post("/owner/assign-shift", shiftData);
  },

  bulkAssignShifts: async (shiftsData) => {
    return await apiClient.post("/owner/bulk-assign-shifts", shiftsData);
  },

  removeShift: async (id) => {
    return await apiClient.delete(`/owner/shifts/${id}`);
  },

  // ==================== THANH TOÁN ====================
  getPaymentPackages: async () => {
    return await apiClient.get("/owner/payment-packages");
  },

  getMyPayments: async () => {
    return await apiClient.get("/owner/my-payments");
  },

  purchasePackage: async (purchaseData) => {
    return await apiClient.post("/owner/purchase-package", purchaseData);
  },
};

export default ownerService;
