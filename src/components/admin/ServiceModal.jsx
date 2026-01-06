// src/components/admin/ServiceModal.jsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const ServiceModal = ({ isOpen, onClose, onSubmit, service, loading }) => {
  const [formData, setFormData] = useState({
    tenDichVu: "",
    moTa: "",
    thoiLuong: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (service) {
      setFormData({
        tenDichVu: service.tenDichVu || "",
        moTa: service.moTa || "",
        thoiLuong: service.thoiLuong || "",
      });
    } else {
      setFormData({
        tenDichVu: "",
        moTa: "",
        thoiLuong: "",
      });
    }
    setErrors({});
  }, [service, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.tenDichVu.trim()) {
      newErrors.tenDichVu = "Tên dịch vụ không được để trống";
    } else if (formData.tenDichVu.trim().length < 3) {
      newErrors.tenDichVu = "Tên dịch vụ phải có ít nhất 3 ký tự";
    }

    if (formData.thoiLuong && isNaN(formData.thoiLuong)) {
      newErrors.thoiLuong = "Thời lượng phải là số";
    } else if (formData.thoiLuong && formData.thoiLuong < 1) {
      newErrors.thoiLuong = "Thời lượng phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">{service ? "Cập Nhật Dịch Vụ" : "Thêm Dịch Vụ Mới"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Dịch Vụ *</label>
            <input
              type="text"
              placeholder="Ví dụ: Tắm & Cắt lông"
              className={`w-full px-4 py-2.5 border ${
                errors.tenDichVu ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.tenDichVu}
              onChange={(e) => setFormData({ ...formData, tenDichVu: e.target.value })}
            />
            {errors.tenDichVu && <p className="text-red-600 text-sm mt-1">{errors.tenDichVu}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
            <textarea
              placeholder="Mô tả chi tiết về dịch vụ..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent resize-none"
              rows="3"
              value={formData.moTa}
              onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thời Lượng (phút)</label>
            <input
              type="number"
              placeholder="30"
              min="1"
              className={`w-full px-4 py-2.5 border ${
                errors.thoiLuong ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.thoiLuong}
              onChange={(e) => setFormData({ ...formData, thoiLuong: e.target.value })}
            />
            {errors.thoiLuong && <p className="text-red-600 text-sm mt-1">{errors.thoiLuong}</p>}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
