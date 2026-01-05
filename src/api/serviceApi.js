// src/api/serviceApi.js
import apiClient from "./apiClient";

export const serviceService = {
  // ==================== PUBLIC ROUTES ====================
  getPublicPetTypes: async () => {
    return await apiClient.get("/services/public/pet-types");
  },

  getPublicServices: async () => {
    return await apiClient.get("/services/public/system");
  },

  getServiceDetail: async (serviceId) => {
    return await apiClient.get(`/services/public/system/${serviceId}`);
  },

  getAllShopServices: async (params) => {
    return await apiClient.get("/services/public/shops", { params });
  },

  getShopServiceDetail: async (shopServiceId) => {
    return await apiClient.get(`/services/public/shops/${shopServiceId}`);
  },

  getShopServicesByPetType: async (shopId, petTypeId) => {
    return await apiClient.get(`/services/shops/${shopId}/pet-type/${petTypeId}`);
  },

  // ==================== ADMIN - ROLES ====================
  getRoles: async () => {
    return await apiClient.get("/services/roles");
  },

  createRole: async (roleData) => {
    return await apiClient.post("/services/roles", roleData);
  },

  updateRole: async (id, roleData) => {
    return await apiClient.put(`/services/roles/${id}`, roleData);
  },

  deleteRole: async (id) => {
    return await apiClient.delete(`/services/roles/${id}`);
  },

  // ==================== ADMIN - PET TYPES ====================
  getPetTypes: async () => {
    return await apiClient.get("/services/pet-types");
  },

  createPetType: async (petTypeData) => {
    return await apiClient.post("/services/pet-types", petTypeData);
  },

  updatePetType: async (id, petTypeData) => {
    return await apiClient.put(`/services/pet-types/${id}`, petTypeData);
  },

  deletePetType: async (id) => {
    return await apiClient.delete(`/services/pet-types/${id}`);
  },

  // ==================== ADMIN - SYSTEM SERVICES ====================
  getSystemServices: async () => {
    return await apiClient.get("/services/system");
  },

  createSystemService: async (serviceData) => {
    return await apiClient.post("/services/system", serviceData);
  },

  updateSystemService: async (id, serviceData) => {
    return await apiClient.put(`/services/system/${id}`, serviceData);
  },

  deleteSystemService: async (id) => {
    return await apiClient.delete(`/services/system/${id}`);
  },

  // ==================== OWNER - SHOP SERVICES ====================
  getShopServices: async () => {
    return await apiClient.get("/services/shop");
  },

  addServiceToShop: async (serviceData) => {
    return await apiClient.post("/services/shop", serviceData);
  },

  updateShopService: async (id, serviceData) => {
    return await apiClient.put(`/services/shop/${id}`, serviceData);
  },

  deleteShopService: async (id) => {
    return await apiClient.delete(`/services/shop/${id}`);
  },

  // ==================== SERVICE PROPOSALS ====================
  proposeNewService: async (proposalData) => {
    return await apiClient.post("/services/proposals", proposalData);
  },

  getServiceProposals: async (params) => {
    return await apiClient.get("/services/proposals", { params });
  },

  approveServiceProposal: async (id) => {
    return await apiClient.put(`/services/proposals/${id}/approve`);
  },

  rejectServiceProposal: async (id, lyDoTuChoi) => {
    return await apiClient.put(`/services/proposals/${id}/reject`, {
      lyDoTuChoi,
    });
  },
};

export default serviceService;
