// src/pages/technician/TechnicianDashboard.jsx (REDESIGNED)
import { useState, useEffect } from "react";
import { bookingService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaWrench, FaHourglassHalf, FaPlay, FaCheckCircle } from "react-icons/fa";
import TechnicianBookingCard from "@/components/technician/TechnicianBookingCard";
import TechnicianBookingDetailModal from "@/components/technician/TechnicianBookingDetailModal";

const TechnicianDashboard = () => {
  const [allAssignments, setAllAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("DA_XAC_NHAN");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyAssignments();
      setAllAssignments(res.data || []);
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

  // Tabs config
  const filterTabs = [
    { value: "DA_XAC_NHAN", label: "Chờ làm", icon: FaHourglassHalf },
    { value: "DANG_THUC_HIEN", label: "Đang làm", icon: FaPlay },
    { value: "HOAN_THANH", label: "Đã hoàn thành", icon: FaCheckCircle },
  ];

  // Tính số lượng theo status
  const getCountByStatus = (status) => {
    return allAssignments.filter((a) => a.trangThai === status).length;
  };

  // Filter assignments
  const filteredAssignments = allAssignments.filter((a) => a.trangThai === filter);

  if (loading && allAssignments.length === 0) {
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

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
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

      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssignments.map((assignment) => (
            <TechnicianBookingCard
              key={assignment.maLichHen}
              assignment={assignment}
              onViewDetail={openDetailModal}
              onStartWork={handleStartWork}
              onCompleteWork={handleCompleteWork}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FaCheckCircle className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-600">Không có công việc nào</p>
          <p className="text-gray-500 mt-2">
            {filter === "DA_XAC_NHAN" && "Chưa có đơn hàng nào cần làm"}
            {filter === "DANG_THUC_HIEN" && "Không có đơn hàng đang thực hiện"}
            {filter === "HOAN_THANH" && "Chưa hoàn thành đơn hàng nào"}
          </p>
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
