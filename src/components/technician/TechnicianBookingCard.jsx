// src/components/technician/TechnicianBookingCard.jsx
import { FaUser, FaCalendarAlt, FaStore, FaPaw, FaEye, FaPlay, FaCheckCircle, FaClock } from "react-icons/fa";

const TechnicianBookingCard = ({ assignment, onViewDetail, onStartWork, onCompleteWork }) => {
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

  const getPriorityBorder = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    const diffHours = (appointmentDate - today) / (1000 * 60 * 60);

    if (diffHours < 2) return "border-l-4 border-l-red-500";
    if (diffHours < 6) return "border-l-4 border-l-yellow-500";
    return "border-l-4 border-l-blue-500";
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 ${getPriorityBorder(
        assignment.ngayHen
      )} overflow-hidden hover:border-gray-300 transition-colors`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800">#{assignment.maLichHen}</h3>
          {getStatusBadge(assignment.trangThai)}
        </div>

        {/* Customer Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3">
            <FaUser className="text-gray-400 mt-1 shrink-0" />
            <div>
              <p className="font-medium text-gray-800">{assignment.KhachHang?.hoTen}</p>
              <p className="text-xs text-gray-500">{assignment.KhachHang?.soDienThoai}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700">{new Date(assignment.ngayHen).toLocaleString("vi-VN")}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaStore className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700">{assignment.CuaHang?.tenCuaHang}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaPaw className="text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700">{assignment.LichHenThuCungs?.length || 0} thú cưng</span>
          </div>
        </div>

        {/* Services Summary */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Dịch vụ:</p>
          {assignment.LichHenThuCungs?.slice(0, 1).map((pet, idx) => (
            <div key={idx} className="text-xs text-gray-600 space-y-1">
              {pet.LichHenChiTiets?.map((detail, i) => (
                <div key={i}>• {detail.DichVuCuaShop?.DichVuHeThong?.tenDichVu}</div>
              ))}
            </div>
          ))}
          {assignment.LichHenThuCungs?.length > 1 && (
            <p className="text-xs text-gray-500 mt-2">...và {assignment.LichHenThuCungs.length - 1} thú cưng khác</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onViewDetail(assignment)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <FaEye />
            Chi Tiết
          </button>

          {assignment.trangThai === "DA_XAC_NHAN" && (
            <button
              onClick={() => onStartWork(assignment.maLichHen)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaPlay />
              Bắt Đầu Làm
            </button>
          )}

          {assignment.trangThai === "DANG_THUC_HIEN" && (
            <button
              onClick={() => onCompleteWork(assignment.maLichHen)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
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

export default TechnicianBookingCard;
