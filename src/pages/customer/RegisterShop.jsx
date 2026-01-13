// src/pages/customer/RegisterShop.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shopService } from "@/api";
import CustomerSidebar from "../../components/customer/CustomerSidebar";
import { FaStore, FaCheckCircle, FaUpload, FaTimes, FaImage } from "react-icons/fa";
import { showToast } from "../../utils/toast";

const RegisterShop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    tenCuaHang: "",
    diaChi: "",
    soDienThoai: "",
    moTa: "",
  });
  const [files, setFiles] = useState({
    giayPhepKD: null,
    cccdMatTruoc: null,
    cccdMatSau: null,
    anhCuaHang: null,
  });
  const [previews, setPreviews] = useState({
    giayPhepKD: null,
    cccdMatTruoc: null,
    cccdMatSau: null,
    anhCuaHang: null,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.tenCuaHang.trim()) {
      newErrors.tenCuaHang = "Vui lòng nhập tên cửa hàng";
    } else if (formData.tenCuaHang.trim().length < 5) {
      newErrors.tenCuaHang = "Tên cửa hàng phải có ít nhất 5 ký tự";
    }

    if (!formData.diaChi.trim()) {
      newErrors.diaChi = "Vui lòng nhập địa chỉ";
    }

    if (!formData.soDienThoai.trim()) {
      newErrors.soDienThoai = "Vui lòng nhập số điện thoại";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ";
    }

    if (!files.giayPhepKD) {
      newErrors.giayPhepKD = "Vui lòng tải lên giấy phép kinh doanh";
    }

    if (!files.cccdMatTruoc) {
      newErrors.cccdMatTruoc = "Vui lòng tải lên CCCD mặt trước";
    }

    if (!files.cccdMatSau) {
      newErrors.cccdMatSau = "Vui lòng tải lên CCCD mặt sau";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    const file = fileList[0];

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        showToast.error("Chỉ chấp nhận file ảnh (JPEG, PNG) hoặc PDF");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error("File không được vượt quá 5MB");
        return;
      }

      setFiles({ ...files, [name]: file });

      // Create preview for images only
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews({ ...previews, [name]: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews({ ...previews, [name]: "pdf" });
      }

      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const removeFile = (name) => {
    setFiles({ ...files, [name]: null });
    setPreviews({ ...previews, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    try {
      const formDataWithFiles = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithFiles.append(key, value);
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) formDataWithFiles.append(key, file);
      });

      await shopService.registerShop(formDataWithFiles);
      setSuccess(true);
      showToast.success("Đăng ký thành công! Chờ admin duyệt.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      showToast.error(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
        <CustomerSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center border border-gray-200">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-5xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h2>
            <p className="text-gray-600 mb-6">Cửa hàng của bạn đang chờ duyệt. Admin sẽ kiểm tra thông tin trong vòng 24-48 giờ.</p>
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#8e2800] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const FileUploadBox = ({ name, label, required, preview, error }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {preview ? (
        <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
          {preview === "pdf" ? (
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">PDF đã tải lên</p>
              </div>
            </div>
          ) : (
            <img src={preview} alt={label} className="w-full h-32 object-cover" />
          )}
          <button
            type="button"
            onClick={() => removeFile(name)}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#8e2800] transition-colors">
          <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Click để tải lên</p>
          <p className="text-xs text-gray-500">JPEG, PNG hoặc PDF (Max 5MB)</p>
          <input
            type="file"
            name={name}
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            className="hidden"
          />
        </label>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      <CustomerSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <FaStore className="text-3xl text-[#8e2800]" />
              <h1 className="text-2xl font-bold text-gray-800">Đăng ký cửa hàng</h1>
            </div>
            <p className="text-gray-600">Mở rộng kinh doanh với nền tảng Pet Care Da Nang</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-5 border border-gray-200">
            {/* Thông tin cơ bản */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Thông tin cơ bản</h3>

              <div className="space-y-4">
                {/* Top Row: 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên cửa hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tenCuaHang"
                      value={formData.tenCuaHang}
                      onChange={handleInputChange}
                      placeholder="Tên cửa hàng"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                        errors.tenCuaHang
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#8e2800] focus:ring-[#8e2800]"
                      }`}
                    />
                    {errors.tenCuaHang && <p className="mt-1 text-sm text-red-500">{errors.tenCuaHang}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="diaChi"
                      value={formData.diaChi}
                      onChange={handleInputChange}
                      placeholder="Địa chỉ"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                        errors.diaChi
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#8e2800] focus:ring-[#8e2800]"
                      }`}
                    />
                    {errors.diaChi && <p className="mt-1 text-sm text-red-500">{errors.diaChi}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="soDienThoai"
                      value={formData.soDienThoai}
                      onChange={handleInputChange}
                      placeholder="0912345678"
                      maxLength={10}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 transition-colors ${
                        errors.soDienThoai
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-[#8e2800] focus:ring-[#8e2800]"
                      }`}
                    />
                    {errors.soDienThoai && <p className="mt-1 text-sm text-red-500">{errors.soDienThoai}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả cửa hàng</label>
                  <textarea
                    name="moTa"
                    value={formData.moTa}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Mô tả chi tiết về cửa hàng của bạn..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Tài liệu - Moved up */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Tài liệu đăng ký</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUploadBox
                  name="giayPhepKD"
                  label="Giấy phép kinh doanh"
                  required
                  preview={previews.giayPhepKD}
                  error={errors.giayPhepKD}
                />

                <FileUploadBox name="anhCuaHang" label="Ảnh cửa hàng" preview={previews.anhCuaHang} error={errors.anhCuaHang} />

                <FileUploadBox
                  name="cccdMatTruoc"
                  label="CCCD mặt trước"
                  required
                  preview={previews.cccdMatTruoc}
                  error={errors.cccdMatTruoc}
                />

                <FileUploadBox name="cccdMatSau" label="CCCD mặt sau" required preview={previews.cccdMatSau} error={errors.cccdMatSau} />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Admin sẽ kiểm tra thông tin và duyệt đơn trong vòng 24-48 giờ. Vui lòng cung cấp đầy đủ và chính xác
                thông tin để quá trình duyệt diễn ra nhanh chóng.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <FaStore />
                  <span>Đăng ký cửa hàng</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterShop;
