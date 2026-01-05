import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { getAvatarUrl } from "@/utils/constants";
import { FaHome, FaPaw, FaSignOutAlt, FaUser } from "react-icons/fa";

const Sidebar = ({ items = [] }) => {
  const location = useLocation();
  const { logout, user, switchToCustomerView } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const roles = user?.VaiTros || [];
  const chuCuaHangRole = roles.find((r) => r.tenVaiTro === "CHU_CUA_HANG");
  const tenVaiTro = chuCuaHangRole?.tenVaiTro || roles[0]?.tenVaiTro;

  const maCuaHang = user?.maCuaHang;

  const canSwitchToCustomerView = tenVaiTro === "CHU_CUA_HANG" || (tenVaiTro === "KHACH_HANG" && maCuaHang);
  const isChuCuaHang = tenVaiTro === "CHU_CUA_HANG";

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

  const avatarUrl = getAvatarUrl(user?.avatar);

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
      <div className="p-5 border-b border-gray-200">
        <Link to={homePath} className="flex items-center gap-2 text-lg font-bold group">
          <div className="w-10 h-10 bg-[#8e2800] rounded-4xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <FaPaw className="text-white text-xl" />
          </div>
          <span className="text-[#8e2800]">Pet Care</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="p-3 flex-1">
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 py-2 px-3 rounded-lg transition-all group text-sm
                  ${isActive(item.path) ? "bg-[#8e2800] text-white" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                <span className={`text-lg ${isActive(item.path) ? "text-white" : "text-[#8e2800]"}`}>{item.icon}</span>
                <span className={`font-medium ${isActive(item.path) ? "text-white" : "text-gray-800"}`}>{item.label}</span>
              </Link>
            </li>
          ))}

          {/* ⭐ Thông tin cá nhân - Thêm vào cuối menu */}
          <li>
            <Link
              to={`${homePath.split("/").slice(0, 2).join("/")}/profile`}
              className={`
                flex items-center gap-3 py-2 px-3 rounded-lg transition-all group text-sm
                ${isActive("/profile") ? "bg-[#8e2800] text-white" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              <span className={`text-lg ${isActive("/profile") ? "text-white" : "text-[#8e2800]"}`}>
                <FaUser />
              </span>
              <span className={`font-medium ${isActive("/profile") ? "text-white" : "text-gray-800"}`}>Thông tin cá nhân</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Dropdown */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div ref={dropdownRef} className={`dropdown dropdown-top w-full ${showDropdown ? "dropdown-open" : ""}`}>
          <label
            tabIndex={0}
            role="button"
            className="btn btn-ghost w-full justify-start gap-2 hover:bg-gray-100 hover:border-white rounded-lg transition-colors h-auto py-2 px-3 text-sm"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.hoTen}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-[#8e2800] flex items-center justify-center text-white text-sm font-bold">
                        ${user?.hoTen?.charAt(0).toUpperCase() || "?"}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#8e2800] flex items-center justify-center text-white text-sm font-bold">
                  {user?.hoTen?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="font-semibold text-xs truncate max-w-[120px] text-gray-800">{user?.hoTen || "User"}</span>
              <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{user?.email}</span>
            </div>

            {/* Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-200 text-gray-600 shrink-0 ${showDropdown ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </label>

          {/* Dropdown Menu */}
          <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-white rounded-lg w-full border border-gray-200">
            {/* Về trang chủ */}
            {canSwitchToCustomerView && (
              <li>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    switchToCustomerView();
                  }}
                  className="gap-2 text-sm text-gray-700 font-medium hover:bg-gray-100 rounded-lg p-2"
                >
                  <FaHome className="text-[#8e2800]" />
                  Về trang chủ
                </button>
              </li>
            )}

            <div className="divider my-0.5"></div>

            {/* Đăng xuất */}
            <li>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="text-red-600 gap-2 font-medium hover:bg-red-50 rounded-lg p-2 text-sm"
              >
                <FaSignOutAlt />
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
