// src/components/common/Header.jsx (UPDATED - Hiển thị nhiều vai trò)
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const {
    user,
    logout,
    isAuthenticated,
    getRoles,
    getPrimaryRole,
    hasRole,
    hasShop,
  } = useAuth();

  const primaryRole = getPrimaryRole();
  const roles = getRoles();
  const userHasShop = hasShop();

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <li>
            <Link to="/">🏠 Trang chủ</Link>
          </li>
          <li>
            <Link to="/shops">🏪 Cửa hàng</Link>
          </li>
          <li>
            <Link to="/services">✨ Dịch vụ</Link>
          </li>
          <li>
            <Link to="/about">📖 Giới thiệu</Link>
          </li>
        </>
      );
    }

    // ⭐ Hiển thị nav dựa trên PRIMARY ROLE
    switch (primaryRole) {
      case "QUAN_TRI_VIEN":
        return (
          <>
            <li>
              <Link to="/admin/dashboard">📊 Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/users">👥 Người dùng</Link>
            </li>
            <li>
              <Link to="/admin/shops">🏪 Cửa hàng</Link>
            </li>
            <li>
              <Link to="/admin/services">✨ Dịch vụ</Link>
            </li>
          </>
        );

      case "CHU_CUA_HANG":
        return (
          <>
            <li>
              <Link to="/owner/dashboard">📊 Dashboard</Link>
            </li>
            <li>
              <Link to="/owner/bookings">📅 Đặt hẹn</Link>
            </li>
            <li>
              <Link to="/owner/employees">👥 Nhân viên</Link>
            </li>
            <li>
              <Link to="/owner/services">✨ Dịch vụ</Link>
            </li>
            <li>
              <Link to="/owner/settings">⚙️ Cài đặt</Link>
            </li>
          </>
        );

      case "LE_TAN":
      case "KY_THUAT_VIEN":
        return (
          <>
            <li>
              <Link to="/staff/schedule">📅 Lịch làm việc</Link>
            </li>
            <li>
              <Link to="/staff/bookings">📋 Đặt hẹn</Link>
            </li>
            <li>
              <Link to="/staff/customers">👥 Khách hàng</Link>
            </li>
          </>
        );

      default: // KHACH_HANG
        return (
          <>
            <li>
              <Link to="/">🏠 Trang chủ</Link>
            </li>
            <li>
              <Link to="/shops">🏪 Cửa hàng</Link>
            </li>
            <li>
              <Link to="/customer/booking">📅 Đặt lịch</Link>
            </li>
            <li>
              <Link to="/customer/history">📜 Lịch sử</Link>
            </li>
            <li>
              <Link to="/customer/pets">🐾 Thú cưng</Link>
            </li>
          </>
        );
    }
  };

  // ⭐ Hiển thị TẤT CẢ các vai trò
  const getRoleBadges = () => {
    const roleColors = {
      QUAN_TRI_VIEN: "badge-error",
      CHU_CUA_HANG: "badge-warning",
      LE_TAN: "badge-info",
      KY_THUAT_VIEN: "badge-info",
      KHACH_HANG: "badge-success",
    };

    const roleLabels = {
      QUAN_TRI_VIEN: "Admin",
      CHU_CUA_HANG: "Chủ shop",
      LE_TAN: "Lễ tân",
      KY_THUAT_VIEN: "Kỹ thuật viên",
      KHACH_HANG: "Khách hàng",
    };

    return roles.map((role, idx) => (
      <span key={idx} className={`badge ${roleColors[role]} badge-sm mr-1`}>
        {roleLabels[role]}
      </span>
    ));
  };

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {getNavLinks()}
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="btn btn-ghost text-xl gap-2">
          <span className="text-2xl">🐾</span>
          <span className="hidden md:inline">Pet Care</span>
        </Link>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{getNavLinks()}</ul>
      </div>

      {/* User menu */}
      <div className="navbar-end gap-2">
        {isAuthenticated ? (
          <>
            {/* Notifications */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </label>
              <div
                tabIndex={0}
                className="mt-3 z-1 card card-compact dropdown-content w-52 bg-base-100 shadow"
              >
                <div className="card-body">
                  <span className="font-bold text-lg">Thông báo</span>
                  <span className="text-info text-sm">
                    Chưa có thông báo mới
                  </span>
                </div>
              </div>
            </div>

            {/* User dropdown */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar placeholder"
              >
                <div className="bg-primary text-primary-content rounded-full w-10">
                  <span className="text-xl">
                    {user?.hoTen?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-64"
              >
                <li className="menu-title">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-base">{user?.hoTen}</span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                    {/* ⭐ Hiển thị TẤT CẢ vai trò */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getRoleBadges()}
                    </div>
                  </div>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link to="/profile" className="gap-2">
                    <span>👤</span>
                    Thông tin cá nhân
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="gap-2">
                    <span>⚙️</span>
                    Cài đặt
                  </Link>
                </li>

                {/* ⭐ Hiển thị option chuyển view nếu có nhiều vai trò */}
                {hasRole("KHACH_HANG") && hasRole("CHU_CUA_HANG") && (
                  <>
                    <div className="divider my-1">Chuyển giao diện</div>
                    {primaryRole === "CHU_CUA_HANG" ? (
                      <li>
                        <Link to="/" className="gap-2">
                          <span>🛒</span>
                          Giao diện Khách hàng
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link to="/owner/dashboard" className="gap-2">
                          <span>🏪</span>
                          Quản lý cửa hàng
                        </Link>
                      </li>
                    )}
                  </>
                )}

                {/* Nếu chỉ là KHACH_HANG nhưng chưa có shop */}
                {hasRole("KHACH_HANG") &&
                  !hasRole("CHU_CUA_HANG") &&
                  !userHasShop && (
                    <>
                      <div className="divider my-1"></div>
                      <li>
                        <Link to="/customer/register-shop" className="gap-2">
                          <span>🏪</span>
                          Đăng ký cửa hàng
                        </Link>
                      </li>
                    </>
                  )}

                <div className="divider my-1"></div>
                <li>
                  <button onClick={logout} className="text-error gap-2">
                    <span>🚪</span>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost gap-2">
              <span>🔐</span>
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
            <Link to="/register" className="btn btn-primary gap-2">
              <span>✨</span>
              <span className="hidden sm:inline">Đăng ký</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
