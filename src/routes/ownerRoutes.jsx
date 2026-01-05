// src/routes/ownerRoutes.jsx
import OwnerLayout from "@/layouts/OwnerLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Owner Pages
import OwnerDashboard from "@/pages/owner/OwnerDashboard";
import EmployeeManagement from "@/pages/owner/EmployeeManagement";
import OwnerServiceManagement from "@/pages/owner/OwnerServiceManagement";
import ShopSettings from "@/pages/owner/ShopSettings";
import OwnerPayments from "@/pages/owner/OwnerPayments";
import OwnerSchedule from "@/pages/owner/OwnerSchedule";
import OwnerBookingManagement from "@/pages/owner/OwnerBookingManagement";
import ProfileContent from "@/components/profile/ProfileContent";

export const ownerRoutes = {
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
    { path: "payments", element: <OwnerPayments /> },
    { path: "bookings", element: <OwnerBookingManagement /> },
    { path: "profile", element: <ProfileContent /> },
  ],
};
