// src/routes/index.jsx (Phần cập nhật quan trọng)
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import StaffLayout from "../layouts/StaffLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Auth Pages
import HomePage from "../pages/home/HomePage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import PetTypeManagement from "../pages/admin/PetTypeManagement";
import ServiceManagement from "../pages/admin/ServiceManagement";
import ShopApproval from "../pages/admin/ShopApproval";

// import RoleManagement from "../pages/admin/RoleManagement";
// import ShopManagement from "../pages/admin/ShopManagement";
// import ServiceProposals from "../pages/admin/ServiceProposals";
// import PaymentPackages from "../pages/admin/PaymentPackages";
// import PaymentConfirm from "../pages/admin/PaymentConfirm";

// Owner Pages
import OwnerDashboard from "../pages/owner/OwnerDashboard";
// import OwnerBookings from "../pages/owner/Bookings";
import EmployeeManagement from "../pages/owner/EmployeeManagement";
import OwnerServiceManagement from "../pages/owner/OwnerServiceManagement";
// import Schedule from "../pages/owner/Schedule";
// import Statistics from "../pages/owner/Statistics";
// import OwnerPayments from "../pages/owner/Payments";
import ShopSettings from "../pages/owner/ShopSettings";

// Staff Pages
// import StaffSchedule from "../pages/staff/Schedule";
// import StaffBookings from "../pages/staff/Bookings";
// import Customers from "../pages/staff/Customers";

// Customer Pages
// import BookingPage from "../pages/customer/Booking";
// import HistoryPage from "../pages/customer/History";
// import PetsPage from "../pages/customer/Pets";
import RegisterShop from "../pages/customer/RegisterShop";

// Public Pages
// import ShopsPage from "../pages/public/Shops";
// import ServicesPage from "../pages/public/Services";
// import ProfilePage from "../pages/public/Profile";
// import SettingsPage from "../pages/public/Settings";
import NotFoundPage from "../pages/public/NotFound";

// Placeholder
const PlaceholderPage = ({ title, icon = "🚧" }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="card-title text-2xl">{title}</h2>
        <p className="text-gray-600">Trang này đang được phát triển</p>
      </div>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Main layout routes
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          // { path: "shops", element: <ShopsPage /> },
          // { path: "services", element: <ServicesPage /> },
          {
            path: "profile",
            element: <ProtectedRoute>{/* <ProfilePage /> */}</ProtectedRoute>,
          },
          {
            path: "settings",
            element: <ProtectedRoute>{/* <SettingsPage /> */}</ProtectedRoute>,
          },
          // Customer routes
          {
            path: "customer/booking",
            element: (
              <ProtectedRoute allowedRoles={["KHACH_HANG"]}>
                {/* <BookingPage /> */}
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/history",
            element: (
              <ProtectedRoute allowedRoles={["KHACH_HANG"]}>
                {/* <HistoryPage /> */}
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/pets",
            element: (
              <ProtectedRoute allowedRoles={["KHACH_HANG"]}>
                {/* <PetsPage /> */}
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/register-shop",
            element: (
              <ProtectedRoute allowedRoles={["KHACH_HANG"]}>
                <RegisterShop />
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Admin layout routes
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["QUAN_TRI_VIEN"]}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <UserManagement /> },
          { path: "shops-approval", element: <ShopApproval /> },

          // { path: "roles", element: <RoleManagement /> },
          { path: "pet-types", element: <PetTypeManagement /> },
          { path: "services", element: <ServiceManagement /> },
          // { path: "shops", element: <ShopManagement /> },
          // { path: "service-proposals", element: <ServiceProposals /> },
          // { path: "payment-packages", element: <PaymentPackages /> },
          // { path: "payment-confirm", element: <PaymentConfirm /> },
        ],
      },

      // Owner layout routes
      {
        path: "/owner",
        element: (
          <ProtectedRoute allowedRoles={["CHU_CUA_HANG"]}>
            <OwnerLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <OwnerDashboard /> },
          // { path: "bookings", element: <OwnerBookings /> },
          { path: "employees", element: <EmployeeManagement /> },
          { path: "services", element: <OwnerServiceManagement /> },
          // { path: "schedule", element: <Schedule /> },
          // { path: "statistics", element: <Statistics /> },
          // { path: "payments", element: <OwnerPayments /> },
          { path: "settings", element: <ShopSettings /> },
        ],
      },

      // Staff layout routes
      {
        path: "/staff",
        element: (
          <ProtectedRoute allowedRoles={["LE_TAN", "KY_THUAT_VIEN"]}>
            <StaffLayout />
          </ProtectedRoute>
        ),
        children: [
          // { path: "schedule", element: <StaffSchedule /> },
          // { path: "bookings", element: <StaffBookings /> },
          // { path: "customers", element: <Customers /> },
        ],
      },

      // Auth routes
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      // 404
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
