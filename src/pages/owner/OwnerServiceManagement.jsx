import { useState, useEffect } from "react";
import { serviceService } from "@/api";
import { FaPlus, FaEdit, FaTrash, FaLightbulb, FaSpinner, FaImage, FaClock } from "react-icons/fa";
import { getServiceImageUrl } from "@/utils/constants";
import { showToast } from "@/utils/toast";
import ServiceEditModal from "@/components/owner/ServiceEditModal";
import ServiceProposeModal from "@/components/owner/ServiceProposeModal";
import ConfirmModal from "@/components/common/ConfirmModal";

const OwnerServiceManagement = () => {
  const [systemServices, setSystemServices] = useState([]);
  const [shopServices, setShopServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteServiceId, setDeleteServiceId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [systemRes, shopRes] = await Promise.all([serviceService.getSystemServices(), serviceService.getShopServices()]);
      setSystemServices(systemRes.data || []);
      setShopServices(shopRes.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Add service
  const handleAddService = async (serviceId, formData, hasFile) => {
    try {
      setActionLoading(true);

      await serviceService.addServiceToShop(formData);
      showToast.success("Thêm dịch vụ thành công!");
      setShowEditModal(false);
      setSelectedService(null);
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Lỗi thêm dịch vụ");
    } finally {
      setActionLoading(false);
    }
  };

  // Update service
  const handleUpdateService = async (formData, hasFile) => {
    if (!selectedService?.maDichVuShop) return;

    try {
      setActionLoading(true);
      await serviceService.updateShopService(selectedService.maDichVuShop, formData);
      showToast.success("Cập nhật dịch vụ thành công!");
      setShowEditModal(false);
      setSelectedService(null);
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Lỗi cập nhật dịch vụ");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete service
  const handleDeleteService = async () => {
    if (!deleteServiceId) return;

    try {
      setActionLoading(true);
      await serviceService.deleteShopService(deleteServiceId);
      showToast.success("Xóa dịch vụ thành công!");
      setShowDeleteModal(false);
      setDeleteServiceId(null);
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Lỗi xóa dịch vụ");
    } finally {
      setActionLoading(false);
    }
  };

  // Propose new service
  const handleProposeService = async (proposeData) => {
    try {
      setActionLoading(true);
      await serviceService.proposeNewService(proposeData);
      showToast.success("Đề xuất dịch vụ thành công! Admin sẽ kiểm tra trong 24-48 giờ");
      setShowProposeModal(false);
    } catch (err) {
      showToast.error(err.message || "Lỗi đề xuất dịch vụ");
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal for adding service
  const openAddModal = (service) => {
    setSelectedService({
      ...service,
      maDichVuShop: null,
      gia: "",
      moTaShop: "",
      thoiLuongShop: "",
      hinhAnh: null,
    });
    setShowEditModal(true);
  };

  // Open edit modal for updating service
  const openEditModal = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  // Save service (add or update)
  const handleSaveService = async (formData, hasFile) => {
    if (selectedService?.maDichVuShop) {
      await handleUpdateService(formData, hasFile);
    } else {
      await handleAddService(selectedService?.maDichVu, formData, hasFile);
    }
  };

  // Get available system services (not added yet)
  const availableSystemServices = systemServices.filter(
    (systemService) => !shopServices.some((s) => s.maDichVuHeThong === systemService.maDichVu)
  );

  // Loading state
  if (loading && systemServices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Dịch Vụ</h1>
          <p className="text-gray-600 mt-1">Thêm, sửa, xóa các dịch vụ của cửa hàng</p>
        </div>
        <button
          onClick={() => setShowProposeModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-bold border border-blue-200"
        >
          <FaLightbulb />
          Đề Xuất Dịch Vụ
        </button>
      </div>

      {/* Shop Services */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Dịch Vụ Đang Hoạt Động ({shopServices.length})</h2>

        {shopServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shopServices.map((service) => (
              <div
                key={service.maDichVuShop}
                className="border border-gray-200 rounded-lg hover:border-[#8e2800] transition-all overflow-hidden group"
              >
                {/* Image */}
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  {service.hinhAnh ? (
                    <img
                      src={getServiceImageUrl(service.hinhAnh)}
                      alt={service.tenDichVu}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%239ca3af'%3E%F0%9F%90%BE%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="text-6xl text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">Kích hoạt</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-gray-800 line-clamp-2 min-h-12">{service.tenDichVu}</h3>

                  {service.moTaShop && <p className="text-sm text-gray-600 line-clamp-2">{service.moTaShop}</p>}

                  <div className="space-y-1 text-sm">
                    {(service.thoiLuongShop || service.thoiLuong) && (
                      <p className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-[#8e2800]" />
                        <span>{service.thoiLuongShop || service.thoiLuong} phút</span>
                      </p>
                    )}

                    <p className="font-bold text-[#8e2800] text-lg">{parseInt(service.gia).toLocaleString("vi-VN")}đ</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => openEditModal(service)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-bold flex-1 border border-blue-200"
                    >
                      <FaEdit />
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        setDeleteServiceId(service.maDichVuShop);
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-bold flex-1 border border-red-200"
                    >
                      <FaTrash />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FaImage className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Chưa có dịch vụ nào</p>
            <p className="text-gray-400 text-sm mt-2">Thêm dịch vụ từ danh sách bên dưới để bắt đầu</p>
          </div>
        )}
      </div>

      {/* Available System Services */}
      {availableSystemServices.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Thêm Dịch Vụ Từ Hệ Thống ({availableSystemServices.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSystemServices.map((service) => (
              <div key={service.maDichVu} className="border border-gray-200 rounded-lg p-4 hover:border-[#8e2800] transition-all">
                <h3 className="font-bold text-gray-800 mb-2">{service.tenDichVu}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.moTa}</p>
                {service.thoiLuong && <p className="text-sm text-gray-700 mb-3">⏱️ {service.thoiLuong} phút</p>}

                <button
                  onClick={() => openAddModal(service)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors text-sm font-bold"
                >
                  <FaPlus />
                  Thêm Dịch Vụ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ServiceEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedService(null);
        }}
        onSave={handleSaveService}
        service={selectedService}
        loading={actionLoading}
      />

      <ServiceProposeModal
        isOpen={showProposeModal}
        onClose={() => setShowProposeModal(false)}
        onSubmit={handleProposeService}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteServiceId(null);
        }}
        onConfirm={handleDeleteService}
        title="Xác Nhận Xóa Dịch Vụ"
        message="Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default OwnerServiceManagement;
