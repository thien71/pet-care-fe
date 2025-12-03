// src/pages/admin/ServiceManagement.jsx
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tenDichVu: "",
    moTa: "",
    thoiLuong: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/admin/services");
      setServices(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.tenDichVu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ tenDichVu: "", moTa: "", thoiLuong: "" });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingId(service.maDichVu);
    setFormData({
      tenDichVu: service.tenDichVu,
      moTa: service.moTa || "",
      thoiLuong: service.thoiLuong || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.tenDichVu.trim()) {
      setError("Vui lòng nhập tên dịch vụ");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await apiClient.put(`/admin/services/${editingId}`, formData);
      } else {
        await apiClient.post("/admin/services", formData);
      }
      setShowModal(false);
      setFormData({ tenDichVu: "", moTa: "", thoiLuong: "" });
      await loadServices();
    } catch (err) {
      setError(err.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      try {
        setLoading(true);
        await apiClient.delete(`/admin/services/${id}`);
        await loadServices();
      } catch (err) {
        setError(err.message || "Lỗi xóa dịch vụ");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && services.length === 0) {
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
    "khách sạn": "🏠",
    spa: "🎨",
  };

  const getServiceIcon = (name) => {
    for (const [key, icon] of Object.entries(serviceIcons)) {
      if (name.toLowerCase().includes(key)) return icon;
    }
    return "✨";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">✨ Quản lý Dịch Vụ Hệ Thống</h1>
        <button onClick={openAddModal} className="btn btn-primary gap-2">
          <span>➕</span>
          Thêm dịch vụ
        </button>
      </div>

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

      {/* Search Box */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.maDichVu} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="text-5xl">
                    {getServiceIcon(service.tenDichVu)}
                  </div>
                  <span className="badge badge-success">Hoạt động</span>
                </div>
                <h2 className="card-title mt-4">{service.tenDichVu}</h2>
                <p className="text-gray-600 text-sm">
                  {service.moTa || "Không có mô tả"}
                </p>
                {service.thoiLuong && (
                  <p className="text-sm">⏱️ {service.thoiLuong} phút</p>
                )}
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => openEditModal(service)}
                    className="btn btn-sm btn-info"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(service.maDichVu)}
                    className="btn btn-sm btn-error"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 mb-4">Chưa có dịch vụ nào</p>
            <button onClick={openAddModal} className="btn btn-primary gap-2">
              <span>➕</span>
              Thêm dịch vụ
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">
              {editingId ? "✏️ Cập nhật dịch vụ" : "➕ Thêm dịch vụ mới"}
            </h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tên dịch vụ *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tắm & Cắt lông"
                  className="input input-bordered"
                  value={formData.tenDichVu}
                  onChange={(e) =>
                    setFormData({ ...formData, tenDichVu: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mô tả</span>
                </label>
                <textarea
                  placeholder="Mô tả chi tiết về dịch vụ..."
                  className="textarea textarea-bordered h-24"
                  value={formData.moTa}
                  onChange={(e) =>
                    setFormData({ ...formData, moTa: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Thời lượng (phút)</span>
                </label>
                <input
                  type="number"
                  placeholder="Ví dụ: 30"
                  className="input input-bordered"
                  value={formData.thoiLuong}
                  onChange={(e) =>
                    setFormData({ ...formData, thoiLuong: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
