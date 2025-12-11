// src/pages/customer/BookingHistory.jsx - LỊCH SỬ ĐẶT LỊCH
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/booking/my-bookings");
      setBookings(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
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

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "ALL") return true;
    return booking.trangThai === filter;
  });

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">📜 Lịch Sử Đặt Lịch</h1>
          <p className="text-gray-600 mt-2">Quản lý các lịch hẹn của bạn</p>
        </div>
        <button
          onClick={() => navigate("/customer/booking")}
          className="btn btn-primary gap-2"
        >
          <span>➕</span>
          Đặt Lịch Mới
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button onClick={() => setError("")} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="tabs tabs-boxed">
            {[
              { value: "ALL", label: "Tất Cả" },
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title text-xs">Tổng</div>
          <div className="stat-value text-2xl">{bookings.length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title text-xs">Chờ</div>
          <div className="stat-value text-2xl text-warning">
            {bookings.filter((b) => b.trangThai === "CHO_XAC_NHAN").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title text-xs">Đã xác nhận</div>
          <div className="stat-value text-2xl text-info">
            {bookings.filter((b) => b.trangThai === "DA_XAC_NHAN").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title text-xs">Hoàn thành</div>
          <div className="stat-value text-2xl text-success">
            {bookings.filter((b) => b.trangThai === "HOAN_THANH").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title text-xs">Đã hủy</div>
          <div className="stat-value text-2xl text-error">
            {bookings.filter((b) => b.trangThai === "HUY").length}
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.maLichHen} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="card-title text-lg">#{booking.maLichHen}</h3>
                  {getStatusBadge(booking.trangThai)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span>🏪</span>
                    <div>
                      <p className="font-semibold">
                        {booking.CuaHang?.tenCuaHang}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.CuaHang?.diaChi}
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

                  <div className="divider my-2"></div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng:</span>
                    <span className="font-bold text-primary text-lg">
                      {parseInt(booking.tongTien).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => openDetailModal(booking)}
                    className="btn btn-sm btn-primary w-full"
                  >
                    👁️ Xem Chi Tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-2xl font-bold text-gray-600">
            Chưa có lịch hẹn nào
          </p>
          <p className="text-gray-500 mt-2">
            Bắt đầu đặt lịch chăm sóc thú cưng ngay!
          </p>
          <button
            onClick={() => navigate("/customer/booking")}
            className="btn btn-primary mt-4 gap-2"
          >
            <span>➕</span>
            Đặt Lịch Ngay
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">
              📋 Chi Tiết Đơn #{selectedBooking.maLichHen}
            </h3>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Trạng thái:</span>
                {getStatusBadge(selectedBooking.trangThai)}
              </div>

              {/* Shop Info */}
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-bold">🏪 Cửa Hàng</h4>
                  <p className="font-semibold">
                    {selectedBooking.CuaHang?.tenCuaHang}
                  </p>
                  <p className="text-sm">{selectedBooking.CuaHang?.diaChi}</p>
                  <p className="text-sm">
                    {selectedBooking.CuaHang?.soDienThoai}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-bold">📅 Thời Gian</h4>
                  <p className="text-lg">
                    {new Date(selectedBooking.ngayHen).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Technician */}
              {selectedBooking.NhanVien && (
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold">👨‍🔧 Kỹ Thuật Viên</h4>
                    <p>{selectedBooking.NhanVien.hoTen}</p>
                    <p className="text-sm">
                      {selectedBooking.NhanVien.soDienThoai}
                    </p>
                  </div>
                </div>
              )}

              {/* Pets & Services */}
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-bold">🐾 Thú Cưng & Dịch Vụ</h4>
                  {selectedBooking.LichHenThuCungs?.map((pet, idx) => (
                    <div key={idx} className="mt-2 p-2 bg-base-100 rounded">
                      <p className="font-semibold">
                        {pet.ten} - {pet.LoaiThuCung?.tenLoai}
                      </p>
                      {pet.tuoi && (
                        <p className="text-xs text-gray-600">
                          Tuổi: {pet.tuoi}
                        </p>
                      )}
                      {pet.dacDiem && (
                        <p className="text-xs text-gray-600">
                          Đặc điểm: {pet.dacDiem}
                        </p>
                      )}
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

              {/* Note */}
              {selectedBooking.ghiChu && (
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold">📝 Ghi Chú</h4>
                    <p>{selectedBooking.ghiChu}</p>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Tổng Tiền:</span>
                <span className="text-primary">
                  {parseInt(selectedBooking.tongTien).toLocaleString("vi-VN")}đ
                </span>
              </div>
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
    </div>
  );
};

export default BookingHistory;
