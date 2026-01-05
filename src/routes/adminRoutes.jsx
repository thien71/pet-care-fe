// src/routes/adminRoutes.jsx
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import PetTypeManagement from "@/pages/admin/PetTypeManagement";
import ServiceManagement from "@/pages/admin/ServiceManagement";
import ShopApproval from "@/pages/admin/ShopApproval";
import ShopManagement from "@/pages/admin/ShopManagement";
import ServiceProposals from "@/pages/admin/ServiceProposals";
import PaymentPackages from "@/pages/admin/PaymentPackages";
import PaymentConfirm from "@/pages/admin/PaymentConfirm";
import ProfileContent from "@/components/profile/ProfileContent";

export const adminRoutes = {
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
    { path: "shops", element: <ShopManagement /> },
    { path: "shop-approvals", element: <ShopApproval /> },
    { path: "service-proposals", element: <ServiceProposals /> },
    { path: "payment-packages", element: <PaymentPackages /> },
    { path: "payment-confirm", element: <PaymentConfirm /> },
    { path: "profile", element: <ProfileContent /> },
  ],
};
