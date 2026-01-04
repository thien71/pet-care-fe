import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import {
  FaCalendar,
  FaUser,
  FaPaw,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaUserMd,
  FaEye,
  FaClock,
  FaSpinner,
} from "react-icons/fa";

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
        { maNhanVien: parseInt(assignTechId) }
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
      CHO_XAC_NHAN: {
        class: "bg-yellow-100 text-yellow-700 border-yellow-300",
        label: "Chờ xác nhận",
      },
      DA_XAC_NHAN: {
        class: "bg-blue-100 text-blue-700 border-blue-300",
        label: "Đã xác nhận",
      },
      DANG_THUC_HIEN: {
        class: "bg-purple-100 text-purple-700 border-purple-300",
        label: "Đang thực hiện",
      },
      HOAN_THANH: {
        class: "bg-green-100 text-green-700 border-green-300",
        label: "Hoàn thành",
      },
      HUY: { class: "bg-red-100 text-red-700 border-red-300", label: "Đã hủy" },
    };
    const badge = badges[status] || {
      class: "bg-gray-100 text-gray-700 border-gray-300",
      label: status,
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${badge.class}`}
      >
        {badge.label}
      </span>
    );
  };

  const getTechnicianEmployees = () => {
    return employees.filter((emp) =>
      emp.VaiTros?.some((role) => role.tenVaiTro === "KY_THUAT_VIEN")
    );
  };

  const filterButtons = [
    { value: "CHO_XAC_NHAN", label: "Chờ xác nhận" },
    { value: "DA_XAC_NHAN", label: "Đã xác nhận" },
    { value: "DANG_THUC_HIEN", label: "Đang thực hiện" },
    { value: "HOAN_THANH", label: "Hoàn thành" },
    { value: "HUY", label: "Đã hủy" },
  ];

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Đặt Hẹn</h1>
        <p className="text-gray-600 mt-1">
          Xử lý các đơn đặt lịch từ khách hàng
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <FaCheckCircle className="text-green-600 text-xl" />
          <span className="text-green-800">{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <FaTimesCircle className="text-red-600 text-xl" />
          <span className="text-red-800">{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.value
                  ? "bg-[#8e2800] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Chờ xác nhận",
            value: bookings.filter((b) => b.trangThai === "CHO_XAC_NHAN")
              .length,
            color: "yellow",
          },
          {
            label: "Đang thực hiện",
            value: bookings.filter((b) => b.trangThai === "DANG_THUC_HIEN")
              .length,
            color: "purple",
          },
          {
            label: "Hoàn thành",
            value: bookings.filter((b) => b.trangThai === "HOAN_THANH").length,
            color: "green",
          },
          { label: "Tổng đơn", value: bookings.length, color: "gray" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-600`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.maLichHen}
              className="bg-white border border-gray-200 rounded-lg hover:border-[#8e2800] transition-colors"
            >
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800">
                    #{booking.maLichHen}
                  </h3>
                  {getStatusBadge(booking.trangThai)}
                </div>

                {/* Customer Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-3">
                    <FaUser className="text-[#8e2800] mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {booking.KhachHang?.hoTen}
                      </p>
                      <p className="text-gray-600">
                        {booking.KhachHang?.soDienThoai}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaCalendar className="text-[#8e2800]" />
                    <span className="text-gray-700">
                      {new Date(booking.ngayHen).toLocaleString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaPaw className="text-[#8e2800]" />
                    <span className="text-gray-700">
                      {booking.LichHenThuCungs?.length || 0} thú cưng
                    </span>
                  </div>

                  {booking.NhanVien && (
                    <div className="flex items-center gap-3">
                      <FaUserMd className="text-[#8e2800]" />
                      <span className="text-gray-700">
                        {booking.NhanVien.hoTen}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <FaDollarSign className="text-[#8e2800]" />
                    <span className="font-bold text-[#8e2800]">
                      {parseInt(booking.tongTien).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center flex-wrap gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openDetailModal(booking)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <FaEye />
                  </button>

                  {booking.trangThai === "CHO_XAC_NHAN" && (
                    <>
                      <button
                        onClick={() => handleConfirm(booking.maLichHen)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      >
                        <FaCheckCircle />
                        Xác nhận
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(booking.maLichHen, "HUY")
                        }
                        className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        <FaTimesCircle />
                        Hủy
                      </button>
                    </>
                  )}

                  {(booking.trangThai === "DA_XAC_NHAN" ||
                    booking.trangThai === "DANG_THUC_HIEN") && (
                    <button
                      onClick={() => openAssignModal(booking)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      <FaUserMd />
                      Gán KTV
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FaClock className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Không có đơn hàng nào</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Chi Tiết Đơn #{selectedBooking.maLichHen}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Customer */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaUser className="text-[#8e2800]" />
                  Khách Hàng
                </h4>
                <p className="text-gray-700">
                  {selectedBooking.KhachHang?.hoTen}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedBooking.KhachHang?.soDienThoai}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedBooking.KhachHang?.email}
                </p>
              </div>

              {/* Pets & Services */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaPaw className="text-[#8e2800]" />
                  Thú Cưng & Dịch Vụ
                </h4>
                {selectedBooking.LichHenThuCungs?.map((pet, idx) => (
                  <div
                    key={idx}
                    className="mt-2 p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <p className="font-semibold text-gray-800">
                      {pet.ten} - {pet.LoaiThuCung?.tenLoai}
                    </p>
                    <div className="ml-4 mt-2 space-y-1">
                      {pet.LichHenChiTiets?.map((detail, i) => (
                        <div key={i} className="text-sm flex justify-between">
                          <span className="text-gray-700">
                            • {detail.DichVuCuaShop?.DichVuHeThong?.tenDichVu}
                          </span>
                          <span className="font-semibold text-[#8e2800]">
                            {parseInt(detail.gia).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trạng Thái</p>
                  {getStatusBadge(selectedBooking.trangThai)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng Tiền</p>
                  <p className="font-bold text-[#8e2800] text-xl">
                    {parseInt(selectedBooking.tongTien).toLocaleString("vi-VN")}
                    đ
                  </p>
                </div>
              </div>

              {selectedBooking.ghiChu && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ghi Chú</p>
                  <p className="text-gray-700">{selectedBooking.ghiChu}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Technician Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Gán Kỹ Thuật Viên
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                Đơn hàng:{" "}
                <span className="font-bold">#{selectedBooking.maLichHen}</span>
              </p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chọn Kỹ Thuật Viên
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
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
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleAssignTechnician}
                disabled={loading}
                className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Gán"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBookingManagement;
