import { useState, useEffect } from "react";
// import apiClient from "../../api/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { shopService } from "@/api";

import {
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaStore,
  FaMapMarkerAlt,
  FaPhone,
  FaFileAlt,
  FaImage,
  FaCalendar,
  FaUser,
} from "react-icons/fa";
import { getShopImageUrl } from "../../utils/constants";

const ShopSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shopData, setShopData] = useState({
    tenCuaHang: "",
    diaChi: "",
    soDienThoai: "",
    moTa: "",
    anhCuaHang: "",
    trangThai: "",
    ngayTao: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      setLoading(true);
      const res = await shopService.getShopInfo();
      setShopData({
        tenCuaHang: res.data.tenCuaHang || "",
        diaChi: res.data.diaChi || "",
        soDienThoai: res.data.soDienThoai || "",
        moTa: res.data.moTa || "",
        anhCuaHang: res.data.anhCuaHang || "",
        trangThai: res.data.trangThai || "",
        ngayTao: res.data.ngayTao || "",
      });
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải thông tin cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!shopData.tenCuaHang.trim()) {
      errors.tenCuaHang = "Tên cửa hàng không được để trống";
    } else if (shopData.tenCuaHang.trim().length < 3) {
      errors.tenCuaHang = "Tên cửa hàng phải có ít nhất 3 ký tự";
    }

    if (!shopData.diaChi.trim()) {
      errors.diaChi = "Địa chỉ không được để trống";
    }

    if (shopData.soDienThoai && !/^[0-9]{10}$/.test(shopData.soDienThoai)) {
      errors.soDienThoai = "Số điện thoại phải có 10 chữ số";
    }

    if (shopData.anhCuaHang && shopData.anhCuaHang.trim() && !/^https?:\/\/.+/.test(shopData.anhCuaHang)) {
      errors.anhCuaHang = "Link ảnh không hợp lệ";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopData({ ...shopData, [name]: value });
    setSuccess("");

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await shopService.updateShopInfo(shopData);
      setSuccess("Cập nhật thông tin cửa hàng thành công!");
      setEditMode(false);
      setError("");
      setFormErrors({});
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormErrors({});
    loadShopData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cài Đặt Cửa Hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin cửa hàng của bạn</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
          >
            <FaEdit />
            Chỉnh Sửa
          </button>
        )}
      </div>

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <FaCheckCircle className="text-green-600 text-xl" />
          <span className="text-green-800">{success}</span>
          <button onClick={() => setSuccess("")} className="ml-auto text-green-600 hover:text-green-800">
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <FaTimesCircle className="text-red-600 text-xl" />
          <span className="text-red-800">{error}</span>
          <button onClick={() => setError("")} className="ml-auto text-red-600 hover:text-red-800">
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Shop Info Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaStore className="text-[#8e2800]" />
          Thông Tin Cửa Hàng
        </h2>

        <div className="space-y-6">
          {/* Tên Cửa Hàng */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên Cửa Hàng <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="tenCuaHang"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                formErrors.tenCuaHang ? "border-red-500" : "border-gray-300"
              } ${!editMode ? "bg-gray-50" : ""}`}
              value={shopData.tenCuaHang}
              onChange={handleChange}
              disabled={!editMode}
            />
            {formErrors.tenCuaHang && <p className="text-red-600 text-sm mt-1">{formErrors.tenCuaHang}</p>}
          </div>

          {/* Grid 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Địa Chỉ <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="diaChi"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                  formErrors.diaChi ? "border-red-500" : "border-gray-300"
                } ${!editMode ? "bg-gray-50" : ""}`}
                value={shopData.diaChi}
                onChange={handleChange}
                disabled={!editMode}
              />
              {formErrors.diaChi && <p className="text-red-600 text-sm mt-1">{formErrors.diaChi}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số Điện Thoại</label>
              <input
                type="tel"
                name="soDienThoai"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                  formErrors.soDienThoai ? "border-red-500" : "border-gray-300"
                } ${!editMode ? "bg-gray-50" : ""}`}
                value={shopData.soDienThoai}
                onChange={handleChange}
                disabled={!editMode}
              />
              {formErrors.soDienThoai && <p className="text-red-600 text-sm mt-1">{formErrors.soDienThoai}</p>}
            </div>
          </div>

          {/* Ảnh Cửa Hàng */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Link Ảnh Cửa Hàng</label>
            <input
              type="text"
              name="anhCuaHang"
              placeholder="https://example.com/shop-image.jpg"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                formErrors.anhCuaHang ? "border-red-500" : "border-gray-300"
              } ${!editMode ? "bg-gray-50" : ""}`}
              value={shopData.anhCuaHang}
              onChange={handleChange}
              disabled={!editMode}
            />
            {formErrors.anhCuaHang && <p className="text-red-600 text-sm mt-1">{formErrors.anhCuaHang}</p>}

            {/* Preview Image */}
            {shopData.anhCuaHang && (
              <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={getShopImageUrl(shopData.anhCuaHang)}
                  alt="Shop preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Mô Tả */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mô Tả</label>
            <textarea
              name="moTa"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent h-32 ${
                !editMode ? "bg-gray-50" : ""
              }`}
              value={shopData.moTa}
              onChange={handleChange}
              disabled={!editMode}
            ></textarea>
          </div>
        </div>

        {/* Actions */}
        {editMode && (
          <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <FaTimes />
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium disabled:opacity-50"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <FaSave />
                  Lưu
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Status Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Trạng Thái Cửa Hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCheckCircle className="text-[#8e2800] text-2xl" />
              <p className="text-sm text-gray-600">Trạng Thái</p>
            </div>
            <p className={`text-lg font-bold ${shopData.trangThai === "HOAT_DONG" ? "text-green-600" : "text-yellow-600"}`}>
              {shopData.trangThai === "HOAT_DONG" ? "Hoạt động" : "Chờ duyệt"}
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCalendar className="text-[#8e2800] text-2xl" />
              <p className="text-sm text-gray-600">Ngày Tạo</p>
            </div>
            <p className="text-lg font-bold text-gray-800">
              {shopData.ngayTao ? new Date(shopData.ngayTao).toLocaleDateString("vi-VN") : "N/A"}
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaUser className="text-[#8e2800] text-2xl" />
              <p className="text-sm text-gray-600">Chủ Sở Hữu</p>
            </div>
            <p className="text-lg font-bold text-gray-800">{user?.hoTen}</p>
          </div>
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start gap-3">
        <FaFileAlt className="text-blue-600 text-2xl shrink-0 mt-1" />
        <div>
          <p className="font-semibold text-blue-800 mb-1">Lưu ý</p>
          <p className="text-blue-700">
            Cập nhật thông tin cửa hàng của bạn để khách hàng có thể tìm thấy dễ dàng hơn. Hãy đảm bảo thông tin luôn chính xác và đầy đủ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;
