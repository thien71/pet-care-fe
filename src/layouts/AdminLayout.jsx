import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import { MdDashboard, MdPets, MdMiscellaneousServices } from "react-icons/md";
import { FaUsers, FaStore, FaClipboardCheck, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const AdminLayout = () => {
  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <MdDashboard />,
    },
    {
      path: "/admin/users",
      label: "Quản lý người dùng",
      icon: <FaUsers />,
    },
    {
      path: "/admin/pet-types",
      label: "Quản lý loại thú cưng",
      icon: <MdPets />,
    },
    {
      path: "/admin/services",
      label: "Quản lý dịch vụ",
      icon: <MdMiscellaneousServices />,
    },
    {
      path: "/admin/shops",
      label: "Quản lý cửa hàng",
      icon: <FaStore />,
    },
    {
      path: "/admin/shop-approvals",
      label: "Duyệt yêu cầu mở cửa hàng",
      icon: <FaClipboardCheck />,
    },
    {
      path: "/admin/service-proposals",
      label: "Duyệt đề xuất dịch vụ",
      icon: <FaClipboardCheck />,
    },
    {
      path: "/admin/payment-packages",
      label: "Gói thanh toán",
      icon: <FaCreditCard />,
    },
    {
      path: "/admin/payment-confirm",
      label: "Xác nhận thanh toán",
      icon: <FaCheckCircle />,
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
