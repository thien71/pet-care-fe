// src/pages/admin/PaymentConfirm.jsx
import { useState, useEffect } from "react";
import { paymentService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaCheck, FaTimes, FaSpinner, FaImage } from "react-icons/fa";
import ConfirmModal from "@/components/common/ConfirmModal";
import { BACKEND_URL } from "@/utils/constants";

const PaymentConfirm = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("CHUA_THANH_TOAN");
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    payment: null,
    action: null,
  });

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = { trangThai: filter };
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
  };

  const openRejectModal = (payment) => {
    setConfirmModal({
      isOpen: true,
      payment,
      action: "reject",
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      payment: null,
      action: null,
    });
  };

  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: null,
  });

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

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang từ chối...");

    try {
      await paymentService.rejectPayment(payment.maThanhToan);
      showToast.dismiss(loadingToast);
      showToast.success("Từ chối thanh toán!");
      closeConfirmModal();
      await loadPayments();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi từ chối thanh toán");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      DA_THANH_TOAN: { text: "Đã thanh toán", class: "bg-green-100 text-green-700 border-green-300" },
      CHUA_THANH_TOAN: { text: "Chưa thanh toán", class: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      QUA_HAN: { text: "Quá hạn", class: "bg-red-100 text-red-700 border-red-300" },
    };
    const { text, class: className } = config[status] || config.CHUA_THANH_TOAN;
    return <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${className}`}>{text}</span>;
  };

  const filterStats = {
    CHUA_THANH_TOAN: payments.filter((p) => p.trangThai === "CHUA_THANH_TOAN").length,
    DA_THANH_TOAN: payments.filter((p) => p.trangThai === "DA_THANH_TOAN").length,
    QUA_HAN: payments.filter((p) => p.trangThai === "QUA_HAN").length,
  };

  const filterButtons = [
    { value: "CHUA_THANH_TOAN", label: "Chưa Thanh Toán", count: filterStats.CHUA_THANH_TOAN },
    { value: "DA_THANH_TOAN", label: "Đã Thanh Toán", count: filterStats.DA_THANH_TOAN },
    { value: "QUA_HAN", label: "Quá Hạn", count: filterStats.QUA_HAN },
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

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === tab.value ? "bg-[#8e2800] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label} ({tab.count})
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
                        <div className="font-medium text-gray-800">{payment.GoiThanhToan?.tenGoi || "N/A"}</div>
                        <div className="text-sm text-gray-600">Gói {payment.GoiThanhToan?.thoiGian} tháng</div>
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
                    <td className="px-6 py-4">{getStatusBadge(payment.trangThai)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Nút xem biên lai */}
                        {payment.bienLaiThanhToan && (
                          <button
                            onClick={() => openImageModal(`${BACKEND_URL}${payment.bienLaiThanhToan}`)}
                            className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200"
                            title="Xem biên lai"
                          >
                            <FaImage />
                          </button>
                        )}

                        {/* Nút xác nhận/từ chối */}
                        {payment.trangThai === "CHO_XAC_NHAN" && (
                          <>
                            <button
                              onClick={() => openConfirmModal(payment)}
                              className="p-2 text-green-700 hover:bg-green-50 rounded-lg border border-green-200"
                              title="Xác nhận"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => openRejectModal(payment)}
                              className="p-2 text-red-700 hover:bg-red-50 rounded-lg border border-red-200"
                              title="Từ chối"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
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

      {/* Confirm Modal */}
      {/* <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.action === "confirm"}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
        title="Xác Nhận Thanh Toán"
        message={`Bạn có chắc chắn xác nhận thanh toán cho cửa hàng "${confirmModal.payment?.CuaHang?.tenCuaHang}"?`}
        confirmText="Xác Nhận"
        cancelText="Hủy"
        type="success"
        loading={actionLoading}
      /> */}

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeImageModal}>
          <div className="relative max-w-4xl w-full">
            <button onClick={closeImageModal} className="absolute -top-12 right-0 p-2 bg-white rounded-lg hover:bg-gray-100">
              <FaTimes />
            </button>
            <img src={imageModal.imageUrl} alt="Biên lai" className="w-full rounded-lg" />
          </div>
        </div>
      )}

      {/* Reject Modal với input lý do */}
      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.action === "reject"}
        onClose={closeConfirmModal}
        onConfirm={handleReject}
        title="Từ Chối Thanh Toán"
        // message={
        //   <>
        //     <p className="mb-4">Bạn có chắc chắn từ chối thanh toán của cửa hàng "{confirmModal.payment?.CuaHang?.tenCuaHang}"?</p>
        //     <textarea
        //       value={rejectReason}
        //       onChange={(e) => setRejectReason(e.target.value)}
        //       rows={3}
        //       placeholder="Nhập lý do từ chối..."
        //       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] resize-none"
        //     />
        //   </>
        // }
        confirmText="Từ Chối"
        cancelText="Hủy"
        type="warning"
        loading={actionLoading}
      />
    </div>
  );
};

export default PaymentConfirm;
