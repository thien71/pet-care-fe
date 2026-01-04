// src/components/customer/CustomerSidebar.jsx - FIXED AVATAR DISPLAY
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaUser, FaHistory, FaStore, FaShoppingBag } from "react-icons/fa";
import { getAvatarUrl } from "../../utils/constants";

const CustomerSidebar = () => {
  const location = useLocation();
  const { user, hasShop } = useAuth();
  const userHasShop = hasShop();

  // ⭐ Chuyển đổi avatar path → full URL
  const avatarUrl = getAvatarUrl(user?.avatar);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: "/profile",
      label: "Thông tin cá nhân",
      icon: <FaUser />,
      description: "Xem và chỉnh sửa thông tin",
    },
    {
      path: "/customer/history",
      label: "Lịch sử đặt lịch",
      icon: <FaHistory />,
      description: "Xem các lịch hẹn đã đặt",
    },
    ...(userHasShop
      ? [
          {
            path: "/owner/dashboard",
            label: "Quản lý cửa hàng",
            icon: <FaStore />,
            description: "Vào trang quản lý shop",
          },
        ]
      : [
          {
            path: "/customer/register-shop",
            label: "Đăng ký cửa hàng",
            icon: <FaShoppingBag />,
            description: "Mở cửa hàng của bạn",
          },
        ]),
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
      {/* User Info Card */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* ⭐ FIXED: Avatar với full URL */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.hoTen}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                // Fallback nếu ảnh lỗi
                e.target.style.display = "none";
                const fallback = document.createElement("div");
                fallback.className =
                  "w-12 h-12 bg-[#8e2800] text-white rounded-full flex items-center justify-center font-bold text-lg";
                fallback.textContent =
                  user?.hoTen?.charAt(0).toUpperCase() || "?";
                e.target.parentElement.appendChild(fallback);
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-[#8e2800] text-white rounded-full flex items-center justify-center font-bold text-lg">
              {user?.hoTen?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">
              {user?.hoTen}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all group
                  ${
                    isActive(item.path)
                      ? "bg-[#8e2800] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span
                  className={`text-xl ${
                    isActive(item.path) ? "text-white" : "text-[#8e2800]"
                  }`}
                >
                  {item.icon}
                </span>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isActive(item.path) ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;
