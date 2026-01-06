// src/pages/owner/ShopSettings.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { shopService } from "@/api";
import { FaEdit, FaSave, FaTimes, FaSpinner, FaStore, FaCheckCircle, FaCalendar, FaUser } from "react-icons/fa";
import { showToast } from "@/utils/toast";
import { getShopImageUrl } from "@/utils/constants";

const ShopSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
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
      showToast.error(err.message || "Lỗi khi tải thông tin cửa hàng");
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopData({ ...shopData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      setSaving(true);
      await shopService.updateShopInfo(shopData);
      showToast.success("Cập nhật thông tin cửa hàng thành công!");
      setEditMode(false);
      setError("");
      setFormErrors({});
    } catch (err) {
      showToast.error(err.message || "Lỗi khi cập nhật thông tin");
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

  if (error && !shopData.tenCuaHang) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={loadShopData} className="mt-4 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FaStore className="text-2xl text-[#8e2800]" />
            <h1 className="text-2xl font-bold text-gray-800">Cài Đặt Cửa Hàng</h1>
          </div>
          <p className="text-gray-600">Quản lý thông tin cửa hàng của bạn</p>
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

      {/* Shop Info Card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="p-6 space-y-6">
            {/* Tên Cửa Hàng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Cửa Hàng <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="tenCuaHang"
                className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                  editMode
                    ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed"
                } ${formErrors.tenCuaHang ? "border-red-500" : ""}`}
                value={shopData.tenCuaHang}
                onChange={handleChange}
                disabled={!editMode}
              />
              {formErrors.tenCuaHang && <p className="text-red-600 text-sm mt-1">{formErrors.tenCuaHang}</p>}
            </div>

            {/* Grid 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa Chỉ <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="diaChi"
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    editMode
                      ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  } ${formErrors.diaChi ? "border-red-500" : ""}`}
                  value={shopData.diaChi}
                  onChange={handleChange}
                  disabled={!editMode}
                />
                {formErrors.diaChi && <p className="text-red-600 text-sm mt-1">{formErrors.diaChi}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                <input
                  type="tel"
                  name="soDienThoai"
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    editMode
                      ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  } ${formErrors.soDienThoai ? "border-red-500" : ""}`}
                  value={shopData.soDienThoai}
                  onChange={handleChange}
                  disabled={!editMode}
                />
                {formErrors.soDienThoai && <p className="text-red-600 text-sm mt-1">{formErrors.soDienThoai}</p>}
              </div>
            </div>

            {/* Mô Tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
              <textarea
                name="moTa"
                className={`w-full px-4 py-2 border rounded-lg transition-colors resize-none ${
                  editMode
                    ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed"
                }`}
                value={shopData.moTa}
                onChange={handleChange}
                disabled={!editMode}
                rows={4}
              ></textarea>
            </div>

            {/* Ảnh Cửa Hàng (readonly for now) */}
            {shopData.anhCuaHang && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Cửa Hàng</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={getShopImageUrl(shopData.anhCuaHang)}
                    alt="Shop"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {editMode && (
            <div className="px-6 pb-6 flex gap-3 justify-end border-t border-gray-200 pt-4">
              <button
                onClick={handleCancel}
                type="button"
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <FaTimes />
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors disabled:opacity-50 font-medium"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Lưu</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Status Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Trạng Thái Cửa Hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FaCheckCircle className="text-2xl text-[#8e2800]" />
              <p className="text-sm text-gray-600">Trạng Thái</p>
            </div>
            <p className={`text-lg font-bold ${shopData.trangThai === "HOAT_DONG" ? "text-green-600" : "text-yellow-600"}`}>
              {shopData.trangThai === "HOAT_DONG" ? "Hoạt động" : "Chờ duyệt"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FaCalendar className="text-2xl text-[#8e2800]" />
              <p className="text-sm text-gray-600">Ngày Tạo</p>
            </div>
            <p className="text-lg font-bold text-gray-800">
              {shopData.ngayTao ? new Date(shopData.ngayTao).toLocaleDateString("vi-VN") : "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FaUser className="text-2xl text-[#8e2800]" />
              <p className="text-sm text-gray-600">Chủ Sở Hữu</p>
            </div>
            <p className="text-lg font-bold text-gray-800">{user?.hoTen}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;
