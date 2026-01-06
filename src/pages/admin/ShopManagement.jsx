// src/pages/admin/ShopManagement.jsx
import { useState, useEffect } from "react";
// import apiClient from "../../api/apiClient";
import { shopService } from "@/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/400x300?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShop, setSelectedShop] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    tenCuaHang: "",
    diaChi: "",
    soDienThoai: "",
    trangThai: "HOAT_DONG",
  });

  useEffect(() => {
    loadShops();
  }, [filter]);

  const loadShops = async () => {
    try {
      setLoading(true);
      const params = filter !== "ALL" ? { trangThai: filter } : {};
      const res = await shopService.getShops(params);
      // const res = await apiClient.get("/admin/shops", { params });
      setShops(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(
    (shop) =>
      shop.tenCuaHang?.toLowerCase().includes(searchTerm.toLowerCase()) || shop.diaChi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetailModal = (shop) => {
    setSelectedShop(shop);
    setShowDetailModal(true);
  };

  const openEditModal = (shop) => {
    setSelectedShop(shop);
    setEditData({
      tenCuaHang: shop.tenCuaHang,
      diaChi: shop.diaChi || "",
      soDienThoai: shop.soDienThoai || "",
      trangThai: shop.trangThai,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await shopService.updateShop(selectedShop.maCuaHang, editData);
      // await apiClient.put(`/admin/shops/${selectedShop.maCuaHang}`, editData);
      setSuccess("Cập nhật cửa hàng thành công!");
      setShowEditModal(false);
      await loadShops();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi cập nhật cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shopId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cửa hàng này? Hành động không thể hoàn tác!")) {
      try {
        setLoading(true);
        await shopService.deleteShop(shopId);
        // await apiClient.delete(`/admin/shops/${shopId}`);
        setSuccess("Xóa cửa hàng thành công!");
        await loadShops();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi xóa cửa hàng");
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      CHO_DUYET: "badge-warning",
      HOAT_DONG: "badge-success",
      BI_KHOA: "badge-error",
    };
    const labels = {
      CHO_DUYET: "Chờ duyệt",
      HOAT_DONG: "Hoạt động",
      BI_KHOA: "Bị khóa",
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  if (loading && shops.length === 0) {
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
        <h1 className="text-3xl font-bold">🏪 Quản Lý Cửa Hàng</h1>
        <p className="text-gray-600 mt-2">Quản lý tất cả các cửa hàng trong hệ thống</p>
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

      {/* Filters & Search */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="tabs tabs-boxed shrink-0">
              {[
                { value: "ALL", label: "Tất cả" },
                { value: "CHO_DUYET", label: "Chờ Duyệt" },
                { value: "HOAT_DONG", label: "Hoạt Động" },
                { value: "BI_KHOA", label: "Bị Khóa" },
              ].map((tab) => (
                <button key={tab.value} onClick={() => setFilter(tab.value)} className={`tab ${filter === tab.value ? "tab-active" : ""}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
              className="input input-bordered flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Tổng cửa hàng</div>
          <div className="stat-value text-primary">{shops.length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Chờ duyệt</div>
          <div className="stat-value text-warning">{shops.filter((s) => s.trangThai === "CHO_DUYET").length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Hoạt động</div>
          <div className="stat-value text-success">{shops.filter((s) => s.trangThai === "HOAT_DONG").length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Bị khóa</div>
          <div className="stat-value text-error">{shops.filter((s) => s.trangThai === "BI_KHOA").length}</div>
        </div>
      </div>

      {/* Shops Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr className="bg-base-200">
                <th>Cửa Hàng</th>
                <th>Người Đại Diện</th>
                <th>Liên Hệ</th>
                <th>Trạng Thái</th>
                <th>Ngày Tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <tr key={shop.maCuaHang} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={getImageUrl(shop.anhCuaHang)} alt={shop.tenCuaHang} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{shop.tenCuaHang}</div>
                          <div className="text-sm opacity-50">{shop.diaChi}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{shop.NguoiDaiDien?.hoTen || "N/A"}</div>
                      <div className="text-sm opacity-50">{shop.NguoiDaiDien?.email || ""}</div>
                    </td>
                    <td>
                      <div className="text-sm">📞 {shop.soDienThoai}</div>
                      <div className="text-sm opacity-50">📍 {shop.diaChi}</div>
                    </td>
                    <td>{getStatusBadge(shop.trangThai)}</td>
                    <td>{new Date(shop.ngayTao).toLocaleDateString("vi-VN")}</td>
                    <td className="space-x-2">
                      <button onClick={() => openDetailModal(shop)} className="btn btn-sm btn-ghost">
                        👁️
                      </button>
                      <button onClick={() => openEditModal(shop)} className="btn btn-sm btn-info">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(shop.maCuaHang)} className="btn btn-sm btn-error">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    Không tìm thấy cửa hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedShop && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">🏪 Chi Tiết Cửa Hàng</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tên Cửa Hàng</p>
                  <p className="font-semibold">{selectedShop.tenCuaHang}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng Thái</p>
                  {getStatusBadge(selectedShop.trangThai)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Địa Chỉ</p>
                  <p className="font-semibold">{selectedShop.diaChi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số Điện Thoại</p>
                  <p className="font-semibold">{selectedShop.soDienThoai}</p>
                </div>
              </div>

              {selectedShop.moTa && (
                <div>
                  <p className="text-sm text-gray-600">Mô Tả</p>
                  <p className="font-semibold">{selectedShop.moTa}</p>
                </div>
              )}

              <div className="divider">Người Đại Diện</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Họ Tên</p>
                  <p className="font-semibold">{selectedShop.NguoiDaiDien?.hoTen || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{selectedShop.NguoiDaiDien?.email || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button onClick={() => setShowDetailModal(false)} className="btn">
                Đóng
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}></div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedShop && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">✏️ Cập Nhật Cửa Hàng</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Tên Cửa Hàng</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editData.tenCuaHang}
                  onChange={(e) => setEditData({ ...editData, tenCuaHang: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Địa Chỉ</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editData.diaChi}
                  onChange={(e) => setEditData({ ...editData, diaChi: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Số Điện Thoại</span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered"
                  value={editData.soDienThoai}
                  onChange={(e) => setEditData({ ...editData, soDienThoai: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Trạng Thái</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editData.trangThai}
                  onChange={(e) => setEditData({ ...editData, trangThai: e.target.value })}
                >
                  <option value="CHO_DUYET">Chờ Duyệt</option>
                  <option value="HOAT_DONG">Hoạt Động</option>
                  <option value="BI_KHOA">Bị Khóa</option>
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button onClick={() => setShowEditModal(false)} className="btn btn-ghost">
                Hủy
              </button>
              <button onClick={handleUpdate} className="btn btn-primary" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowEditModal(false)}></div>
        </div>
      )}
    </div>
  );
};

export default ShopManagement;
