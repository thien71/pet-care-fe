import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastProvider from "@/components/common/ToastProvider";
import router from "@/routes/index";

function App() {
  return (
    <AuthProvider>
      <ToastProvider />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
