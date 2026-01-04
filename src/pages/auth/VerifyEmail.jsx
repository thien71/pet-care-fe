// src/pages/auth/VerifyEmail.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();

  const [state, setState] = useState({
    verifying: true,
    success: false,
    error: "",
    resending: false,
    resendSuccess: false,
    email: "",
  });

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setState((prev) => ({
          ...prev,
          verifying: false,
          error: "Token không hợp lệ. Vui lòng kiểm tra link trong email.",
        }));
        return;
      }

      try {
        await verifyEmail(token);
        setState((prev) => ({
          ...prev,
          verifying: false,
          success: true,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          verifying: false,
          error: error.message || "Token đã hết hạn hoặc không hợp lệ",
        }));
      }
    };

    verify();
  }, [token, verifyEmail]);

  const handleResend = async () => {
    if (!state.email) {
      setState((prev) => ({ ...prev, error: "Vui lòng nhập email" }));
      return;
    }

    setState((prev) => ({ ...prev, resending: true, resendSuccess: false }));

    try {
      await resendVerification(state.email);
      setState((prev) => ({
        ...prev,
        resending: false,
        resendSuccess: true,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        resending: false,
        error: error.message || "Không thể gửi lại email",
      }));
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
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {state.verifying ? (
            /* Verifying State */
            <div className="p-12 text-center">
              <div className="text-6xl mb-6">📧</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Đang Xác Thực Email
              </h2>
              <p className="text-gray-600 mb-6">
                Vui lòng chờ trong giây lát...
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[#8e2800] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-[#8e2800] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#8e2800] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          ) : state.success ? (
            /* Success State */
            <div className="p-8 text-center">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-6xl">✅</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Xác Thực Thành Công!
              </h2>
              <p className="text-gray-600 mb-6">
                Email của bạn đã được xác thực. Bây giờ bạn có thể đăng nhập và
                sử dụng đầy đủ các tính năng.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">🎉 Chúc mừng!</span> Tài khoản
                  của bạn đã được kích hoạt.
                </p>
              </div>

              <Link
                to="/login"
                className="inline-block bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Đăng Nhập Ngay
              </Link>
            </div>
          ) : (
            /* Error State */
            <div className="p-8 text-center">
              <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-6xl">❌</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Xác Thực Thất Bại
              </h2>
              <p className="text-gray-600 mb-6">{state.error}</p>

              {state.resendSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800">
                    ✅ Email xác thực mới đã được gửi! Vui lòng kiểm tra hộp
                    thư.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">💡 Gợi ý:</span> Link xác
                    thực có thể đã hết hạn. Bạn có thể yêu cầu gửi lại email xác
                    thực.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={state.email}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="Nhập email của bạn"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition"
                    disabled={state.resending}
                  />
                </div>
                <button
                  onClick={handleResend}
                  disabled={state.resending}
                  className="w-full bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {state.resending ? "Đang gửi..." : "Gửi Lại Email Xác Thực"}
                </button>
                <Link
                  to="/login"
                  className="block text-center text-gray-600 hover:text-[#8e2800] transition"
                >
                  Quay lại Đăng Nhập
                </Link>
              </div>
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

export default VerifyEmail;
