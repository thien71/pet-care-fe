// src/pages/owner/ServiceManagement.jsx
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const OwnerServiceManagement = () => {
  const [systemServices, setSystemServices] = useState([]);
  const [shopServices, setShopServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ gia: "" });
  const [proposeData, setProposeData] = useState({
    tenDichVu: "",
    moTa: "",
    gia: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [systemRes, shopRes] = await Promise.all([
        apiClient.get("/owner/system-services"),
        apiClient.get("/owner/shop-services"),
      ]);
      setSystemServices(systemRes.data || []);
      setShopServices(shopRes.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (serviceId) => {
    try {
      setLoading(true);
      await apiClient.post("/owner/shop-services", {
        maDichVuHeThong: serviceId,
        gia: parseFloat(formData.gia),
      });
      setSuccess("Thêm dịch vụ thành công!");
      setShowAddModal(false);
      setFormData({ gia: "" });
      setEditingService(null);
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi thêm dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (serviceId) => {
    try {
      setLoading(true);
      await apiClient.put(`/owner/shop-services/${serviceId}`, {
        gia: parseFloat(formData.gia),
      });
      setSuccess("Cập nhật dịch vụ thành công!");
      setShowAddModal(false);
      setFormData({ gia: "" });
      setEditingService(null);
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi cập nhật dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa dịch vụ này?")) {
      try {
        setLoading(true);
        await apiClient.delete(`/owner/shop-services/${serviceId}`);
        setSuccess("Xóa dịch vụ thành công!");
        await loadData();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi xóa dịch vụ");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProposeService = async () => {
    if (!proposeData.tenDichVu.trim() || !proposeData.gia) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/owner/propose-service", {
        tenDichVu: proposeData.tenDichVu,
        moTa: proposeData.moTa,
        gia: parseFloat(proposeData.gia),
      });
      setSuccess(
        "Đề xuất dịch vụ thành công! Admin sẽ kiểm tra trong 24-48 giờ"
      );
      setShowProposeModal(false);
      setProposeData({ tenDichVu: "", moTa: "", gia: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi đề xuất dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  if (loading && systemServices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const serviceIcons = {
    tắm: "🛁",
    cắt: "✂️",
    khám: "💉",
    khách: "🏠",
    spa: "🎨",
  };

  const getIcon = (name) => {
    for (const [key, icon] of Object.entries(serviceIcons)) {
      if (name.toLowerCase().includes(key)) return icon;
    }
    return "✨";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">✨ Quản Lý Dịch Vụ</h1>
          <p className="text-gray-600 mt-2">
            Thêm, sửa, xóa các dịch vụ của cửa hàng
          </p>
        </div>
        <button
          onClick={() => {
            setShowProposeModal(true);
            setProposeData({ tenDichVu: "", moTa: "", gia: "" });
          }}
          className="btn btn-secondary gap-2"
        >
          <span>💡</span>
          Đề Xuất Dịch Vụ
        </button>
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

      {/* Dịch Vụ Đang Hoạt Động */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-6">🟢 Dịch Vụ Đang Hoạt Động</h2>

          {shopServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopServices.map((service) => (
                <div
                  key={service.maDichVuShop}
                  className="card bg-base-200 shadow"
                >
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <span>{getIcon(service.tenDichVu)}</span>
                          {service.tenDichVu}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.moTa}
                        </p>
                        <p className="font-semibold text-primary mt-2">
                          {parseInt(service.gia).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <div className="badge badge-success">Kích hoạt</div>
                    </div>

                    <div className="card-actions justify-end mt-4 gap-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setFormData({ gia: service.gia });
                          setShowAddModal(true);
                        }}
                        className="btn btn-sm btn-info"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteService(service.maDichVuShop)
                        }
                        className="btn btn-sm btn-error"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Chưa có dịch vụ nào
            </p>
          )}
        </div>
      </div>

      {/* Dịch Vụ Hệ Thống Có Sẵn */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-6">➕ Thêm Dịch Vụ Từ Hệ Thống</h2>

          {systemServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemServices.map((service) => {
                const isAdded = shopServices.some(
                  (s) => s.maDichVuHeThong === service.maDichVu
                );

                return (
                  <div
                    key={service.maDichVu}
                    className={`card shadow ${
                      isAdded ? "bg-gray-200" : "bg-base-200"
                    }`}
                  >
                    <div className="card-body p-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <span>{getIcon(service.tenDichVu)}</span>
                        {service.tenDichVu}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.moTa}
                      </p>
                      {service.thoiLuong && (
                        <p className="text-sm">⏱️ {service.thoiLuong} phút</p>
                      )}

                      {isAdded ? (
                        <div className="badge badge-success mt-2">
                          ✅ Đã thêm
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setFormData({ gia: "" });
                            setShowAddModal(true);
                          }}
                          className="btn btn-sm btn-primary mt-4"
                        >
                          Thêm Dịch Vụ
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Chưa có dịch vụ hệ thống
            </p>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">
              {editingService?.maDichVuShop
                ? "✏️ Cập Nhật Giá"
                : "➕ Thêm Dịch Vụ"}
            </h3>

            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">
                  {editingService?.tenDichVu}
                </p>
                <p className="text-sm text-gray-600">{editingService?.moTa}</p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Giá (đ) *</span>
                </label>
                <input
                  type="number"
                  placeholder="Nhập giá dịch vụ"
                  className="input input-bordered"
                  value={formData.gia}
                  onChange={(e) => setFormData({ gia: e.target.value })}
                  min="0"
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingService(null);
                  setFormData({ gia: "" });
                }}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (editingService?.maDichVuShop) {
                    handleUpdateService(editingService.maDichVuShop);
                  } else {
                    handleAddService(editingService.maDichVu);
                  }
                }}
                className="btn btn-primary"
                disabled={loading || !formData.gia}
              >
                {loading ? "Đang xử lý..." : "Lưu"}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setShowAddModal(false);
              setEditingService(null);
              setFormData({ gia: "" });
            }}
          ></div>
        </div>
      )}

      {/* Propose Service Modal */}
      {showProposeModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">💡 Đề Xuất Dịch Vụ Mới</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Tên Dịch Vụ *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cắt móng chuyên nghiệp"
                  className="input input-bordered"
                  value={proposeData.tenDichVu}
                  onChange={(e) =>
                    setProposeData({
                      ...proposeData,
                      tenDichVu: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Mô Tả</span>
                </label>
                <textarea
                  placeholder="Mô tả chi tiết dịch vụ..."
                  className="textarea textarea-bordered h-20"
                  value={proposeData.moTa}
                  onChange={(e) =>
                    setProposeData({ ...proposeData, moTa: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Giá (đ) *</span>
                </label>
                <input
                  type="number"
                  placeholder="Giá dự kiến"
                  className="input input-bordered"
                  value={proposeData.gia}
                  onChange={(e) =>
                    setProposeData({ ...proposeData, gia: e.target.value })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="alert alert-info mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Admin sẽ duyệt đề xuất của bạn trong 24-48 giờ</span>
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowProposeModal(false);
                  setProposeData({ tenDichVu: "", moTa: "", gia: "" });
                }}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button
                onClick={handleProposeService}
                className="btn btn-primary"
                disabled={loading || !proposeData.tenDichVu || !proposeData.gia}
              >
                {loading ? "Đang xử lý..." : "Gửi Đề Xuất"}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setShowProposeModal(false);
              setProposeData({ tenDichVu: "", moTa: "", gia: "" });
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default OwnerServiceManagement;
