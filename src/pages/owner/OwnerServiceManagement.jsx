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

  const handleAddService = async (serviceId, formData) => {
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

  const handleUpdateService = async (formData) => {
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

  const openEditModal = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleSaveService = async (formData) => {
    if (selectedService?.maDichVuShop) {
      await handleUpdateService(formData);
    } else {
      await handleAddService(selectedService?.maDichVu, formData);
    }
  };

  const availableSystemServices = systemServices.filter(
    (systemService) => !shopServices.some((s) => s.maDichVuHeThong === systemService.maDichVu)
  );

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
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Dịch Vụ</h1>
          <p className="text-gray-600 mt-1">Thêm, sửa, xóa các dịch vụ của cửa hàng</p>
        </div>
        <button
          onClick={() => setShowProposeModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
        >
          <FaLightbulb />
          Đề Xuất Dịch Vụ
        </button>
      </div>

      {/* Shop Services Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Dịch Vụ Đang Hoạt Động ({shopServices.length})</h2>
        </div>

        {shopServices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hình ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tên dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Thời lượng</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shopServices.map((service) => (
                  <tr key={service.maDichVuShop} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {service.hinhAnh ? (
                          <img
                            src={getServiceImageUrl(service.hinhAnh)}
                            alt={service.tenDichVu}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentElement.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center">
                                  <svg class="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                                  </svg>
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaImage className="text-2xl text-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-800">{service.tenDichVu}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{service.moTaShop || service.moTa || "Không có mô tả"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <FaClock className="text-[#8e2800]" />
                        <span>{service.thoiLuongShop || service.thoiLuong || 0} phút</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#8e2800]">{parseInt(service.gia).toLocaleString("vi-VN")}đ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Kích hoạt
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          title="Sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteServiceId(service.maDichVuShop);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <FaImage className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Chưa có dịch vụ nào</p>
            <p className="text-gray-400 text-sm mt-2">Thêm dịch vụ từ danh sách bên dưới để bắt đầu</p>
          </div>
        )}
      </div>

      {/* Available System Services Table */}
      {availableSystemServices.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Thêm Dịch Vụ Từ Hệ Thống ({availableSystemServices.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tên dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mô tả</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Thời lượng</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableSystemServices.map((service) => (
                  <tr key={service.maDichVu} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-800">{service.tenDichVu}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md">{service.moTa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.thoiLuong && (
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <FaClock className="text-[#8e2800]" />
                          <span>{service.thoiLuong} phút</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openAddModal(service)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors text-sm font-medium"
                      >
                        <FaPlus />
                        Thêm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
