// src/pages/admin/UserManagement.jsx
import { useState, useEffect } from "react";
import { userService, serviceService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaSearch, FaEdit, FaToggleOn, FaToggleOff, FaEnvelope, FaPhone, FaSpinner } from "react-icons/fa";
import EditUserModal from "@/components/admin/EditUserModal";
import ConfirmModal from "@/components/common/ConfirmModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    user: null,
    action: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([userService.getUsers(), serviceService.getRoles()]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) => u.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (formData) => {
    if (!selectedUser) return;

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang cập nhật...");

    try {
      await userService.updateUser(selectedUser.maNguoiDung, formData);
      showToast.dismiss(loadingToast);
      showToast.success("Cập nhật người dùng thành công!");
      setShowEditModal(false);
      setSelectedUser(null);
      await loadData();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi cập nhật người dùng");
    } finally {
      setActionLoading(false);
    }
  };

  const openConfirmModal = (user) => {
    setConfirmModal({
      isOpen: true,
      user,
      action: user.trangThai === 1 ? "deactivate" : "activate",
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      user: null,
      action: null,
    });
  };

  const handleToggleStatus = async () => {
    const { user } = confirmModal;
    if (!user) return;

    setActionLoading(true);
    const newStatus = user.trangThai === 1 ? 0 : 1;
    const loadingToast = showToast.loading(newStatus === 0 ? "Đang vô hiệu hóa..." : "Đang kích hoạt...");

    try {
      await userService.updateUser(user.maNguoiDung, {
        ...user,
        trangThai: newStatus,
      });
      showToast.dismiss(loadingToast);
      showToast.success(newStatus === 0 ? "Vô hiệu hóa tài khoản thành công!" : "Kích hoạt tài khoản thành công!");
      closeConfirmModal();
      await loadData();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi thay đổi trạng thái");
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
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Người Dùng</h1>
        <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng trong hệ thống</p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Người Dùng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số Điện Thoại</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vai Trò</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.maNguoiDung} className={`hover:bg-gray-50 transition-colors ${user.trangThai === 0 ? "opacity-60" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#8e2800] text-white flex items-center justify-center font-bold">
                          {user.hoTen.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{user.hoTen}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaEnvelope className="text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaPhone className="text-gray-400" />
                        <span>{user.soDienThoai || "Chưa cập nhật"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 border border-blue-300">
                        {user.VaiTro?.tenVaiTro || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          user.trangThai === 1
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {user.trangThai === 1 ? "Hoạt động" : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openConfirmModal(user)}
                          disabled={actionLoading}
                          className={`p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors ${
                            user.trangThai === 1 ? "text-green-600" : "text-red-600"
                          }`}
                          title={user.trangThai === 1 ? "Vô hiệu hóa" : "Kích hoạt"}
                        >
                          {user.trangThai === 1 ? <FaToggleOn className="text-2xl" /> : <FaToggleOff className="text-2xl" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">Không tìm thấy người dùng</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUpdateUser}
          user={selectedUser}
          roles={roles}
          loading={actionLoading}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleToggleStatus}
        title={confirmModal.action === "deactivate" ? "Xác nhận vô hiệu hóa" : "Xác nhận kích hoạt"}
        message={
          confirmModal.action === "deactivate"
            ? `Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${confirmModal.user?.hoTen}"? Người dùng này sẽ không thể đăng nhập vào hệ thống.`
            : `Bạn có chắc chắn muốn kích hoạt lại tài khoản "${confirmModal.user?.hoTen}"?`
        }
        confirmText={confirmModal.action === "deactivate" ? "Vô hiệu hóa" : "Kích hoạt"}
        cancelText="Hủy"
        type={confirmModal.action === "deactivate" ? "warning" : "success"}
        loading={actionLoading}
      />
    </div>
  );
};

export default UserManagement;
