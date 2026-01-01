// src/routes/index.jsx - UPDATED VERSION
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import MainLayout from "../layouts/MainLayout";
import NotFoundPage from "../pages/public/NotFound";

// Import các route modules
import { authRoutes } from "./authRoutes";
import { adminRoutes } from "./adminRoutes";
import { ownerRoutes } from "./ownerRoutes";
import { staffRoutes } from "./staffRoutes";
import { technicianRoutes } from "./technicianRoutes";
import { customerRoutes } from "./customerRoutes";
import { publicRoutes } from "./publicRoutes";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Main layout routes (Public + Customer)
      {
        path: "/",
        element: <MainLayout />,
        children: [...publicRoutes, ...customerRoutes],
      },

      // Admin routes
      adminRoutes,

      // Owner routes
      ownerRoutes,

      // Staff routes
      staffRoutes,

      // Technician routes
      technicianRoutes,

      // Auth routes
      ...authRoutes,

      // 404
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
