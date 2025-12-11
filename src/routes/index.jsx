// src/routes/index.jsx (UPDATED)
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import StaffLayout from "../layouts/StaffLayout";
import TechnicianLayout from "../layouts/TechnicianLayout";
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
import ShopManagement from "../pages/admin/ShopManagement"; // ⭐ NEW
import ServiceProposals from "../pages/admin/ServiceProposals"; // ⭐ NEW
import PaymentPackages from "../pages/admin/PaymentPackages"; // ⭐ NEW
import PaymentConfirm from "../pages/admin/PaymentConfirm"; // ⭐ NEW

// Owner Pages
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import EmployeeManagement from "../pages/owner/EmployeeManagement";
import OwnerServiceManagement from "../pages/owner/OwnerServiceManagement";
import ShopSettings from "../pages/owner/ShopSettings";
import OwnerPayments from "../pages/owner/OwnerPayments"; // ⭐ NEW
import OwnerSchedule from "../pages/owner/OwnerSchedule";
import OwnerBookingManagement from "../pages/owner/OwnerBookingManagement"; // ⭐ NEW

// Customer Pages
import RegisterShop from "../pages/customer/RegisterShop";
import BookingPage from "../pages/customer/BookingPage"; // ⭐ NEW
import BookingHistory from "../pages/customer/BookingHistory"; // ⭐ NEW (sẽ tạo sau)

// Tech Pages
import TechnicianDashboard from "../pages/technician/TechnicianDashboard"; // ⭐ NEW

// Staff Pages
import StaffDashboard from "../pages/staff/StaffDashboard";

// Public Pages
import NotFoundPage from "../pages/public/NotFound";

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
                <BookingPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/history",
            element: (
              <ProtectedRoute allowedRoles={["KHACH_HANG"]}>
                <BookingHistory />
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
          { path: "pet-types", element: <PetTypeManagement /> },
          { path: "services", element: <ServiceManagement /> },
          { path: "shops", element: <ShopManagement /> }, // ⭐ NEW
          { path: "shop-approvals", element: <ShopApproval /> },
          { path: "service-proposals", element: <ServiceProposals /> }, // ⭐ NEW
          { path: "payment-packages", element: <PaymentPackages /> }, // ⭐ NEW
          { path: "payment-confirm", element: <PaymentConfirm /> }, // ⭐ NEW
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
          { path: "employees", element: <EmployeeManagement /> },
          { path: "schedule", element: <OwnerSchedule /> },
          { path: "services", element: <OwnerServiceManagement /> },
          { path: "settings", element: <ShopSettings /> },
          { path: "payments", element: <OwnerPayments /> }, // ⭐ NEW
          { path: "bookings", element: <OwnerBookingManagement /> }, // ⭐ NEW
        ],
      },

      // ⭐ STAFF ROUTES - Riêng biệt
      {
        path: "/staff",
        element: (
          <ProtectedRoute allowedRoles={["LE_TAN"]}>
            <StaffLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <StaffDashboard /> },
          { path: "schedule", element: <OwnerSchedule /> }, // Xem lịch làm việc
        ],
      },

      // ⭐ TECHNICIAN ROUTES - Riêng biệt
      {
        path: "/tech",
        element: (
          <ProtectedRoute allowedRoles={["KY_THUAT_VIEN"]}>
            <TechnicianLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <TechnicianDashboard /> },
          { path: "schedule", element: <OwnerSchedule /> }, // Xem lịch làm việc
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
