// src/pages/customer/RegisterShop.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const RegisterShop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    tenCuaHang: "",
    diaChi: "",
    soDienThoai: "",
    moTa: "",
    kinhDo: "",
    viDo: "",
  });
  const [files, setFiles] = useState({
    giayPhepKD: null,
    cccdMatTruoc: null,
    cccdMatSau: null,
    anhCuaHang: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList[0]) {
      setFiles({ ...files, [name]: fileList[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate
      if (!formData.tenCuaHang.trim()) {
        setError("Vui lòng nhập tên cửa hàng");
        setLoading(false);
        return;
      }

      // Tạo FormData để upload file
      const formDataWithFiles = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithFiles.append(key, value);
      });

      // Thêm files
      Object.entries(files).forEach(([key, file]) => {
        if (file) formDataWithFiles.append(key, file);
      });

      // Gọi API
      const response = await apiClient.post(
        "/customer/register-shop",
        formDataWithFiles,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/customer/booking");
      }, 2000);
    } catch (err) {
      setError(err.message || "Đăng ký cửa hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="card w-96 bg-base-100 shadow-2xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="card-title text-success">Đăng ký thành công!</h2>
            <p className="text-gray-600">
              Cửa hàng của bạn đang chờ duyệt. Admin sẽ kiểm tra thông tin trong
              vòng 24-48 giờ.
            </p>
            <div className="mt-4">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏪</div>
              <h1 className="text-3xl font-bold mb-2">Đăng Ký Cửa Hàng</h1>
              <p className="text-gray-600">
                Mở rộng kinh doanh với nền tảng Pet Care Da Nang
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Tên Cửa Hàng *
                  </span>
                </label>
                <input
                  type="text"
                  name="tenCuaHang"
                  placeholder="Ví dụ: Pet Care Premium Đà Nẵng"
                  className="input input-bordered"
                  value={formData.tenCuaHang}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              {/* Grid 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Địa Chỉ *</span>
                  </label>
                  <input
                    type="text"
                    name="diaChi"
                    placeholder="Địa chỉ cửa hàng"
                    className="input input-bordered"
                    value={formData.diaChi}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Số Điện Thoại *
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="soDienThoai"
                    placeholder="0912345678"
                    className="input input-bordered"
                    value={formData.soDienThoai}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Tọa độ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Kinh Độ</span>
                  </label>
                  <input
                    type="number"
                    name="kinhDo"
                    placeholder="107.5930"
                    step="0.0001"
                    className="input input-bordered"
                    value={formData.kinhDo}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Vĩ Độ</span>
                  </label>
                  <input
                    type="number"
                    name="viDo"
                    placeholder="16.0544"
                    step="0.0001"
                    className="input input-bordered"
                    value={formData.viDo}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Mô Tả Cửa Hàng
                  </span>
                </label>
                <textarea
                  name="moTa"
                  placeholder="Mô tả chi tiết về cửa hàng của bạn..."
                  className="textarea textarea-bordered h-24"
                  value={formData.moTa}
                  onChange={handleInputChange}
                  disabled={loading}
                ></textarea>
              </div>

              {/* Upload Files */}
              <div className="divider">Tài Liệu Đăng Ký</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Giấy Phép Kinh Doanh *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="giayPhepKD"
                    className="file-input file-input-bordered"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {files.giayPhepKD
                      ? `Đã chọn: ${files.giayPhepKD.name}`
                      : "Chưa chọn file"}
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Ảnh Cửa Hàng
                    </span>
                  </label>
                  <input
                    type="file"
                    name="anhCuaHang"
                    className="file-input file-input-bordered"
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {files.anhCuaHang
                      ? `Đã chọn: ${files.anhCuaHang.name}`
                      : "Chưa chọn file"}
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      CCCD Mặt Trước *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="cccdMatTruoc"
                    className="file-input file-input-bordered"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {files.cccdMatTruoc
                      ? `Đã chọn: ${files.cccdMatTruoc.name}`
                      : "Chưa chọn file"}
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      CCCD Mặt Sau *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="cccdMatSau"
                    className="file-input file-input-bordered"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {files.cccdMatSau
                      ? `Đã chọn: ${files.cccdMatSau.name}`
                      : "Chưa chọn file"}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="alert alert-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Admin sẽ kiểm tra thông tin và duyệt đơn trong vòng 24-48 giờ
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Đăng Ký Cửa Hàng
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterShop;
