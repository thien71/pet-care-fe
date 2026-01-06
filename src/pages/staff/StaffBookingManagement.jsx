// src/pages/staff/StaffBookingManagement.jsx
import { useState, useEffect } from "react";
import { bookingService, staffService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaClipboardList, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import StaffBookingCard from "@/components/staff/StaffBookingCard";
import StaffBookingDetailModal from "@/components/staff/StaffBookingDetailModal";
import StaffAssignTechnicianModal from "@/components/staff/StaffAssignTechnicianModal";

const StaffBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("CHO_XAC_NHAN");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const bookingsRes = await bookingService.getShopBookings({ trangThai: filter });
      const employeesRes = await staffService.getEmployees();
      setBookings(bookingsRes.data || []);
      setEmployees(employeesRes.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      const loadingToast = showToast.loading("Đang xác nhận đơn hàng...");
      await bookingService.confirmBooking(bookingId);
      showToast.dismiss(loadingToast);
      showToast.success("Xác nhận đơn hàng thành công!");
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Lỗi xác nhận");
    }
  };

  const handleAssignTechnician = async (technicianId) => {
    if (!selectedBooking) return;

    try {
      const loadingToast = showToast.loading("Đang gán kỹ thuật viên...");
      await bookingService.assignTechnician(selectedBooking.maLichHen, { maNhanVien: parseInt(technicianId) });
      showToast.dismiss(loadingToast);
      showToast.success("Gán kỹ thuật viên thành công!");
      setShowAssignModal(false);
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Lỗi gán kỹ thuật viên");
    }
  };

  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
  };

  const filterButtons = [
    { value: "CHO_XAC_NHAN", label: "Chờ xác nhận", icon: FaHourglassHalf },
    { value: "DA_XAC_NHAN", label: "Đã xác nhận", icon: FaCheckCircle },
    { value: "DANG_THUC_HIEN", label: "Đang thực hiện", icon: FaClock },
    { value: "HOAN_THANH", label: "Hoàn thành", icon: FaCheckCircle },
    { value: "HUY", label: "Đã hủy", icon: FaTimesCircle },
  ];

  const getCountByStatus = (status) => {
    return bookings.filter((b) => b.trangThai === status).length;
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#8e2800] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <FaClipboardList className="text-2xl text-[#8e2800]" />
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Đơn Đặt Hẹn</h1>
        </div>
        <p className="text-gray-600">Xử lý các đơn đặt lịch từ khách hàng</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((tab) => {
            const Icon = tab.icon;
            const count = getCountByStatus(tab.value);
            const isActive = filter === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isActive ? "bg-[#8e2800] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Icon />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? "bg-white/20" : "bg-gray-200"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaHourglassHalf className="text-2xl text-yellow-600" />
            <p className="text-sm text-gray-600">Chờ xác nhận</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{bookings.filter((b) => b.trangThai === "CHO_XAC_NHAN").length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaClock className="text-2xl text-blue-600" />
            <p className="text-sm text-gray-600">Đang thực hiện</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{bookings.filter((b) => b.trangThai === "DANG_THUC_HIEN").length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaCheckCircle className="text-2xl text-green-600" />
            <p className="text-sm text-gray-600">Hoàn thành</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{bookings.filter((b) => b.trangThai === "HOAN_THANH").length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaClipboardList className="text-2xl text-gray-600" />
            <p className="text-sm text-gray-600">Tổng đơn</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{bookings.length}</p>
        </div>
      </div>

      {/* Bookings Grid */}
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <StaffBookingCard
              key={booking.maLichHen}
              booking={booking}
              onViewDetail={openDetailModal}
              onConfirm={handleConfirm}
              onAssign={openAssignModal}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-600">Không có đơn hàng nào</p>
        </div>
      )}

      {/* Modals */}
      {showDetailModal && selectedBooking && (
        <StaffBookingDetailModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {showAssignModal && selectedBooking && (
        <StaffAssignTechnicianModal
          booking={selectedBooking}
          employees={employees}
          onConfirm={handleAssignTechnician}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default StaffBookingManagement;
