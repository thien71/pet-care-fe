// src/pages/admin/ShopApproval.jsx
import { useState, useEffect } from "react";
import { shopService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaEye, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { getShopImageUrl } from "@/utils/constants";
import ConfirmModal from "@/components/common/ConfirmModal";
import ShopDetailModal from "@/components/admin/ShopDetailModal";

const ShopApproval = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("CHO_DUYET");
  const [selectedShop, setSelectedShop] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    shop: null,
    action: null,
  });
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadShops();
  }, [filter]);

  const loadShops = async () => {
    try {
      setLoading(true);
      const res = await shopService.getShopApprovals({ trangThai: filter });
      setShops(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (shop) => {
    setSelectedShop(shop);
    setShowDetailModal(true);
  };

  const openApproveModal = (shop) => {
    setConfirmModal({
      isOpen: true,
      shop,
      action: "approve",
    });
  };

  const openRejectModal = (shop) => {
    setSelectedShop(shop);
    setConfirmModal({
      isOpen: true,
      shop,
      action: "reject",
    });
    setRejectReason("");
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      shop: null,
      action: null,
    });
    setRejectReason("");
  };

  const handleApprove = async () => {
    const { shop } = confirmModal;
    if (!shop) return;

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang duyệt...");

    try {
      await shopService.approveShop(shop.maCuaHang);
      showToast.dismiss(loadingToast);
      showToast.success("Duyệt cửa hàng thành công!");
      closeConfirmModal();
      await loadShops();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi khi duyệt cửa hàng");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const { shop } = confirmModal;
    if (!shop) return;

    if (!rejectReason.trim()) {
      showToast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang từ chối...");

    try {
      await shopService.rejectShop(shop.maCuaHang, rejectReason);
      showToast.dismiss(loadingToast);
      showToast.success("Từ chối cửa hàng thành công!");
      closeConfirmModal();
      await loadShops();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi khi từ chối cửa hàng");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      CHO_DUYET: { text: "Chờ duyệt", class: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      HOAT_DONG: { text: "Hoạt động", class: "bg-green-100 text-green-700 border-green-300" },
      BI_KHOA: { text: "Bị khóa", class: "bg-red-100 text-red-700 border-red-300" },
    };
    const { text, class: className } = config[status] || config.CHO_DUYET;
    return <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${className}`}>{text}</span>;
  };

  const filterStats = {
    CHO_DUYET: shops.filter((s) => s.trangThai === "CHO_DUYET").length,
    HOAT_DONG: shops.filter((s) => s.trangThai === "HOAT_DONG").length,
    BI_KHOA: shops.filter((s) => s.trangThai === "BI_KHOA").length,
  };

  const filterButtons = [
    { value: "CHO_DUYET", label: "Chờ Duyệt", count: filterStats.CHO_DUYET },
    { value: "HOAT_DONG", label: "Hoạt Động", count: filterStats.HOAT_DONG },
    { value: "BI_KHOA", label: "Bị Khóa", count: filterStats.BI_KHOA },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Duyệt Đơn Đăng Ký Cửa Hàng</h1>
        <p className="text-gray-600 mt-1">Kiểm tra và duyệt các đơn đăng ký cửa hàng mới</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === tab.value ? "bg-[#8e2800] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Shops Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cửa Hàng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Người Đại Diện</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Liên Hệ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shops.length > 0 ? (
                shops.map((shop) => (
                  <tr key={shop.maCuaHang} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <img src={getShopImageUrl(shop.anhCuaHang)} alt={shop.tenCuaHang} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{shop.tenCuaHang}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">{shop.diaChi}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">{shop.NguoiDaiDien?.hoTen || "N/A"}</div>
                        <div className="text-gray-600">{shop.NguoiDaiDien?.email || ""}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{shop.soDienThoai}</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(shop.trangThai)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDetailModal(shop)}
                          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        {shop.trangThai === "CHO_DUYET" && (
                          <>
                            <button
                              onClick={() => openApproveModal(shop)}
                              disabled={actionLoading}
                              className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-200 disabled:opacity-50"
                              title="Duyệt"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => openRejectModal(shop)}
                              disabled={actionLoading}
                              className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
                              title="Từ chối"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">Không có cửa hàng nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedShop && (
        <ShopDetailModal
          shop={selectedShop}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedShop(null);
          }}
        />
      )}

      {/* Approve Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.action === "approve"}
        onClose={closeConfirmModal}
        onConfirm={handleApprove}
        title="Xác Nhận Duyệt"
        message={`Bạn có chắc chắn muốn duyệt cửa hàng "${confirmModal.shop?.tenCuaHang}"? Cửa hàng sẽ được kích hoạt và có thể hoạt động.`}
        confirmText="Duyệt"
        cancelText="Hủy"
        type="success"
        loading={actionLoading}
      />

      {/* Reject Modal */}
      {confirmModal.isOpen && confirmModal.action === "reject" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Xác Nhận Từ Chối</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <p className="text-gray-700">Bạn có chắc chắn muốn từ chối cửa hàng "{confirmModal.shop?.tenCuaHang}"?</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lý Do Từ Chối *</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Nhập lý do từ chối..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 transition-colors"
              >
                {actionLoading ? "Đang xử lý..." : "Từ Chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopApproval;
