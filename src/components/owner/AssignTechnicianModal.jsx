// src/components/owner/AssignTechnicianModal.jsx
import { useState, useEffect } from "react";
import { FaUserMd } from "react-icons/fa";

const AssignTechnicianModal = ({ booking, employees, onConfirm, onClose, loading }) => {
  const [assignTechId, setAssignTechId] = useState("");

  useEffect(() => {
    if (booking) {
      setAssignTechId(booking.maNhanVien?.toString() || "");
    }
  }, [booking]);

  if (!booking) return null;

  const getTechnicianEmployees = () => {
    return employees.filter((emp) => emp.VaiTros?.some((role) => role.tenVaiTro === "KY_THUAT_VIEN"));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!assignTechId) {
      return;
    }
    onConfirm(assignTechId);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FaUserMd className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Gán Kỹ Thuật Viên</h3>
              <p className="text-sm text-gray-600 mt-0.5">Đơn hàng #{booking.maLichHen}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn Kỹ Thuật Viên</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent transition-all"
              value={assignTechId}
              onChange={(e) => setAssignTechId(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Chọn kỹ thuật viên --</option>
              {getTechnicianEmployees().map((emp) => (
                <option key={emp.maNguoiDung} value={emp.maNguoiDung}>
                  {emp.hoTen}
                </option>
              ))}
            </select>
            {!assignTechId && <p className="text-xs text-gray-500 mt-2">Vui lòng chọn kỹ thuật viên để tiếp tục</p>}
          </div>

          {booking.KhachHang && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Khách hàng</p>
              <p className="font-medium text-gray-800">{booking.KhachHang.hoTen}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !assignTechId}
            className="flex-1 px-6 py-3 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Gán"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTechnicianModal;
