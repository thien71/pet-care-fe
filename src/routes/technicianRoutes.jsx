// src/routes/technicianRoutes.jsx
import TechnicianLayout from "@/layouts/TechnicianLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Technician Pages
import TechnicianDashboard from "@/pages/technician/TechnicianDashboard";
import TechnicianSchedule from "@/pages/technician/TechnicianSchedule";
import ProfileContent from "@/components/profile/ProfileContent";

export const technicianRoutes = {
  path: "/tech",
  element: (
    <ProtectedRoute allowedRoles={["KY_THUAT_VIEN"]}>
      <TechnicianLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: "dashboard", element: <TechnicianDashboard /> },
    { path: "schedule", element: <TechnicianSchedule /> },
    { path: "profile", element: <ProfileContent /> },
  ],
};
