// src/api/bookingApi.js
import apiClient from "./apiClient";

export const bookingService = {
  // ==================== PUBLIC ROUTES ====================
  getPublicShops: async (params) => {
    return await apiClient.get("/booking/public/shops", { params });
  },

  getPublicPetTypes: async () => {
    return await apiClient.get("/booking/public/pet-types");
  },

  getPublicServices: async () => {
    return await apiClient.get("/booking/public/services");
  },

  getTopShops: async (limit = 10) => {
    return await apiClient.get("/booking/public/top-shops", {
      params: { limit },
    });
  },

  getAllShopServices: async (params) => {
    return await apiClient.get("/booking/public/shop-services", { params });
  },

  getShopServiceDetail: async (shopServiceId) => {
    return await apiClient.get(`/booking/public/shop-service/${shopServiceId}`);
  },

  getServiceDetail: async (serviceId) => {
    return await apiClient.get(`/booking/service/${serviceId}`);
  },

  getShopProfile: async (shopId) => {
    return await apiClient.get(`/booking/shop/${shopId}/profile`);
  },

  getAvailableSlots: async (shopId, params) => {
    return await apiClient.get(`/booking/shop/${shopId}/available-slots`, {
      params,
    });
  },

  // ==================== CUSTOMER ROUTES ====================
  getShopServicesByPetType: async (shopId, petTypeId) => {
    return await apiClient.get(
      `/booking/shop/${shopId}/services/pet-type/${petTypeId}`
    );
  },

  createBooking: async (bookingData) => {
    return await apiClient.post("/booking/create", bookingData);
  },

  getMyBookings: async (params) => {
    return await apiClient.get("/booking/my-bookings", { params });
  },

  // ==================== STAFF/OWNER ROUTES ====================
  getShopBookings: async (params) => {
    return await apiClient.get("/booking/shop-bookings", { params });
  },

  confirmBooking: async (id) => {
    return await apiClient.put(`/booking/${id}/confirm`);
  },

  assignTechnician: async (id, technicianData) => {
    return await apiClient.put(
      `/booking/${id}/assign-technician`,
      technicianData
    );
  },

  updateBookingStatus: async (id, statusData) => {
    return await apiClient.put(`/booking/${id}/status`, statusData);
  },

  // ==================== TECHNICIAN ROUTES ====================
  getMyAssignments: async (params) => {
    return await apiClient.get("/booking/my-assignments", { params });
  },

  updateMyAssignment: async (id, assignmentData) => {
    return await apiClient.put(`/booking/${id}/my-assignment`, assignmentData);
  },
};

export default bookingService;
