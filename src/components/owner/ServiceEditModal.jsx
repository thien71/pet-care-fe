import { useState, useEffect } from "react";
import { FaTimes, FaImage, FaDollarSign, FaClock } from "react-icons/fa";
import { getServiceImageUrl } from "@/utils/constants";

const ServiceEditModal = ({ isOpen, onClose, onSave, service, loading }) => {
  const [formData, setFormData] = useState({
    gia: "",
    moTaShop: "",
    thoiLuongShop: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (service) {
      setFormData({
        gia: service.gia || "",
        moTaShop: service.moTaShop || "",
        thoiLuongShop: service.thoiLuongShop || "",
      });
      // Convert path từ database thành full URL
      setImagePreview(service.hinhAnh ? getServiceImageUrl(service.hinhAnh) : null);
      setImageFile(null);
    }
  }, [service]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Vui lòng chọn file hình ảnh" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Kích thước ảnh không quá 5MB" });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.gia || parseFloat(formData.gia) <= 0) {
      newErrors.gia = "Giá phải lớn hơn 0";
    }

    if (formData.thoiLuongShop && (isNaN(formData.thoiLuongShop) || parseInt(formData.thoiLuongShop) <= 0)) {
      newErrors.thoiLuongShop = "Thời lượng phải là số dương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Nếu có file hoặc cần FormData
    if (imageFile || service?.maDichVuShop === null) {
      const formDataToSend = new FormData();

      // Add image nếu có
      if (imageFile) {
        formDataToSend.append("hinhAnh", imageFile);
      }

      // Add các fields bắt buộc
      formDataToSend.append("gia", parseFloat(formData.gia));

      // Add maDichVuHeThong khi thêm mới
      if (service?.maDichVuShop === null) {
        formDataToSend.append("maDichVuHeThong", service.maDichVu);
      }

      // Add optional fields
      if (formData.moTaShop) {
        formDataToSend.append("moTaShop", formData.moTaShop);
      }
      if (formData.thoiLuongShop) {
        formDataToSend.append("thoiLuongShop", parseInt(formData.thoiLuongShop));
      }

      onSave(formDataToSend, true);
    } else {
      // Gửi JSON thường khi không có file
      const submitData = {
        gia: parseFloat(formData.gia),
        moTaShop: formData.moTaShop || null,
        thoiLuongShop: formData.thoiLuongShop ? parseInt(formData.thoiLuongShop) : null,
      };
      onSave(submitData, false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{service?.maDichVuShop ? "Cập Nhật Dịch Vụ" : "Thêm Dịch Vụ"}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Service Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-1">{service?.tenDichVu}</p>
            <p className="text-sm text-gray-600">{service?.moTa}</p>
          </div>

          {/* Image Upload */}
          <div className="flex justify-between gap-8">
            <div className="flex-2/3">
              <label className="block text-sm font-bold text-gray-700 mb-3">Hình Ảnh Dịch Vụ</label>
              <div className="flex gap-4 items-start">
                {/* Preview */}
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaImage className="text-4xl text-gray-300" />
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="service-image-upload" />
                  <label
                    htmlFor="service-image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border border-gray-300 font-medium"
                  >
                    <FaImage />
                    Chọn Ảnh
                  </label>
                  <p className="text-sm text-gray-500 mt-2">Định dạng: JPG, PNG. Tối đa 5MB</p>
                  {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                </div>
              </div>
            </div>
            {/* Price and Duration in same row */}
            <div className="grid grid-cols-1 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Giá (đ) <span className="text-red-600">*</span>
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

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Thời Lượng (phút)</label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="60"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                      errors.thoiLuongShop ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.thoiLuongShop}
                    onChange={(e) => setFormData({ ...formData, thoiLuongShop: e.target.value })}
                    min="0"
                  />
                </div>
                {errors.thoiLuongShop && <p className="text-red-600 text-sm mt-1">{errors.thoiLuongShop}</p>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mô Tả Cửa Hàng</label>
            <textarea
              placeholder="Mô tả riêng của cửa hàng về dịch vụ này..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent h-24 resize-none"
              value={formData.moTaShop}
              onChange={(e) => setFormData({ ...formData, moTaShop: e.target.value })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceEditModal;
