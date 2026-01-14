// src/pages/owner/ShopSettings.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { shopService } from "@/api";
import { FaEdit, FaSave, FaTimes, FaSpinner, FaStore, FaCheckCircle, FaCalendar, FaUser, FaCamera } from "react-icons/fa";
import { showToast } from "@/utils/toast";
import { getShopImageUrl } from "@/utils/constants";

const ShopSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [shop, setShop] = useState(null);
  const [formData, setFormData] = useState({
    tenCuaHang: "",
    diaChi: "",
    soDienThoai: "",
    moTa: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      setLoading(true);
      const res = await shopService.getShopInfo();
      setShop(res.data);
      setFormData({
        tenCuaHang: res.data.tenCuaHang || "",
        diaChi: res.data.diaChi || "",
        soDienThoai: res.data.soDienThoai || "",
        moTa: res.data.moTa || "",
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

    if (!formData.tenCuaHang.trim()) {
      errors.tenCuaHang = "Tên cửa hàng không được để trống";
    } else if (formData.tenCuaHang.trim().length < 3) {
      errors.tenCuaHang = "Tên cửa hàng phải có ít nhất 3 ký tự";
    }

    if (!formData.diaChi.trim()) {
      errors.diaChi = "Địa chỉ không được để trống";
    }

    if (formData.soDienThoai && !/^[0-9]{10}$/.test(formData.soDienThoai)) {
      errors.soDienThoai = "Số điện thoại phải có 10 chữ số";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Nếu là số điện thoại → chỉ cho phép số
    if (name === "soDienThoai") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast.error("Vui lòng chọn file ảnh");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast.error("Ảnh không được vượt quá 5MB");
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      setSaving(true);
      let updateData;

      if (imageFile) {
        const formDataToSend = new FormData();
        formDataToSend.append("tenCuaHang", formData.tenCuaHang);
        formDataToSend.append("diaChi", formData.diaChi);
        formDataToSend.append("soDienThoai", formData.soDienThoai);
        formDataToSend.append("moTa", formData.moTa);
        formDataToSend.append("anhCuaHang", imageFile);
        updateData = formDataToSend;
      } else {
        updateData = formData;
      }

      const response = await shopService.updateShopInfo(updateData);

      if (response && response.data) {
        setShop(response.data);
        setFormData({
          tenCuaHang: response.data.tenCuaHang || "",
          diaChi: response.data.diaChi || "",
          soDienThoai: response.data.soDienThoai || "",
          moTa: response.data.moTa || "",
        });

        setImageFile(null);
        setPreviewImage(null);
      }

      setEditing(false);
      setFormErrors({});

      setTimeout(() => {
        showToast.success("Cập nhật thông tin cửa hàng thành công!");
      }, 100);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi cập nhật thông tin");
      setError(err.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormErrors({});
    setImageFile(null);
    setPreviewImage(null);
    setFormData({
      tenCuaHang: shop?.tenCuaHang || "",
      diaChi: shop?.diaChi || "",
      soDienThoai: shop?.soDienThoai || "",
      moTa: shop?.moTa || "",
    });
  };

  const getDisplayImage = () => {
    if (previewImage) return previewImage;
    if (shop?.anhCuaHang) return getShopImageUrl(shop.anhCuaHang);
    return null;
  };

  const displayImage = getDisplayImage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8e2800] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error && !shop) {
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
          <p className="text-gray-600 mt-1">Quản lý thông tin cửa hàng của bạn</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
          >
            <FaEdit />
            Chỉnh Sửa
          </button>
        )}
      </div>

      {/* Shop Info Card */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <form onSubmit={handleSave}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Shop Image Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative group w-full">
                <div className="w-full aspect-4/3 rounded-lg overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt="Shop"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full bg-[#8e2800] flex items-center justify-center text-white text-4xl font-bold">
                            ${shop?.tenCuaHang?.charAt(0).toUpperCase() || "S"}
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#8e2800] flex items-center justify-center text-white text-4xl font-bold">
                      {shop?.tenCuaHang?.charAt(0).toUpperCase() || "S"}
                    </div>
                  )}
                </div>

                {editing && (
                  <label className="absolute bottom-4 right-4 w-12 h-12 bg-[#8e2800] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6d1f00] transition-colors shadow-lg">
                    <FaCamera className="text-white text-xl" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-2 space-y-4">
              {/* Tên Cửa Hàng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Cửa Hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tenCuaHang"
                  value={formData.tenCuaHang}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    editing
                      ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  } ${formErrors.tenCuaHang ? "border-red-500" : ""}`}
                  placeholder="Nhập tên cửa hàng"
                />
                {formErrors.tenCuaHang && <p className="mt-1 text-sm text-red-500">{formErrors.tenCuaHang}</p>}
              </div>

              {/* Địa Chỉ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa Chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    editing
                      ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  } ${formErrors.diaChi ? "border-red-500" : ""}`}
                  placeholder="Nhập địa chỉ cửa hàng"
                />
                {formErrors.diaChi && <p className="mt-1 text-sm text-red-500">{formErrors.diaChi}</p>}
              </div>

              {/* Số Điện Thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số Điện Thoại</label>
                <input
                  type="tel"
                  name="soDienThoai"
                  value={formData.soDienThoai}
                  maxLength={10}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    editing
                      ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  } ${formErrors.soDienThoai ? "border-red-500" : ""}`}
                  placeholder="0912345678"
                />
                {formErrors.soDienThoai && <p className="mt-1 text-sm text-red-500">{formErrors.soDienThoai}</p>}
              </div>

              {/* Mô Tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
                <textarea
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleChange}
                  disabled={!editing}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors resize-none ${
                    editing
                      ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                  placeholder="Nhập mô tả về cửa hàng"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors disabled:opacity-50 font-medium"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaCheckCircle className="text-2xl text-[#8e2800]" />
            <p className="text-sm text-gray-600">Trạng Thái</p>
          </div>
          <p className={`text-lg font-semibold ${shop?.trangThai === "HOAT_DONG" ? "text-green-600" : "text-yellow-600"}`}>
            {shop?.trangThai === "HOAT_DONG" ? "Hoạt động" : "Chờ duyệt"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaCalendar className="text-2xl text-[#8e2800]" />
            <p className="text-sm text-gray-600">Ngày Tạo</p>
          </div>
          <p className="text-lg font-semibold text-gray-800">
            {shop?.ngayTao ? new Date(shop.ngayTao).toLocaleDateString("vi-VN") : "N/A"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaUser className="text-2xl text-[#8e2800]" />
            <p className="text-sm text-gray-600">Chủ Sở Hữu</p>
          </div>
          <p className="text-lg font-semibold text-gray-800">{user?.hoTen}</p>
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;
