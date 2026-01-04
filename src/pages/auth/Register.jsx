// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import EmailVerificationModal from "../../components/auth/EmailVerificationModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "@/components/common/Logo";

const Register = () => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    matKhau: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.hoTen.trim()) {
      setError("Vui lòng nhập họ và tên");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }

    if (formData.matKhau.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (formData.matKhau !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);

      setRegisteredEmail(formData.email);
      setShowVerificationModal(true);

      setFormData({
        hoTen: "",
        email: "",
        matKhau: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left - Image/Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#8e2800] to-[#c43a0e] items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="text-8xl mb-6">
            <Logo className="border border-white rounded-full" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Pet Care Da Nang</h1>
          <p className="text-xl text-white/90">
            Gia nhập và nhận những dịch vụ tốt nhất
          </p>
        </div>
      </div>

      {/* Right - Register Form */}
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
              Tạo Tài Khoản Mới
            </h2>
            <p className="text-gray-600 text-sm mb-6">Đăng ký để bắt đầu</p>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Họ tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="hoTen"
                  value={formData.hoTen}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8e2800] transition"
                  placeholder="Nhập họ tên"
                  required
                  disabled={loading}
                />
              </div>

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
                    minLength={6}
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
                <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8e2800] transition"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8e2800] text-white py-2.5 rounded-lg font-semibold hover:bg-[#6b2000] transition disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Đăng Ký"}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-[#8e2800] font-semibold hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EmailVerificationModal
        isOpen={showVerificationModal}
        email={registeredEmail}
        onClose={() => setShowVerificationModal(false)}
      />
    </div>
  );
};

export default Register;
