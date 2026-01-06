// src/pages/owner/OwnerSchedule.jsx
import { useState, useEffect } from "react";
import { staffService } from "@/api";
import {
  FaCalendarAlt,
  FaCalendarWeek,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaCalendarDay,
  FaUsers,
  FaClock,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { showToast } from "@/utils/toast";
import BulkScheduleModal from "@/components/owner/BulkScheduleModal";
import AssignShiftModal from "@/components/owner/AssignShiftModal";

const OwnerSchedule = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedWeek, setSelectedWeek] = useState(getWeekDates(new Date()));
  const [viewMode, setViewMode] = useState("week");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  function getWeekDates(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date.toISOString().split("T")[0]);
    }
    return week;
  }

  useEffect(() => {
    loadData();
  }, [selectedDate, selectedWeek]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [shiftsRes, employeesRes] = await Promise.all([staffService.getShifts(), staffService.getEmployees()]);
      setShifts(shiftsRes.data || []);
      setEmployees(employeesRes.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignShift = async (formData) => {
    try {
      await staffService.assignShift(formData);
      showToast.success("Phân công ca làm thành công!");
      setShowAssignModal(false);
      await loadData();
    } catch (err) {
      showToast.error(err.message || "Lỗi phân công ca làm");
    }
  };

  const handleRemoveShift = async (shiftId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa ca làm này?")) {
      try {
        await staffService.removeShift(shiftId);
        showToast.success("Xóa ca làm thành công!");
        await loadData();
      } catch (err) {
        showToast.error(err.message || "Lỗi xóa ca làm");
      }
    }
  };

  const getShiftsForDate = (date) => {
    return shifts.filter((s) => s.ngayLam === date);
  };

  const getShiftsByEmployee = (date, employeeId) => {
    return shifts.filter((s) => s.ngayLam === date && s.maNhanVien === employeeId);
  };

  const timeSlots = [
    { maCa: 1, tenCa: "Ca Sáng", time: "08:00-12:00", color: "bg-sky-100 border-sky-200" },
    { maCa: 2, tenCa: "Ca Chiều", time: "13:00-17:00", color: "bg-amber-100 border-amber-200" },
    { maCa: 3, tenCa: "Ca Tối", time: "18:00-22:00", color: "bg-purple-100 border-purple-200" },
  ];

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const goToPreviousWeek = () => {
    const firstDay = new Date(selectedWeek[0]);
    firstDay.setDate(firstDay.getDate() - 7);
    setSelectedWeek(getWeekDates(firstDay));
  };

  const goToNextWeek = () => {
    const firstDay = new Date(selectedWeek[0]);
    firstDay.setDate(firstDay.getDate() + 7);
    setSelectedWeek(getWeekDates(firstDay));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today.toISOString().split("T")[0]);
    setSelectedWeek(getWeekDates(today));
  };

  if (loading && shifts.length === 0 && employees.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lịch Làm Việc</h1>
          <p className="text-gray-600 mt-1">Quản lý lịch làm việc của nhân viên</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
          >
            <FaCalendarWeek />
            Phân Công Hàng Tuần
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
          >
            <FaPlus />
            Phân Công Ca
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* View Mode Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("day")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "day" ? "bg-[#8e2800] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaCalendarDay />
              Ngày
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "week" ? "bg-[#8e2800] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaCalendarWeek />
              Tuần
            </button>
          </div>

          {/* Navigation */}
          {viewMode === "day" ? (
            <div className="flex gap-2 items-center">
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d.toISOString().split("T")[0]);
                }}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaChevronLeft />
              </button>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d.toISOString().split("T")[0]);
                }}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaChevronRight />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
              >
                Hôm nay
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <button onClick={goToPreviousWeek} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaChevronLeft />
              </button>
              <span className="px-4 py-2 font-medium text-gray-800">
                {new Date(selectedWeek[0]).toLocaleDateString("vi-VN")} - {new Date(selectedWeek[6]).toLocaleDateString("vi-VN")}
              </span>
              <button onClick={goToNextWeek} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaChevronRight />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
              >
                Tuần này
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Schedule View */}
      {viewMode === "day" ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaCalendarAlt className="text-[#8e2800]" />
              {new Date(selectedDate).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {timeSlots.map((slot) => {
              const shiftsInSlot = getShiftsForDate(selectedDate).filter((s) => s.maCa === slot.maCa);

              return (
                <div key={slot.maCa} className={`border rounded-lg ${slot.color} overflow-hidden`}>
                  <div className="p-4 border-b border-gray-300/50">
                    <h3 className="font-bold text-lg text-gray-800">
                      {slot.tenCa} <span className="text-sm font-normal">({slot.time})</span>
                    </h3>
                  </div>

                  {shiftsInSlot.length > 0 ? (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {shiftsInSlot.map((shift) => (
                        <div
                          key={shift.maGanCa}
                          className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#8e2800] flex items-center justify-center text-white font-bold text-sm">
                              {shift.NhanVien?.hoTen?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-800">{shift.NhanVien?.hoTen}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveShift(shift.maGanCa)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">Chưa có nhân viên</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50">
                    Nhân Viên
                  </th>
                  {selectedWeek.map((date, idx) => (
                    <th key={date} className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div>{weekDays[idx]}</div>
                      <div className="text-xs font-normal mt-1 text-gray-600">
                        {new Date(date).getDate()}/{new Date(date).getMonth() + 1}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp.maNguoiDung} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#8e2800] flex items-center justify-center text-white font-bold">
                            {emp.hoTen?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{emp.hoTen}</div>
                            <div className="text-xs text-gray-500">{emp.VaiTro?.tenVaiTro}</div>
                          </div>
                        </div>
                      </td>
                      {selectedWeek.map((date) => {
                        const dayShifts = getShiftsByEmployee(date, emp.maNguoiDung);
                        return (
                          <td key={date} className="px-6 py-4 text-center">
                            {dayShifts.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {dayShifts.map((shift) => {
                                  const slot = timeSlots.find((s) => s.maCa === shift.maCa);
                                  return (
                                    <button
                                      key={shift.maGanCa}
                                      onClick={() => handleRemoveShift(shift.maGanCa)}
                                      className={`text-xs px-2 py-1 rounded border ${slot?.color} hover:opacity-80 transition-opacity`}
                                      title={`Click để xóa: ${slot?.tenCa}`}
                                    >
                                      {slot?.tenCa}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      Chưa có nhân viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaUsers className="text-2xl text-[#8e2800]" />
            <p className="text-sm text-gray-600">Tổng nhân viên</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{employees.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaClock className="text-2xl text-[#8e2800]" />
            <p className="text-sm text-gray-600">Ca làm {viewMode === "day" ? "hôm nay" : "tuần này"}</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {viewMode === "day" ? getShiftsForDate(selectedDate).length : shifts.filter((s) => selectedWeek.includes(s.ngayLam)).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaCalendarAlt className="text-2xl text-[#8e2800]" />
            <p className="text-sm text-gray-600">Tổng ca làm</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{shifts.length}</p>
        </div>
      </div>

      {/* Modals */}
      <BulkScheduleModal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} onSuccess={loadData} />
      <AssignShiftModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onSubmit={handleAssignShift}
        employees={employees}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default OwnerSchedule;
