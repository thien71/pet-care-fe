// src/api/index.js
// Export tất cả API services để import dễ dàng

export { default as authService } from "./authApi";
export { default as userService } from "./userApi";
export { default as adminService } from "./adminApi";
export { default as ownerService } from "./ownerApi";
export { default as staffService } from "./staffApi";
export { default as customerService } from "./customerApi";
export { default as bookingService } from "./bookingApi";

// Sử dụng:
// import { authService, bookingService } from "@/api";
// const shops = await bookingService.getPublicShops();
