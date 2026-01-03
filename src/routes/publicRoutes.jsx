// src/routes/publicRoutes.jsx
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Public Pages
import HomePage from "@/pages/home/HomePage";
import ShopServiceDetail from "@/pages/services/ShopServiceDetail";
import ServiceDetail from "@/pages/services/ServiceDetail";
import SearchResults from "@/pages/search/SearchResults";

export const publicRoutes = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "search",
    element: <SearchResults />,
  },
  {
    path: "service/:serviceId",
    element: <ShopServiceDetail />,
  },
  {
    path: "services/:serviceId",
    element: <ServiceDetail />,
  },
  {
    path: "profile",
    element: <ProtectedRoute>{/* <ProfilePage /> */}</ProtectedRoute>,
  },
  {
    path: "settings",
    element: <ProtectedRoute>{/* <SettingsPage /> */}</ProtectedRoute>,
  },
];
