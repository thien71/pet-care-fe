// src/api/staffApi.js
import apiClient from "./apiClient";

export const staffService = {
  // ==================== LỊCH LÀM VIỆC ====================
  getMySchedule: async (params) => {
    return await apiClient.get("/staff/schedule", { params });
  },

  // ==================== QUẢN LÝ ĐẶT HẸN ====================
  getShopBookings: async (params) => {
    return await apiClient.get("/staff/bookings", { params });
  },

  confirmBooking: async (id) => {
    return await apiClient.put(`/staff/bookings/${id}/confirm`);
  },

  assignTechnician: async (id, technicianData) => {
    return await apiClient.put(
      `/staff/bookings/${id}/assign-technician`,
      technicianData
    );
  },

  updateBookingStatus: async (id, statusData) => {
    return await apiClient.put(`/staff/bookings/${id}/status`, statusData);
  },

  // ==================== KHÁCH HÀNG ====================
  getShopCustomers: async () => {
    return await apiClient.get("/staff/customers");
  },
};

export default staffService;
