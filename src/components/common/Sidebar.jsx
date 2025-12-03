// src/components/common/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ items = [] }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-base-100 shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="p-6 border-b border-base-300">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold">
          <span className="text-3xl">🐾</span>
          <span className="text-primary">Pet Care</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
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

      {/* Logout Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-100">
        <button
          onClick={logout}
          className="btn btn-error btn-sm w-full gap-2 justify-start"
        >
          <span>🚪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
