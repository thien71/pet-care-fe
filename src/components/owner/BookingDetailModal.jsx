// src/components/owner/BookingDetailModal.jsx
import { FaTimes, FaUser, FaPaw } from "react-icons/fa";

const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const getStatusBadge = (status) => {
    const badges = {
      CHO_XAC_NHAN: {
        class: "bg-yellow-50 text-yellow-700 border-yellow-200",
        label: "Chờ xác nhận",
      },
      DA_XAC_NHAN: {
        class: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Đã xác nhận",
      },
      DANG_THUC_HIEN: {
        class: "bg-purple-50 text-purple-700 border-purple-200",
        label: "Đang thực hiện",
      },
      HOAN_THANH: {
        class: "bg-green-50 text-green-700 border-green-200",
        label: "Hoàn thành",
      },
      HUY: {
        class: "bg-red-50 text-red-700 border-red-200",
        label: "Đã hủy",
      },
    };
    const badge = badges[status] || {
      class: "bg-gray-50 text-gray-700 border-gray-200",
      label: status,
    };
    return <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${badge.class}`}>{badge.label}</span>;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Chi Tiết Đơn #{booking.maLichHen}</h3>
          <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Customer */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaUser className="text-[#8e2800] w-4 h-4" />
              Khách Hàng
            </h4>
            <p className="text-gray-700 font-medium">{booking.KhachHang?.hoTen}</p>
            <p className="text-sm text-gray-600">{booking.KhachHang?.soDienThoai}</p>
            <p className="text-sm text-gray-600">{booking.KhachHang?.email}</p>
          </div>

          {/* Pets & Services */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaPaw className="text-[#8e2800] w-4 h-4" />
              Thú Cưng & Dịch Vụ
            </h4>
            {booking.LichHenThuCungs?.map((pet, idx) => (
              <div key={idx} className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                <p className="font-semibold text-gray-800">
                  {pet.ten} - {pet.LoaiThuCung?.tenLoai}
                </p>
                <div className="ml-4 mt-2 space-y-1">
                  {pet.LichHenChiTiets?.map((detail, i) => (
                    <div key={i} className="text-sm flex justify-between">
                      <span className="text-gray-700">• {detail.DichVuCuaShop?.DichVuHeThong?.tenDichVu}</span>
                      <span className="font-semibold text-[#8e2800]">{parseInt(detail.gia).toLocaleString("vi-VN")}đ</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Trạng Thái</p>
              {getStatusBadge(booking.trangThai)}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Tổng Tiền</p>
              <p className="font-bold text-[#8e2800] text-xl">{parseInt(booking.tongTien).toLocaleString("vi-VN")}đ</p>
            </div>
          </div>

          {booking.ghiChu && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Ghi Chú</p>
              <p className="text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">{booking.ghiChu}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
