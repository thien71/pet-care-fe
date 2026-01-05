import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import { MdDashboard, MdMiscellaneousServices } from "react-icons/md";
import { FaCalendarAlt, FaUserTie, FaCalendar, FaChartLine, FaCreditCard, FaCog } from "react-icons/fa";

const OwnerLayout = () => {
  const menuItems = [
    {
      path: "/owner/dashboard",
      label: "Dashboard",
      icon: <MdDashboard />,
    },
    {
      path: "/owner/bookings",
      label: "Quản lý đặt hẹn",
      icon: <FaCalendarAlt />,
    },
    {
      path: "/owner/employees",
      label: "Quản lý nhân viên",
      icon: <FaUserTie />,
    },
    {
      path: "/owner/services",
      label: "Quản lý dịch vụ",
      icon: <MdMiscellaneousServices />,
    },
    {
      path: "/owner/schedule",
      label: "Lịch làm việc",
      icon: <FaCalendar />,
    },
    {
      path: "/owner/statistics",
      label: "Thống kê",
      icon: <FaChartLine />,
    },
    {
      path: "/owner/payments",
      label: "Thanh toán",
      icon: <FaCreditCard />,
    },
    {
      path: "/owner/settings",
      label: "Cài đặt cửa hàng",
      icon: <FaCog />,
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

export default OwnerLayout;
