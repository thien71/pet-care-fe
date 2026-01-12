import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/common/ScrollToTop";

const RootLayout = () => {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Outlet />
    </AuthProvider>
  );
};

export default RootLayout;
