// src/utils/toast.js
import toast from "react-hot-toast";

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 4000,
    });
  },

  error: (message) => {
    toast.error(message, {
      duration: 5000,
    });
  },

  loading: (message) => {
    return toast.loading(message);
  },

  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || "Đang xử lý...",
      success: messages.success || "Thành công!",
      error: messages.error || "Đã có lỗi xảy ra",
    });
  },

  custom: (message, options = {}) => {
    toast(message, options);
  },

  dismiss: (toastId) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};

export default showToast;
