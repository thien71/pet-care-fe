// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const AdminLayout = () => {
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Quản lý người dùng", icon: "👥" },
    { path: "/admin/roles", label: "Quản lý vai trò", icon: "🎭" },
    { path: "/admin/pet-types", label: "Quản lý loại thú cưng", icon: "🐾" },
    { path: "/admin/services", label: "Quản lý dịch vụ", icon: "✨" },
    { path: "/admin/shops", label: "Quản lý cửa hàng", icon: "🏪" },
    {
      path: "/admin/service-proposals",
      label: "Duyệt đề xuất dịch vụ",
      icon: "📋",
    },
    { path: "/admin/payment-packages", label: "Gói thanh toán", icon: "💳" },
    {
      path: "/admin/payment-confirm",
      label: "Xác nhận thanh toán",
      icon: "✅",
    },
  ];

  return (
    <div className="flex">
      <Sidebar items={menuItems} />
      <main className="flex-1 ml-64">
        <div className="p-8 bg-base-200 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
