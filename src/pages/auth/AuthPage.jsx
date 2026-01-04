// src/pages/auth/AuthPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../contexts/AuthContext";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";

  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({ email: "", matKhau: "" });
  const [registerData, setRegisterData] = useState({
    hoTen: "",
    email: "",
    matKhau: "",
    confirmPassword: "",
  });

  // Reset form khi chuyển mode
  useEffect(() => {
    setError("");
    setSuccess("");
    setLoginData({ email: "", matKhau: "" });
    setRegisterData({ hoTen: "", email: "", matKhau: "", confirmPassword: "" });
  }, [mode]);

  // Toggle between login/register
  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(loginData.email, loginData.matKhau);

      if (response.warning) {
        setSuccess(response.warning);
      }

      // Redirect based on role
      const roles = response.user.VaiTros?.map((vt) => vt.tenVaiTro) || [];
      setTimeout(() => {
        if (roles.includes("QUAN_TRI_VIEN")) {
          navigate("/admin/dashboard");
        } else if (roles.includes("CHU_CUA_HANG")) {
          navigate("/owner/dashboard");
        } else if (roles.includes("LE_TAN")) {
          navigate("/staff/dashboard");
        } else if (roles.includes("KY_THUAT_VIEN")) {
          navigate("/tech/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (registerData.matKhau !== registerData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (registerData.matKhau.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = registerData;
      const response = await register(data);

      setSuccess(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );

      // Clear form và chuyển sang login sau 3s
      setTimeout(() => {
        setMode("login");
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const googleProfile = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      };

      const response = await loginWithGoogle(googleProfile);

      // Redirect based on role
      const roles = response.user.VaiTros?.map((vt) => vt.tenVaiTro) || [];
      if (roles.includes("QUAN_TRI_VIEN")) {
        navigate("/admin/dashboard");
      } else if (roles.includes("CHU_CUA_HANG")) {
        navigate("/owner/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8e2800] opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8e2800] opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-md">
          {/* Back to Home Button */}
          <Link
            to="/"
            className="absolute -top-16 left-0 flex items-center gap-2 text-white hover:text-[#8e2800] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Về trang chủ</span>
          </Link>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-[#8e2800] to-[#c43a0e] p-8 text-white text-center">
              <div className="text-5xl mb-3">🐾</div>
              <h1 className="text-3xl font-bold mb-2">Pet Care Da Nang</h1>
              <p className="text-white/90">
                {mode === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Alerts */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Login Form */}
              {mode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                      placeholder="example@email.com"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginData.matKhau}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            matKhau: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-600">Ghi nhớ đăng nhập</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[#8e2800] hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Đang xử lý..." : "Đăng nhập"}
                  </button>
                </form>
              )}

              {/* Register Form */}
              {mode === "register" && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={registerData.hoTen}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          hoTen: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                      placeholder="Nguyễn Văn A"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                      placeholder="example@email.com"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerData.matKhau}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          matKhau: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                      placeholder="••••••••"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tối thiểu 6 ký tự
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Đang xử lý..." : "Đăng ký"}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">HOẶC</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                {googleClientId ? (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Đăng nhập Google thất bại")}
                    size="large"
                    text={mode === "login" ? "signin_with" : "signup_with"}
                    locale="vi"
                  />
                ) : (
                  <div className="text-sm text-gray-500">
                    Google Login chưa được cấu hình
                  </div>
                )}
              </div>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-[#8e2800] font-semibold hover:underline"
                  >
                    {mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white/70 text-sm mt-6">
            © 2024 Pet Care Da Nang. Made with ❤️
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthPage;
