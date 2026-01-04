// src/components/auth/EmailVerificationModal.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const EmailVerificationModal = ({ isOpen, email, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 phút
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const { resendVerification } = useAuth();

  // Countdown timer - Auto close sau 3 phút
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(180);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setResendSuccess(false);

    try {
      await resendVerification(email);
      setTimeLeft(180);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Không thể gửi lại email");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ✅ Nút gửi lại bị khoá cho đến khi countdown = 0 (hoặc đang loading)
  const canResend = timeLeft === 0 && !loading;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-[#8e2800] to-[#c43a0e] p-6 text-white text-center">
          <div className="text-4xl mb-3">📧</div>
          <h2 className="text-xl font-bold">Xác Thực Email</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Thông báo chính */}
          <div className="text-center mb-6">
            <p className="text-gray-700 text-sm mb-2">
              Vui lòng kiểm tra email để xác thực
            </p>
            <p className="text-sm text-gray-600">{email}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              ✅ Email đã được gửi lại
            </div>
          )}

          {/* Timer */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-xs mb-2">
              {timeLeft === 0
                ? "Bạn có thể gửi lại email"
                : "Gửi lại email sau:"}
            </p>
            <div className="text-3xl font-bold text-[#8e2800] font-mono">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {/* Resend Button - Disable nếu còn countdown hoặc đang loading */}
            <button
              onClick={handleResend}
              disabled={!canResend || loading}
              className={`w-full font-semibold py-2.5 rounded-lg transition ${
                canResend
                  ? "bg-[#8e2800] text-white hover:bg-[#6b2000]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Đang gửi..." : "Gửi Lại Email"}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
