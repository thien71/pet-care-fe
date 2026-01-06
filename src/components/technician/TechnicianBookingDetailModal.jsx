// src/components/technician/TechnicianBookingDetailModal.jsx
import { FaUser, FaCalendarAlt, FaPaw, FaTimes, FaPlay, FaCheckCircle, FaClock } from "react-icons/fa";

const TechnicianBookingDetailModal = ({ assignment, onClose, onStartWork, onCompleteWork }) => {
  const getStatusBadge = (status) => {
    const config = {
      DA_XAC_NHAN: { text: "Chờ làm", class: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: FaClock },
      DANG_THUC_HIEN: { text: "Đang làm", class: "bg-blue-100 text-blue-700 border-blue-200", icon: FaPlay },
      HOAN_THANH: { text: "Hoàn thành", class: "bg-green-100 text-green-700 border-green-200", icon: FaCheckCircle },
    };
    const cfg = config[status] || config.DA_XAC_NHAN;
    const Icon = cfg.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-medium border ${cfg.class}`}>
        <Icon />
        {cfg.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Chi Tiết Công Việc</h3>
            <p className="text-sm text-gray-600 mt-1">Đơn hàng #{assignment.maLichHen}</p>
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
            {getStatusBadge(assignment.trangThai)}
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FaUser className="text-[#8e2800]" />
              <h4 className="font-bold text-gray-800">Khách Hàng</h4>
            </div>
            <p className="text-gray-800 font-medium">{assignment.KhachHang?.hoTen}</p>
            <p className="text-sm text-gray-600">{assignment.KhachHang?.soDienThoai}</p>
          </div>

          {/* Time */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FaCalendarAlt className="text-[#8e2800]" />
              <h4 className="font-bold text-gray-800">Thời Gian</h4>
            </div>
            <p className="text-gray-800">{new Date(assignment.ngayHen).toLocaleString("vi-VN")}</p>
          </div>

          {/* Pets & Services */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FaPaw className="text-[#8e2800]" />
              <h4 className="font-bold text-gray-800">Thú Cưng & Dịch Vụ Cần Làm</h4>
            </div>
            <div className="space-y-3">
              {assignment.LichHenThuCungs?.map((pet, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-800 mb-1">
                    {pet.ten} - {pet.LoaiThuCung?.tenLoai}
                  </p>
                  {pet.dacDiem && <p className="text-xs text-gray-600 mb-2">Đặc điểm: {pet.dacDiem}</p>}
                  <div className="ml-4 space-y-1">
                    {pet.LichHenChiTiets?.map((detail, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">• {detail.DichVuCuaShop?.DichVuHeThong?.tenDichVu}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FaClock />
                          {detail.DichVuCuaShop?.DichVuHeThong?.thoiLuong || "N/A"} phút
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Đóng
          </button>

          {assignment.trangThai === "DA_XAC_NHAN" && (
            <button
              onClick={() => {
                onStartWork(assignment.maLichHen);
                onClose();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <FaPlay />
              Bắt Đầu Làm
            </button>
          )}

          {assignment.trangThai === "DANG_THUC_HIEN" && (
            <button
              onClick={() => {
                onCompleteWork(assignment.maLichHen);
                onClose();
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <FaCheckCircle />
              Hoàn Thành
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianBookingDetailModal;
