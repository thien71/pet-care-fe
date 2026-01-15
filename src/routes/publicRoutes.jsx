// src/routes/publicRoutes.jsx
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Public Pages
import ProtectedHomePage from "@/pages/home/ProtectedHomePage";
import ShopServiceDetail from "@/pages/services/ShopServiceDetail";
import ServiceDetail from "@/pages/services/ServiceDetail";
import SearchResults from "@/pages/search/SearchResults";
import Profile from "@/pages/customer/Profile";
import ShopList from "@/pages/shop/ShopList";
import ShopDetail from "@/pages/shop/ShopDetail";

export const publicRoutes = [
  {
    index: true,
    element: <ProtectedHomePage />,
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
    path: "shops",
    element: <ShopList />,
  },
  {
    path: "shop/:shopId",
    element: <ShopDetail />,
  },
  {
    path: "profile",
    element: <ProtectedRoute>{<Profile />}</ProtectedRoute>,
  },
];
