// src/components/owner/ConfirmBookingModal.jsx
import { FaCheckCircle } from "react-icons/fa";

const ConfirmBookingModal = ({ booking, onConfirm, onClose, loading }) => {
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
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Xác Nhận Đơn</h3>
              <p className="text-sm text-gray-600 mt-1">Xác nhận đơn hàng từ khách hàng</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-gray-700">
              Bạn có muốn xác nhận đơn hàng <span className="font-bold text-gray-800">#{booking.maLichHen}</span> không?
            </p>
            {booking.KhachHang && <p className="text-sm text-gray-600 mt-2">Khách hàng: {booking.KhachHang.hoTen}</p>}
            <p className="text-sm text-gray-600">Tổng tiền: {parseInt(booking.tongTien).toLocaleString("vi-VN")}đ</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Đóng
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Xác Nhận"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookingModal;
