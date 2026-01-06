// src/components/owner/UploadPaymentProofModal.jsx
import { useState } from "react";
import { FaUpload, FaTimes, FaImage, FaCheckCircle } from "react-icons/fa";

const UploadPaymentProofModal = ({ isOpen, onClose, payment, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showToast.error("Chỉ chấp nhận file ảnh");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast.error("File không được vượt quá 5MB");
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

  const handleSubmit = async () => {
    if (!file) {
      showToast.error("Vui lòng chọn ảnh biên lai");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("paymentId", payment.maThanhToan);
    formData.append("bienLai", file);
    formData.append("ghiChu", note);

    try {
      await paymentService.uploadPaymentProof(formData);
      showToast.success("Upload biên lai thành công! Chờ admin xác nhận.");
      onSuccess();
      onClose();
    } catch (err) {
      showToast.error(err.message || "Upload thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Upload Biên Lai Thanh Toán</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Thông tin gói */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Gói</p>
                <p className="font-medium text-gray-800">{payment.GoiThanhToan?.tenGoi}</p>
              </div>
              <div>
                <p className="text-gray-600">Số tiền</p>
                <p className="font-bold text-[#8e2800]">{parseInt(payment.soTien).toLocaleString("vi-VN")}đ</p>
              </div>
            </div>
          </div>

          {/* Upload ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biên lai chuyển khoản <span className="text-red-500">*</span>
            </label>

            {preview ? (
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                <img src={preview} alt="Biên lai" className="w-full h-64 object-contain bg-gray-50" />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Nội dung chuyển khoản, mã giao dịch..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent resize-none"
            />
          </div>

          {/* Thông tin chuyển khoản */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Thông tin chuyển khoản:</p>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                • Ngân hàng: <strong>Vietcombank</strong>
              </p>
              <p>
                • Số TK: <strong>1234567890</strong>
              </p>
              <p>
                • Chủ TK: <strong>NGUYEN VAN THANH THIEN</strong>
              </p>
              <p>
                • Nội dung: <strong>THANHTOAN {payment.maThanhToan}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang upload...
              </>
            ) : (
              <>
                <FaUpload />
                Upload Biên Lai
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPaymentProofModal;
