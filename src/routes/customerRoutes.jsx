// src/routes/customerRoutes.jsx
import ProtectedRoute from "../components/common/ProtectedRoute";

// Customer Pages
import RegisterShop from "../pages/customer/RegisterShop";
import BookingPage from "../pages/customer/BookingPage";
import BookingHistory from "../pages/customer/BookingHistory";

export const customerRoutes = [
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
];
