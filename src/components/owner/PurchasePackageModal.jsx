// src/components/owner/PurchasePackageModal.jsx
import { FaTimes, FaSpinner, FaInfoCircle } from "react-icons/fa";

const PurchasePackageModal = ({ isOpen, onClose, onConfirm, packageData, loading }) => {
  if (!isOpen || !packageData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Xác Nhận Đăng Ký</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <FaInfoCircle className="text-blue-600 text-lg mt-0.5 shrink-0" />
            <span className="text-sm text-blue-800">Sau khi đăng ký, vui lòng chuyển khoản và admin sẽ xác nhận trong 24-48 giờ</span>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Gói</p>
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

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-800 mb-2">Thông Tin Chuyển Khoản</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Ngân hàng:</span> Vietcombank
              </p>
              <p className="text-sm">
                <span className="font-medium">Số TK:</span> 1234567890
              </p>
              <p className="text-sm">
                <span className="font-medium">Chủ TK:</span> PETCARE DA NANG
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Nội dung:</span> THANHTOAN [TÊN CỬA HÀNG]
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Xác Nhận Đăng Ký</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePackageModal;
