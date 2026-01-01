// src/api/customerApi.js
import apiClient from "./apiClient";

export const customerService = {
  // ==================== ĐĂNG KÝ CỬA HÀNG ====================
  registerShop: async (formData) => {
    return await apiClient.post("/customer/register-shop", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // ==================== THÚ CƯNG ====================
  getMyPets: async () => {
    return await apiClient.get("/customer/pets");
  },

  createPet: async (petData) => {
    return await apiClient.post("/customer/pets", petData);
  },

  updatePet: async (id, petData) => {
    return await apiClient.put(`/customer/pets/${id}`, petData);
  },

  deletePet: async (id) => {
    return await apiClient.delete(`/customer/pets/${id}`);
  },
};

export default customerService;
