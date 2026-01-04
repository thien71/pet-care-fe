// src/utils/constants.js
// Tách biệt URL cho API calls và static files

// URL cho API endpoints (có /api)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// URL cho static files như images, uploads (KHÔNG có /api)
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Helper function: Convert avatar path → full URL
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;

  // Nếu đã là full URL (bắt đầu bằng http)
  if (avatarPath.startsWith("http")) return avatarPath;

  // Nếu là Google avatar
  if (avatarPath.includes("googleusercontent")) return avatarPath;

  // Chuyển đổi path tương đối → Full URL (KHÔNG dùng API_BASE_URL)
  return `${BACKEND_URL}${avatarPath}`;
};

// Helper function: Get shop image URL
export const getShopImageUrl = (imagePath) => {
  return getAvatarUrl(imagePath); // Dùng chung logic
};

// Helper function: Get service image URL
export const getServiceImageUrl = (imagePath) => {
  return getAvatarUrl(imagePath); // Dùng chung logic
};

export const ROLES = {
  KHACH_HANG: "KHACH_HANG",
  QUAN_TRI_VIEN: "QUAN_TRI_VIEN",
  CHU_CUA_HANG: "CHU_CUA_HANG",
  LE_TAN: "LE_TAN",
  KY_THUAT_VIEN: "KY_THUAT_VIEN",
};
