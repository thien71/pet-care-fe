// src/components/staff/StaffBookingCard.jsx (FIXED)
import { FaUser, FaCalendarAlt, FaPaw, FaMoneyBillWave, FaUserTie, FaEye, FaCheckCircle, FaUserCog, FaWallet } from "react-icons/fa";

const StaffBookingCard = ({ booking, onViewDetail, onConfirm, onAssign, onConfirmPayment }) => {
  // ⭐ Kiểm tra xem có đang chờ thanh toán không
  const isWaitingPayment = booking.trangThai === "HOAN_THANH" && booking.trangThaiThanhToan === "CHUA_THANH_TOAN";

  const getStatusBadge = () => {
    // ⭐ Ưu tiên hiển thị trạng thái thanh toán nếu đang chờ thanh toán
    if (isWaitingPayment) {
      return (
        <span className="inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
          <FaWallet />
          Chờ thanh toán
        </span>
      );
    }

    const config = {
      CHO_XAC_NHAN: { text: "Chờ xác nhận", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      DA_XAC_NHAN: { text: "Đã xác nhận", class: "bg-blue-100 text-blue-700 border-blue-200" },
      DANG_THUC_HIEN: { text: "Đang thực hiện", class: "bg-purple-100 text-purple-700 border-purple-200" },
      HOAN_THANH: { text: "Hoàn thành", class: "bg-green-100 text-green-700 border-green-200" },
      HUY: { text: "Đã hủy", class: "bg-red-100 text-red-700 border-red-200" },
    };
    const cfg = config[booking.trangThai] || config.CHO_XAC_NHAN;
    return <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${cfg.class}`}>{cfg.text}</span>;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800">#{booking.maLichHen}</h3>
          {getStatusBadge()}
        </div>

        {/* Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <FaUser className="text-gray-400 mt-1 shrink-0" />
            <div>
              <p className="font-medium text-gray-800">{booking.KhachHang?.hoTen}</p>
              <p className="text-xs text-gray-500">{booking.KhachHang?.soDienThoai}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700">{new Date(booking.ngayHen).toLocaleString("vi-VN")}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaPaw className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700">{booking.LichHenThuCungs?.length || 0} thú cưng</span>
          </div>

          {booking.NhanVien && (
            <div className="flex items-center gap-3">
              <FaUserTie className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700">{booking.NhanVien.hoTen}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-gray-400 shrink-0" />
            <span className="text-sm font-bold text-[#8e2800]">{parseInt(booking.tongTien).toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onViewDetail(booking)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <FaEye />
            Chi tiết
          </button>

          {booking.trangThai === "CHO_XAC_NHAN" && (
            <button
              onClick={() => onConfirm(booking.maLichHen)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaCheckCircle />
              Xác nhận
            </button>
          )}

          {(booking.trangThai === "DA_XAC_NHAN" || booking.trangThai === "DANG_THUC_HIEN") && (
            <button
              onClick={() => onAssign(booking)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaUserCog />
              Gán KTV
            </button>
          )}

          {/* ⭐ Nút xác nhận thanh toán chỉ hiện khi chờ thanh toán */}
          {isWaitingPayment && (
            <button
              onClick={() => onConfirmPayment(booking)}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaMoneyBillWave />
              Xác nhận thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffBookingCard;
