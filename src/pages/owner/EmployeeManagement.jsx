// src/pages/owner/EmployeeManagement.jsx
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("employees");
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    email: "",
    hoTen: "",
    soDienThoai: "",
    maVaiTro: 2, // LE_TAN by default
    kinhNghiem: "",
    chungChi: "",
  });
  const [scheduleForm, setScheduleForm] = useState({
    maNhanVien: "",
    maCa: "",
    ngayLam: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [empRes, shiftRes] = await Promise.all([
        apiClient.get("/owner/employees"),
        // apiClient.get("/owner/shifts"),
      ]);
      setEmployees(empRes.data || []);
      setShifts(shiftRes.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!employeeForm.email || !employeeForm.hoTen) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/owner/employees", employeeForm);
      setSuccess("Thêm nhân viên thành công!");
      setShowAddEmployeeModal(false);
      setEmployeeForm({
        email: "",
        hoTen: "",
        soDienThoai: "",
        maVaiTro: 2,
        kinhNghiem: "",
        chungChi: "",
      });
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
        await apiClient.delete(`/owner/employees/${employeeId}`);
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
    if (
      !scheduleForm.maNhanVien ||
      !scheduleForm.maCa ||
      !scheduleForm.ngayLam
    ) {
      setError("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/owner/assign-shift", scheduleForm);
      setSuccess("Phân công ca làm thành công!");
      setShowScheduleModal(false);
      setScheduleForm({ maNhanVien: "", maCa: "", ngayLam: "" });
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
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">👥 Quản Lý Nhân Viên & Ca Làm</h1>
        <p className="text-gray-600 mt-2">Quản lý đội ngũ và lịch làm việc</p>
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

      {/* Tabs */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="tabs tabs-boxed mb-6">
            <button
              onClick={() => setActiveTab("employees")}
              className={`tab ${activeTab === "employees" ? "tab-active" : ""}`}
            >
              👥 Danh sách nhân viên
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`tab ${activeTab === "schedule" ? "tab-active" : ""}`}
            >
              📅 Phân công ca làm
            </button>
          </div>

          {/* Employees Tab */}
          {activeTab === "employees" && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowAddEmployeeModal(true);
                  setEmployeeForm({
                    email: "",
                    hoTen: "",
                    soDienThoai: "",
                    maVaiTro: 2,
                    kinhNghiem: "",
                    chungChi: "",
                  });
                }}
                className="btn btn-primary gap-2"
              >
                <span>➕</span>
                Thêm nhân viên
              </button>

              {employees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr className="bg-base-200">
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Vai trò</th>
                        <th>Kinh nghiệm</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.maNguoiDung} className="hover">
                          <td className="font-semibold">{emp.hoTen}</td>
                          <td>{emp.email}</td>
                          <td>{emp.soDienThoai || "N/A"}</td>
                          <td>
                            <span className="badge badge-primary">
                              {emp.VaiTro?.tenVaiTro || "N/A"}
                            </span>
                          </td>
                          <td>{emp.HoSoNhanVien?.kinhNghiem || "N/A"} năm</td>
                          <td>
                            <button
                              onClick={() =>
                                handleDeleteEmployee(emp.maNguoiDung)
                              }
                              className="btn btn-sm btn-error"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Chưa có nhân viên nào
                </p>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowScheduleModal(true);
                  setScheduleForm({ maNhanVien: "", maCa: "", ngayLam: "" });
                }}
                className="btn btn-primary gap-2"
              >
                <span>➕</span>
                Phân công ca làm
              </button>

              {shifts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shifts.map((shift) => (
                    <div key={shift.maGanCa} className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="font-bold">{shift.NhanVien?.hoTen}</h3>
                        <p className="text-sm">
                          📅{" "}
                          {new Date(shift.ngayLam).toLocaleDateString("vi-VN")}
                        </p>
                        <p className="text-sm">
                          🕐 {shift.CaLamViec?.gioBatDau} -{" "}
                          {shift.CaLamViec?.gioKetThuc}
                        </p>
                        <div className="badge badge-success mt-2">
                          {shift.CaLamViec?.tenCa}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Chưa có ca làm nào được phân công
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-md">
            <h3 className="font-bold text-lg mb-4">➕ Thêm Nhân Viên</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email *</span>
                </label>
                <input
                  type="email"
                  placeholder="employee@example.com"
                  className="input input-bordered"
                  value={employeeForm.email}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Họ Tên *</span>
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="input input-bordered"
                  value={employeeForm.hoTen}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      hoTen: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Số Điện Thoại
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="0912345678"
                  className="input input-bordered"
                  value={employeeForm.soDienThoai}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      soDienThoai: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Vai Trò</span>
                </label>
                <select
                  className="select select-bordered"
                  value={employeeForm.maVaiTro}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      maVaiTro: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="2">Lễ Tân</option>
                  <option value="3">Kỹ Thuật Viên</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Kinh Nghiệm (năm)
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="input input-bordered"
                  value={employeeForm.kinhNghiem}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      kinhNghiem: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Chứng Chỉ</span>
                </label>
                <textarea
                  placeholder="Liệt kê các chứng chỉ..."
                  className="textarea textarea-bordered"
                  value={employeeForm.chungChi}
                  onChange={(e) =>
                    setEmployeeForm({
                      ...employeeForm,
                      chungChi: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="btn btn-ghost"
              >
                Hủy
              </button>
              <button
                onClick={handleAddEmployee}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Thêm"}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowAddEmployeeModal(false)}
          ></div>
        </div>
      )}

      {/* Assign Shift Modal */}
      {showScheduleModal && (
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
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Ca Làm *</span>
                </label>
                <select
                  className="select select-bordered"
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
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Ngày Làm *</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={scheduleForm.ngayLam}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      ngayLam: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowScheduleModal(false)}
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
            onClick={() => setShowScheduleModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
