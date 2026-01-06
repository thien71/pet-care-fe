// src/pages/admin/PaymentPackages.jsx
import { useState, useEffect } from "react";
// import apiClient from "../../api/apiClient";
import { paymentService } from "@/api";

const PaymentPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tenGoi: "",
    soTien: "",
    thoiGian: "",
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getPaymentPackages();
      // const res = await apiClient.get("/admin/payment-packages");
      setPackages(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ tenGoi: "", soTien: "", thoiGian: "" });
    setShowModal(true);
  };

  const openEditModal = (pkg) => {
    setEditingId(pkg.maGoi);
    setFormData({
      tenGoi: pkg.tenGoi,
      soTien: pkg.soTien,
      thoiGian: pkg.thoiGian,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.tenGoi.trim() || !formData.soTien || !formData.thoiGian) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await paymentService.updatePaymentPackage(editingId, formData);
        // await apiClient.put(`/admin/payment-packages/${editingId}`, formData);
        setSuccess("Cập nhật gói thành công!");
      } else {
        await paymentService.createPaymentPackage(formData);
        // await apiClient.post("/admin/payment-packages", formData);
        setSuccess("Tạo gói mới thành công!");
      }
      setShowModal(false);
      setFormData({ tenGoi: "", soTien: "", thoiGian: "" });
      await loadPackages();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói thanh toán này?")) {
      try {
        setLoading(true);
        await paymentService.deletePaymentPackage(id);
        // await apiClient.delete(`/admin/payment-packages/${id}`);
        setSuccess("Xóa gói thành công!");
        await loadPackages();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi xóa gói");
      } finally {
        setLoading(false);
      }
    }
  };

  const getPackageIcon = (name) => {
    if (name.toLowerCase().includes("cơ bản")) return "🥉";
    if (name.toLowerCase().includes("nâng cao")) return "🥈";
    if (name.toLowerCase().includes("vip")) return "🥇";
    return "💳";
  };

  if (loading && packages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">💳 Quản Lý Gói Thanh Toán</h1>
          <p className="text-gray-600 mt-2">Quản lý các gói thanh toán cho cửa hàng</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary gap-2">
          <span>➕</span>
          Tạo gói mới
        </button>
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

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div key={pkg.maGoi} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
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

                <div className="card-actions mt-6">
                  <button onClick={() => openEditModal(pkg)} className="btn btn-info btn-sm">
                    ✏️ Sửa
                  </button>
                  <button onClick={() => handleDelete(pkg.maGoi)} className="btn btn-error btn-sm">
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Chưa có gói thanh toán nào</p>
            <button onClick={openAddModal} className="btn btn-primary gap-2">
              <span>➕</span>
              Tạo gói đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">{editingId ? "✏️ Cập nhật gói" : "➕ Tạo gói mới"}</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Tên Gói *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Gói Cơ Bản, Gói VIP"
                  className="input input-bordered"
                  value={formData.tenGoi}
                  onChange={(e) => setFormData({ ...formData, tenGoi: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Giá (đ) *</span>
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  className="input input-bordered"
                  value={formData.soTien}
                  onChange={(e) => setFormData({ ...formData, soTien: e.target.value })}
                  min="0"
                />
                <label className="label">
                  <span className="label-text-alt">{formData.soTien ? `${parseInt(formData.soTien).toLocaleString("vi-VN")}đ` : ""}</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Thời Gian (tháng) *</span>
                </label>
                <input
                  type="number"
                  placeholder="1"
                  className="input input-bordered"
                  value={formData.thoiGian}
                  onChange={(e) => setFormData({ ...formData, thoiGian: e.target.value })}
                  min="1"
                />
              </div>

              {formData.soTien && formData.thoiGian && (
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>
                    Giá / tháng:{" "}
                    {(parseInt(formData.soTien) / parseInt(formData.thoiGian)).toLocaleString("vi-VN", { maximumFractionDigits: 0 })}đ
                  </span>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ tenGoi: "", soTien: "", thoiGian: "" });
                }}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setShowModal(false);
              setFormData({ tenGoi: "", soTien: "", thoiGian: "" });
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default PaymentPackages;
