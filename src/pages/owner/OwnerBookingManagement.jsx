// src/pages/owner/OwnerBookingManagement.jsx
import { useState, useEffect } from "react";
import { FaSpinner, FaClock } from "react-icons/fa";
import { bookingService, staffService } from "@/api";
import { showToast } from "@/utils/toast";

import BookingCard from "@/components/owner/BookingCard";
import BookingDetailModal from "@/components/owner/BookingDetailModal";
import ConfirmCancelModal from "@/components/owner/ConfirmCancelModal";
import ConfirmBookingModal from "@/components/owner/ConfirmBookingModal";
import AssignTechnicianModal from "@/components/owner/AssignTechnicianModal";

const OwnerBookingManagement = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("CHO_XAC_NHAN");

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, employeesRes] = await Promise.all([bookingService.getShopBookings(), staffService.getEmployees()]);
      setAllBookings(bookingsRes.data || []);
      setEmployees(employeesRes.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedBooking) return;

    try {
      setActionLoading(true);
      await bookingService.confirmBooking(selectedBooking.maLichHen);
      showToast.success("Xác nhận đơn hàng thành công!");
      setShowConfirmModal(false);
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Lỗi xác nhận");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;

    try {
      setActionLoading(true);
      await bookingService.updateBookingStatus(selectedBooking.maLichHen, {
        trangThai: "HUY",
      });
      showToast.success("Đã hủy đơn hàng");
      setShowCancelModal(false);
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Lỗi hủy đơn");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignTechnician = async (techId) => {
    if (!selectedBooking) return;

    try {
      setActionLoading(true);
      await bookingService.assignTechnician(selectedBooking.maLichHen, {
        maNhanVien: parseInt(techId),
      });
      showToast.success("Gán kỹ thuật viên thành công!");
      setShowAssignModal(false);
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Lỗi gán kỹ thuật viên");
    } finally {
      setActionLoading(false);
    }
  };

  // Modal handlers
  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const openConfirmModal = (booking) => {
    setSelectedBooking(booking);
    setShowConfirmModal(true);
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
  };

  const closeAllModals = () => {
    setShowDetailModal(false);
    setShowConfirmModal(false);
    setShowCancelModal(false);
    setShowAssignModal(false);
    setSelectedBooking(null);
  };

  // Filter bookings
  const filteredBookings = allBookings.filter((booking) => booking.trangThai === filter);

  // Count bookings by status
  const getCountByStatus = (status) => {
    return allBookings.filter((b) => b.trangThai === status).length;
  };

  const filterButtons = [
    { value: "CHO_XAC_NHAN", label: "Chờ xác nhận" },
    { value: "DA_XAC_NHAN", label: "Đã xác nhận" },
    { value: "DANG_THUC_HIEN", label: "Đang thực hiện" },
    { value: "HOAN_THANH", label: "Hoàn thành" },
    { value: "HUY", label: "Đã hủy" },
  ];

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
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-5">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Đặt Hẹn</h1>
        <p className="text-gray-600 mt-1">Xử lý các đơn đặt lịch từ khách hàng</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((tab) => {
            const count = getCountByStatus(tab.value);
            const isActive = filter === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  isActive ? "bg-[#8e2800] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? "bg-white/20" : "bg-gray-200"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.maLichHen}
              booking={booking}
              onViewDetail={openDetailModal}
              onConfirm={openConfirmModal}
              onCancel={openCancelModal}
              onAssign={openAssignModal}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FaClock className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Không có đơn hàng nào</p>
        </div>
      )}

      {/* Modals */}
      {showDetailModal && <BookingDetailModal booking={selectedBooking} onClose={closeAllModals} />}

      {showConfirmModal && (
        <ConfirmBookingModal booking={selectedBooking} onConfirm={handleConfirm} onClose={closeAllModals} loading={actionLoading} />
      )}

      {showCancelModal && (
        <ConfirmCancelModal booking={selectedBooking} onConfirm={handleCancel} onClose={closeAllModals} loading={actionLoading} />
      )}

      {showAssignModal && (
        <AssignTechnicianModal
          booking={selectedBooking}
          employees={employees}
          onConfirm={handleAssignTechnician}
          onClose={closeAllModals}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default OwnerBookingManagement;
