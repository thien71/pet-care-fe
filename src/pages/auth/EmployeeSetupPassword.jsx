// src/pages/auth/EmployeeSetupPassword.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";

const EmployeeSetupPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setValidating(false);
      return;
    }
    // Simulate token validation
    setTimeout(() => {
      setValidating(false);
      setTokenValid(true);
    }, 1000);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      showToast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    const loadingToast = showToast.loading("Đang thiết lập mật khẩu...");

    try {
      await authService.resetPassword(token, formData.password);
      showToast.dismiss(loadingToast);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Thiết lập tài khoản thành công! Vui lòng đăng nhập" },
        });
      }, 2000);
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Không thể thiết lập mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#8e2800] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Link Không Hợp Lệ</h2>
          <p className="text-gray-600 mb-6">
            Link thiết lập tài khoản không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ quản lý để được hỗ trợ.
          </p>
          <Link to="/login" className="inline-block bg-[#8e2800] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6b2000]">
            Về Trang Đăng Nhập
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thiết Lập Thành Công!</h2>
          <p className="text-gray-600 mb-4">Tài khoản của bạn đã được kích hoạt. Đang chuyển đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="bg-[#8e2800] p-8 text-white text-center rounded-t-xl">
            <div className="text-5xl mb-3">🔑</div>
            <h1 className="text-2xl font-bold mb-2">Thiết Lập Mật Khẩu</h1>
            <p className="text-white/90">Tạo mật khẩu cho tài khoản nhân viên</p>
          </div>

          <div className="p-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-2">Yêu cầu mật khẩu:</p>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <span className={formData.password.length >= 6 ? "text-green-600" : "text-gray-400"}>
                    {formData.password.length >= 6 ? "✓" : "○"}
                  </span>
                  <span>Tối thiểu 6 ký tự</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword ? "✓" : "○"}
                  </span>
                  <span>Mật khẩu xác nhận khớp</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8e2800]"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8e2800]"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8e2800] text-white py-2.5 rounded-lg font-semibold hover:bg-[#6b2000] disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Thiết Lập Mật Khẩu"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSetupPassword;
