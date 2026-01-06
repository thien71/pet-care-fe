// src/pages/admin/ShopApproval.jsx
import { useState, useEffect } from "react";
// import apiClient from "../../api/apiClient";
import { shopService } from "@/api";

// Ở đầu component, TRƯỚC useState
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/400x300?text=No+Image";

  // Nếu đã là URL đầy đủ
  if (path.startsWith("http")) return path;

  // Nếu là đường dẫn tương đối
  const fullUrl = `${API_BASE}${path}`;
  console.log("🖼️ Image URL:", fullUrl); // Debug
  return fullUrl;
};

const ShopApproval = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("CHO_DUYET");
  const [selectedShop, setSelectedShop] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadShops();
  }, [filter]);

  const loadShops = async () => {
    try {
      setLoading(true);
      const res = await shopService.getShopApprovals({ trangThai: filter });
      // const res = await apiClient.get("/admin/shop-approvals", {
      //   params: { trangThai: filter },
      // });
      setShops(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (shop) => {
    setSelectedShop(shop);
    setShowDetailModal(true);
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await shopService.approveShop(selectedShop.maCuaHang);
      // await apiClient.put(`/admin/shops/${selectedShop.maCuaHang}/approve`);
      setShowDetailModal(false);
      await loadShops();
    } catch (err) {
      setError(err.message || "Lỗi khi duyệt cửa hàng");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      setActionLoading(true);
      await shopService.rejectShop(selectedShop.maCuaHang, { lyDo: rejectReason });
      // await apiClient.put(`/admin/shops/${selectedShop.maCuaHang}/reject`, {
      //   lyDo: rejectReason,
      // });
      setShowDetailModal(false);
      setRejectReason("");
      await loadShops();
    } catch (err) {
      setError(err.message || "Lỗi khi từ chối cửa hàng");
    } finally {
      setActionLoading(false);
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
        <h1 className="text-3xl font-bold">🏪 Duyệt Đơn Đăng Ký Cửa Hàng</h1>
        <p className="text-gray-600 mt-2">Kiểm tra và duyệt các đơn đăng ký cửa hàng mới</p>
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

      {/* Filter Tabs */}
      <div className="tabs tabs-boxed bg-base-100 p-4 rounded-lg shadow">
        {[
          { value: "CHO_DUYET", label: "Chờ Duyệt" },
          { value: "HOAT_DONG", label: "Hoạt Động" },
          { value: "BI_KHOA", label: "Bị Khóa" },
        ].map((tab) => (
          <button key={tab.value} onClick={() => setFilter(tab.value)} className={`tab ${filter === tab.value ? "tab-active" : ""}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.length > 0 ? (
          shops.map((shop) => (
            <div key={shop.maCuaHang} className="card bg-base-100 shadow-xl">
              {shop.anhCuaHang ? (
                <figure className="h-48 bg-base-200 overflow-hidden">
                  <img
                    src={getImageUrl(shop.anhCuaHang)}
                    alt={shop.tenCuaHang}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Failed to load image:", e.target.src);
                      e.target.src = "https://placehold.co/400x300?text=Image+Load+Failed";
                    }}
                  />
                </figure>
              ) : (
                <figure className="h-48 bg-base-200 overflow-hidden flex items-center justify-center">
                  <span className="text-gray-400">Không có ảnh</span>
                </figure>
              )}
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-lg">{shop.tenCuaHang}</h2>
                  {getStatusBadge(shop.trangThai)}
                </div>

                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <span>📍</span>
                  {shop.diaChi}
                </p>

                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <span>📞</span>
                  {shop.soDienThoai}
                </p>

                {shop.moTa && <p className="text-sm text-gray-600 line-clamp-2">{shop.moTa}</p>}

                <div className="card-actions justify-end mt-4">
                  <button onClick={() => openDetailModal(shop)} className="btn btn-primary btn-sm">
                    Chi Tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 text-lg">Không có cửa hàng</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedShop && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">🏪 {selectedShop.tenCuaHang}</h3>

            {/* Shop Info */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Địa Chỉ</p>
                  <p className="font-semibold">{selectedShop.diaChi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số Điện Thoại</p>
                  <p className="font-semibold">{selectedShop.soDienThoai}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kinh Độ</p>
                  <p className="font-semibold">{selectedShop.kinhDo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vĩ Độ</p>
                  <p className="font-semibold">{selectedShop.viDo || "N/A"}</p>
                </div>
              </div>

              {selectedShop.moTa && (
                <div>
                  <p className="text-sm text-gray-600">Mô Tả</p>
                  <p className="font-semibold">{selectedShop.moTa}</p>
                </div>
              )}

              <div className="divider">Tài Liệu</div>

              {/* Documents */}
              <div className="space-y-2">
                {selectedShop.giayPhepKD && (
                  <a
                    href={getImageUrl(selectedShop.giayPhepKD)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline w-full justify-start gap-2"
                    onClick={(e) => {
                      const url = getImageUrl(selectedShop.giayPhepKD);
                      console.log("Opening:", url);
                    }}
                  >
                    📄 Giấy Phép Kinh Doanh
                  </a>
                )}
                {selectedShop.anhCuaHang && (
                  <a
                    href={getImageUrl(selectedShop.anhCuaHang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline w-full justify-start gap-2"
                    onClick={(e) => {
                      const url = getImageUrl(selectedShop.anhCuaHang);
                      console.log("Opening:", url);
                    }}
                  >
                    🖼️ Ảnh Cửa Hàng
                  </a>
                )}
                {selectedShop.cccdMatTruoc && (
                  <a
                    href={getImageUrl(selectedShop.cccdMatTruoc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline w-full justify-start gap-2"
                    onClick={(e) => {
                      const url = getImageUrl(selectedShop.cccdMatTruoc);
                      console.log("Opening:", url);
                    }}
                  >
                    🆔 CCCD Mặt Trước
                  </a>
                )}
                {selectedShop.cccdMatSau && (
                  <a
                    href={getImageUrl(selectedShop.cccdMatSau)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline w-full justify-start gap-2"
                    onClick={(e) => {
                      const url = getImageUrl(selectedShop.cccdMatSau);
                      console.log("Opening:", url);
                    }}
                  >
                    🆔 CCCD Mặt Sau
                  </a>
                )}
              </div>

              {/* Reject Reason Input */}
              {selectedShop.trangThai === "CHO_DUYET" && (
                <>
                  <div className="divider">Từ Chối (nếu cần)</div>
                  <textarea
                    placeholder="Nhập lý do từ chối (nếu muốn từ chối)..."
                    className="textarea textarea-bordered w-full"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows="3"
                  ></textarea>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setRejectReason("");
                }}
                className="btn btn-ghost"
              >
                Đóng
              </button>

              {selectedShop.trangThai === "CHO_DUYET" && (
                <>
                  <button onClick={handleReject} className="btn btn-error" disabled={actionLoading}>
                    {actionLoading ? "Đang xử lý..." : "Từ Chối"}
                  </button>
                  <button onClick={handleApprove} className="btn btn-success" disabled={actionLoading}>
                    {actionLoading ? "Đang xử lý..." : "Duyệt"}
                  </button>
                </>
              )}
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setShowDetailModal(false);
              setRejectReason("");
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ShopApproval;
