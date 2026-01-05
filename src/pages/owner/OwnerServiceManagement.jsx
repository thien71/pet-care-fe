import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import { serviceService } from "@/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaLightbulb,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaImage,
  FaClock,
  FaFileAlt,
  FaDollarSign,
} from "react-icons/fa";
import { getServiceImageUrl } from "../../utils/constants";

const OwnerServiceManagement = () => {
  const [systemServices, setSystemServices] = useState([]);
  const [shopServices, setShopServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    gia: "",
    hinhAnh: "",
    moTaShop: "",
    thoiLuongShop: "",
  });
  const [proposeData, setProposeData] = useState({
    tenDichVu: "",
    moTa: "",
    gia: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [systemRes, shopRes] = await Promise.all([serviceService.getSystemServices(), serviceService.getShopServices()]);
      setSystemServices(systemRes.data || []);
      setShopServices(shopRes.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.gia || parseFloat(formData.gia) <= 0) {
      errors.gia = "Giá phải lớn hơn 0";
    }

    if (formData.hinhAnh && formData.hinhAnh.trim() && !/^https?:\/\/.+/.test(formData.hinhAnh)) {
      errors.hinhAnh = "Link hình ảnh không hợp lệ";
    }

    if (formData.thoiLuongShop && (isNaN(formData.thoiLuongShop) || parseInt(formData.thoiLuongShop) <= 0)) {
      errors.thoiLuongShop = "Thời lượng phải là số dương";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateProposeForm = () => {
    const errors = {};

    if (!proposeData.tenDichVu.trim()) {
      errors.tenDichVu = "Tên dịch vụ không được để trống";
    }

    if (!proposeData.gia || parseFloat(proposeData.gia) <= 0) {
      errors.gia = "Giá phải lớn hơn 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddService = async (serviceId) => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await serviceService.addServiceToShop({
        maDichVuHeThong: serviceId,
        gia: parseFloat(formData.gia),
        hinhAnh: formData.hinhAnh || null,
        moTaShop: formData.moTaShop || null,
        thoiLuongShop: formData.thoiLuongShop ? parseInt(formData.thoiLuongShop) : null,
      });
      setSuccess("Thêm dịch vụ thành công!");
      closeModal();
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi thêm dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (serviceId) => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await serviceService.updateShopService(serviceId, {
        gia: parseFloat(formData.gia),
        hinhAnh: formData.hinhAnh || null,
        moTaShop: formData.moTaShop || null,
        thoiLuongShop: formData.thoiLuongShop ? parseInt(formData.thoiLuongShop) : null,
      });
      setSuccess("Cập nhật dịch vụ thành công!");
      closeModal();
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi cập nhật dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa dịch vụ này?")) {
      try {
        setLoading(true);
        await serviceService.deleteShopService(serviceId);
        setSuccess("Xóa dịch vụ thành công!");
        await loadData();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi xóa dịch vụ");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProposeService = async () => {
    if (!validateProposeForm()) return;

    try {
      setLoading(true);
      await serviceService.proposeNewService({
        tenDichVu: proposeData.tenDichVu,
        moTa: proposeData.moTa,
        gia: parseFloat(proposeData.gia),
      });
      setSuccess("Đề xuất dịch vụ thành công! Admin sẽ kiểm tra trong 24-48 giờ");
      setShowProposeModal(false);
      setProposeData({ tenDichVu: "", moTa: "", gia: "" });
      setFormErrors({});
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi đề xuất dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setFormData({ gia: "", hinhAnh: "", moTaShop: "", thoiLuongShop: "" });
    setFormErrors({});
  };

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
          onClick={() => {
            setShowProposeModal(true);
            setProposeData({ tenDichVu: "", moTa: "", gia: "" });
            setFormErrors({});
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium border border-blue-300"
        >
          <FaLightbulb />
          Đề Xuất Dịch Vụ
        </button>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <FaCheckCircle className="text-green-600 text-xl" />
          <span className="text-green-800">{success}</span>
          <button onClick={() => setSuccess("")} className="ml-auto text-green-600 hover:text-green-800">
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <FaTimesCircle className="text-red-600 text-xl" />
          <span className="text-red-800">{error}</span>
          <button onClick={() => setError("")} className="ml-auto text-red-600 hover:text-red-800">
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Active Services */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Dịch Vụ Đang Hoạt Động</h2>

        {shopServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopServices.map((service) => (
              <div
                key={service.maDichVuShop}
                className="border border-gray-200 rounded-lg hover:border-[#8e2800] transition-colors overflow-hidden"
              >
                {service.hinhAnh && (
                  <div className="h-48 bg-gray-100">
                    <img
                      src={getServiceImageUrl(service.hinhAnh)}
                      alt={service.tenDichVu}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">{service.tenDichVu}</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                      Kích hoạt
                    </span>
                  </div>

                  {service.moTaShop && <p className="text-sm text-gray-600 line-clamp-2">{service.moTaShop}</p>}

                  <div className="space-y-1 text-sm">
                    {service.thoiLuongShop && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaClock className="text-[#8e2800]" />
                        <span>{service.thoiLuongShop} phút</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-[#8e2800]" />
                      <span className="font-bold text-[#8e2800]">{parseInt(service.gia).toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setFormData({
                          gia: service.gia,
                          hinhAnh: service.hinhAnh || "",
                          moTaShop: service.moTaShop || "",
                          thoiLuongShop: service.thoiLuongShop || "",
                        });
                        setShowAddModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex-1"
                    >
                      <FaEdit />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.maDichVuShop)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex-1"
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
          <div className="text-center py-12">
            <FaFileAlt className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Chưa có dịch vụ nào</p>
          </div>
        )}
      </div>

      {/* System Services */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Thêm Dịch Vụ Từ Hệ Thống</h2>

        {systemServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemServices.map((service) => {
              const isAdded = shopServices.some((s) => s.maDichVuHeThong === service.maDichVu);

              return (
                <div
                  key={service.maDichVu}
                  className={`border rounded-lg p-4 ${
                    isAdded ? "bg-gray-50 border-gray-300" : "border-gray-200 hover:border-[#8e2800]"
                  } transition-colors`}
                >
                  <h3 className="font-bold text-gray-800 mb-2">{service.tenDichVu}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.moTa}</p>
                  {service.thoiLuong && (
                    <p className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <FaClock className="text-[#8e2800]" />
                      {service.thoiLuong} phút
                    </p>
                  )}

                  {isAdded ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700 border border-green-300">
                      <FaCheckCircle className="mr-2" />
                      Đã thêm
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setFormData({
                          gia: "",
                          hinhAnh: "",
                          moTaShop: "",
                          thoiLuongShop: "",
                        });
                        setFormErrors({});
                        setShowAddModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors text-sm font-medium"
                    >
                      <FaPlus />
                      Thêm Dịch Vụ
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Chưa có dịch vụ hệ thống</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && editingService && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">{editingService?.maDichVuShop ? "Cập Nhật Dịch Vụ" : "Thêm Dịch Vụ"}</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-800 mb-1">{editingService?.tenDichVu}</p>
                <p className="text-sm text-gray-600">{editingService?.moTa}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá (đ) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Nhập giá dịch vụ"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.gia ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.gia}
                  onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                  min="0"
                />
                {formErrors.gia && <p className="text-red-600 text-sm mt-1">{formErrors.gia}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Link Hình Ảnh</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.hinhAnh ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.hinhAnh}
                  onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                />
                {formErrors.hinhAnh && <p className="text-red-600 text-sm mt-1">{formErrors.hinhAnh}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô Tả Cửa Hàng</label>
                <textarea
                  placeholder="Mô tả riêng của cửa hàng về dịch vụ này..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent h-24"
                  value={formData.moTaShop}
                  onChange={(e) => setFormData({ ...formData, moTaShop: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Thời Lượng (phút)</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 60"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.thoiLuongShop ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.thoiLuongShop}
                  onChange={(e) => setFormData({ ...formData, thoiLuongShop: e.target.value })}
                  min="0"
                />
                {formErrors.thoiLuongShop && <p className="text-red-600 text-sm mt-1">{formErrors.thoiLuongShop}</p>}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (editingService?.maDichVuShop) {
                    handleUpdateService(editingService.maDichVuShop);
                  } else {
                    handleAddService(editingService.maDichVu);
                  }
                }}
                disabled={loading}
                className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Propose Service Modal */}
      {showProposeModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Đề Xuất Dịch Vụ Mới</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Dịch Vụ <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cắt móng chuyên nghiệp"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.tenDichVu ? "border-red-500" : "border-gray-300"
                  }`}
                  value={proposeData.tenDichVu}
                  onChange={(e) =>
                    setProposeData({
                      ...proposeData,
                      tenDichVu: e.target.value,
                    })
                  }
                />
                {formErrors.tenDichVu && <p className="text-red-600 text-sm mt-1">{formErrors.tenDichVu}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô Tả</label>
                <textarea
                  placeholder="Mô tả chi tiết dịch vụ..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent h-24"
                  value={proposeData.moTa}
                  onChange={(e) => setProposeData({ ...proposeData, moTa: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá Dự Kiến (đ) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Giá dự kiến"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.gia ? "border-red-500" : "border-gray-300"
                  }`}
                  value={proposeData.gia}
                  onChange={(e) => setProposeData({ ...proposeData, gia: e.target.value })}
                  min="0"
                />
                {formErrors.gia && <p className="text-red-600 text-sm mt-1">{formErrors.gia}</p>}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <FaLightbulb className="text-blue-600 mt-1 shrink-0" />
                <p className="text-sm text-blue-800">Admin sẽ duyệt đề xuất của bạn trong 24-48 giờ</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowProposeModal(false);
                  setProposeData({ tenDichVu: "", moTa: "", gia: "" });
                  setFormErrors({});
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleProposeService}
                disabled={loading}
                className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Gửi Đề Xuất"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerServiceManagement;
