// src/components/staff/StaffAssignTechnicianModal.jsx
import { useState } from "react";
import { FaTimes, FaUserCog, FaCheckCircle } from "react-icons/fa";

const StaffAssignTechnicianModal = ({ booking, employees, onConfirm, onClose }) => {
  const [selectedTech, setSelectedTech] = useState(booking.maNhanVien || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTech) {
      return;
    }
    onConfirm(selectedTech);
  };

  const technicians = employees.filter((emp) => emp.VaiTro?.tenVaiTro === "KY_THUAT_VIEN");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaUserCog className="text-[#8e2800]" />
              <h3 className="text-xl font-bold text-gray-800">Gán Kỹ Thuật Viên</h3>
            </div>
            <p className="text-sm text-gray-600">Đơn hàng #{booking.maLichHen}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Chọn Kỹ Thuật Viên <span className="text-red-500">*</span>
            </label>

            {technicians.length > 0 ? (
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                required
              >
                <option value="">-- Chọn kỹ thuật viên --</option>
                {technicians.map((emp) => (
                  <option key={emp.maNguoiDung} value={emp.maNguoiDung}>
                    {emp.hoTen}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Không có kỹ thuật viên nào</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!selectedTech || technicians.length === 0}
              className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaCheckCircle />
              Gán
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffAssignTechnicianModal;
