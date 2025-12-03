// src/layouts/StaffLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const StaffLayout = () => {
  const menuItems = [
    { path: "/staff/schedule", label: "Lịch làm việc", icon: "📅" },
    { path: "/staff/bookings", label: "Đặt hẹn", icon: "📋" },
    { path: "/staff/customers", label: "Khách hàng", icon: "👥" },
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

export default StaffLayout;
