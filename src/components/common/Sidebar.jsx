// src/components/common/Sidebar.jsx - UPDATED THEME
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { getAvatarUrl } from "../../utils/constants";

const Sidebar = ({ items = [] }) => {
  const location = useLocation();
  const { logout, user, switchToCustomerView } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const tenVaiTro = user?.VaiTros?.[0]?.tenVaiTro;
  const maCuaHang = user?.maCuaHang;

  const canSwitchToCustomerView = tenVaiTro === "CHU_CUA_HANG" || (tenVaiTro === "KHACH_HANG" && maCuaHang);

  const isChuCuaHang = tenVaiTro === "CHU_CUA_HANG";

  // Tính toán home path
  let homePath = "/";
  if (tenVaiTro === "QUAN_TRI_VIEN") {
    homePath = "/admin/dashboard";
  } else if (tenVaiTro === "CHU_CUA_HANG") {
    homePath = "/owner/dashboard";
  } else if (tenVaiTro === "LE_TAN") {
    homePath = "/staff/dashboard";
  } else if (tenVaiTro === "KY_THUAT_VIEN") {
    homePath = "/tech/dashboard";
  }
  console.log("home path", homePath);

  // Lấy avatar URL
  const avatarUrl = getAvatarUrl(user?.avatar);

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
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to={homePath} className="flex items-center gap-3 text-xl font-bold group">
          <span className="text-3xl group-hover:scale-110 transition-transform">🐾</span>
          <span className="text-[#8e2800]">Pet Care</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all group
                  ${isActive(item.path) ? "bg-[#8e2800] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                <span className={`text-xl ${isActive(item.path) ? "text-white" : "text-[#8e2800]"}`}>{item.icon}</span>
                <span className={`font-medium ${isActive(item.path) ? "text-white" : "text-gray-800"}`}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Dropdown */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div ref={dropdownRef} className={`dropdown dropdown-top w-full ${showDropdown ? "dropdown-open" : ""}`}>
          <label
            tabIndex={0}
            role="button"
            className="btn btn-ghost w-full justify-start gap-3 hover:bg-gray-100 transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.hoTen}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-[#8e2800] flex items-center justify-center text-white text-lg font-bold">
                        ${user?.hoTen?.charAt(0).toUpperCase() || "?"}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#8e2800] flex items-center justify-center text-white text-lg font-bold">
                  {user?.hoTen?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="font-semibold text-sm truncate max-w-[120px] text-gray-800">{user?.hoTen || "User"}</span>
              <span className="text-xs text-gray-500 truncate max-w-[120px]">{user?.email}</span>
            </div>

            {/* Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-200 text-gray-600 shrink-0 ${showDropdown ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </label>

          {/* Dropdown Menu */}
          <ul tabIndex={0} className="dropdown-content z-50 menu p-3 shadow-lg bg-white rounded-box w-full border border-gray-200">
            {/* Về trang chủ */}
            {canSwitchToCustomerView && (
              <li>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    switchToCustomerView();
                  }}
                  className="gap-2 text-gray-700 hover:bg-gray-100"
                >
                  <span>🏠</span>
                  Về trang chủ
                </button>
              </li>
            )}

            {/* Thông tin cá nhân - FIXED: Relative path */}
            <li>
              <Link to="profile" onClick={() => setShowDropdown(false)} className="gap-2 text-gray-700 hover:bg-gray-100">
                <span>👤</span>
                Thông tin cá nhân
              </Link>
            </li>

            {/* Cài đặt cửa hàng - chỉ chủ cửa hàng */}
            {isChuCuaHang && (
              <li>
                <Link to="/owner/settings" onClick={() => setShowDropdown(false)} className="gap-2 text-gray-700 hover:bg-gray-100">
                  <span>⚙️</span>
                  Cài đặt cửa hàng
                </Link>
              </li>
            )}

            <div className="divider my-1"></div>

            {/* Đăng xuất */}
            <li>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="text-error gap-2 hover:bg-red-50"
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
