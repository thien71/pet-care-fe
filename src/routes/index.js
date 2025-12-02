import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../pages/home/HomePage";
import Login from "../pages/auth/Login";
// ... import các pages khác

import { useAuth } from "../hooks/useAuth"; // Hook check role

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> }, // Xem cửa hàng, dịch vụ
      {
        path: "customer/booking",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.KHACH_HANG]}>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      // Customer routes: history, profile, register-shop
      {
        path: "customer/history",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.KHACH_HANG]}>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      // Staff routes: schedule, update-status
      {
        path: "staff/schedule",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.LE_TAN, ROLES.KY_THUAT_VIEN]}>
            <SchedulePage />
          </ProtectedRoute>
        ),
      },
      // Owner routes: dashboard, employees, payments
      {
        path: "owner/dashboard",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.CHU_CUA_HANG]}>
            <ShopDashboard />
          </ProtectedRoute>
        ),
      },
      // Admin routes: users, approve, services
      {
        path: "admin/users",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.QUAN_TRI_VIEN]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default router;
