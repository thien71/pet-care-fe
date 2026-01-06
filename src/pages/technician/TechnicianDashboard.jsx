// src/pages/technician/TechnicianDashboard.jsx
import { useState, useEffect } from "react";
import { bookingService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaClipboardList, FaHourglassHalf, FaWrench, FaCheckCircle, FaEye } from "react-icons/fa";
import TechnicianBookingCard from "@/components/technician/TechnicianBookingCard";
import TechnicianBookingDetailModal from "@/components/technician/TechnicianBookingDetailModal";

const TechnicianDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyAssignments();
      setAssignments(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async (assignmentId) => {
    try {
      const loadingToast = showToast.loading("Đang bắt đầu làm việc...");
      await bookingService.updateMyAssignment(assignmentId, { trangThai: "DANG_THUC_HIEN" });
      showToast.dismiss(loadingToast);
      showToast.success("Đã bắt đầu làm việc!");
      await loadAssignments();
    } catch (err) {
      showToast.error(err.message || "Lỗi cập nhật");
    }
  };

  const handleCompleteWork = async (assignmentId) => {
    try {
      const loadingToast = showToast.loading("Đang hoàn thành công việc...");
      await bookingService.updateMyAssignment(assignmentId, { trangThai: "HOAN_THANH" });
      showToast.dismiss(loadingToast);
      showToast.success("Đã hoàn thành công việc!");
      await loadAssignments();
    } catch (err) {
      showToast.error(err.message || "Lỗi cập nhật");
    }
  };

  const openDetailModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailModal(true);
  };

  const todoCount = assignments.filter((a) => a.trangThai === "DA_XAC_NHAN").length;
  const inProgressCount = assignments.filter((a) => a.trangThai === "DANG_THUC_HIEN").length;

  if (loading && assignments.length === 0) {
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
          <FaWrench className="text-2xl text-[#8e2800]" />
          <h1 className="text-2xl font-bold text-gray-800">Công Việc Của Tôi</h1>
        </div>
        <p className="text-gray-600">Quản lý các đơn hàng được giao</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <FaHourglassHalf className="text-2xl text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Chờ Làm</p>
          <p className="text-3xl font-bold text-gray-800">{todoCount}</p>
          <p className="text-xs text-gray-500 mt-1">Đơn hàng cần bắt đầu</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FaWrench className="text-2xl text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Đang Làm</p>
          <p className="text-3xl font-bold text-gray-800">{inProgressCount}</p>
          <p className="text-xs text-gray-500 mt-1">Công việc hiện tại</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <FaClipboardList className="text-2xl text-gray-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tổng Công Việc</p>
          <p className="text-3xl font-bold text-gray-800">{assignments.length}</p>
          <p className="text-xs text-gray-500 mt-1">Trong hôm nay</p>
        </div>
      </div>

      {/* Assignments List */}
      {assignments.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Danh Sách Công Việc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <TechnicianBookingCard
                key={assignment.maLichHen}
                assignment={assignment}
                onViewDetail={openDetailModal}
                onStartWork={handleStartWork}
                onCompleteWork={handleCompleteWork}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
          <p className="text-2xl font-bold text-gray-600">Không có công việc nào!</p>
          <p className="text-gray-500 mt-2">Bạn đã hoàn thành tất cả công việc hôm nay</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAssignment && (
        <TechnicianBookingDetailModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAssignment(null);
          }}
          onStartWork={handleStartWork}
          onCompleteWork={handleCompleteWork}
        />
      )}
    </div>
  );
};

export default TechnicianDashboard;
