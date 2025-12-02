import { RouterProvider } from "react-router-dom";
import router from "./routes/index";
import { AuthProvider } from "./contexts/AuthContext"; // Context cho auth

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
