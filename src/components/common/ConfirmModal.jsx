// src/components/common/ConfirmModal.jsx
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "warning", // warning | danger | info | success
  loading = false,
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: FaExclamationTriangle,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      confirmBg: "bg-yellow-600 hover:bg-yellow-700",
    },
    danger: {
      icon: FaExclamationTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      confirmBg: "bg-red-600 hover:bg-red-700",
    },
    info: {
      icon: FaInfoCircle,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      confirmBg: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      icon: FaCheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      confirmBg: "bg-green-600 hover:bg-green-700",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 w-12 h-12 rounded-lg ${config.iconBg} flex items-center justify-center`}>
              <Icon className={`text-2xl ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg font-medium disabled:opacity-50 transition-colors ${config.confirmBg}`}
          >
            {loading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
