// src/pages/admin/UserManagement.jsx
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
    diaChi: "",
    maVaiTro: 1,
  });

  // Load users và roles
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        apiClient.get("/admin/users"),
        apiClient.get("/admin/roles"),
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({
      hoTen: user.hoTen,
      email: user.email,
      soDienThoai: user.soDienThoai || "",
      diaChi: user.diaChi || "",
      maVaiTro: user.maVaiTro,
    });
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      await apiClient.put(`/admin/users/${selectedUser.maNguoiDung}`, editData);
      setShowModal(false);
      setSelectedUser(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Lỗi cập nhật người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        setLoading(true);
        await apiClient.delete(`/admin/users/${userId}`);
        await loadData();
      } catch (err) {
        setError(err.message || "Lỗi xóa người dùng");
      } finally {
        setLoading(false);
      }
    }
  };

  const getRoleName = (roleId) => {
    return roles.find((r) => r.maVaiTro === roleId)?.tenVaiTro || "N/A";
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">👥 Quản lý Người Dùng</h1>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Search Box */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr className="bg-base-200">
                <th>Tên</th>
                <th>Email</th>
                <th>Vai Trò</th>
                <th>Số Điện Thoại</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.maNguoiDung} className="hover">
                    <td className="font-semibold">{user.hoTen}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-primary">
                        {getRoleName(user.maVaiTro)}
                      </span>
                    </td>
                    <td>{user.soDienThoai || "N/A"}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.trangThai ? "badge-success" : "badge-error"
                        }`}
                      >
                        {user.trangThai ? "Kích hoạt" : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td className="space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="btn btn-sm btn-info"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.maNguoiDung)}
                        className="btn btn-sm btn-error"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    Không tìm thấy người dùng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">✏️ Cập nhật người dùng</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Họ tên</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editData.hoTen}
                  onChange={(e) =>
                    setEditData({ ...editData, hoTen: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={editData.email}
                  disabled
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Số điện thoại</span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered"
                  value={editData.soDienThoai}
                  onChange={(e) =>
                    setEditData({ ...editData, soDienThoai: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Địa chỉ</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editData.diaChi}
                  onChange={(e) =>
                    setEditData({ ...editData, diaChi: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Vai Trò</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editData.maVaiTro}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      maVaiTro: parseInt(e.target.value),
                    })
                  }
                >
                  {roles.map((role) => (
                    <option key={role.maVaiTro} value={role.maVaiTro}>
                      {role.tenVaiTro}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateUser}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
