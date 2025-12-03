// src/components/common/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, canAccess } = useAuth();

  // Đang load user từ localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> redirect login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (allowedRoles.length > 0 && !canAccess(allowedRoles)) {
    const userRole = user?.VaiTro?.tenVaiTro;

    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-2xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">⛔</div>
            <h2 className="card-title text-error text-2xl">
              Không có quyền truy cập
            </h2>
            <p className="text-gray-600">
              Bạn cần quyền <strong>{allowedRoles.join(", ")}</strong> để truy
              cập trang này.
            </p>
            <p className="text-sm text-gray-500">
              Quyền hiện tại: <span className="badge badge-sm">{userRole}</span>
            </p>
            <div className="card-actions mt-6">
              <button
                onClick={() => window.history.back()}
                className="btn btn-primary gap-2"
              >
                <span>⬅️</span>
                Quay lại
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="btn btn-ghost gap-2"
              >
                <span>🏠</span>
                Trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
