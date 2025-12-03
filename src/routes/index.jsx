// src/routes/index.jsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Pages
import HomePage from "../pages/home/HomePage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Constants
const ROLES = {
  KHACH_HANG: "KHACH_HANG",
  QUAN_TRI_VIEN: "QUAN_TRI_VIEN",
  CHU_CUA_HANG: "CHU_CUA_HANG",
  LE_TAN: "LE_TAN",
  KY_THUAT_VIEN: "KY_THUAT_VIEN",
};

// Placeholder components
const PlaceholderPage = ({ title, icon = "🚧" }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="card-title text-2xl">{title}</h2>
        <p className="text-gray-600">Trang này đang được phát triển</p>
        <div className="badge badge-warning gap-2 mt-4">
          <span>⏰</span>
          Coming Soon
        </div>
      </div>
    </div>
  </div>
);

// Customer Pages
const BookingPage = () => <PlaceholderPage title="Đặt lịch" icon="📅" />;
const HistoryPage = () => <PlaceholderPage title="Lịch sử đặt hẹn" icon="📜" />;
const PetsPage = () => <PlaceholderPage title="Thú cưng của tôi" icon="🐾" />;
const RegisterShopPage = () => (
  <PlaceholderPage title="Đăng ký cửa hàng" icon="🏪" />
);

const ShopsPage = () => (
  <PlaceholderPage title="Danh sách cửa hàng" icon="🏪" />
);
const ServicesPage = () => (
  <PlaceholderPage title="Danh sách dịch vụ" icon="✨" />
);

const SchedulePage = () => <PlaceholderPage title="Lịch làm việc" icon="📅" />;
const StaffBookingsPage = () => (
  <PlaceholderPage title="Quản lý đặt hẹn" icon="📋" />
);
const CustomersPage = () => (
  <PlaceholderPage title="Quản lý khách hàng" icon="👥" />
);

const OwnerDashboard = () => (
  <PlaceholderPage title="Dashboard Chủ Shop" icon="📊" />
);
const OwnerBookingsPage = () => (
  <PlaceholderPage title="Quản lý đặt hẹn" icon="📅" />
);
const EmployeesPage = () => (
  <PlaceholderPage title="Quản lý nhân viên" icon="👥" />
);
const OwnerServicesPage = () => (
  <PlaceholderPage title="Quản lý dịch vụ" icon="✨" />
);
const OwnerSettingsPage = () => (
  <PlaceholderPage title="Cài đặt cửa hàng" icon="⚙️" />
);

const AdminDashboard = () => (
  <PlaceholderPage title="Admin Dashboard" icon="📊" />
);
const UserManagement = () => (
  <PlaceholderPage title="Quản lý người dùng" icon="👥" />
);
const ShopManagement = () => (
  <PlaceholderPage title="Quản lý cửa hàng" icon="🏪" />
);
const ServiceManagement = () => (
  <PlaceholderPage title="Quản lý dịch vụ" icon="✨" />
);

const ProfilePage = () => (
  <PlaceholderPage title="Thông tin cá nhân" icon="👤" />
);
const SettingsPage = () => <PlaceholderPage title="Cài đặt" icon="⚙️" />;

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-200">
    <div className="card w-96 bg-base-100 shadow-2xl">
      <div className="card-body items-center text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-6xl font-bold text-error">404</h1>
        <h2 className="card-title text-2xl mt-4">Không tìm thấy trang</h2>
        <p className="text-gray-600">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
        </p>
        <div className="card-actions mt-6">
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost gap-2"
          >
            <span>⬅️</span>
            Quay lại
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn btn-primary gap-2"
          >
            <span>🏠</span>
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "shops",
            element: <ShopsPage />,
          },
          {
            path: "services",
            element: <ServicesPage />,
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/booking",
            element: (
              <ProtectedRoute allowedRoles={["KHACH_HANG"]}>
                <BookingPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/history",
            element: (
              <ProtectedRoute allowedRoles={["KHACH_HANG"]}>
                <HistoryPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/pets",
            element: (
              <ProtectedRoute allowedRoles={["KHACH_HANG"]}>
                <PetsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/register-shop",
            element: (
              <ProtectedRoute allowedRoles={["KHACH_HANG"]}>
                <RegisterShopPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "staff/schedule",
            element: (
              <ProtectedRoute allowedRoles={["LE_TAN", "KY_THUAT_VIEN"]}>
                <SchedulePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "staff/bookings",
            element: (
              <ProtectedRoute allowedRoles={["LE_TAN", "KY_THUAT_VIEN"]}>
                <StaffBookingsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "staff/customers",
            element: (
              <ProtectedRoute allowedRoles={["LE_TAN", "KY_THUAT_VIEN"]}>
                <CustomersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "owner/dashboard",
            element: (
              <ProtectedRoute allowedRoles={["CHU_CUA_HANG"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "owner/bookings",
            element: (
              <ProtectedRoute allowedRoles={["CHU_CUA_HANG"]}>
                <OwnerBookingsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "owner/employees",
            element: (
              <ProtectedRoute allowedRoles={["CHU_CUA_HANG"]}>
                <EmployeesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "owner/services",
            element: (
              <ProtectedRoute allowedRoles={["CHU_CUA_HANG"]}>
                <OwnerServicesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "owner/settings",
            element: (
              <ProtectedRoute allowedRoles={["CHU_CUA_HANG"]}>
                <OwnerSettingsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/dashboard",
            element: (
              <ProtectedRoute allowedRoles={["QUAN_TRI_VIEN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/users",
            element: (
              <ProtectedRoute allowedRoles={["QUAN_TRI_VIEN"]}>
                <UserManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/shops",
            element: (
              <ProtectedRoute allowedRoles={["QUAN_TRI_VIEN"]}>
                <ShopManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/services",
            element: (
              <ProtectedRoute allowedRoles={["QUAN_TRI_VIEN"]}>
                <ServiceManagement />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
export { ROLES };
