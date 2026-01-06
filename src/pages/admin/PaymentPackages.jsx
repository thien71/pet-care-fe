// src/pages/admin/PaymentPackages.jsx
import { useState, useEffect } from "react";
import { paymentService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import ConfirmModal from "@/components/common/ConfirmModal";

const PaymentPackageModal = ({ isOpen, onClose, onSubmit, packageData, loading }) => {
  const [formData, setFormData] = useState({
    tenGoi: "",
    soTien: "",
    thoiGian: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (packageData) {
      setFormData({
        tenGoi: packageData.tenGoi || "",
        soTien: packageData.soTien || "",
        thoiGian: packageData.thoiGian || "",
      });
    } else {
      setFormData({ tenGoi: "", soTien: "", thoiGian: "" });
    }
    setErrors({});
  }, [packageData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.tenGoi.trim()) newErrors.tenGoi = "Tên gói không được để trống";
    if (!formData.soTien || formData.soTien <= 0) newErrors.soTien = "Số tiền phải lớn hơn 0";
    if (!formData.thoiGian || formData.thoiGian <= 0) newErrors.thoiGian = "Thời gian phải lớn hơn 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">{packageData ? "Cập Nhật Gói" : "Tạo Gói Mới"}</h3>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên Gói *</label>
            <input
              type="text"
              placeholder="Ví dụ: Gói Cơ Bản, Gói VIP"
              className={`w-full px-4 py-2.5 border ${
                errors.tenGoi ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.tenGoi}
              onChange={(e) => setFormData({ ...formData, tenGoi: e.target.value })}
            />
            {errors.tenGoi && <p className="text-red-600 text-sm mt-1">{errors.tenGoi}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Giá (đ) *</label>
            <input
              type="number"
              placeholder="100000"
              min="0"
              className={`w-full px-4 py-2.5 border ${
                errors.soTien ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.soTien}
              onChange={(e) => setFormData({ ...formData, soTien: e.target.value })}
            />
            {errors.soTien && <p className="text-red-600 text-sm mt-1">{errors.soTien}</p>}
            {formData.soTien > 0 && <p className="text-sm text-gray-600 mt-1">{parseInt(formData.soTien).toLocaleString("vi-VN")}đ</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thời Gian (tháng) *</label>
            <input
              type="number"
              placeholder="1"
              min="1"
              className={`w-full px-4 py-2.5 border ${
                errors.thoiGian ? "border-red-300" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent`}
              value={formData.thoiGian}
              onChange={(e) => setFormData({ ...formData, thoiGian: e.target.value })}
            />
            {errors.thoiGian && <p className="text-red-600 text-sm mt-1">{errors.thoiGian}</p>}
          </div>
          {formData.soTien > 0 && formData.thoiGian > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Giá / tháng:{" "}
                {(parseInt(formData.soTien) / parseInt(formData.thoiGian)).toLocaleString("vi-VN", { maximumFractionDigits: 0 })}đ
              </p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deletePackage, setDeletePackage] = useState(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getPaymentPackages();
      setPackages(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPackage(null);
    setShowModal(true);
  };

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    const loadingToast = showToast.loading(editingPackage ? "Đang cập nhật..." : "Đang thêm...");

    try {
      if (editingPackage) {
        await paymentService.updatePaymentPackage(editingPackage.maGoi, formData);
        showToast.dismiss(loadingToast);
        showToast.success("Cập nhật gói thành công!");
      } else {
        await paymentService.createPaymentPackage(formData);
        showToast.dismiss(loadingToast);
        showToast.success("Tạo gói mới thành công!");
      }
      setShowModal(false);
      await loadPackages();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePackage) return;

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang xóa...");

    try {
      await paymentService.deletePaymentPackage(deletePackage.maGoi);
      showToast.dismiss(loadingToast);
      showToast.success("Xóa gói thành công!");
      setDeletePackage(null);
      await loadPackages();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi xóa gói");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Gói Thanh Toán</h1>
          <p className="text-gray-600 mt-1">Quản lý các gói thanh toán cho cửa hàng</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
        >
          <FaPlus />
          Tạo Gói Mới
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên Gói</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thời Gian</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Giá / Tháng</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <tr key={pkg.maGoi} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800">{pkg.tenGoi}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#8e2800]">{parseInt(pkg.soTien).toLocaleString("vi-VN")}đ</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{pkg.thoiGian} tháng</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">
                      {(parseInt(pkg.soTien) / pkg.thoiGian).toLocaleString("vi-VN", { maximumFractionDigits: 0 })}đ
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(pkg)}
                        className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                        title="Sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeletePackage(pkg)}
                        className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
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
                  <p className="text-gray-500 text-lg mb-4">Chưa có gói thanh toán nào</p>
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
                  >
                    <FaPlus />
                    Tạo Gói Đầu Tiên
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaymentPackageModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPackage(null);
        }}
        onSubmit={handleSave}
        packageData={editingPackage}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={!!deletePackage}
        onClose={() => setDeletePackage(null)}
        onConfirm={handleDelete}
        title="Xác Nhận Xóa"
        message={`Bạn có chắc chắn muốn xóa gói "${deletePackage?.tenGoi}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default PaymentPackages;
