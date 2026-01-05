// src/components/owner/BookingCard.jsx
import { FaCalendar, FaUser, FaPaw, FaDollarSign, FaCheckCircle, FaTimesCircle, FaUserMd, FaEye } from "react-icons/fa";

const BookingCard = ({ booking, onViewDetail, onConfirm, onCancel, onAssign }) => {
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:border-[#8e2800] transition-all duration-200">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">#{booking.maLichHen}</h3>
          {getStatusBadge(booking.trangThai)}
        </div>

        {/* Customer Info */}
        <div className="space-y-3 text-sm min-h-44">
          <div className="flex items-start gap-3">
            <FaUser className="text-[#8e2800] mt-1 shrink-0 w-4 h-4" />
            <div>
              <p className="font-semibold text-gray-800">{booking.KhachHang?.hoTen}</p>
              {booking.KhachHang?.soDienThoai ? booking.KhachHang.soDienThoai : <span className="invisible">0000000000</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaCalendar className="text-[#8e2800] w-4 h-4" />
            <span className="text-gray-700">{new Date(booking.ngayHen).toLocaleString("vi-VN")}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaPaw className="text-[#8e2800] w-4 h-4" />
            <span className="text-gray-700">{booking.LichHenThuCungs?.length || 0} thú cưng</span>
          </div>

          {booking.NhanVien && (
            <div className="flex items-center gap-3">
              <FaUserMd className="text-[#8e2800] w-4 h-4" />
              <span className="text-gray-700">{booking.NhanVien.hoTen}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <FaDollarSign className="text-[#8e2800] w-4 h-4" />
            <span className="font-bold text-[#8e2800]">{parseInt(booking.tongTien).toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onViewDetail(booking)}
            className="flex items-center gap-2 px-2 py-2 border-none bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
          >
            <FaEye className="w-4 h-4" />
            {/* <span>Xem</span> */}
          </button>

          {booking.trangThai === "CHO_XAC_NHAN" && (
            <>
              <button
                onClick={() => onConfirm(booking)}
                className="flex items-center gap-2 px-2 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium border border-green-200"
              >
                <FaCheckCircle className="w-4 h-4" />
                <span>Xác nhận</span>
              </button>
              <button
                onClick={() => onCancel(booking)}
                className="flex items-center gap-2 px-2 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
              >
                <FaTimesCircle className="w-4 h-4" />
                <span>Hủy</span>
              </button>
            </>
          )}

          {(booking.trangThai === "DA_XAC_NHAN" || booking.trangThai === "DANG_THUC_HIEN") && (
            <button
              onClick={() => onAssign(booking)}
              className="flex items-center gap-2 px-2 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
            >
              <FaUserMd className="w-4 h-4" />
              <span>Gán KTV</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
