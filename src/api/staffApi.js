// src/api/staffApi.js
import apiClient from "./apiClient";

export const staffService = {
  // ==================== SCHEDULE ====================
  getMySchedule: async (params) => {
    return await apiClient.get("/staff/schedule", { params });
  },

  // ==================== EMPLOYEE MANAGEMENT ====================
  getEmployees: async () => {
    return await apiClient.get("/staff/employees");
  },

  addEmployee: async (employeeData) => {
    return await apiClient.post("/staff/employees", employeeData);
  },

  deleteEmployee: async (id) => {
    return await apiClient.delete(`/staff/employees/${id}`);
  },

  // ==================== SHIFT MANAGEMENT ====================
  getShifts: async (params) => {
    return await apiClient.get("/staff/shifts", { params });
  },

  assignShift: async (shiftData) => {
    return await apiClient.post("/staff/shifts", shiftData);
  },

  bulkAssignShifts: async (shiftsData) => {
    return await apiClient.post("/staff/shifts/bulk", shiftsData);
  },

  removeShift: async (id) => {
    return await apiClient.delete(`/staff/shifts/${id}`);
  },
};

export default staffService;
