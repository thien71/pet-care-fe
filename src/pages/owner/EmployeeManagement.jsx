import { useState, useEffect } from "react";
import { staffService } from "@/api";
import {
  FaUserPlus,
  FaTrash,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserTag,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaClock,
} from "react-icons/fa";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("employees");
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    email: "",
    hoTen: "",
    soDienThoai: "",
    maVaiTro: 4,
  });
  const [scheduleForm, setScheduleForm] = useState({
    maNhanVien: "",
    maCa: "",
    ngayLam: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [empRes, shiftRes] = await Promise.all([staffService.getEmployees(), staffService.getShifts()]);
      setEmployees(empRes.data || []);
      setShifts(shiftRes.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const validateEmployeeForm = () => {
    const errors = {};

    if (!employeeForm.email.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeForm.email)) {
      errors.email = "Email không đúng định dạng";
    }

    if (!employeeForm.hoTen.trim()) {
      errors.hoTen = "Họ tên không được để trống";
    } else if (employeeForm.hoTen.trim().length < 2) {
      errors.hoTen = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (employeeForm.soDienThoai && !/^[0-9]{10}$/.test(employeeForm.soDienThoai)) {
      errors.soDienThoai = "Số điện thoại phải có 10 chữ số";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateScheduleForm = () => {
    const errors = {};

    if (!scheduleForm.maNhanVien) {
      errors.maNhanVien = "Vui lòng chọn nhân viên";
    }

    if (!scheduleForm.maCa) {
      errors.maCa = "Vui lòng chọn ca làm";
    }

    if (!scheduleForm.ngayLam) {
      errors.ngayLam = "Vui lòng chọn ngày làm";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEmployee = async () => {
    if (!validateEmployeeForm()) return;

    try {
      setLoading(true);
      await staffService.addEmployee(employeeForm);
      // await apiClient.post("/owner/employees", employeeForm);
      setSuccess("Thêm nhân viên thành công!");
      setShowAddEmployeeModal(false);
      setEmployeeForm({
        email: "",
        hoTen: "",
        soDienThoai: "",
        maVaiTro: 4,
      });
      setFormErrors({});
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi thêm nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa nhân viên này?")) {
      try {
        setLoading(true);
        await staffService.deleteEmployee(employeeId);
        setSuccess("Xóa nhân viên thành công!");
        await loadData();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi xóa nhân viên");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAssignShift = async () => {
    if (!validateScheduleForm()) return;

    try {
      setLoading(true);
      await staffService.assignShift(scheduleForm);
      // await apiClient.post("/owner/assign-shift", scheduleForm);
      setSuccess("Phân công ca làm thành công!");
      setShowScheduleModal(false);
      setScheduleForm({ maNhanVien: "", maCa: "", ngayLam: "" });
      setFormErrors({});
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi phân công ca làm");
    } finally {
      setLoading(false);
    }
  };

  if (loading && employees.length === 0 && shifts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Nhân Viên</h1>
        <p className="text-gray-600 mt-1">Quản lý đội ngũ và lịch làm việc</p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <FaCheckCircle className="text-green-600 text-xl" />
          <span className="text-green-800">{success}</span>
          <button onClick={() => setSuccess("")} className="ml-auto text-green-600 hover:text-green-800">
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <FaTimesCircle className="text-red-600 text-xl" />
          <span className="text-red-800">{error}</span>
          <button onClick={() => setError("")} className="ml-auto text-red-600 hover:text-red-800">
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("employees")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "employees" ? "bg-[#8e2800] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaUser />
            Danh sách nhân viên
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "schedule" ? "bg-[#8e2800] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaCalendarAlt />
            Phân công ca làm
          </button>
        </div>
      </div>

      {/* Employees Tab */}
      {activeTab === "employees" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowAddEmployeeModal(true);
                setEmployeeForm({
                  email: "",
                  hoTen: "",
                  soDienThoai: "",
                  maVaiTro: 4,
                });
                setFormErrors({});
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
            >
              <FaUserPlus />
              Thêm nhân viên
            </button>
          </div>

          {employees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {employees.map((emp) => (
                <div key={emp.maNguoiDung} className="bg-white border border-gray-200 rounded-lg hover:border-[#8e2800] transition-colors">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{emp.hoTen}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 border border-blue-300">
                          {emp.VaiTro?.tenVaiTro || "N/A"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteEmployee(emp.maNguoiDung)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaEnvelope className="text-[#8e2800]" />
                        <span>{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaPhone className="text-[#8e2800]" />
                        <span>{emp.soDienThoai || "Chưa cập nhật"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Chưa có nhân viên nào</p>
            </div>
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowScheduleModal(true);
                setScheduleForm({ maNhanVien: "", maCa: "", ngayLam: "" });
                setFormErrors({});
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium"
            >
              <FaCalendarAlt />
              Phân công ca làm
            </button>
          </div>

          {shifts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shifts.map((shift) => (
                <div key={shift.maGanCa} className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-gray-800">{shift.NhanVien?.hoTen}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaCalendarAlt className="text-[#8e2800]" />
                        <span>{new Date(shift.ngayLam).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaClock className="text-[#8e2800]" />
                        <span>
                          {shift.CaLamViec?.gioBatDau} - {shift.CaLamViec?.gioKetThuc}
                        </span>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700 border border-green-300">
                        {shift.CaLamViec?.tenCa}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <FaClock className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Chưa có ca làm nào được phân công</p>
            </div>
          )}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Thêm Nhân Viên</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="employee@example.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                />
                {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ Tên <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.hoTen ? "border-red-500" : "border-gray-300"
                  }`}
                  value={employeeForm.hoTen}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, hoTen: e.target.value })}
                />
                {formErrors.hoTen && <p className="text-red-600 text-sm mt-1">{formErrors.hoTen}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số Điện Thoại</label>
                <input
                  type="tel"
                  placeholder="0912345678"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.soDienThoai ? "border-red-500" : "border-gray-300"
                  }`}
                  value={employeeForm.soDienThoai}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      soDienThoai: e.target.value,
                    })
                  }
                />
                {formErrors.soDienThoai && <p className="text-red-600 text-sm mt-1">{formErrors.soDienThoai}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vai Trò</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
                  value={employeeForm.maVaiTro}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      maVaiTro: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="4">Lễ Tân</option>
                  <option value="5">Kỹ Thuật Viên</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddEmployeeModal(false);
                  setFormErrors({});
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleAddEmployee}
                disabled={loading}
                className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Shift Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Phân Công Ca Làm</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nhân Viên <span className="text-red-600">*</span>
                </label>
                <select
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.maNhanVien ? "border-red-500" : "border-gray-300"
                  }`}
                  value={scheduleForm.maNhanVien}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      maNhanVien: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Chọn nhân viên</option>
                  {employees.map((emp) => (
                    <option key={emp.maNguoiDung} value={emp.maNguoiDung}>
                      {emp.hoTen}
                    </option>
                  ))}
                </select>
                {formErrors.maNhanVien && <p className="text-red-600 text-sm mt-1">{formErrors.maNhanVien}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ca Làm <span className="text-red-600">*</span>
                </label>
                <select
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.maCa ? "border-red-500" : "border-gray-300"
                  }`}
                  value={scheduleForm.maCa}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      maCa: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Chọn ca làm</option>
                  <option value="1">Sáng (8:00 - 12:00)</option>
                  <option value="2">Chiều (12:00 - 17:00)</option>
                  <option value="3">Tối (17:00 - 21:00)</option>
                </select>
                {formErrors.maCa && <p className="text-red-600 text-sm mt-1">{formErrors.maCa}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày Làm <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent ${
                    formErrors.ngayLam ? "border-red-500" : "border-gray-300"
                  }`}
                  value={scheduleForm.ngayLam}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      ngayLam: e.target.value,
                    })
                  }
                />
                {formErrors.ngayLam && <p className="text-red-600 text-sm mt-1">{formErrors.ngayLam}</p>}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setFormErrors({});
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleAssignShift}
                disabled={loading}
                className="px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Phân Công"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
