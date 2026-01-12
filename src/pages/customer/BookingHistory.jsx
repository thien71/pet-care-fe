// src/pages/customer/BookingHistory.jsx (UPDATED)
import { useState, useEffect } from "react";
import { bookingService } from "../../api";
import CustomerSidebar from "../../components/customer/CustomerSidebar";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaPaw,
  FaUser,
  FaMoneyBillWave,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEye,
  FaStore,
  FaWallet,
} from "react-icons/fa";
import { showToast } from "../../utils/toast";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      setBookings(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Không thể tải lịch sử");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    CHO_XAC_NHAN: {
      label: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <FaClock className="text-yellow-600" />,
    },
    DA_XAC_NHAN: {
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <FaCheckCircle className="text-blue-600" />,
    },
    DANG_THUC_HIEN: {
      label: "Đang thực hiện",
      color: "bg-purple-100 text-purple-700 border-purple-200",
      icon: <FaSpinner className="text-purple-600" />,
    },
    HOAN_THANH: {
      label: "Hoàn thành",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <FaCheckCircle className="text-green-600" />,
    },
    HUY: {
      label: "Đã hủy",
      color: "bg-red-100 text-red-700 border-red-200",
      icon: <FaTimesCircle className="text-red-600" />,
    },
  };

  const filterTabs = [
    { value: "ALL", label: "Tất cả", count: bookings.length },
    { value: "CHO_XAC_NHAN", label: "Chờ xác nhận" },
    { value: "DA_XAC_NHAN", label: "Đã xác nhận" },
    { value: "DANG_THUC_HIEN", label: "Đang thực hiện" },
    { value: "CHO_THANH_TOAN", label: "Chờ thanh toán" }, // ⭐ NEW
    { value: "HOAN_THANH", label: "Đã thanh toán" },
    { value: "HUY", label: "Đã hủy" },
  ];

  // ⭐ Lọc theo trạng thái + trạng thái thanh toán
  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    if (filter === "CHO_THANH_TOAN") {
      return b.trangThai === "HOAN_THANH" && b.trangThaiThanhToan === "CHUA_THANH_TOAN";
    }
    if (filter === "HOAN_THANH") {
      return b.trangThai === "HOAN_THANH" && b.trangThaiThanhToan === "DA_THANH_TOAN";
    }
    return b.trangThai === filter;
  });

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // ⭐ Hiển thị badge phù hợp
  const getStatusBadge = (booking) => {
    if (booking.trangThai === "HOAN_THANH" && booking.trangThaiThanhToan === "CHUA_THANH_TOAN") {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-orange-100 text-orange-700 border-orange-200">
          <FaWallet className="text-orange-600" />
          Chờ thanh toán
        </span>
      );
    }

    const status = statusConfig[booking.trangThai];
    return (
      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
        {status.icon}
        {status.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
        <CustomerSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#8e2800] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      <CustomerSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Lịch sử đặt lịch</h1>
            <p className="text-gray-600 mt-1">Quản lý các lịch hẹn của bạn</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => {
                let count = 0;
                if (tab.value === "ALL") {
                  count = bookings.length;
                } else if (tab.value === "CHO_THANH_TOAN") {
                  count = bookings.filter((b) => b.trangThai === "HOAN_THANH" && b.trangThaiThanhToan === "CHUA_THANH_TOAN").length;
                } else if (tab.value === "HOAN_THANH") {
                  count = bookings.filter((b) => b.trangThai === "HOAN_THANH" && b.trangThaiThanhToan === "DA_THANH_TOAN").length;
                } else {
                  count = bookings.filter((b) => b.trangThai === tab.value).length;
                }

                return (
                  <button
                    key={tab.value}
                    onClick={() => setFilter(tab.value)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all
                      ${
                        filter === tab.value
                          ? "bg-[#8e2800] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }
                    `}
                  >
                    {tab.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === tab.value ? "bg-white/20" : "bg-gray-200"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.maLichHen}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Mã:</span>
                        <span className="font-bold text-gray-800">#{booking.maLichHen}</span>
                      </div>
                      {getStatusBadge(booking)}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    {/* Shop Info */}
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-[#8e2800] mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{booking.CuaHang?.tenCuaHang}</p>
                        <p className="text-sm text-gray-600 truncate">{booking.CuaHang?.diaChi}</p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="text-[#8e2800]" />
                      <span>{new Date(booking.ngayHen).toLocaleString("vi-VN")}</span>
                    </div>

                    {/* Pets Count */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPaw className="text-[#8e2800]" />
                      <span>{booking.LichHenThuCungs?.length || 0} thú cưng</span>
                    </div>

                    {/* Staff */}
                    {booking.NhanVien && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaUser className="text-[#8e2800]" />
                        <span>{booking.NhanVien.hoTen}</span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tổng tiền:</span>
                        <span className="text-lg font-bold text-[#8e2800] flex items-center gap-1">
                          <FaMoneyBillWave />
                          {parseInt(booking.tongTien).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => openModal(booking)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
                    >
                      <FaEye />
                      <span>Xem chi tiết</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có lịch hẹn</h3>
              <p className="text-gray-600 mb-6">Bắt đầu đặt lịch chăm sóc thú cưng ngay hôm nay!</p>
              <button
                onClick={() => (window.location.href = "/customer/booking")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
              >
                <FaCalendarAlt />
                <span>Đặt lịch ngay</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal - Giống BookingDetailModal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Chi Tiết Đơn #{selectedBooking.maLichHen}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-center">{getStatusBadge(selectedBooking)}</div>

              {/* Shop Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaStore className="text-[#8e2800] w-4 h-4" />
                  Thông tin cửa hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-800">{selectedBooking.CuaHang?.tenCuaHang}</p>
                  <p className="text-gray-600 flex items-start gap-2">
                    <FaMapMarkerAlt className="mt-1 shrink-0" />
                    {selectedBooking.CuaHang?.diaChi}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaPhone />
                    {selectedBooking.CuaHang?.soDienThoai}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaClock className="text-[#8e2800] w-4 h-4" />
                  Thời gian
                </h4>
                <p className="text-gray-800">
                  {new Date(selectedBooking.ngayHen).toLocaleString("vi-VN", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              {/* Staff */}
              {selectedBooking.NhanVien && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FaUser className="text-[#8e2800] w-4 h-4" />
                    Nhân viên phụ trách
                  </h4>
                  <p className="text-gray-800">{selectedBooking.NhanVien.hoTen}</p>
                  {selectedBooking.NhanVien.soDienThoai && (
                    <p className="text-gray-600 text-sm mt-1">{selectedBooking.NhanVien.soDienThoai}</p>
                  )}
                </div>
              )}

              {/* Pets & Services */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaPaw className="text-[#8e2800] w-4 h-4" />
                  Thú cưng & Dịch vụ
                </h4>
                {selectedBooking.LichHenThuCungs?.map((pet, idx) => (
                  <div key={idx} className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="font-semibold text-gray-800">
                      {pet.ten} - {pet.LoaiThuCung?.tenLoai}
                    </p>
                    <div className="ml-4 mt-2 space-y-1">
                      {pet.LichHenChiTiets?.map((detail, i) => (
                        <div key={i} className="text-sm flex justify-between">
                          <span className="text-gray-700">• {detail.DichVuCuaShop?.DichVuHeThong?.tenDichVu}</span>
                          <span className="font-semibold text-[#8e2800]">{parseInt(detail.gia).toLocaleString("vi-VN")}đ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Note */}
              {selectedBooking.ghiChu && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-2">Ghi chú</h4>
                  <p className="text-gray-600 text-sm">{selectedBooking.ghiChu}</p>
                </div>
              )}

              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-[#8e2800]">{parseInt(selectedBooking.tongTien).toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
