// src/pages/auth/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (error) {
      setError(error.message || "Không thể gửi email. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8e2800] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8e2800] opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Link
          to="/login"
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
          <span>Quay lại đăng nhập</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {!success ? (
            <>
              {/* Header */}
              <div className="bg-linear-to-r from-[#8e2800] to-[#c43a0e] p-8 text-white text-center">
                <div className="text-5xl mb-3">🔐</div>
                <h1 className="text-3xl font-bold mb-2">Quên Mật Khẩu</h1>
                <p className="text-white/90">Nhập email để đặt lại mật khẩu</p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Alert */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Info Box */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">ℹ️ Lưu ý:</span> Chúng tôi
                    sẽ gửi link đặt lại mật khẩu đến email của bạn. Link này có
                    hiệu lực trong vòng 1 giờ.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                      placeholder="example@email.com"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Đang gửi..." : "Gửi Link Đặt Lại Mật Khẩu"}
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Email Đã Được Gửi!
              </h2>
              <p className="text-gray-600 mb-6">
                Chúng tôi đã gửi link đặt lại mật khẩu đến email:
              </p>
              <p className="text-[#8e2800] font-semibold text-lg mb-6">
                {email}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">⚠️ Quan trọng:</span> Kiểm tra
                  cả hộp thư spam nếu không thấy email trong vài phút.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Quay lại Đăng Nhập
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

export default ForgotPassword;
