// src/pages/auth/ResetPassword.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [state, setState] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    loading: false,
    error: "",
    success: false,
    validating: true,
    tokenValid: false,
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setState((prev) => ({
          ...prev,
          validating: false,
          error: "Token không hợp lệ",
        }));
        return;
      }

      // In real app, validate token with backend
      // For now, just assume valid
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          validating: false,
          tokenValid: true,
        }));
      }, 1000);
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: "" }));

    // Validation
    if (!state.password || !state.confirmPassword) {
      setState((prev) => ({
        ...prev,
        error: "Vui lòng điền đầy đủ thông tin",
      }));
      return;
    }

    if (state.password.length < 6) {
      setState((prev) => ({
        ...prev,
        error: "Mật khẩu phải có ít nhất 6 ký tự",
      }));
      return;
    }

    if (state.password !== state.confirmPassword) {
      setState((prev) => ({ ...prev, error: "Mật khẩu xác nhận không khớp" }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      await resetPassword(token, state.password);
      setState((prev) => ({ ...prev, loading: false, success: true }));

      // Redirect to login after 3s
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
      }));
    }
  };

  if (state.validating) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#8e2800] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8e2800] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8e2800] opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {!state.tokenValid ? (
            /* Invalid Token State */
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Token Không Hợp Lệ
              </h2>
              <p className="text-gray-600 mb-6">
                Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Yêu Cầu Link Mới
              </Link>
            </div>
          ) : !state.success ? (
            <>
              {/* Reset Form */}
              <div className="bg-linear-to-r from-[#8e2800] to-[#c43a0e] p-8 text-white text-center">
                <div className="text-5xl mb-3">🔑</div>
                <h1 className="text-3xl font-bold mb-2">Đặt Lại Mật Khẩu</h1>
                <p className="text-white/90">Tạo mật khẩu mới cho tài khoản</p>
              </div>

              <div className="p-8">
                {/* Alert */}
                {state.error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {state.error}
                  </div>
                )}

                {/* Password Requirements */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    Yêu cầu mật khẩu:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          state.password.length >= 6
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        {state.password.length >= 6 ? "✓" : "○"}
                      </span>
                      Tối thiểu 6 ký tự
                    </li>
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          state.password &&
                          state.confirmPassword &&
                          state.password === state.confirmPassword
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        {state.password &&
                        state.confirmPassword &&
                        state.password === state.confirmPassword
                          ? "✓"
                          : "○"}
                      </span>
                      Mật khẩu xác nhận khớp
                    </li>
                  </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={state.showPassword ? "text" : "password"}
                        value={state.password}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                        placeholder="••••••••"
                        disabled={state.loading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            showPassword: !prev.showPassword,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {state.showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type={state.showPassword ? "text" : "password"}
                      value={state.confirmPassword}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                      placeholder="••••••••"
                      disabled={state.loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={state.loading}
                    className="w-full bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {state.loading ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Đặt Lại Mật Khẩu Thành Công!
              </h2>
              <p className="text-gray-600 mb-6">
                Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật
                khẩu mới ngay bây giờ.
              </p>
              <Link
                to="/login"
                className="inline-block bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Đăng Nhập Ngay
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-sm mt-6">
          © 2024 Pet Care Da Nang. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
