// src/components/auth/EmailVerificationModal.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/authApi";

const EmailVerificationModal = ({ isOpen, email, onClose }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 phút
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Refs cho các input OTP
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(180);
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setVerifySuccess(false);
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

  // Focus vào ô đầu tiên khi mở modal
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Xử lý thay đổi OTP
  const handleOtpChange = (index, value) => {
    // Chỉ cho phép nhập số
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto focus sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit khi nhập đủ 6 số
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleVerify(newOtp.join(""));
    }
  };

  // Xử lý phím
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Nếu ô hiện tại rỗng, focus về ô trước
        inputRefs.current[index - 1]?.focus();
      } else {
        // Xóa ô hiện tại
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Xử lý paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Chỉ chấp nhận 6 số
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();

      // Auto submit
      handleVerify(pastedData);
    }
  };

  // Xác thực OTP
  const handleVerify = async (otpCode = null) => {
    const otpValue = otpCode || otp.join("");

    if (otpValue.length !== 6) {
      setError("Vui lòng nhập đủ 6 số");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.verifyOTP(email, otpValue);
      setVerifySuccess(true);

      // Chuyển sang trang login sau 2 giây
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Xác thực thành công! Vui lòng đăng nhập." },
        });
      }, 2000);
    } catch (err) {
      setError(err.message || "Mã OTP không đúng");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại OTP
  const handleResend = async () => {
    setLoading(true);
    setError("");
    setResendSuccess(false);

    try {
      await authService.resendOTP(email);
      setTimeLeft(180);
      setOtp(["", "", "", "", "", ""]);
      setResendSuccess(true);
      inputRefs.current[0]?.focus();

      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Không thể gửi lại mã OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const canResend = timeLeft === 0 && !loading;

  // Success State
  if (verifySuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          <div className="p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Xác Thực Thành Công!
            </h2>
            <p className="text-gray-600 mb-4">
              Tài khoản của bạn đã được kích hoạt
            </p>
            <p className="text-sm text-gray-500">
              Đang chuyển đến trang đăng nhập...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-[#8e2800] to-[#c43a0e] p-6 text-white text-center">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-xl font-bold">Xác Thực Email</h2>
          <p className="text-sm text-white/90 mt-1">
            Nhập mã OTP đã được gửi đến email
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Email */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-1">Mã đã được gửi đến</p>
            <p className="text-sm font-semibold text-[#8e2800]">{email}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Success */}
          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
              ✅ Mã OTP mới đã được gửi
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Nhập mã OTP (6 số)
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#8e2800] focus:ring-2 focus:ring-[#8e2800]/20 outline-none transition disabled:bg-gray-100"
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-xs mb-2">
              {timeLeft === 0 ? "Mã OTP đã hết hạn" : "Mã OTP sẽ hết hạn sau:"}
            </p>
            <div
              className={`text-3xl font-bold font-mono ${
                timeLeft <= 30 ? "text-red-600" : "text-[#8e2800]"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {/* Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={loading || otp.some((d) => !d)}
              className={`w-full font-semibold py-2.5 rounded-lg transition ${
                loading || otp.some((d) => !d)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#8e2800] text-white hover:bg-[#6b2000]"
              }`}
            >
              {loading ? "Đang xác thực..." : "Xác Thực"}
            </button>

            {/* Resend Button */}
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`w-full font-semibold py-2.5 rounded-lg transition ${
                canResend
                  ? "bg-white border-2 border-[#8e2800] text-[#8e2800] hover:bg-[#8e2800] hover:text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Đang gửi..." : "Gửi Lại Mã OTP"}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition"
            >
              Đóng
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Không nhận được mã? Kiểm tra hộp thư spam hoặc gửi lại mã sau khi
            hết giờ
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
