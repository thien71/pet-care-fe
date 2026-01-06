// src/components/staff/StaffBookingDetailModal.jsx
import { FaUser, FaPaw, FaTimes, FaMoneyBillWave } from "react-icons/fa";

const StaffBookingDetailModal = ({ booking, onClose }) => {
  const getStatusBadge = (status) => {
    const config = {
      CHO_XAC_NHAN: { text: "Chờ xác nhận", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      DA_XAC_NHAN: { text: "Đã xác nhận", class: "bg-blue-100 text-blue-700 border-blue-200" },
      DANG_THUC_HIEN: { text: "Đang thực hiện", class: "bg-purple-100 text-purple-700 border-purple-200" },
      HOAN_THANH: { text: "Hoàn thành", class: "bg-green-100 text-green-700 border-green-200" },
      HUY: { text: "Đã hủy", class: "bg-red-100 text-red-700 border-red-200" },
    };
    const cfg = config[status] || config.CHO_XAC_NHAN;
    return <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium border ${cfg.class}`}>{cfg.text}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Chi Tiết Đơn Hàng</h3>
            <p className="text-sm text-gray-600 mt-1">Đơn #{booking.maLichHen}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
            {getStatusBadge(booking.trangThai)}
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FaUser className="text-[#8e2800]" />
              <h4 className="font-bold text-gray-800">Khách Hàng</h4>
            </div>
            <p className="text-gray-800 font-medium">{booking.KhachHang?.hoTen}</p>
            <p className="text-sm text-gray-600">{booking.KhachHang?.soDienThoai}</p>
          </div>

          {/* Pets & Services */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FaPaw className="text-[#8e2800]" />
              <h4 className="font-bold text-gray-800">Thú Cưng & Dịch Vụ</h4>
            </div>
            <div className="space-y-3">
              {booking.LichHenThuCungs?.map((pet, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-800 mb-1">
                    {pet.ten} - {pet.LoaiThuCung?.tenLoai}
                  </p>
                  <div className="ml-4 space-y-1">
                    {pet.LichHenChiTiets?.map((detail, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">• {detail.DichVuCuaShop?.DichVuHeThong?.tenDichVu}</span>
                        <span className="font-semibold text-[#8e2800]">{parseInt(detail.gia).toLocaleString("vi-VN")}đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-[#8e2800]/5 p-4 rounded-lg border border-[#8e2800]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-[#8e2800]" />
                <span className="font-semibold text-gray-800">Tổng tiền:</span>
              </div>
              <span className="text-2xl font-bold text-[#8e2800]">{parseInt(booking.tongTien).toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffBookingDetailModal;
