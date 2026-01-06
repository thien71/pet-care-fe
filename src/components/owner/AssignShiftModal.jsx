// src/components/owner/AssignShiftModal.jsx
import { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";

const AssignShiftModal = ({ isOpen, onClose, onSubmit, employees, selectedDate }) => {
  const [formData, setFormData] = useState({
    maNhanVien: "",
    maCa: "",
    ngayLam: selectedDate || new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    { id: 1, name: "Ca sáng", time: "08:00-12:00" },
    { id: 2, name: "Ca chiều", time: "13:00-17:00" },
    { id: 3, name: "Ca tối", time: "18:00-22:00" },
  ];

  useEffect(() => {
    if (isOpen && selectedDate) {
      setFormData((prev) => ({ ...prev, ngayLam: selectedDate }));
    }
  }, [isOpen, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.maNhanVien || !formData.maCa || !formData.ngayLam) {
      return;
    }

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);

    setFormData({
      maNhanVien: "",
      maCa: "",
      ngayLam: selectedDate || new Date().toISOString().split("T")[0],
    });
  };

  const handleClose = () => {
    setFormData({
      maNhanVien: "",
      maCa: "",
      ngayLam: selectedDate || new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Phân Công Ca Làm</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nhân viên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhân Viên <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.maNhanVien}
              onChange={(e) => setFormData({ ...formData, maNhanVien: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
              disabled={loading}
              required
            >
              <option value="">-- Chọn nhân viên --</option>
              {employees.map((emp) => (
                <option key={emp.maNguoiDung} value={emp.maNguoiDung}>
                  {emp.hoTen}
                </option>
              ))}
            </select>
          </div>

          {/* Ca làm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ca Làm <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.maCa}
              onChange={(e) => setFormData({ ...formData, maCa: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
              disabled={loading}
              required
            >
              <option value="">-- Chọn ca làm --</option>
              {timeSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.name} ({slot.time})
                </option>
              ))}
            </select>
          </div>

          {/* Ngày làm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày Làm <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.ngayLam}
              onChange={(e) => setFormData({ ...formData, ngayLam: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
              disabled={loading}
              required
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.maNhanVien || !formData.maCa}
            className="flex items-center gap-2 px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Phân Công</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignShiftModal;
