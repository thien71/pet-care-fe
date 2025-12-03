// src/layouts/OwnerLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const OwnerLayout = () => {
  const menuItems = [
    { path: "/owner/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/owner/bookings", label: "Quản lý đặt hẹn", icon: "📅" },
    { path: "/owner/employees", label: "Quản lý nhân viên", icon: "👥" },
    { path: "/owner/services", label: "Quản lý dịch vụ", icon: "✨" },
    { path: "/owner/schedule", label: "Lịch làm việc", icon: "📆" },
    { path: "/owner/statistics", label: "Thống kê", icon: "📈" },
    { path: "/owner/payments", label: "Thanh toán", icon: "💳" },
    { path: "/owner/settings", label: "Cài đặt cửa hàng", icon: "⚙️" },
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

export default OwnerLayout;
