// src/pages/owner/OwnerBookingManagement.jsx - QUẢN LÝ ĐƠN HÀNG
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const OwnerBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("CHO_XAC_NHAN");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTechId, setAssignTechId] = useState("");

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, employeesRes] = await Promise.all([
        apiClient.get("/booking/shop-bookings", {
          params: { trangThai: filter },
        }),
        apiClient.get("/owner/employees"),
      ]);
      setBookings(bookingsRes.data || []);
      setEmployees(employeesRes.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      setLoading(true);
      await apiClient.put(`/booking/${bookingId}/confirm`);
      setSuccess("Xác nhận đơn hàng thành công!");
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi xác nhận");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTechnician = async () => {
    if (!assignTechId) {
      setError("Vui lòng chọn kỹ thuật viên");
      return;
    }

    try {
      setLoading(true);
      await apiClient.put(
        `/booking/${selectedBooking.maLichHen}/assign-technician`,
        {
          maNhanVien: parseInt(assignTechId),
        }
      );
      setSuccess("Gán kỹ thuật viên thành công!");
      setShowAssignModal(false);
      setAssignTechId("");
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi gán kỹ thuật viên");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      await apiClient.put(`/booking/${bookingId}/status`, {
        trangThai: newStatus,
      });
      setSuccess("Cập nhật trạng thái thành công!");
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setAssignTechId(booking.maNhanVien || "");
    setShowAssignModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      CHO_XAC_NHAN: { class: "badge-warning", label: "Chờ xác nhận" },
      DA_XAC_NHAN: { class: "badge-info", label: "Đã xác nhận" },
      DANG_THUC_HIEN: { class: "badge-primary", label: "Đang thực hiện" },
      HOAN_THANH: { class: "badge-success", label: "Hoàn thành" },
      HUY: { class: "badge-error", label: "Đã hủy" },
    };
    const badge = badges[status] || { class: "", label: status };
    return <span className={`badge ${badge.class}`}>{badge.label}</span>;
  };

  const getTechnicianEmployees = () => {
    return employees.filter((emp) =>
      emp.VaiTros?.some((role) => role.tenVaiTro === "KY_THUAT_VIEN")
    );
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">📋 Quản Lý Đặt Hẹn</h1>
        <p className="text-gray-600 mt-2">
          Xử lý các đơn đặt lịch từ khách hàng
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError("")} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="tabs tabs-boxed">
            {[
              { value: "CHO_XAC_NHAN", label: "Chờ Xác Nhận" },
              { value: "DA_XAC_NHAN", label: "Đã Xác Nhận" },
              { value: "DANG_THUC_HIEN", label: "Đang Thực Hiện" },
              { value: "HOAN_THANH", label: "Hoàn Thành" },
              { value: "HUY", label: "Đã Hủy" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`tab ${filter === tab.value ? "tab-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Chờ xác nhận</div>
          <div className="stat-value text-warning">
            {bookings.filter((b) => b.trangThai === "CHO_XAC_NHAN").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Đang thực hiện</div>
          <div className="stat-value text-primary">
            {bookings.filter((b) => b.trangThai === "DANG_THUC_HIEN").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Hoàn thành</div>
          <div className="stat-value text-success">
            {bookings.filter((b) => b.trangThai === "HOAN_THANH").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Tổng đơn</div>
          <div className="stat-value">{bookings.length}</div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.maLichHen} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="card-title text-lg">#{booking.maLichHen}</h3>
                  {getStatusBadge(booking.trangThai)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span>👤</span>
                    <div>
                      <p className="font-semibold">
                        {booking.KhachHang?.hoTen}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.KhachHang?.soDienThoai}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>
                      {new Date(booking.ngayHen).toLocaleString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>🐾</span>
                    <span>{booking.LichHenThuCungs?.length || 0} thú cưng</span>
                  </div>

                  {booking.NhanVien && (
                    <div className="flex items-center gap-2">
                      <span>👨‍🔧</span>
                      <span>{booking.NhanVien.hoTen}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span className="font-bold text-primary">
                      {parseInt(booking.tongTien).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4 gap-2">
                  <button
                    onClick={() => openDetailModal(booking)}
                    className="btn btn-sm btn-ghost"
                  >
                    👁️ Chi tiết
                  </button>

                  {booking.trangThai === "CHO_XAC_NHAN" && (
                    <>
                      <button
                        onClick={() => handleConfirm(booking.maLichHen)}
                        className="btn btn-sm btn-success"
                      >
                        ✅ Xác nhận
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(booking.maLichHen, "HUY")
                        }
                        className="btn btn-sm btn-error"
                      >
                        ❌ Hủy
                      </button>
                    </>
                  )}

                  {(booking.trangThai === "DA_XAC_NHAN" ||
                    booking.trangThai === "DANG_THUC_HIEN") && (
                    <button
                      onClick={() => openAssignModal(booking)}
                      className="btn btn-sm btn-info"
                    >
                      👨‍🔧 Gán KTV
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 text-lg">Không có đơn hàng nào</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">
              📋 Chi Tiết Đơn #{selectedBooking.maLichHen}
            </h3>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-bold">👤 Khách Hàng</h4>
                  <p>{selectedBooking.KhachHang?.hoTen}</p>
                  <p className="text-sm">
                    {selectedBooking.KhachHang?.soDienThoai}
                  </p>
                  <p className="text-sm">{selectedBooking.KhachHang?.email}</p>
                </div>
              </div>

              {/* Pets & Services */}
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-bold">🐾 Thú Cưng & Dịch Vụ</h4>
                  {selectedBooking.LichHenThuCungs?.map((pet, idx) => (
                    <div key={idx} className="mt-2 p-2 bg-base-100 rounded">
                      <p className="font-semibold">
                        {pet.ten} - {pet.LoaiThuCung?.tenLoai}
                      </p>
                      <div className="ml-4 mt-1 space-y-1">
                        {pet.LichHenChiTiets?.map((detail, i) => (
                          <div key={i} className="text-sm flex justify-between">
                            <span>
                              • {detail.DichVuCuaShop?.DichVuHeThong?.tenDichVu}
                            </span>
                            <span className="font-semibold">
                              {parseInt(detail.gia).toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Trạng Thái</p>
                  {getStatusBadge(selectedBooking.trangThai)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng Tiền</p>
                  <p className="font-bold text-primary text-lg">
                    {parseInt(selectedBooking.tongTien).toLocaleString("vi-VN")}
                    đ
                  </p>
                </div>
              </div>

              {selectedBooking.ghiChu && (
                <div>
                  <p className="text-sm text-gray-600">Ghi Chú</p>
                  <p>{selectedBooking.ghiChu}</p>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button onClick={() => setShowDetailModal(false)} className="btn">
                Đóng
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowDetailModal(false)}
          ></div>
        </div>
      )}

      {/* Assign Technician Modal */}
      {showAssignModal && selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">👨‍🔧 Gán Kỹ Thuật Viên</h3>

            <p className="mb-4">Đơn hàng: #{selectedBooking.maLichHen}</p>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Chọn Kỹ Thuật Viên
                </span>
              </label>
              <select
                className="select select-bordered"
                value={assignTechId}
                onChange={(e) => setAssignTechId(e.target.value)}
              >
                <option value="">-- Chọn kỹ thuật viên --</option>
                {getTechnicianEmployees().map((emp) => (
                  <option key={emp.maNguoiDung} value={emp.maNguoiDung}>
                    {emp.hoTen}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowAssignModal(false)}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button
                onClick={handleAssignTechnician}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Gán"}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowAssignModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default OwnerBookingManagement;
