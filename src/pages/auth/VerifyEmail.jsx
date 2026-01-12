// src/pages/auth/VerifyEmail.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  const [state, setState] = useState({
    verifying: true,
    success: false,
    error: "",
  });

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setState({
          verifying: false,
          success: false,
          error: "Token không hợp lệ",
        });
        return;
      }

      try {
        console.log("🔐 Verifying email with token...");
        await verifyEmail(token);

        console.log("✅ Email verified!");

        setState({
          verifying: false,
          success: true,
          error: "",
        });

        // Auto redirect sau 2 giây
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (error) {
        console.error("❌ Verify error:", error);
        setState({
          verifying: false,
          success: false,
          error: error.message || "Token không hợp lệ hoặc đã hết hạn",
        });
      }
    };

    verify();
  }, [token, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        {state.verifying ? (
          <>
            {/* Spinner */}
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#8e2800] rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang Xác Thực Email</h2>
            <p className="text-gray-600">Vui lòng chờ...</p>
          </>
        ) : state.success ? (
          <>
            {/* Success */}
            <div className="mb-6">
              <div className="text-6xl">✅</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác Thực Thành Công!</h2>
            <p className="text-gray-600 mb-4">Bạn sẽ được chuyển hướng tới trang chủ...</p>
          </>
        ) : (
          <>
            {/* Error */}
            <div className="mb-6">
              <div className="text-6xl">❌</div>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Xác Thực Thất Bại</h2>
            <p className="text-gray-600 mb-4">{state.error}</p>
            <a
              href="/login"
              className="inline-block bg-[#8e2800] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#6b2000] transition"
            >
              Quay Lại Đăng Nhập
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
