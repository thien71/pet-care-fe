// src/components/owner/AddEmployeeModal.jsx
import { useState } from "react";
import { FaEnvelope, FaUser, FaPhone, FaUserTag } from "react-icons/fa";

const AddEmployeeModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    hoTen: "",
    soDienThoai: "",
    maVaiTro: 4,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
    } else if (formData.hoTen.trim().length < 2) {
      newErrors.hoTen = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (formData.soDienThoai && !/^[0-9]{10}$/.test(formData.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại phải có 10 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ email: "", hoTen: "", soDienThoai: "", maVaiTro: 4 });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Thêm Nhân Viên</h3>
          <p className="text-sm text-gray-600 mt-1">Nhân viên sẽ nhận email để thiết lập mật khẩu</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2 text-[#8e2800]" />
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="employee@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-[#8e2800]" />
              Họ Tên <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] ${
                errors.hoTen ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.hoTen}
              onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
            />
            {errors.hoTen && <p className="text-red-600 text-sm mt-1">{errors.hoTen}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2 text-[#8e2800]" />
              Số Điện Thoại
            </label>
            <input
              type="tel"
              placeholder="0912345678"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] ${
                errors.soDienThoai ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.soDienThoai}
              onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
            />
            {errors.soDienThoai && <p className="text-red-600 text-sm mt-1">{errors.soDienThoai}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUserTag className="inline mr-2 text-[#8e2800]" />
              Vai Trò
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800]"
              value={formData.maVaiTro}
              onChange={(e) => setFormData({ ...formData, maVaiTro: parseInt(e.target.value) })}
            >
              <option value="4">Lễ Tân</option>
              <option value="5">Kỹ Thuật Viên</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button onClick={handleClose} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] font-medium disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Thêm Nhân Viên"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
