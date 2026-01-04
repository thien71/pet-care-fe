import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaStore,
  FaCalendarAlt,
  FaHistory,
  FaSearch,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Logo from "@/components/common/Logo";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, hasShop } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef(null);

  // Đóng menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showUserMenu]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
      setShowMobileMenu(false);
    }
  };

  const menuItems = [
    { path: "/", label: "Trang chủ", icon: <FaHome /> },
    { path: "/shops", label: "Cửa hàng", icon: <FaStore /> },
    { path: "/customer/booking", label: "Đặt lịch", icon: <FaCalendarAlt /> },
    { path: "/customer/history", label: "Lịch sử đặt", icon: <FaHistory /> },
    { path: "/search", label: "Tìm kiếm", icon: <FaSearch /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Logo
              className="mb-0! p-2!"
              iconClassName="text-2xl!"
              animate={false}
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800">Pet Care</h1>
              <p className="text-xs text-gray-500">Chăm sóc thú cưng</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#8e2800] transition-colors"
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#8e2800] text-white rounded-full flex items-center justify-center font-semibold">
                      {user?.hoTen?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="hidden lg:block font-medium text-gray-700">
                      {user?.hoTen || "User"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-md border border-gray-200 py-2">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-800">
                          {user?.hoTen}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <FaUser />
                        <span>Thông tin cá nhân</span>
                      </Link>

                      {hasShop() ? (
                        <Link
                          to={`/owner/dashboard`}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                          <FaStore />
                          <span>Xem cửa hàng</span>
                        </Link>
                      ) : (
                        <Link
                          to="/customer/register-shop"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                          <FaStore />
                          <span>Đăng ký cửa hàng</span>
                        </Link>
                      )}

                      <div className="border-t border-gray-200 my-2"></div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-red-600 w-full transition-colors"
                      >
                        <FaSignOutAlt />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-[#8e2800] font-medium transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showMobileMenu ? (
                <FaTimes className="text-xl text-gray-600" />
              ) : (
                <FaBars className="text-xl text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm dịch vụ..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
