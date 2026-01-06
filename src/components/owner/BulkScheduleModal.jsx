// src/components/owner/BulkScheduleModal.jsx - PHÂN CÔNG LỊCH HÀNG TUẦN
import { useState, useEffect } from "react";
// import apiClient from "../../api/apiClient";
import { staffService } from "@/api";

const BulkScheduleModal = ({ isOpen, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedShifts, setSelectedShifts] = useState([]); // [1, 2] = Ca sáng + chiều
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [repeatWeeks, setRepeatWeeks] = useState(1); // Số tuần lặp lại

  const shifts = [
    { id: 1, name: "Ca sáng", time: "08:00-12:00" },
    { id: 2, name: "Ca chiều", time: "13:00-17:00" },
    { id: 3, name: "Ca tối", time: "18:00-22:00" },
  ];

  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
  const dayNumbers = [1, 2, 3, 4, 5, 6, 0]; // 0 = Sunday

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await staffService.getEmployees();
      // const res = await apiClient.get("/owner/employees");
      setEmployees(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShiftToggle = (shiftId) => {
    if (selectedShifts.includes(shiftId)) {
      setSelectedShifts(selectedShifts.filter((id) => id !== shiftId));
    } else {
      setSelectedShifts([...selectedShifts, shiftId]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || selectedShifts.length === 0) {
      setError("Vui lòng chọn nhân viên và ít nhất 1 ca làm");
      return;
    }

    try {
      setLoading(true);
      const startDateObj = new Date(startDate);

      // Tạo danh sách các ngày và ca để phân công
      const assignmentsToCreate = [];

      for (let week = 0; week < repeatWeeks; week++) {
        for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
          const dayNum = dayNumbers[dayIdx];
          const assignDate = new Date(startDateObj);
          assignDate.setDate(assignDate.getDate() + week * 7 + (dayNum === 0 ? 6 : dayNum - 1));

          for (const shiftId of selectedShifts) {
            assignmentsToCreate.push({
              maNhanVien: parseInt(selectedEmployee),
              maCa: shiftId,
              ngayLam: assignDate.toISOString().split("T")[0],
            });
          }
        }
      }

      // Gửi API bulk assign
      await staffService.bulkAssignShifts({ assignments: assignmentsToCreate });

      // await apiClient.post("/owner/bulk-assign-shifts", {
      //   assignments: assignmentsToCreate,
      // });

      setSuccess(`✅ Phân công thành công! ${assignmentsToCreate.length} ca đã được thêm.`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Lỗi phân công");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">📅 Phân Công Lịch Hàng Tuần</h3>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* 1. Chọn nhân viên */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nhân Viên *</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Chọn nhân viên --</option>
              {employees.map((emp) => (
                <option key={emp.maNguoiDung} value={emp.maNguoiDung}>
                  {emp.hoTen}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Chọn ca làm (checkbox) */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Chọn Ca Làm (Mỗi tuần) *</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shifts.map((shift) => (
                <label
                  key={shift.id}
                  className={`card cursor-pointer transition-all ${
                    selectedShifts.includes(shift.id) ? "bg-primary text-primary-content ring-2 ring-primary" : "bg-base-200"
                  }`}
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedShifts.includes(shift.id)}
                        onChange={() => handleShiftToggle(shift.id)}
                      />
                      <div>
                        <h4 className="font-bold">{shift.name}</h4>
                        <p className="text-sm opacity-80">{shift.time}</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Chọn ngày bắt đầu */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Ngày Bắt Đầu *</span>
            </label>
            <input type="date" className="input input-bordered" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label className="label">
              <span className="label-text-alt">Nên chọn thứ Hai để bắt đầu tuần</span>
            </label>
          </div>

          {/* 4. Chọn số tuần lặp lại */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Số Tuần Lặp Lại *</span>
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="input input-bordered w-24"
                value={repeatWeeks}
                onChange={(e) => setRepeatWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="52"
              />
              <span className="text-sm text-gray-600">(1-52 tuần. Ví dụ: 4 = phân công 4 tuần liên tiếp)</span>
            </div>
          </div>

          {/* Preview */}
          {selectedEmployee && selectedShifts.length > 0 && (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                📌 Sẽ phân công {selectedShifts.length} ca/ngày × 7 ngày × {repeatWeeks} tuần ={" "}
                <strong>{selectedShifts.length * 7 * repeatWeeks} ca</strong> cho nhân viên
              </span>
            </div>
          )}
        </div>

        <div className="modal-action mt-6">
          <button onClick={onClose} className="btn btn-ghost" disabled={loading}>
            Hủy
          </button>
          <button onClick={handleSubmit} className="btn btn-primary" disabled={loading || !selectedEmployee || selectedShifts.length === 0}>
            {loading ? "Đang xử lý..." : "✅ Phân Công"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default BulkScheduleModal;
