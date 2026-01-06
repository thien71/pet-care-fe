// src/pages/admin/PetTypeManagement.jsx
import { useState, useEffect } from "react";
import { serviceService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaPlus, FaPaw, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import PetTypeModal from "@/components/admin/PetTypeModal";
import ConfirmModal from "@/components/common/ConfirmModal";

const PetTypeManagement = () => {
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingPetType, setEditingPetType] = useState(null);
  const [deletePetType, setDeletePetType] = useState(null);

  useEffect(() => {
    loadPetTypes();
  }, []);

  const loadPetTypes = async () => {
    try {
      setLoading(true);
      const res = await serviceService.getPetTypes();
      setPetTypes(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingPetType(null);
    setShowModal(true);
  };

  const openEditModal = (petType) => {
    setEditingPetType(petType);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    const loadingToast = showToast.loading(editingPetType ? "Đang cập nhật..." : "Đang thêm...");

    try {
      if (editingPetType) {
        await serviceService.updatePetType(editingPetType.maLoai, formData);
        showToast.dismiss(loadingToast);
        showToast.success("Cập nhật loại thú cưng thành công!");
      } else {
        await serviceService.createPetType(formData);
        showToast.dismiss(loadingToast);
        showToast.success("Thêm loại thú cưng thành công!");
      }
      setShowModal(false);
      await loadPetTypes();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi khi lưu dữ liệu");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePetType) return;

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang xóa...");

    try {
      await serviceService.deletePetType(deletePetType.maLoai);
      showToast.dismiss(loadingToast);
      showToast.success("Xóa loại thú cưng thành công!");
      setDeletePetType(null);
      await loadPetTypes();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi xóa loại thú cưng");
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
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Loại Thú Cưng</h1>
          <p className="text-gray-600 mt-1">Quản lý các loại thú cưng trong hệ thống</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
        >
          <FaPlus />
          Thêm Loại
        </button>
      </div>

      {/* Pet Types Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Icon</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên Loại</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {petTypes.length > 0 ? (
                petTypes.map((petType) => (
                  <tr key={petType.maLoai} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <FaPaw className="text-xl text-[#8e2800]" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{petType.tenLoai}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(petType)}
                          className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          title="Sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeletePetType(petType)}
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
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <FaPaw className="mx-auto text-6xl text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Chưa có loại thú cưng nào</p>
                    <button
                      onClick={openAddModal}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
                    >
                      <FaPlus />
                      Thêm Loại Đầu Tiên
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PetTypeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPetType(null);
        }}
        onSubmit={handleSave}
        petType={editingPetType}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={!!deletePetType}
        onClose={() => setDeletePetType(null)}
        onConfirm={handleDelete}
        title="Xác Nhận Xóa"
        message={`Bạn có chắc chắn muốn xóa loại "${deletePetType?.tenLoai}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default PetTypeManagement;
