// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    matKhau: "",
    confirmPassword: "",
    soDienThoai: "",
    diaChi: "",
    maVaiTro: 1, // Mặc định là KHACH_HANG
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (formData.matKhau.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (formData.matKhau !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }
    if (!agreedToTerms) {
      setError("Vui lòng đồng ý với điều khoản dịch vụ");
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

      setSuccess(true);

      // Chuyển đến trang login sau 2s
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Success modal
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 px-4">
        <div className="card w-96 bg-base-100 shadow-2xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="card-title text-success">Đăng ký thành công!</h2>
            <p className="text-gray-600">
              Tài khoản của bạn đã được tạo. Đang chuyển đến trang đăng nhập...
            </p>
            <div className="mt-4">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🐾</div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Tạo Tài Khoản Mới
              </h1>
              <p className="text-gray-600">
                Gia nhập cộng đồng yêu thú cưng Đà Nẵng
              </p>
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
              {/* Grid 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Họ tên */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Họ và tên *</span>
                  </label>
                  <input
                    type="text"
                    name="hoTen"
                    placeholder="Nguyễn Văn A"
                    className="input input-bordered w-full"
                    value={formData.hoTen}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    className="input input-bordered w-full"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Số điện thoại */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Số điện thoại
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="soDienThoai"
                    placeholder="0123456789"
                    className="input input-bordered w-full"
                    value={formData.soDienThoai}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    disabled={loading}
                  />
                </div>

                {/* Địa chỉ */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Địa chỉ</span>
                  </label>
                  <input
                    type="text"
                    name="diaChi"
                    placeholder="Đà Nẵng"
                    className="input input-bordered w-full"
                    value={formData.diaChi}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Mật khẩu *</span>
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
                      minLength={6}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <label className="label">
                    <span className="label-text-alt">Tối thiểu 6 ký tự</span>
                  </label>
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Xác nhận mật khẩu *
                    </span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="input input-bordered w-full"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                  />
                  <span className="label-text">
                    Tôi đồng ý với{" "}
                    <a href="#" className="link link-primary">
                      Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a href="#" className="link link-primary">
                      Chính sách bảo mật
                    </a>
                  </span>
                </label>
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
                    <span>✨</span>
                    Đăng ký
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link to="/login" className="link link-primary font-medium">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
