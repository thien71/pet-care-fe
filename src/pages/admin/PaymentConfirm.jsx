// src/pages/admin/PaymentConfirm.jsx
import { useState, useEffect } from "react";
import { paymentService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaCheck, FaTimes, FaSpinner, FaImage, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaGift } from "react-icons/fa";
import ConfirmModal from "@/components/common/ConfirmModal";
import { BACKEND_URL } from "@/utils/constants";

const PaymentConfirm = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("CHO_XAC_NHAN");
  const [rejectReason, setRejectReason] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    payment: null,
    action: null,
  });

  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: null,
  });

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = filter === "ALL" ? {} : { trangThai: filter };
      const res = await paymentService.getPaymentConfirmations(params);
      setPayments(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (payment) => {
    setConfirmModal({
      isOpen: true,
      payment,
      action: "confirm",
    });
    setRejectReason("");
  };

  const openRejectModal = (payment) => {
    setConfirmModal({
      isOpen: true,
      payment,
      action: "reject",
    });
    setRejectReason("");
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      payment: null,
      action: null,
    });
    setRejectReason("");
  };

  const openImageModal = (imageUrl) => {
    setImageModal({ isOpen: true, imageUrl });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, imageUrl: null });
  };

  const handleConfirm = async () => {
    const { payment } = confirmModal;
    if (!payment) return;

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang xác nhận...");

    try {
      await paymentService.confirmPayment(payment.maThanhToan);
      showToast.dismiss(loadingToast);
      showToast.success("Xác nhận thanh toán thành công!");
      closeConfirmModal();
      await loadPayments();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi xác nhận thanh toán");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const { payment } = confirmModal;
    if (!payment) return;

    if (!rejectReason || !rejectReason.trim()) {
      showToast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang từ chối...");

    try {
      await paymentService.rejectPayment(payment.maThanhToan, rejectReason);
      showToast.dismiss(loadingToast);
      showToast.success("Từ chối thanh toán thành công!");
      closeConfirmModal();
      await loadPayments();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi từ chối thanh toán");
    } finally {
      setActionLoading(false);
    }
  };

  // ⭐ CẬP NHẬT: Thêm icon và màu sắc cho từng trạng thái
  const getStatusConfig = (status) => {
    const configs = {
      TRIAL: {
        text: "Dùng thử",
        class: "bg-purple-100 text-purple-700 border-purple-300",
        icon: FaGift,
      },
      CHUA_THANH_TOAN: {
        text: "Chưa thanh toán",
        class: "bg-gray-100 text-gray-700 border-gray-300",
        icon: FaClock,
      },
      CHO_XAC_NHAN: {
        text: "Chờ xác nhận",
        class: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: FaClock,
      },
      DA_THANH_TOAN: {
        text: "Đã thanh toán",
        class: "bg-green-100 text-green-700 border-green-300",
        icon: FaCheckCircle,
      },
      TU_CHOI: {
        text: "Đã từ chối",
        class: "bg-red-100 text-red-700 border-red-300",
        icon: FaTimesCircle,
      },
      QUA_HAN: {
        text: "Quá hạn",
        class: "bg-orange-100 text-orange-700 border-orange-300",
        icon: FaExclamationTriangle,
      },
    };
    return configs[status] || configs.CHUA_THANH_TOAN;
  };

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium border ${config.class}`}>
        <Icon className="text-base" />
        {config.text}
      </span>
    );
  };

  // ⭐ CẬP NHẬT: Filter statistics cho tất cả trạng thái
  const filterStats = {
    ALL: payments.length,
    CHO_XAC_NHAN: payments.filter((p) => p.trangThai === "CHO_XAC_NHAN").length,
    DA_THANH_TOAN: payments.filter((p) => p.trangThai === "DA_THANH_TOAN").length,
    TRIAL: payments.filter((p) => p.trangThai === "TRIAL").length,
    CHUA_THANH_TOAN: payments.filter((p) => p.trangThai === "CHUA_THANH_TOAN").length,
    TU_CHOI: payments.filter((p) => p.trangThai === "TU_CHOI").length,
    QUA_HAN: payments.filter((p) => p.trangThai === "QUA_HAN").length,
  };

  // ⭐ CẬP NHẬT: Filter buttons với tất cả trạng thái
  const filterButtons = [
    {
      value: "CHO_XAC_NHAN",
      label: "Chờ Xác Nhận",
      count: filterStats.CHO_XAC_NHAN,
      color: "yellow",
    },
    {
      value: "DA_THANH_TOAN",
      label: "Đã Thanh Toán",
      count: filterStats.DA_THANH_TOAN,
      color: "green",
    },
    {
      value: "TRIAL",
      label: "Dùng Thử",
      count: filterStats.TRIAL,
      color: "purple",
    },
    {
      value: "CHUA_THANH_TOAN",
      label: "Chưa Thanh Toán",
      count: filterStats.CHUA_THANH_TOAN,
      color: "gray",
    },
    {
      value: "TU_CHOI",
      label: "Đã Từ Chối",
      count: filterStats.TU_CHOI,
      color: "red",
    },
    {
      value: "QUA_HAN",
      label: "Quá Hạn",
      count: filterStats.QUA_HAN,
      color: "orange",
    },
    {
      value: "ALL",
      label: "Tất Cả",
      count: filterStats.ALL,
      color: "blue",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Xác Nhận Thanh Toán</h1>
        <p className="text-gray-600 mt-1">Xác nhận các khoản thanh toán từ cửa hàng</p>
      </div>

      {/* ⭐ Filter Tabs - CẬP NHẬT */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === tab.value
                  ? "bg-[#8e2800] text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  filter === tab.value ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cửa Hàng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Gói Thanh Toán</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số Tiền</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thời Gian</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.maThanhToan} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{payment.CuaHang?.tenCuaHang || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-800">{payment.GoiThanhToan?.tenGoi || "Dùng thử"}</div>
                        {payment.GoiThanhToan && <div className="text-sm text-gray-600">Gói {payment.GoiThanhToan.thoiGian} tháng</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#8e2800]">{parseInt(payment.soTien).toLocaleString("vi-VN")}đ</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        <div>Từ: {new Date(payment.thoiGianBatDau).toLocaleDateString("vi-VN")}</div>
                        <div>Đến: {new Date(payment.thoiGianKetThuc).toLocaleDateString("vi-VN")}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.trangThai)}

                      {/* Hiển thị lý do từ chối */}
                      {payment.trangThai === "TU_CHOI" && payment.ghiChu && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                          <strong>Lý do:</strong> {payment.ghiChu}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Nút xem biên lai */}
                        {payment.bienLaiThanhToan && (
                          <button
                            onClick={() => openImageModal(`${BACKEND_URL}${payment.bienLaiThanhToan}`)}
                            className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                            title="Xem biên lai"
                          >
                            <FaImage />
                          </button>
                        )}

                        {/* ⭐ Nút xác nhận/từ chối - CHỈ hiển thị cho CHO_XAC_NHAN */}
                        {payment.trangThai === "CHO_XAC_NHAN" && (
                          <>
                            <button
                              onClick={() => openConfirmModal(payment)}
                              className="p-2 text-green-700 hover:bg-green-50 rounded-lg border border-green-200 transition-colors"
                              title="Xác nhận"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => openRejectModal(payment)}
                              className="p-2 text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                              title="Từ chối"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}

                        {/* Hiển thị trạng thái cho các case khác */}
                        {payment.trangThai === "DA_THANH_TOAN" && <span className="text-sm text-green-600 font-medium">✓ Đã xác nhận</span>}

                        {payment.trangThai === "TRIAL" && <span className="text-sm text-purple-600 font-medium">🎁 Đang dùng thử</span>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">Không có thanh toán nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeImageModal}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimes />
            </button>
            <img src={imageModal.imageUrl} alt="Biên lai" className="w-full rounded-lg shadow-2xl" />
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && confirmModal.action === "confirm" && (
        <ConfirmModal
          isOpen={true}
          onClose={closeConfirmModal}
          onConfirm={handleConfirm}
          title="Xác Nhận Thanh Toán"
          message={`Bạn có chắc chắn xác nhận thanh toán cho cửa hàng "${confirmModal.payment?.CuaHang?.tenCuaHang}"?`}
          confirmText="Xác Nhận"
          cancelText="Hủy"
          type="success"
          loading={actionLoading}
        />
      )}

      {/* Reject Modal với input lý do */}
      {confirmModal.isOpen && confirmModal.action === "reject" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Từ Chối Thanh Toán</h3>

            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn từ chối thanh toán của cửa hàng "{confirmModal.payment?.CuaHang?.tenCuaHang}"?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Nhập lý do từ chối..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading && <FaSpinner className="animate-spin" />}
                Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirm;
