// src/layouts/OwnerLayout.jsx (UPDATED)
import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import ShopLockedBanner from "@/components/owner/ShopLockedBanner";
import { useShopStatus } from "@/hooks/useShopStatus";
import { MdDashboard, MdMiscellaneousServices } from "react-icons/md";
import { FaCalendarAlt, FaUserTie, FaCalendar, FaCreditCard, FaCog, FaSpinner } from "react-icons/fa";

const OwnerLayout = () => {
  const { status, loading } = useShopStatus();
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu shop bị khóa và không phải đang ở trang payments → redirect
  useEffect(() => {
    if (!loading && status?.isLocked && location.pathname !== "/owner/payments") {
      navigate("/owner/payments", { replace: true });
    }
  }, [status, loading, location.pathname, navigate]);

  // Định nghĩa menu items
  const allMenuItems = [
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

  // Nếu shop bị khóa → chỉ hiện menu thanh toán
  const menuItems = status?.isLocked ? allMenuItems.filter((item) => item.path === "/owner/payments") : allMenuItems;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar items={menuItems} />
      <main className="flex-1 ml-64">
        {/* Banner thông báo */}
        {status && (status.isLocked || (status.isTrial && status.daysLeft <= 3)) && <ShopLockedBanner status={status} />}

        <div className="p-8 bg-base-200 min-h-screen">
          <Outlet context={{ shopStatus: status }} />
        </div>
      </main>
    </div>
  );
};

export default OwnerLayout;
