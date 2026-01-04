// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "@/components/common/Logo";
import { showToast } from "@/utils/toast";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    matKhau: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Hiển thị toast message từ navigation state
  useEffect(() => {
    if (location.state?.message) {
      showToast.success(location.state.message);
      // Clear state để không hiển thị lại khi refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
      const response = await login(formData.email, formData.matKhau);

      if (!response.user.emailVerified) {
        setError("Vui lòng xác thực email trước khi đăng nhập");
        setLoading(false);
        return;
      }

      const roles = response.user.VaiTros?.map((vt) => vt.tenVaiTro) || [];

      // Delay một chút để user thấy toast
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
      }, 0);
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
      showToast.error(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    const loadingToast = showToast.loading("Đang đăng nhập bằng Google...");

    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const googleProfile = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      };

      const response = await loginWithGoogle(googleProfile);

      showToast.dismiss(loadingToast);
      showToast.success(`Đăng nhập thành công!`);

      const roles = response.user.VaiTros?.map((vt) => vt.tenVaiTro) || [];

      setTimeout(() => {
        if (roles.includes("QUAN_TRI_VIEN")) {
          navigate("/admin/dashboard");
        } else if (roles.includes("CHU_CUA_HANG")) {
          navigate("/owner/dashboard");
        } else {
          navigate("/");
        }
      }, 500);
    } catch (err) {
      showToast.dismiss(loadingToast);
      setError(err.message || "Đăng nhập Google thất bại");
      showToast.error(err.message || "Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <div className="min-h-screen bg-white flex">
        {/* Left - Image/Banner */}
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#8e2800] to-[#c43a0e] items-center justify-center p-8">
          <div className="text-center text-white max-w-md">
            <div className="text-8xl mb-6">
              <Logo className="border border-white rounded-full" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Pet Care Da Nang</h1>
            <p className="text-xl text-white/90">Chăm sóc thú cưng của bạn</p>
          </div>
        </div>

        {/* Right - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="text-5xl mb-3">
                <Logo className="border border-white rounded-full" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Pet Care Da Nang
              </h1>
            </div>

            {/* Form Container */}
            <div className="bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Chào Mừng Trở Lại
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Đăng nhập để tiếp tục
              </p>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8e2800] transition"
                    placeholder="Nhập email của bạn"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="matKhau"
                      value={formData.matKhau}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8e2800] transition"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-[#8e2800]" />
                      ) : (
                        <FaEye className="text-[#8e2800]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-end text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-[#8e2800] hover:underline font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8e2800] text-white py-2.5 rounded-lg font-semibold hover:bg-[#6b2000] transition disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Đăng Nhập"}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-gray-500 text-sm">Hoặc</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Google Login */}
              {googleClientId ? (
                <div className="flex justify-center mb-6">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      showToast.error("Đăng nhập Google thất bại");
                    }}
                    size="large"
                    text="signin_with"
                    locale="vi"
                  />
                </div>
              ) : null}

              {/* Register Link */}
              <p className="text-center text-gray-600 text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-[#8e2800] font-semibold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
