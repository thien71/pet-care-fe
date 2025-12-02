export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const ROLES = {
  KHACH_HANG: "KHACH_HANG",
  QUAN_TRI_VIEN: "QUAN_TRI_VIEN",
  CHU_CUA_HANG: "CHU_CUA_HANG",
  LE_TAN: "LE_TAN",
  KY_THUAT_VIEN: "KY_THUAT_VIEN",
};

export const BOOKING_STATUS = {
  CHO_XAC_NHAN: "CHO_XAC_NHAN",
  DA_XAC_NHAN: "DA_XAC_NHAN",
  // ... dựa trên ENUM trong SQL
};

export const PET_TYPES = ["CHO", "MEO", "CHIM", "CA"]; // Dựa trên LoaiThuCung
