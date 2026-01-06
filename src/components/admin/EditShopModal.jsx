// src/components/admin/EditShopModal.jsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const EditShopModal = ({ isOpen, onClose, onSubmit, shop, loading }) => {
  const [formData, setFormData] = useState({
    tenCuaHang: "",
    diaChi: "",
    soDienThoai: "",
    moTa: "",
    trangThai: "CHO_DUYET",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (shop) {
      setFormData({
        tenCuaHang: shop.tenCuaHang || "",
        diaChi: shop.diaChi || "",
        soDienThoai: shop.soDienThoai || "",
        moTa: shop.moTa || "",
        trangThai: shop.trangThai || "CHO_DUYET",
      });
    }
    setErrors({});
  }, [shop, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.tenCuaHang.trim()) {
      newErrors.tenCuaHang = "Tên cửa hàng không được để trống";
    } else if (formData.tenCuaHang.trim().length < 3) {
      newErrors.tenCuaHang = "Tên cửa hàng phải có ít nhất 3 ký tự";
    }

    if (!formData.diaChi.trim()) {
      newErrors.diaChi = "Địa chỉ không được để trống";
    }

    if (!formData.soDienThoai.trim()) {
      newErrors.soDienThoai = "Số điện thoại không được để trống";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.soDienThoai.trim())) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ";
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
      <div className="bg-white rounded-lg max-w-2xl w-full border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Cập Nhật Cửa Hàng</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Cửa Hàng *</label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 border ${
                errors.tenCuaHang ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.tenCuaHang}
              onChange={(e) => setFormData({ ...formData, tenCuaHang: e.target.value })}
            />
            {errors.tenCuaHang && <p className="text-red-600 text-sm mt-1">{errors.tenCuaHang}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa Chỉ *</label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 border ${
                errors.diaChi ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.diaChi}
              onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
            />
            {errors.diaChi && <p className="text-red-600 text-sm mt-1">{errors.diaChi}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại *</label>
            <input
              type="tel"
              className={`w-full px-4 py-2.5 border ${
                errors.soDienThoai ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.soDienThoai}
              onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
              placeholder="0987654321"
            />
            {errors.soDienThoai && <p className="text-red-600 text-sm mt-1">{errors.soDienThoai}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
            <textarea
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent resize-none"
              rows="3"
              value={formData.moTa}
              onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái *</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
              value={formData.trangThai}
              onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
            >
              <option value="CHO_DUYET">Chờ duyệt</option>
              <option value="HOAT_DONG">Hoạt động</option>
              <option value="BI_KHOA">Bị khóa</option>
            </select>
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

export default EditShopModal;
