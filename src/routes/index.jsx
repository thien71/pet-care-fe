import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/Home";
import Profile from "../pages/user/Profile";
import MainLayout from "../layouts/MainLayout";

const ProtectedRoute = ({ roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <ProtectedRoute roles={["KHACH_HANG"]} />,
        children: [{ path: "profile", element: <Profile /> }],
      },
      // Thêm routes cho admin, owner sau: roles={['QUAN_TRI_VIEN']}
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

export default router;
