// src/components/common/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

const Sidebar = ({ items = [] }) => {
  const location = useLocation();
  const { logout, user, switchToCustomerView } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // ✅ Lấy đúng tên vai trò từ object lồng nhau
  const tenVaiTro = user?.VaiTro?.tenVaiTro; // đúng cấu trúc backend của bạn
  const maCuaHang = user?.maCuaHang;

  // ✅ Điều kiện hiển thị nút "Về trang chủ"
  // Chỉ hiện cho: CHU_CUA_HANG hoặc KHACH_HANG có maCuaHang
  const canSwitchToCustomerView =
    tenVaiTro === "CHU_CUA_HANG" || (tenVaiTro === "KHACH_HANG" && maCuaHang);

  // ✅ Chỉ chủ cửa hàng mới thấy "Cài đặt cửa hàng"
  const isChuCuaHang = tenVaiTro === "CHU_CUA_HANG";

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <aside className="w-64 bg-base-100 shadow-lg h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-base-300">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold">
          <span className="text-3xl">🐾</span>
          <span className="text-primary">Pet Care</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="p-4 flex-1">
        <ul className="menu menu-compact w-full">
          {items.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 ${
                  isActive(item.path) ? "active" : ""
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Dropdown */}
      <div className="p-4 border-t border-base-300 bg-base-100">
        <div
          ref={dropdownRef}
          className={`dropdown dropdown-top w-full ${
            showDropdown ? "dropdown-open" : ""
          }`}
        >
          <label
            tabIndex={0}
            role="button"
            className="btn btn-ghost w-full justify-start gap-3 hover:bg-base-200"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-lg">
                  {user?.hoTen?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start flex-1">
              <span className="font-semibold text-sm truncate max-w-[120px]">
                {user?.hoTen || "User"}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-[120px]">
                {user?.email}
              </span>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-3 shadow-lg bg-base-100 rounded-box w-full"
          >
            {/* Về trang chủ - chỉ hiện khi được phép */}
            {canSwitchToCustomerView && (
              <li>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    switchToCustomerView();
                  }}
                  className="gap-2"
                >
                  <span>🏠</span>
                  Về trang chủ
                </button>
              </li>
            )}

            <li>
              <Link
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="gap-2"
              >
                <span>👤</span>
                Thông tin cá nhân
              </Link>
            </li>

            {/* Cài đặt cửa hàng - chỉ chủ cửa hàng */}
            {isChuCuaHang && (
              <li>
                <Link
                  to="/owner/settings"
                  onClick={() => setShowDropdown(false)}
                  className="gap-2"
                >
                  <span>⚙️</span>
                  Cài đặt cửa hàng
                </Link>
              </li>
            )}

            <div className="divider my-1"></div>

            <li>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="text-error gap-2"
              >
                <span>🚪</span>
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
