// src/pages/admin/PaymentConfirm.jsx
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const PaymentConfirm = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("CHUA_THANH_TOAN");

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = { trangThai: filter };
      const res = await apiClient.get("/admin/payment-confirmations", {
        params,
      });
      setPayments(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (paymentId) => {
    if (window.confirm("Xác nhận thanh toán cho cửa hàng này?")) {
      try {
        setLoading(true);
        await apiClient.put(
          `/admin/payment-confirmations/${paymentId}/confirm`
        );
        setSuccess("Xác nhận thanh toán thành công!");
        await loadPayments();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi xác nhận thanh toán");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReject = async (paymentId) => {
    if (
      window.confirm("Từ chối thanh toán này? Cửa hàng sẽ cần thanh toán lại.")
    ) {
      try {
        setLoading(true);
        await apiClient.put(`/admin/payment-confirmations/${paymentId}/reject`);
        setSuccess("Từ chối thanh toán!");
        await loadPayments();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi từ chối thanh toán");
      } finally {
        setLoading(false);
      }
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
      CHUA_THANH_TOAN: "Chưa thanh toán",
      QUA_HAN: "Quá hạn",
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  if (loading && payments.length === 0) {
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
        <h1 className="text-3xl font-bold">✅ Xác Nhận Thanh Toán</h1>
        <p className="text-gray-600 mt-2">
          Xác nhận các khoản thanh toán từ cửa hàng
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
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

      {/* Filter Tabs */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="tabs tabs-boxed">
            {[
              { value: "CHUA_THANH_TOAN", label: "Chưa Thanh Toán" },
              { value: "DA_THANH_TOAN", label: "Đã Thanh Toán" },
              { value: "QUA_HAN", label: "Quá Hạn" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`tab ${filter === tab.value ? "tab-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Chưa thanh toán</div>
          <div className="stat-value text-warning">
            {payments.filter((p) => p.trangThai === "CHUA_THANH_TOAN").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Đã thanh toán</div>
          <div className="stat-value text-success">
            {payments.filter((p) => p.trangThai === "DA_THANH_TOAN").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Quá hạn</div>
          <div className="stat-value text-error">
            {payments.filter((p) => p.trangThai === "QUA_HAN").length}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr className="bg-base-200">
                <th>Cửa Hàng</th>
                <th>Gói Thanh Toán</th>
                <th>Số Tiền</th>
                <th>Thời Gian</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.maThanhToan} className="hover">
                    <td>
                      <div className="font-semibold">
                        {payment.CuaHang?.tenCuaHang || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div>{payment.GoiThanhToan?.tenGoi || "N/A"}</div>
                      <div className="text-xs text-gray-500">
                        Gói {payment.GoiThanhToan?.thoiGian} tháng
                      </div>
                    </td>
                    <td>
                      <span className="font-bold text-primary">
                        {parseInt(payment.soTien).toLocaleString("vi-VN")}đ
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>
                          Từ:{" "}
                          {new Date(payment.thoiGianBatDau).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div>
                          Đến:{" "}
                          {new Date(payment.thoiGianKetThuc).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(payment.trangThai)}</td>
                    <td className="space-x-2">
                      {payment.trangThai === "CHUA_THANH_TOAN" && (
                        <>
                          <button
                            onClick={() => handleConfirm(payment.maThanhToan)}
                            className="btn btn-sm btn-success"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => handleReject(payment.maThanhToan)}
                            className="btn btn-sm btn-error"
                          >
                            ❌
                          </button>
                        </>
                      )}
                      {payment.trangThai === "DA_THANH_TOAN" && (
                        <span className="text-success">✅ Đã xác nhận</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    Không có thanh toán nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirm;
