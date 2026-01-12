// src/components/owner/ConfirmPaymentModal.jsx
import { FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const ConfirmPaymentModal = ({ booking, onConfirm, onClose, loading }) => {
  if (!booking) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <FaMoneyBillWave className="text-green-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Xác Nhận Thanh Toán</h3>
              <p className="text-sm text-gray-600 mt-1">Xác nhận khách hàng đã thanh toán tại quầy</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Đơn hàng:</span>
                <span className="font-bold text-gray-800">#{booking.maLichHen}</span>
              </div>

              {booking.KhachHang && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-medium text-gray-800">{booking.KhachHang.hoTen}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-gray-300">
                <span className="text-gray-700 font-medium">Tổng tiền:</span>
                <span className="text-2xl font-bold text-[#8e2800]">{parseInt(booking.tongTien).toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Chỉ xác nhận khi khách hàng đã thanh toán đầy đủ số tiền tại quầy.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Đang xử lý..."
              ) : (
                <>
                  <FaCheckCircle />
                  Xác Nhận Đã Thanh Toán
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPaymentModal;
