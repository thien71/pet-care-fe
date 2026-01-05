// src/pages/owner/EmployeeManagement.jsx
import { useState, useEffect } from "react";
import { staffService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaUserPlus, FaToggleOn, FaToggleOff, FaEnvelope, FaPhone, FaSpinner } from "react-icons/fa";
import AddEmployeeModal from "@/components/owner/AddEmployeeModal";
import ConfirmModal from "@/components/common/ConfirmModal";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    employee: null,
    action: null,
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await staffService.getEmployees();
      setEmployees(response.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (formData) => {
    setActionLoading(true);
    const loadingToast = showToast.loading("Đang thêm nhân viên...");

    try {
      await staffService.addEmployee(formData);
      showToast.dismiss(loadingToast);
      showToast.success("Thêm nhân viên thành công! Email thiết lập mật khẩu đã được gửi.");
      await loadEmployees();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi thêm nhân viên");
    } finally {
      setActionLoading(false);
    }
  };

  const openConfirmModal = (employee) => {
    setConfirmModal({
      isOpen: true,
      employee,
      action: employee.trangThai === 1 ? "deactivate" : "activate",
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      employee: null,
      action: null,
    });
  };

  const handleConfirmToggleStatus = async () => {
    const { employee } = confirmModal;
    if (!employee) return;

    setActionLoading(true);
    const action = employee.trangThai === 1 ? "vô hiệu hóa" : "kích hoạt";
    const loadingToast = showToast.loading(`Đang ${action}...`);

    try {
      const response = await staffService.toggleEmployeeStatus(employee.maNguoiDung);
      showToast.dismiss(loadingToast);
      showToast.success(response.message);
      await loadEmployees();
      closeConfirmModal();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || `Lỗi ${action} nhân viên`);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      LE_TAN: "Lễ Tân",
      KY_THUAT_VIEN: "Kỹ Thuật Viên",
    };
    return labels[role] || role;
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
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Nhân Viên</h1>
        <p className="text-gray-600 mt-1">Quản lý đội ngũ nhân viên cửa hàng</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Danh Sách Nhân Viên</h2>
            <p className="text-sm text-gray-600 mt-1">Tổng số: {employees.length} nhân viên</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] font-medium transition-colors"
          >
            <FaUserPlus />
            Thêm Nhân Viên
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Họ Tên</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số Điện Thoại</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vai Trò</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.maNguoiDung} className={`hover:bg-gray-50 transition-colors ${emp.trangThai === 0 ? "opacity-60" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#8e2800] text-white flex items-center justify-center font-bold">
                          {emp.hoTen.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{emp.hoTen}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaEnvelope className="text-gray-400" />
                        <span>{emp.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaPhone className="text-gray-400" />
                        <span>{emp.soDienThoai || "Chưa cập nhật"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 border border-blue-300">
                        {getRoleLabel(emp.VaiTro?.tenVaiTro)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          emp.trangThai === 1
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {emp.trangThai === 1 ? "Hoạt động" : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => openConfirmModal(emp)}
                          disabled={actionLoading}
                          className={`p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors ${
                            emp.trangThai === 1 ? "text-green-600" : "text-red-600"
                          }`}
                          title={emp.trangThai === 1 ? "Vô hiệu hóa" : "Kích hoạt"}
                        >
                          {emp.trangThai === 1 ? <FaToggleOn className="text-2xl" /> : <FaToggleOff className="text-2xl" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">👥</div>
                    <p className="text-gray-500 text-lg">Chưa có nhân viên nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddEmployeeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEmployee}
          loading={actionLoading}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmToggleStatus}
        title={confirmModal.action === "deactivate" ? "Xác nhận vô hiệu hóa" : "Xác nhận kích hoạt"}
        message={
          confirmModal.action === "deactivate"
            ? `Bạn có chắc chắn muốn vô hiệu hóa nhân viên "${confirmModal.employee?.hoTen}"? Nhân viên này sẽ không thể đăng nhập vào hệ thống.`
            : `Bạn có chắc chắn muốn kích hoạt lại nhân viên "${confirmModal.employee?.hoTen}"? Nhân viên này sẽ có thể đăng nhập trở lại.`
        }
        confirmText={confirmModal.action === "deactivate" ? "Vô hiệu hóa" : "Kích hoạt"}
        cancelText="Hủy"
        type={confirmModal.action === "deactivate" ? "warning" : "success"}
        loading={actionLoading}
      />
    </div>
  );
};

export default EmployeeManagement;
