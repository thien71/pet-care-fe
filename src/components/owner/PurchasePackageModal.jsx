// src/components/owner/PurchasePackageModal.jsx (REDESIGNED)
import { useState } from "react";
import { FaTimes, FaSpinner, FaInfoCircle, FaUpload, FaImage, FaQrcode } from "react-icons/fa";

const PurchasePackageModal = ({ isOpen, onClose, onConfirm, packageData, loading }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!isOpen || !packageData) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Chỉ chấp nhận file ảnh");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File không được vượt quá 5MB");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    if (!file) {
      alert("Vui lòng upload biên lai");
      return;
    }
    onConfirm(file);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Đăng Ký Gói Thanh Toán</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <FaInfoCircle className="text-blue-600 text-lg mt-0.5 shrink-0" />
            <span className="text-sm text-blue-800">Vui lòng chuyển khoản và upload biên lai. Admin sẽ xác nhận trong 24-48 giờ.</span>
          </div>

          {/* 2 Columns Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left: Package Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800 mb-4">Thông Tin Gói</h4>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Tên Gói</p>
                <p className="text-lg font-bold text-gray-800">{packageData.tenGoi}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Thời Gian</p>
                <p className="text-lg font-bold text-gray-800">{packageData.thoiGian} tháng</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Tổng Thanh Toán</p>
                <p className="text-2xl font-bold text-[#8e2800]">{parseInt(packageData.soTien).toLocaleString("vi-VN")}đ</p>
              </div>
            </div>

            {/* Right: Payment Info + QR */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800 mb-4">Thông Tin Chuyển Khoản</h4>

              {/* QR Code Placeholder */}
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <FaQrcode className="text-6xl text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 text-center">Mã QR thanh toán</p>
                <p className="text-xs text-gray-500 mt-1">(Quét để chuyển khoản nhanh)</p>
              </div>

              {/* Bank Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-medium text-gray-800">Vietcombank</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số TK:</span>
                  <span className="font-medium text-gray-800">1234567890</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Chủ TK:</span>
                  <span className="font-medium text-gray-800">NGUYEN VAN THANH THIEN</span>
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <p className="text-xs text-gray-600 mb-1">Nội dung chuyển khoản:</p>
                  <p className="font-bold text-[#8e2800]">THANHTOAN [TÊN CỬA HÀNG]</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Receipt */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-800 mb-4">Upload Biên Lai Chuyển Khoản</h4>

            {preview ? (
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                <img src={preview} alt="Biên lai" className="w-full h-64 object-contain bg-gray-50" />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#8e2800] transition-colors">
                <FaImage className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">Click để chọn ảnh biên lai</p>
                <p className="text-xs text-gray-500">JPEG, PNG (Max 5MB)</p>
                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 justify-end border-t border-gray-200 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="flex items-center gap-2 px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>Đăng Ký & Upload Biên Lai</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePackageModal;
