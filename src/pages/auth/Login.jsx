// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    matKhau: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.matKhau);
    } catch (err) {
      setError(
        err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick login for testing
  const quickLogin = async (email, password) => {
    setFormData({ email, matKhau: password });
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            {/* Logo & Title */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🐾</div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Pet Care Da Nang
              </h1>
              <p className="text-gray-600">Đăng nhập vào hệ thống</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    className="input input-bordered w-full pr-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    📧
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Mật khẩu</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="matKhau"
                    placeholder="••••••••"
                    className="input input-bordered w-full pr-12"
                    value={formData.matKhau}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="label-text">Ghi nhớ đăng nhập</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="link link-primary text-sm"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span>🔐</span>
                    Đăng nhập
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">HOẶC</div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="link link-primary font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {/* Quick Login - FOR TESTING */}
            <div className="mt-4 p-4 bg-base-200 rounded-lg">
              <details className="collapse collapse-arrow">
                <summary className="collapse-title text-xs font-medium text-gray-600 min-h-0 py-2">
                  🧪 Tài khoản test (click để xem)
                </summary>
                <div className="collapse-content">
                  <div className="space-y-2 text-xs">
                    <button
                      onClick={() =>
                        quickLogin("customer@petcare.com", "cust123")
                      }
                      className="btn btn-xs btn-ghost w-full justify-start"
                      disabled={loading}
                    >
                      👤 Khách hàng: customer@petcare.com
                    </button>
                    <button
                      onClick={() =>
                        quickLogin("admin@petcare.com", "admin123")
                      }
                      className="btn btn-xs btn-ghost w-full justify-start"
                      disabled={loading}
                    >
                      👨‍💼 Admin: admin@petcare.com
                    </button>
                    <button
                      onClick={() =>
                        quickLogin("owner@petcare.com", "owner123")
                      }
                      className="btn btn-xs btn-ghost w-full justify-start"
                      disabled={loading}
                    >
                      🏪 Chủ shop: owner@petcare.com
                    </button>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            © 2024 Pet Care Da Nang. Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
