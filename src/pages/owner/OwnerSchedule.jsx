// src/pages/owner/OwnerSchedule.jsx
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import BulkScheduleModal from "../../components/owner/BulkScheduleModal"; // ⭐ THÊM IMPORT

const OwnerSchedule = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedWeek, setSelectedWeek] = useState(getWeekDates(new Date()));
  const [viewMode, setViewMode] = useState("week"); // 'day' | 'week'
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    maNhanVien: "",
    maCa: "",
    ngayLam: "",
  });
  const [showBulkModal, setShowBulkModal] = useState(false); // ⭐ THÊM STATE

  // Get week dates
  function getWeekDates(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
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
      const [shiftsRes, employeesRes] = await Promise.all([
        apiClient.get("/owner/shifts"),
        apiClient.get("/owner/employees"),
      ]);
      setShifts(shiftsRes.data || []);
      setEmployees(employeesRes.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignShift = async () => {
    if (!assignForm.maNhanVien || !assignForm.maCa || !assignForm.ngayLam) {
      setError("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/owner/assign-shift", assignForm);
      setSuccess("Phân công ca làm thành công!");
      setShowAssignModal(false);
      setAssignForm({ maNhanVien: "", maCa: "", ngayLam: "" });
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi phân công ca làm");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShift = async (shiftId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa ca làm này?")) {
      try {
        setLoading(true);
        await apiClient.delete(`/owner/shifts/${shiftId}`);
        setSuccess("Xóa ca làm thành công!");
        await loadData();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi xóa ca làm");
      } finally {
        setLoading(false);
      }
    }
  };

  const getShiftsForDate = (date) => {
    return shifts.filter((s) => s.ngayLam === date);
  };

  const getShiftsByEmployee = (date, employeeId) => {
    return shifts.filter(
      (s) => s.ngayLam === date && s.maNhanVien === employeeId
    );
  };

  const timeSlots = [
    { maCa: 1, tenCa: "Ca Sáng", time: "08:00-12:00", color: "bg-sky-100" },
    { maCa: 2, tenCa: "Ca Chiều", time: "13:00-17:00", color: "bg-amber-100" },
    { maCa: 3, tenCa: "Ca Tối", time: "18:00-22:00", color: "bg-purple-100" },
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
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">📅 Lịch Làm Việc</h1>
          <p className="text-gray-600 mt-2">
            Quản lý lịch làm việc của nhân viên
          </p>
        </div>
        <div className="flex gap-2">
          {/* ⭐ THÊM NÚT NÀY */}
          <button
            onClick={() => setShowBulkModal(true)}
            className="btn btn-secondary gap-2"
          >
            <span>📅</span>
            Phân Công Hàng Tuần
          </button>
          <button
            onClick={() => {
              setShowAssignModal(true);
              setAssignForm({
                maNhanVien: "",
                maCa: "",
                ngayLam: selectedDate,
              });
            }}
            className="btn btn-primary gap-2"
          >
            <span>➕</span>
            Phân Công Ca
          </button>
        </div>
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

      {/* View Controls */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* View Mode Tabs */}
            <div className="tabs tabs-boxed">
              <button
                onClick={() => setViewMode("day")}
                className={`tab ${viewMode === "day" ? "tab-active" : ""}`}
              >
                📅 Ngày
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`tab ${viewMode === "week" ? "tab-active" : ""}`}
              >
                📆 Tuần
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
                  className="btn btn-sm"
                >
                  ◀️
                </button>
                <input
                  type="date"
                  className="input input-bordered input-sm"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() + 1);
                    setSelectedDate(d.toISOString().split("T")[0]);
                  }}
                  className="btn btn-sm"
                >
                  ▶️
                </button>
                <button onClick={goToToday} className="btn btn-sm btn-primary">
                  Hôm nay
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <button onClick={goToPreviousWeek} className="btn btn-sm">
                  ◀️ Tuần trước
                </button>
                <span className="font-semibold">
                  {new Date(selectedWeek[0]).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(selectedWeek[6]).toLocaleDateString("vi-VN")}
                </span>
                <button onClick={goToNextWeek} className="btn btn-sm">
                  Tuần sau ▶️
                </button>
                <button onClick={goToToday} className="btn btn-sm btn-primary">
                  Tuần này
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule View */}
      {viewMode === "day" ? (
        // DAY VIEW
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">
              📅{" "}
              {new Date(selectedDate).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>

            <div className="space-y-6">
              {timeSlots.map((slot) => {
                const shiftsInSlot = getShiftsForDate(selectedDate).filter(
                  (s) => s.maCa === slot.maCa
                );

                return (
                  <div key={slot.maCa} className={`card ${slot.color}`}>
                    <div className="card-body p-4">
                      <h3 className="font-bold text-lg">
                        {slot.tenCa} ({slot.time})
                      </h3>

                      {shiftsInSlot.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                          {shiftsInSlot.map((shift) => (
                            <div
                              key={shift.maGanCa}
                              className="flex items-center justify-between bg-white p-2 rounded shadow"
                            >
                              <div className="flex items-center gap-2">
                                <div className="avatar placeholder">
                                  <div className="bg-primary text-primary-content rounded-full w-8">
                                    <span className="text-xs">
                                      {shift.NhanVien?.hoTen
                                        ?.charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-sm font-semibold">
                                  {shift.NhanVien?.hoTen}
                                </span>
                              </div>
                              <button
                                onClick={() => handleRemoveShift(shift.maGanCa)}
                                className="btn btn-xs btn-error"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mt-2">
                          Chưa có nhân viên
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // WEEK VIEW
        <div className="card bg-base-100 shadow-xl overflow-x-auto">
          <div className="card-body p-0">
            <table className="table table-zebra">
              <thead>
                <tr className="bg-base-200">
                  <th className="w-32">Nhân Viên</th>
                  {selectedWeek.map((date, idx) => (
                    <th key={date} className="text-center">
                      <div>{weekDays[idx]}</div>
                      <div className="text-xs font-normal">
                        {new Date(date).getDate()}/
                        {new Date(date).getMonth() + 1}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp.maNguoiDung}>
                      <td className="font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-8">
                              <span className="text-xs">
                                {emp.hoTen?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div>{emp.hoTen}</div>
                            <div className="text-xs text-gray-500">
                              {emp.VaiTro?.tenVaiTro}
                            </div>
                          </div>
                        </div>
                      </td>
                      {selectedWeek.map((date) => {
                        const dayShifts = getShiftsByEmployee(
                          date,
                          emp.maNguoiDung
                        );
                        return (
                          <td key={date} className="text-center p-1">
                            {dayShifts.length > 0 ? (
                              <div className="space-y-1">
                                {dayShifts.map((shift) => {
                                  const slot = timeSlots.find(
                                    (s) => s.maCa === shift.maCa
                                  );
                                  return (
                                    <div
                                      key={shift.maGanCa}
                                      className={`badge badge-sm ${slot?.color} text-xs cursor-pointer hover:opacity-80`}
                                      onClick={() =>
                                        handleRemoveShift(shift.maGanCa)
                                      }
                                      title={`Click to remove: ${slot?.tenCa}`}
                                    >
                                      {slot?.tenCa}
                                    </div>
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
                    <td colSpan="8" className="text-center py-8">
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
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Tổng nhân viên</div>
          <div className="stat-value text-primary">{employees.length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">
            Ca làm {viewMode === "day" ? "hôm nay" : "tuần này"}
          </div>
          <div className="stat-value text-secondary">
            {viewMode === "day"
              ? getShiftsForDate(selectedDate).length
              : shifts.filter((s) => selectedWeek.includes(s.ngayLam)).length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Tổng ca làm</div>
          <div className="stat-value text-accent">{shifts.length}</div>
        </div>
      </div>

      {/* ⭐ THÊM MODAL MỚI */}
      <BulkScheduleModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSuccess={loadData}
      />
      {/* Assign Shift Modal */}
      {showAssignModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">📅 Phân Công Ca Làm</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Nhân Viên *</span>
                </label>
                <select
                  className="select select-bordered"
                  value={assignForm.maNhanVien}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      maNhanVien: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Chọn nhân viên</option>
                  {employees.map((emp) => (
                    <option key={emp.maNguoiDung} value={emp.maNguoiDung}>
                      {emp.hoTen} - {emp.VaiTro?.tenVaiTro}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Ca Làm *</span>
                </label>
                <select
                  className="select select-bordered"
                  value={assignForm.maCa}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      maCa: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Chọn ca làm</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.maCa} value={slot.maCa}>
                      {slot.tenCa} ({slot.time})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Ngày Làm *</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={assignForm.ngayLam}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      ngayLam: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowAssignModal(false)}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button
                onClick={handleAssignShift}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Phân Công"}
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

export default OwnerSchedule;
