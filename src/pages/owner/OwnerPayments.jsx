// src/pages/owner/OwnerPayments.jsx (UPDATED)
import { useState, useEffect } from "react";
import { paymentService } from "@/api";
import { FaSpinner, FaCreditCard, FaCheckCircle, FaClock, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { showToast } from "@/utils/toast";
import PurchasePackageModal from "@/components/owner/PurchasePackageModal";

const OwnerPayments = () => {
  const [packages, setPackages] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [packagesRes, paymentsRes] = await Promise.all([paymentService.getPaymentPackages(), paymentService.getMyPayments()]);
      setPackages(packagesRes.data || []);
      setMyPayments(paymentsRes.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openPurchaseModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  // ⭐ CẬP NHẬT: Nhận file từ modal
  const handlePurchase = async (receiptFile) => {
    try {
      setActionLoading(true);

      // 1. Đăng ký gói
      const paymentRes = await paymentService.purchasePackage({
        maGoi: selectedPackage.maGoi,
      });

      // Sửa: Lấy đúng payment object từ response (server trả { message, data })
      // const payment = paymentRes.data.data;
      console.log("PaymentRes", paymentRes);

      // 2. Upload biên lai
      const formData = new FormData();
      formData.append("paymentId", paymentRes.data.maThanhToan);
      formData.append("bienLai", receiptFile);
      formData.append("ghiChu", "");

      await paymentService.uploadPaymentProof(formData);
      showToast.success("Đăng ký và upload biên lai thành công! Chờ admin xác nhận.");
      setShowPurchaseModal(false);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi xử lý");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      DA_THANH_TOAN: {
        text: "Đã thanh toán",
        class: "bg-green-100 text-green-700 border-green-200",
        icon: FaCheckCircle,
      },
      CHO_XAC_NHAN: {
        text: "Chờ xác nhận",
        class: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: FaClock,
      },
      CHUA_THANH_TOAN: {
        text: "Chưa thanh toán",
        class: "bg-gray-100 text-gray-700 border-gray-200",
        icon: FaClock,
      },
      TU_CHOI: {
        text: "Bị từ chối",
        class: "bg-red-100 text-red-700 border-red-200",
        icon: FaTimes,
      },
      QUA_HAN: {
        text: "Quá hạn",
        class: "bg-red-100 text-red-700 border-red-200",
        icon: FaExclamationTriangle,
      },
    };
    const cfg = config[status] || config.CHUA_THANH_TOAN;
    const Icon = cfg.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-medium border ${cfg.class}`}>
        <Icon />
        {cfg.text}
      </span>
    );
  };

  const getCurrentSubscription = () => {
    const active = myPayments.find((p) => p.trangThai === "DA_THANH_TOAN");
    if (!active) return null;

    const endDate = new Date(active.thoiGianKetThuc);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    return { ...active, daysLeft };
  };

  const currentSub = getCurrentSubscription();

  if (loading && packages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <FaCreditCard className="text-2xl text-[#8e2800]" />
          <h1 className="text-2xl font-bold text-gray-800">Thanh Toán & Gói Dịch Vụ</h1>
        </div>
        <p className="text-gray-600">Quản lý gói thanh toán và lịch sử thanh toán của cửa hàng</p>
      </div>

      {/* Current Subscription */}
      {currentSub ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaCheckCircle className="text-2xl text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Gói Đang Sử Dụng</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Gói</p>
              <p className="text-lg font-bold text-gray-800">{currentSub.GoiThanhToan?.tenGoi || "N/A"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Hết hạn</p>
              <p className="text-lg font-bold text-gray-800">{new Date(currentSub.thoiGianKetThuc).toLocaleDateString("vi-VN")}</p>
              <p className="text-sm text-gray-500 mt-1">Còn {currentSub.daysLeft} ngày</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium border border-green-200 mt-2">
                <FaCheckCircle />
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-600 text-2xl mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-yellow-800">Chưa có gói đang hoạt động</p>
            <p className="text-sm text-yellow-700 mt-1">Vui lòng đăng ký gói dưới đây để tiếp tục sử dụng dịch vụ!</p>
          </div>
        </div>
      )}

      {/* Available Packages */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Các Gói Có Sẵn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg.maGoi} className="border border-gray-200 rounded-lg p-6 hover:border-[#8e2800] transition-all">
                <h3 className="text-xl font-bold text-gray-800 text-center mb-4">{pkg.tenGoi}</h3>

                <div className="space-y-3 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Giá</p>
                    <p className="text-2xl font-bold text-[#8e2800]">{parseInt(pkg.soTien).toLocaleString("vi-VN")}đ</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Thời Gian</p>
                    <p className="text-xl font-bold text-gray-800">{pkg.thoiGian} tháng</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Giá / Tháng</p>
                    <p className="text-lg font-bold text-gray-800">
                      {(parseInt(pkg.soTien) / pkg.thoiGian).toLocaleString("vi-VN", {
                        maximumFractionDigits: 0,
                      })}
                      đ
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openPurchaseModal(pkg)}
                  className="w-full px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
                >
                  Đăng Ký Ngay
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">Chưa có gói nào có sẵn</div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Lịch Sử Thanh Toán</h2>
        </div>

        {myPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Gói</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Số Tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Thời Gian</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myPayments.map((payment) => (
                  <tr key={payment.maThanhToan} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{payment.GoiThanhToan?.tenGoi || "N/A"}</div>
                      <div className="text-xs text-gray-500">{payment.GoiThanhToan?.thoiGian} tháng</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#8e2800]">{parseInt(payment.soTien).toLocaleString("vi-VN")}đ</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div>{new Date(payment.thoiGianBatDau).toLocaleDateString("vi-VN")}</div>
                        <div className="text-xs text-gray-500">đến</div>
                        <div>{new Date(payment.thoiGianKetThuc).toLocaleDateString("vi-VN")}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.trangThai)}

                      {payment.trangThai === "TU_CHOI" && payment.ghiChu && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                          <strong>Lý do:</strong> {payment.ghiChu}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">Chưa có lịch sử thanh toán</div>
        )}
      </div>

      {/* Purchase Modal */}
      <PurchasePackageModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onConfirm={handlePurchase}
        packageData={selectedPackage}
        loading={actionLoading}
      />
    </div>
  );
};

export default OwnerPayments;
