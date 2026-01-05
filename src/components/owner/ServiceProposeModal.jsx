import { useState } from "react";
import { FaTimes, FaLightbulb, FaDollarSign } from "react-icons/fa";

const ServiceProposeModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    tenDichVu: "",
    moTa: "",
    gia: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.tenDichVu.trim()) {
      newErrors.tenDichVu = "Tên dịch vụ không được để trống";
    } else if (formData.tenDichVu.trim().length < 3) {
      newErrors.tenDichVu = "Tên dịch vụ phải có ít nhất 3 ký tự";
    }

    if (!formData.gia || parseFloat(formData.gia) <= 0) {
      newErrors.gia = "Giá phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      tenDichVu: formData.tenDichVu.trim(),
      moTa: formData.moTa.trim(),
      gia: parseFloat(formData.gia),
    });
  };

  const handleClose = () => {
    setFormData({ tenDichVu: "", moTa: "", gia: "" });
    setErrors({});
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-xl max-w-lg w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Đề Xuất Dịch Vụ Mới</h3>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tên Dịch Vụ <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Cắt móng chuyên nghiệp"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                errors.tenDichVu ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.tenDichVu}
              onChange={(e) => setFormData({ ...formData, tenDichVu: e.target.value })}
            />
            {errors.tenDichVu && <p className="text-red-600 text-sm mt-1">{errors.tenDichVu}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mô Tả</label>
            <textarea
              placeholder="Mô tả chi tiết về dịch vụ bạn muốn đề xuất..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent h-28 resize-none"
              value={formData.moTa}
              onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Giá Dự Kiến (đ) <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                placeholder="50000"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                  errors.gia ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.gia}
                onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                min="0"
              />
            </div>
            {errors.gia && <p className="text-red-600 text-sm mt-1">{errors.gia}</p>}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <FaLightbulb className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800 leading-relaxed">Admin sẽ xem xét và phản hồi đề xuất của bạn trong vòng 24-48 giờ</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang gửi..." : "Gửi Đề Xuất"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceProposeModal;
