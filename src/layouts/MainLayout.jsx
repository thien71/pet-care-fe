import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
