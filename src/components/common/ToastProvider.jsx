// src/components/common/ToastProvider.jsx
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: "#fff",
          color: "#333",
          padding: "16px",
          borderRadius: "10px",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },

        // Success style
        success: {
          duration: 4000,
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #86efac",
          },
        },

        // Error style
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
          style: {
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fca5a5",
          },
        },

        // Loading style
        loading: {
          iconTheme: {
            primary: "#8e2800",
            secondary: "#fff",
          },
          style: {
            background: "#fff7ed",
            color: "#8e2800",
            border: "1px solid #fed7aa",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
