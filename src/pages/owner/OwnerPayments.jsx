// src/pages/owner/OwnerPayments.jsx
import { useState, useEffect } from "react";
// import apiClient from "../../api/apiClient";
import { paymentService } from "@/api";

const OwnerPayments = () => {
  const [packages, setPackages] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [packagesRes, paymentsRes] = await Promise.all([
        paymentService.getPaymentPackages(),
        paymentService.getMyPayments(),
        // paymentService.getPaymentPackages(),
        // apiClient.get("/owner/my-payments"),
      ]);
      setPackages(packagesRes.data || []);
      setMyPayments(paymentsRes.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openPurchaseModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  const handlePurchase = async () => {
    try {
      setLoading(true);
      await paymentService.purchasePackage({ maGoi: selectedPackage.maGoi });

      // await apiClient.post("/owner/purchase-package", {
      //   maGoi: selectedPackage.maGoi,
      // });
      setSuccess("Đăng ký gói thành công! Admin sẽ xác nhận thanh toán trong vòng 24-48 giờ.");
      setShowPurchaseModal(false);
      await loadData();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.message || "Lỗi khi đăng ký gói");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      DA_THANH_TOAN: "badge-success",
      CHUA_THANH_TOAN: "badge-warning",
      QUA_HAN: "badge-error",
    };
    const labels = {
      DA_THANH_TOAN: "Đã thanh toán",
      CHUA_THANH_TOAN: "Chờ xác nhận",
      QUA_HAN: "Quá hạn",
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  const getPackageIcon = (name) => {
    if (name.toLowerCase().includes("cơ bản")) return "🥉";
    if (name.toLowerCase().includes("nâng cao")) return "🥈";
    if (name.toLowerCase().includes("vip")) return "🥇";
    return "💳";
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

  if (loading && packages.length === 0 && myPayments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">💳 Thanh Toán & Gói Dịch Vụ</h1>
        <p className="text-gray-600 mt-2">Quản lý gói thanh toán và lịch sử thanh toán của cửa hàng</p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
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

      {/* Current Subscription */}
      {currentSub ? (
        <div className="card bg-linear-to-r from-primary via-secondary to-accent text-white shadow-2xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">🎉 Gói Đang Sử Dụng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="opacity-80">Gói:</p>
                <p className="text-2xl font-bold">{currentSub.GoiThanhToan?.tenGoi || "N/A"}</p>
              </div>
              <div>
                <p className="opacity-80">Hết hạn:</p>
                <p className="text-2xl font-bold">{new Date(currentSub.thoiGianKetThuc).toLocaleDateString("vi-VN")}</p>
                <p className="text-sm opacity-80">Còn {currentSub.daysLeft} ngày</p>
              </div>
              <div>
                <p className="opacity-80">Trạng thái:</p>
                <span className="badge badge-success badge-lg mt-2">✅ Đang hoạt động</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Bạn chưa có gói nào đang hoạt động. Vui lòng đăng ký gói dưới đây!</span>
        </div>
      )}

      {/* Available Packages */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📦 Các Gói Có Sẵn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg.maGoi} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="card-body items-center text-center">
                  <div className="text-6xl mb-4">{getPackageIcon(pkg.tenGoi)}</div>
                  <h2 className="card-title text-2xl">{pkg.tenGoi}</h2>

                  <div className="divider my-2"></div>

                  <div className="space-y-2 w-full">
                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Giá</div>
                      <div className="stat-value text-2xl text-primary">{parseInt(pkg.soTien).toLocaleString("vi-VN")}đ</div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Thời Gian</div>
                      <div className="stat-value text-xl text-secondary">{pkg.thoiGian} tháng</div>
                    </div>

                    <div className="stat bg-base-200 rounded-lg">
                      <div className="stat-title">Giá / Tháng</div>
                      <div className="stat-value text-lg text-accent">
                        {(parseInt(pkg.soTien) / pkg.thoiGian).toLocaleString("vi-VN", { maximumFractionDigits: 0 })}đ
                      </div>
                    </div>
                  </div>

                  <button onClick={() => openPurchaseModal(pkg)} className="btn btn-primary mt-6 w-full">
                    Đăng Ký Ngay
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">Chưa có gói nào có sẵn</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📜 Lịch Sử Thanh Toán</h2>
        <div className="card bg-base-100 shadow-xl overflow-x-auto">
          <div className="card-body p-0">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th>Gói</th>
                  <th>Số Tiền</th>
                  <th>Thời Gian</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Đăng Ký</th>
                </tr>
              </thead>
              <tbody>
                {myPayments.length > 0 ? (
                  myPayments.map((payment) => (
                    <tr key={payment.maThanhToan} className="hover">
                      <td>
                        <div className="font-semibold">{payment.GoiThanhToan?.tenGoi || "N/A"}</div>
                        <div className="text-xs text-gray-500">{payment.GoiThanhToan?.thoiGian} tháng</div>
                      </td>
                      <td>
                        <span className="font-bold text-primary">{parseInt(payment.soTien).toLocaleString("vi-VN")}đ</span>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>{new Date(payment.thoiGianBatDau).toLocaleDateString("vi-VN")}</div>
                          <div className="text-gray-500">đến</div>
                          <div>{new Date(payment.thoiGianKetThuc).toLocaleDateString("vi-VN")}</div>
                        </div>
                      </td>
                      <td>{getStatusBadge(payment.trangThai)}</td>
                      <td>{new Date(payment.ngayTao).toLocaleDateString("vi-VN")}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      Chưa có lịch sử thanh toán
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedPackage && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">💳 Xác Nhận Đăng Ký</h3>

            <div className="space-y-4">
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>Sau khi đăng ký, vui lòng chuyển khoản và admin sẽ xác nhận trong 24-48 giờ</span>
              </div>

              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Gói</div>
                <div className="stat-value text-lg">{selectedPackage.tenGoi}</div>
              </div>

              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Thời Gian</div>
                <div className="stat-value text-lg">{selectedPackage.thoiGian} tháng</div>
              </div>

              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Tổng Thanh Toán</div>
                <div className="stat-value text-xl text-primary">{parseInt(selectedPackage.soTien).toLocaleString("vi-VN")}đ</div>
              </div>

              <div className="divider">Thông Tin Chuyển Khoản</div>

              <div className="bg-base-200 p-4 rounded-lg">
                <p className="font-semibold">Ngân hàng: Vietcombank</p>
                <p className="font-semibold">Số TK: 1234567890</p>
                <p className="font-semibold">Chủ TK: PETCARE DA NANG</p>
                <p className="text-sm text-gray-600 mt-2">Nội dung: THANHTOAN [TÊN CỬA HÀNG]</p>
              </div>
            </div>

            <div className="modal-action">
              <button onClick={() => setShowPurchaseModal(false)} className="btn btn-ghost">
                Hủy
              </button>
              <button onClick={handlePurchase} className="btn btn-primary" disabled={loading}>
                {loading ? "Đang xử lý..." : "Xác Nhận Đăng Ký"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowPurchaseModal(false)}></div>
        </div>
      )}
    </div>
  );
};

export default OwnerPayments;
