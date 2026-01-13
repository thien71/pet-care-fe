// src/components/owner/PurchasePackageModal.jsx - COMPACT VERSION
import { useState } from "react";
import { FaTimes, FaSpinner, FaUpload, FaCheckCircle, FaQrcode } from "react-icons/fa";

const PurchasePackageModal = ({ isOpen, onClose, onConfirm, packageData, loading }) => {
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!isOpen || !packageData) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn! Vui lòng chọn file < 5MB");
      return;
    }

    // Kiểm tra định dạng
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    setReceiptFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!receiptFile) {
      alert("Vui lòng chọn ảnh biên lai!");
      return;
    }

    onConfirm(receiptFile);
  };

  const handleClose = () => {
    setReceiptFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Xác Nhận Đăng Ký Gói</h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Thông tin gói - COMPACT */}
          <div className="bg-linear-to-r from-[#8e2800] to-[#c43a0e] text-white rounded-lg p-4">
            <h4 className="text-lg font-bold mb-3">{packageData.tenGoi}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="opacity-90 mb-1">Giá tiền</p>
                <p className="text-xl font-bold">{parseInt(packageData.soTien).toLocaleString("vi-VN")}đ</p>
              </div>
              <div>
                <p className="opacity-90 mb-1">Thời hạn</p>
                <p className="text-xl font-bold">{packageData.thoiGian} tháng</p>
              </div>
            </div>
          </div>

          {/* Hướng dẫn thanh toán - COMPACT */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex2/3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-4">
              <h5 className="font-semibold text-blue-900 mb-2 text-sm">Hướng dẫn thanh toán</h5>
              <ol className="text-sm text-blue-800 space-y-1 ml-0">
                <li>
                  1. STK: <strong>1234567890</strong>
                </li>
                <li>
                  2. Ngân hàng: <strong>Vietcombank</strong>
                </li>
                <li>
                  3. Chủ TK: <strong>Nguyen Van Thanh Thien</strong>
                </li>
                <li>
                  4. Nội dung: <strong>Thanh toan goi {packageData.tenGoi}</strong>
                </li>
              </ol>
            </div>

            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <FaQrcode className="text-6xl text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 text-center">Mã QR thanh toán</p>
            </div>
          </div>

          {/* Upload biên lai */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Upload Biên Lai <span className="text-red-500">*</span>
            </label>

            {!previewUrl ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#8e2800] transition-colors">
                  <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click để chọn ảnh biên lai</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={loading} />
              </label>
            ) : (
              <div className="relative">
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-contain bg-gray-50 rounded-lg border border-gray-200" />
                <button
                  onClick={() => {
                    setReceiptFile(null);
                    setPreviewUrl(null);
                  }}
                  disabled={loading}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <FaTimes />
                </button>
                <div className="flex items-center gap-2 mt-2 text-sm text-green-700">
                  <FaCheckCircle />
                  <span>{receiptFile?.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !receiptFile}
            className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            Xác Nhận Đăng Ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePackageModal;
