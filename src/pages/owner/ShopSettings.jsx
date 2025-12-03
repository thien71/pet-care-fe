// src/pages/owner/ShopSettings.jsx
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../contexts/AuthContext";

const ShopSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shopData, setShopData] = useState({
    tenCuaHang: "",
    diaChi: "",
    soDienThoai: "",
    moTa: "",
    kinhDo: "",
    viDo: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/owner/shop-info");
      setShopData(res.data || {});
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải thông tin cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopData({ ...shopData, [name]: value });
    setSuccess("");
  };

  const handleSave = async () => {
    if (!shopData.tenCuaHang.trim()) {
      setError("Vui lòng nhập tên cửa hàng");
      return;
    }

    try {
      setSaving(true);
      await apiClient.put("/owner/shop-info", shopData);
      setSuccess("Cập nhật thông tin cửa hàng thành công!");
      setEditMode(false);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold">⚙️ Cài Đặt Cửa Hàng</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin cửa hàng</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="btn btn-primary gap-2"
          >
            <span>✏️</span>
            Chỉnh Sửa
          </button>
        )}
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

      {/* Shop Info Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-6">🏪 Thông Tin Cửa Hàng</h2>

          <div className="space-y-4">
            {/* Tên Cửa Hàng */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Tên Cửa Hàng</span>
              </label>
              <input
                type="text"
                name="tenCuaHang"
                className="input input-bordered"
                value={shopData.tenCuaHang}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>

            {/* Grid 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Địa Chỉ</span>
                </label>
                <input
                  type="text"
                  name="diaChi"
                  className="input input-bordered"
                  value={shopData.diaChi}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Số Điện Thoại
                  </span>
                </label>
                <input
                  type="tel"
                  name="soDienThoai"
                  className="input input-bordered"
                  value={shopData.soDienThoai}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>

            {/* Tọa độ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Kinh Độ</span>
                </label>
                <input
                  type="number"
                  name="kinhDo"
                  step="0.0001"
                  className="input input-bordered"
                  value={shopData.kinhDo}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Vĩ Độ</span>
                </label>
                <input
                  type="number"
                  name="viDo"
                  step="0.0001"
                  className="input input-bordered"
                  value={shopData.viDo}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </div>

            {/* Mô Tả */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Mô Tả</span>
              </label>
              <textarea
                name="moTa"
                className="textarea textarea-bordered h-24"
                value={shopData.moTa}
                onChange={handleChange}
                disabled={!editMode}
              ></textarea>
            </div>
          </div>

          {/* Actions */}
          {editMode && (
            <div className="card-actions justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setEditMode(false);
                  loadShopData();
                }}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">📊 Trạng Thái</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Trạng Thái Cửa Hàng</div>
              <div className="stat-value text-lg text-success">
                {shopData.trangThai === "HOAT_DONG"
                  ? "✅ Hoạt động"
                  : "⏳ Chờ duyệt"}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Ngày Tạo</div>
              <div className="stat-value text-base">
                {shopData.ngayTao
                  ? new Date(shopData.ngayTao).toLocaleDateString("vi-VN")
                  : "N/A"}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Chủ Sở Hữu</div>
              <div className="stat-value text-base">{user?.hoTen}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Card */}
      <div className="alert alert-info">
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
        <span>
          Cập nhật thông tin cửa hàng của bạn để khách hàng có thể tìm thấy dễ
          dàng hơn
        </span>
      </div>
    </div>
  );
};

export default ShopSettings;
