// src/components/auth/EmailVerificationModal.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const EmailVerificationModal = ({
  isOpen,
  email,
  onClose,
  onVerifySuccess,
}) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 phút = 180 giây
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { resendVerification } = useAuth();

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");

    try {
      await resendVerification(email);
      // Reset timer
      setTimeLeft(180);
    } catch (err) {
      setError(err.message || "Không thể gửi lại email");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-500 to-blue-600 p-8 text-white text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold">Xác Thực Email</h2>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-2">
              Chúng tôi đã gửi email xác thực đến:
            </p>
            <p className="text-lg font-semibold text-blue-600">{email}</p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <div className="text-2xl shrink-0">1️⃣</div>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Kiểm tra email của bạn</p>
                <p>Bao gồm cả thư mục Spam nếu không thấy</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <div className="text-2xl shrink-0">2️⃣</div>
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">Click link xác thực</p>
                <p>Bạn sẽ được tự động đăng nhập</p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Timer */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Modal sẽ đóng trong</p>
            <div className="text-3xl font-bold text-blue-600 font-mono">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Resend Button */}
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mb-3"
          >
            {loading ? "Đang gửi..." : "Gửi Lại Email"}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
          >
            Đóng
          </button>
        </div>

        {/* Footer Tips */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-600 border-t">
          <p>💡 Sau khi click link xác thực, bạn sẽ được tự động đăng nhập</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
