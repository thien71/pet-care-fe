// src/pages/admin/ShopManagement.jsx
import { useState, useEffect } from "react";
import { shopService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaSearch, FaEdit, FaToggleOn, FaToggleOff, FaEye, FaSpinner } from "react-icons/fa";
import { getShopImageUrl } from "@/utils/constants";
import EditShopModal from "@/components/admin/EditShopModal";
import ShopDetailModal from "@/components/admin/ShopDetailModal";
import ConfirmModal from "@/components/common/ConfirmModal";

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedShop, setSelectedShop] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    shop: null,
    action: null,
  });

  useEffect(() => {
    loadShops();
  }, [filter]);

  const loadShops = async () => {
    try {
      setLoading(true);
      const params = filter !== "ALL" ? { trangThai: filter } : {};
      const res = await shopService.getShops(params);
      setShops(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
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
    setShowEditModal(true);
  };

  const handleUpdate = async (formData) => {
    if (!selectedShop) return;

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang cập nhật...");

    try {
      await shopService.updateShop(selectedShop.maCuaHang, formData);
      showToast.dismiss(loadingToast);
      showToast.success("Cập nhật cửa hàng thành công!");
      setShowEditModal(false);
      await loadShops();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi cập nhật cửa hàng");
    } finally {
      setActionLoading(false);
    }
  };

  const openConfirmModal = (shop) => {
    setConfirmModal({
      isOpen: true,
      shop,
      action: shop.trangThai === "HOAT_DONG" ? "deactivate" : "activate",
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      shop: null,
      action: null,
    });
  };

  const handleToggleStatus = async () => {
    const { shop } = confirmModal;
    if (!shop) return;

    setActionLoading(true);
    const newStatus = shop.trangThai === "HOAT_DONG" ? "BI_KHOA" : "HOAT_DONG";
    const loadingToast = showToast.loading(newStatus === "BI_KHOA" ? "Đang vô hiệu hóa..." : "Đang kích hoạt...");

    try {
      await shopService.updateShop(shop.maCuaHang, {
        ...shop,
        trangThai: newStatus,
      });
      showToast.dismiss(loadingToast);
      showToast.success(newStatus === "BI_KHOA" ? "Vô hiệu hóa cửa hàng thành công!" : "Kích hoạt cửa hàng thành công!");
      closeConfirmModal();
      await loadShops();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi thay đổi trạng thái");
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

  const filterButtons = [
    { value: "ALL", label: "Tất cả" },
    { value: "CHO_DUYET", label: "Chờ duyệt" },
    { value: "HOAT_DONG", label: "Hoạt động" },
    { value: "BI_KHOA", label: "Bị khóa" },
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
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Cửa Hàng</h1>
        <p className="text-gray-600 mt-1">Quản lý tất cả các cửa hàng trong hệ thống</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === tab.value ? "bg-[#8e2800] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc địa chỉ..."
            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ngày Tạo</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <tr key={shop.maCuaHang} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={getShopImageUrl(shop.anhCuaHang)} alt={shop.tenCuaHang} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{shop.tenCuaHang}</div>
                          <div className="text-sm text-gray-600">{shop.diaChi}</div>
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
                      <span className="text-sm text-gray-700">{new Date(shop.ngayTao).toLocaleDateString("vi-VN")}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDetailModal(shop)}
                          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openEditModal(shop)}
                          className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          title="Sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openConfirmModal(shop)}
                          disabled={actionLoading}
                          className={`p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors ${
                            shop.trangThai === "HOAT_DONG" ? "text-green-600" : "text-red-600"
                          }`}
                          title={shop.trangThai === "HOAT_DONG" ? "Vô hiệu hóa" : "Kích hoạt"}
                        >
                          {shop.trangThai === "HOAT_DONG" ? <FaToggleOn className="text-2xl" /> : <FaToggleOff className="text-2xl" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">Không tìm thấy cửa hàng</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && (
        <ShopDetailModal
          shop={selectedShop}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedShop(null);
          }}
        />
      )}

      {showEditModal && (
        <EditShopModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedShop(null);
          }}
          onSubmit={handleUpdate}
          shop={selectedShop}
          loading={actionLoading}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleToggleStatus}
        title={confirmModal.action === "deactivate" ? "Xác Nhận Vô Hiệu Hóa" : "Xác Nhận Kích Hoạt"}
        message={
          confirmModal.action === "deactivate"
            ? `Vô hiệu hóa cửa hàng "${confirmModal.shop?.tenCuaHang}"? Cửa hàng sẽ không thể hoạt động.`
            : `Kích hoạt lại cửa hàng "${confirmModal.shop?.tenCuaHang}"?`
        }
        confirmText={confirmModal.action === "deactivate" ? "Vô hiệu hóa" : "Kích hoạt"}
        cancelText="Hủy"
        type={confirmModal.action === "deactivate" ? "warning" : "success"}
        loading={actionLoading}
      />
    </div>
  );
};

export default ShopManagement;
