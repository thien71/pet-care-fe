// src/layouts/StaffLayout.jsx - UPDATED cho Lễ Tân
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const StaffLayout = () => {
  const menuItems = [
    { path: "/staff/dashboard", label: "Quản Lý Đơn Đặt", icon: "📋" },
    { path: "/staff/schedule", label: "Lịch Làm Việc", icon: "📅" },
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
