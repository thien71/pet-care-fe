// src/components/owner/AddEmployeeModal.jsx - IMPROVED VALIDATION WITH INPUT PREVENTION
import { useState } from "react";
import { FaEnvelope, FaUser, FaPhone, FaUserTag, FaTimes } from "react-icons/fa";

const AddEmployeeModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    hoTen: "",
    soDienThoai: "",
    maVaiTro: 4,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) {
          return "Email không được để trống";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Email không đúng định dạng";
        }
        return "";

      case "hoTen":
        if (!value.trim()) {
          return "Họ tên không được để trống";
        }
        if (value.trim().length < 2) {
          return "Họ tên phải có ít nhất 2 ký tự";
        }
        if (value.trim().length > 100) {
          return "Họ tên không được vượt quá 100 ký tự";
        }
        if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value.trim())) {
          return "Họ tên chỉ được chứa chữ cái và khoảng trắng";
        }
        return "";

      case "soDienThoai":
        if (value && !/^[0-9]{10}$/.test(value)) {
          return "Số điện thoại phải có 10 chữ số";
        }
        if (value && !value.startsWith("0")) {
          return "Số điện thoại phải bắt đầu bằng số 0";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    // Xử lý riêng cho từng field
    if (name === "email") {
      sanitizedValue = value.replace(/\s/g, "");
    } else if (name === "soDienThoai") {
      sanitizedValue = value.replace(/[^0-9]/g, "");
      if (sanitizedValue.length > 10) {
        sanitizedValue = sanitizedValue.slice(0, 10);
      }
    } else if (name === "maVaiTro") {
      sanitizedValue = parseInt(value, 10);
    } else if (name === "hoTen") {
      if (formData.hoTen.length === 0 && value === " ") {
        return;
      }
      sanitizedValue = value.replace(/\s{2,}/g, " ");
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Clear error khi người dùng bắt đầu sửa
    if (touched[name]) {
      const error = validateField(name, sanitizedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Ngăn paste nội dung không hợp lệ
  const handlePaste = (e, fieldName) => {
    const pastedData = e.clipboardData.getData("text");

    if (fieldName === "email") {
      // Ngăn paste có khoảng trắng
      if (/\s/.test(pastedData)) {
        e.preventDefault();
        const cleaned = pastedData.replace(/\s/g, "");
        setFormData((prev) => ({ ...prev, email: cleaned }));
      }
    } else if (fieldName === "soDienThoai") {
      // Chỉ cho paste số
      e.preventDefault();
      const cleaned = pastedData.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, soDienThoai: cleaned }));
    }
  };

  // Ngăn nhập khoảng trắng cho email và số điện thoại
  const handleKeyDown = (e, fieldName) => {
    if (fieldName === "email" && e.key === " ") {
      e.preventDefault();
    } else if (fieldName === "hoTen" && e.key === " ") {
      // Ngăn space đầu tiên khi chưa có ký tự
      if (formData.hoTen.length === 0) {
        e.preventDefault();
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "maVaiTro") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      email: true,
      hoTen: true,
      soDienThoai: true,
    });

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
    setTouched({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Thêm Nhân Viên</h3>
            <p className="text-sm text-gray-600 mt-1">Nhân viên sẽ nhận email để thiết lập mật khẩu</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={loading}>
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2 text-[#8e2800]" />
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="employee@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] transition-colors ${
                errors.email && touched.email ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e, "email")}
              onPaste={(e) => handlePaste(e, "email")}
              disabled={loading}
              autoComplete="off"
            />
            {errors.email && touched.email && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span>•</span>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-[#8e2800]" />
              Họ Tên <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="hoTen"
              placeholder="Nguyễn Văn A"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] transition-colors ${
                errors.hoTen && touched.hoTen ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.hoTen}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e, "hoTen")}
              disabled={loading}
              autoComplete="off"
            />
            {errors.hoTen && touched.hoTen && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span>•</span>
                {errors.hoTen}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2 text-[#8e2800]" />
              Số Điện Thoại
            </label>
            <input
              type="text"
              name="soDienThoai"
              placeholder="0912345678"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] transition-colors ${
                errors.soDienThoai && touched.soDienThoai ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.soDienThoai}
              onChange={handleChange}
              onBlur={handleBlur}
              onPaste={(e) => handlePaste(e, "soDienThoai")}
              disabled={loading}
              autoComplete="off"
              inputMode="numeric"
            />
            {errors.soDienThoai && touched.soDienThoai && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span>•</span>
                {errors.soDienThoai}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUserTag className="inline mr-2 text-[#8e2800]" />
              Vai Trò <span className="text-red-600">*</span>
            </label>
            <select
              name="maVaiTro"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] transition-colors"
              value={formData.maVaiTro}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="4">Lễ Tân</option>
              <option value="5">Kỹ Thuật Viên</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang xử lý..." : "Thêm Nhân Viên"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
