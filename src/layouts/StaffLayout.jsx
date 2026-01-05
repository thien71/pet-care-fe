import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import { FaClipboardList, FaCalendar } from "react-icons/fa";

const StaffLayout = () => {
  const menuItems = [
    {
      path: "/staff/dashboard",
      label: "Quản Lý Đơn Đặt",
      icon: <FaClipboardList />,
    },
    {
      path: "/staff/schedule",
      label: "Lịch Làm Việc",
      icon: <FaCalendar />,
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

export default StaffLayout;
