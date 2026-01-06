// src/pages/admin/PetTypeManagement.jsx
import { useState, useEffect } from "react";
// import apiClient from "../../api/apiClient";
import { serviceService } from "@/api";

const PetTypeManagement = () => {
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ tenLoai: "" });

  useEffect(() => {
    loadPetTypes();
  }, []);

  const loadPetTypes = async () => {
    try {
      setLoading(true);
      const res = await serviceService.getPetTypes();
      // const res = await apiClient.get("/admin/pet-types");
      setPetTypes(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ tenLoai: "" });
    setShowModal(true);
  };

  const openEditModal = (petType) => {
    setEditingId(petType.maLoai);
    setFormData({ tenLoai: petType.tenLoai });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.tenLoai.trim()) {
      setError("Vui lòng nhập tên loại thú cưng");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await serviceService.updatePetType(editingId, formData);
        // await apiClient.put(`/admin/pet-types/${editingId}`, formData);
      } else {
        await serviceService.createPetType(formData);
        // await apiClient.post("/admin/pet-types", formData);
      }
      setShowModal(false);
      setFormData({ tenLoai: "" });
      await loadPetTypes();
    } catch (err) {
      setError(err.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại thú cưng này?")) {
      try {
        setLoading(true);
        await serviceService.deletePetType(id);
        // await apiClient.delete(`/admin/pet-types/${id}`);
        await loadPetTypes();
      } catch (err) {
        setError(err.message || "Lỗi xóa loại thú cưng");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && petTypes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const petEmojis = {
    CHO: "🐕",
    MEO: "🐱",
    CHIM: "🐦",
    CA: "🐠",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🐾 Quản lý Loại Thú Cưng</h1>
        <button onClick={openAddModal} className="btn btn-primary gap-2">
          <span>➕</span>
          Thêm loại mới
        </button>
      </div>

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

      {/* Pet Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {petTypes.length > 0 ? (
          petTypes.map((petType) => (
            <div key={petType.maLoai} className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-6xl">{petEmojis[petType.tenLoai] || "🐾"}</div>
                <h2 className="card-title text-2xl">{petType.tenLoai}</h2>
                <div className="card-actions">
                  <button onClick={() => openEditModal(petType)} className="btn btn-sm btn-info">
                    ✏️ Sửa
                  </button>
                  <button onClick={() => handleDelete(petType.maLoai)} className="btn btn-sm btn-error">
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 mb-4">Chưa có loại thú cưng nào</p>
            <button onClick={openAddModal} className="btn btn-primary gap-2">
              <span>➕</span>
              Thêm loại mới
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">{editingId ? "✏️ Sửa loại thú cưng" : "➕ Thêm loại thú cưng"}</h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Tên loại</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: CHO, MEO, CHIM, CA"
                className="input input-bordered"
                value={formData.tenLoai}
                onChange={(e) => setFormData({ ...formData, tenLoai: e.target.value })}
              />
            </div>

            <div className="modal-action">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">
                Hủy
              </button>
              <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
        </div>
      )}
    </div>
  );
};

export default PetTypeManagement;
