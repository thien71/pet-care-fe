// src/components/admin/PetTypeModal.jsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const PetTypeModal = ({ isOpen, onClose, onSubmit, petType, loading }) => {
  const [formData, setFormData] = useState({ tenLoai: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (petType) {
      setFormData({ tenLoai: petType.tenLoai || "" });
    } else {
      setFormData({ tenLoai: "" });
    }
    setErrors({});
  }, [petType, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.tenLoai.trim()) {
      newErrors.tenLoai = "Tên loại không được để trống";
    } else if (formData.tenLoai.trim().length < 2) {
      newErrors.tenLoai = "Tên loại phải có ít nhất 2 ký tự";
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
          <h3 className="text-lg font-bold text-gray-800">{petType ? "Cập Nhật Loại" : "Thêm Loại Mới"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Loại Thú Cưng *</label>
            <input
              type="text"
              placeholder="Ví dụ: Chó, Mèo, Chim..."
              className={`w-full px-4 py-2.5 border ${
                errors.tenLoai ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.tenLoai}
              onChange={(e) => setFormData({ ...formData, tenLoai: e.target.value })}
            />
            {errors.tenLoai && <p className="text-red-600 text-sm mt-1">{errors.tenLoai}</p>}
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

export default PetTypeModal;
