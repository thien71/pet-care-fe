// src/api/bookingApi.js
import apiClient from "./apiClient";

export const bookingService = {
  // ==================== PUBLIC ROUTES ====================
  getAvailableSlots: async (shopId, params) => {
    return await apiClient.get(`/bookings/slots/${shopId}`, { params });
  },

  // ==================== CUSTOMER ====================
  createBooking: async (bookingData) => {
    return await apiClient.post("/bookings", bookingData);
  },

  getMyBookings: async (params) => {
    return await apiClient.get("/bookings/my", { params });
  },

  // ==================== STAFF/OWNER ====================
  getShopBookings: async (params) => {
    return await apiClient.get("/bookings/shop", { params });
  },

  confirmBooking: async (id) => {
    return await apiClient.put(`/bookings/${id}/confirm`);
  },

  assignTechnician: async (id, technicianData) => {
    return await apiClient.put(`/bookings/${id}/assign`, technicianData);
  },

  updateBookingStatus: async (id, statusData) => {
    return await apiClient.put(`/bookings/${id}/status`, statusData);
  },

  confirmPayment: async (id) => {
    return await apiClient.put(`/bookings/${id}/confirm-payment`);
  },

  // ==================== TECHNICIAN ====================
  getMyAssignments: async (params) => {
    return await apiClient.get("/bookings/my-assignments", { params });
  },

  updateMyAssignment: async (id, assignmentData) => {
    return await apiClient.put(`/bookings/${id}/my-assignment`, assignmentData);
  },
};

export default bookingService;
