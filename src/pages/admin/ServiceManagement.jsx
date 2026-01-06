// src/pages/admin/ServiceManagement.jsx
import { useState, useEffect } from "react";
import { serviceService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaClock, FaSpinner, FaSearch, FaInfoCircle, FaTrash } from "react-icons/fa";
import ServiceModal from "@/components/admin/ServiceModal";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    service: null,
    action: null, // 'deactivate' | 'activate' | 'delete'
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await serviceService.getSystemServices();
      setServices(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((s) => s.tenDichVu?.toLowerCase().includes(searchTerm.toLowerCase()));

  const openAddModal = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    const loadingToast = showToast.loading(editingService ? "Đang cập nhật..." : "Đang thêm...");

    try {
      if (editingService) {
        await serviceService.updateSystemService(editingService.maDichVu, formData);
        showToast.dismiss(loadingToast);
        showToast.success("Cập nhật dịch vụ thành công!");
      } else {
        await serviceService.createSystemService(formData);
        showToast.dismiss(loadingToast);
        showToast.success("Thêm dịch vụ thành công!");
      }
      setShowModal(false);
      await loadServices();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setActionLoading(false);
    }
  };

  const openToggleModal = (service) => {
    setConfirmModal({
      isOpen: true,
      service,
      action: service.trangThai === 1 ? "deactivate" : "activate",
    });
  };

  const openDeleteModal = (service) => {
    setConfirmModal({
      isOpen: true,
      service,
      action: "delete",
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      service: null,
      action: null,
    });
  };

  const handleToggleStatus = async () => {
    const { service } = confirmModal;
    if (!service) return;

    setActionLoading(true);
    const newStatus = service.trangThai === 1 ? 0 : 1;
    const loadingToast = showToast.loading(newStatus === 0 ? "Đang vô hiệu hóa..." : "Đang kích hoạt...");

    try {
      await serviceService.updateSystemService(service.maDichVu, {
        ...service,
        trangThai: newStatus,
      });
      showToast.dismiss(loadingToast);
      showToast.success(newStatus === 0 ? "Vô hiệu hóa dịch vụ thành công!" : "Kích hoạt dịch vụ thành công!");
      closeConfirmModal();
      await loadServices();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi thay đổi trạng thái");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const { service } = confirmModal;
    if (!service) return;

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang xóa...");

    try {
      await serviceService.deleteSystemService(service.maDichVu);
      showToast.dismiss(loadingToast);
      showToast.success("Xóa dịch vụ thành công!");
      closeConfirmModal();
      await loadServices();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi khi xóa dịch vụ");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = () => {
    if (confirmModal.action === "delete") {
      handleDelete();
    } else {
      handleToggleStatus();
    }
  };

  const getConfirmMessage = () => {
    const { service, action } = confirmModal;
    if (!service) return "";

    if (action === "delete") {
      return (
        <div className="space-y-3">
          <p>Bạn có chắc chắn muốn xóa dịch vụ "{service.tenDichVu}"?</p>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex gap-2 items-start">
              <FaInfoCircle className="text-red-600 mt-0.5 shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Cảnh báo:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Nếu có cửa hàng đang sử dụng dịch vụ này, không thể xóa</li>
                  <li>Hành động này không thể hoàn tác</li>
                  <li>Nên vô hiệu hóa thay vì xóa để bảo vệ dữ liệu</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (action === "deactivate") {
      return (
        <div className="space-y-3">
          <p>Bạn có chắc chắn muốn vô hiệu hóa dịch vụ "{service.tenDichVu}"?</p>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2 items-start">
              <FaInfoCircle className="text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Các cửa hàng hiện có vẫn giữ được dịch vụ này</li>
                  <li>Cửa hàng mới sẽ không thể thêm dịch vụ này nữa</li>
                  <li>Bạn có thể kích hoạt lại bất cứ lúc nào</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return `Bạn có chắc chắn muốn kích hoạt lại dịch vụ "${service.tenDichVu}"? Các cửa hàng sẽ có thể thêm dịch vụ này vào danh sách của họ.`;
    }
  };

  const getConfirmButtonConfig = () => {
    const { action } = confirmModal;

    if (action === "delete") {
      return {
        text: "Xóa",
        className: "bg-red-600 hover:bg-red-700",
      };
    } else if (action === "deactivate") {
      return {
        text: "Vô Hiệu Hóa",
        className: "bg-yellow-600 hover:bg-yellow-700",
      };
    } else {
      return {
        text: "Kích Hoạt",
        className: "bg-green-600 hover:bg-green-700",
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  const buttonConfig = getConfirmButtonConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Dịch Vụ Hệ Thống</h1>
          <p className="text-gray-600 mt-1">Quản lý các dịch vụ trong hệ thống</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
        >
          <FaPlus />
          Thêm Dịch Vụ
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên Dịch Vụ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mô Tả</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thời Lượng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr
                    key={service.maDichVu}
                    className={`hover:bg-gray-50 transition-colors ${service.trangThai === 0 ? "opacity-60" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{service.tenDichVu}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{service.moTa || "Không có mô tả"}</span>
                    </td>
                    <td className="px-6 py-4">
                      {service.thoiLuong && (
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <FaClock className="text-[#8e2800]" />
                          <span>{service.thoiLuong} phút</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          service.trangThai === 1
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {service.trangThai === 1 ? "Hoạt động" : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          title="Sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openToggleModal(service)}
                          disabled={actionLoading}
                          className={`p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors ${
                            service.trangThai === 1 ? "text-green-600" : "text-red-600"
                          }`}
                          title={service.trangThai === 1 ? "Vô hiệu hóa" : "Kích hoạt"}
                        >
                          {service.trangThai === 1 ? <FaToggleOn className="text-2xl" /> : <FaToggleOff className="text-2xl" />}
                        </button>
                        <button
                          onClick={() => openDeleteModal(service)}
                          disabled={actionLoading}
                          className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">{searchTerm ? "Không tìm thấy dịch vụ" : "Chưa có dịch vụ nào"}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingService(null);
        }}
        onSubmit={handleSave}
        service={editingService}
        loading={actionLoading}
      />

      {/* Custom Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                {confirmModal.action === "delete" && "Xác Nhận Xóa"}
                {confirmModal.action === "deactivate" && "Xác Nhận Vô Hiệu Hóa"}
                {confirmModal.action === "activate" && "Xác Nhận Kích Hoạt"}
              </h3>
            </div>
            <div className="px-6 py-4">{getConfirmMessage()}</div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                className={`px-6 py-2.5 text-white rounded-lg font-medium disabled:opacity-50 transition-colors ${buttonConfig.className}`}
              >
                {actionLoading ? "Đang xử lý..." : buttonConfig.text}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
