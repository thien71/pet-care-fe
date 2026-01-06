// src/components/admin/EditUserModal.jsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const EditUserModal = ({ isOpen, onClose, onSubmit, user, roles, loading }) => {
  const [formData, setFormData] = useState({
    hoTen: "",
    soDienThoai: "",
    diaChi: "",
    vaiTros: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        hoTen: user.hoTen || "",
        soDienThoai: user.soDienThoai || "",
        diaChi: user.diaChi || "",
        vaiTros: user.allRoles?.map((r) => r.maVaiTro) || [],
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
    } else if (formData.hoTen.trim().length < 3) {
      newErrors.hoTen = "Họ tên phải có ít nhất 3 ký tự";
    }

    if (formData.soDienThoai && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.soDienThoai.trim())) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ";
    }

    if (formData.vaiTros.length === 0) {
      newErrors.vaiTros = "Vui lòng chọn ít nhất một vai trò";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(formData);
  };

  const handleRoleToggle = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      vaiTros: prev.vaiTros.includes(roleId) ? prev.vaiTros.filter((id) => id !== roleId) : [...prev.vaiTros, roleId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Cập Nhật Người Dùng</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ Tên *</label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 border ${
                errors.hoTen ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.hoTen}
              onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
            />
            {errors.hoTen && <p className="text-red-600 text-sm mt-1">{errors.hoTen}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
              value={user?.email || ""}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa Chỉ</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
              value={formData.diaChi}
              onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vai Trò *</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.maVaiTro}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.vaiTros.includes(role.maVaiTro)}
                    onChange={() => handleRoleToggle(role.maVaiTro)}
                    className="w-4 h-4 text-[#8e2800] border-gray-300 rounded focus:ring-[#8e2800]"
                  />
                  <span className="text-gray-700">{role.tenVaiTro}</span>
                </label>
              ))}
            </div>
            {errors.vaiTros && <p className="text-red-600 text-sm mt-1">{errors.vaiTros}</p>}
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

export default EditUserModal;
