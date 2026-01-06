// src/components/owner/BulkScheduleModal.jsx
import { useState, useEffect } from "react";
import { staffService } from "@/api";
import { FaTimes, FaSpinner, FaInfoCircle } from "react-icons/fa";
import { showToast } from "@/utils/toast";

const BulkScheduleModal = ({ isOpen, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [repeatWeeks, setRepeatWeeks] = useState(1);

  const shifts = [
    { id: 1, name: "Ca sáng", time: "08:00-12:00" },
    { id: 2, name: "Ca chiều", time: "13:00-17:00" },
    { id: 3, name: "Ca tối", time: "18:00-22:00" },
  ];

  const dayNumbers = [1, 2, 3, 4, 5, 6, 0];

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await staffService.getEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      showToast.error(err.message);
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
      showToast.error("Vui lòng chọn nhân viên và ít nhất 1 ca làm");
      return;
    }

    try {
      setSubmitting(true);
      const startDateObj = new Date(startDate);

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

      await staffService.bulkAssignShifts({ assignments: assignmentsToCreate });

      showToast.success(`Phân công thành công ${assignmentsToCreate.length} ca!`);
      onSuccess();
      handleClose();
    } catch (err) {
      showToast.error(err.message || "Lỗi phân công");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedEmployee("");
    setSelectedShifts([]);
    setStartDate(new Date().toISOString().split("T")[0]);
    setRepeatWeeks(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full border border-gray-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Phân Công Lịch Hàng Tuần</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={submitting}>
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Nhân viên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhân Viên <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              disabled={loading || submitting}
            >
              <option value="">-- Chọn nhân viên --</option>
              {employees.map((emp) => (
                <option key={emp.maNguoiDung} value={emp.maNguoiDung}>
                  {emp.hoTen}
                </option>
              ))}
            </select>
          </div>

          {/* Ca làm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Chọn Ca Làm (Mỗi tuần) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {shifts.map((shift) => (
                <label
                  key={shift.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedShifts.includes(shift.id) ? "border-[#8e2800] bg-[#fff7ed]" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedShifts.includes(shift.id)}
                      onChange={() => handleShiftToggle(shift.id)}
                      className="mt-1"
                      disabled={submitting}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{shift.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{shift.time}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Ngày bắt đầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày Bắt Đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">Nên chọn thứ Hai để bắt đầu tuần</p>
          </div>

          {/* Số tuần */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số Tuần Lặp Lại <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
                value={repeatWeeks}
                onChange={(e) => setRepeatWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="52"
                disabled={submitting}
              />
              <span className="text-sm text-gray-600">(1-52 tuần. Ví dụ: 4 = phân công 4 tuần liên tiếp)</span>
            </div>
          </div>

          {/* Preview */}
          {selectedEmployee && selectedShifts.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <FaInfoCircle className="text-blue-600 text-lg mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-800">
                  Sẽ phân công <span className="font-bold">{selectedShifts.length}</span> ca/ngày × <span className="font-bold">7</span>{" "}
                  ngày × <span className="font-bold">{repeatWeeks}</span> tuần ={" "}
                  <span className="font-bold text-[#8e2800]">{selectedShifts.length * 7 * repeatWeeks}</span> ca cho nhân viên
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3 justify-end border-t border-gray-200 pt-4">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !selectedEmployee || selectedShifts.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors disabled:opacity-50 font-medium"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Phân Công</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkScheduleModal;
