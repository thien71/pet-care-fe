// src/routes/staffRoutes.jsx
import StaffLayout from "../layouts/StaffLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Staff Pages
import StaffBookingManagement from "../pages/staff/StaffBookingManagement";
import StaffSchedule from "../pages/staff/StaffSchedule";

export const staffRoutes = {
  path: "/staff",
  element: (
    <ProtectedRoute allowedRoles={["LE_TAN"]}>
      <StaffLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: "dashboard", element: <StaffBookingManagement /> },
    { path: "schedule", element: <StaffSchedule /> },
  ],
};
