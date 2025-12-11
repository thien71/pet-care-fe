// src/pages/staff/TechnicianDashboard.jsx - CÔNG VIỆC CỦA KỸ THUẬT VIÊN
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const TechnicianDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/booking/my-assignments");
      setAssignments(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async (assignmentId) => {
    if (window.confirm("Bắt đầu làm việc với đơn hàng này?")) {
      try {
        setLoading(true);
        await apiClient.put(`/booking/${assignmentId}/my-assignment`, {
          trangThai: "DANG_THUC_HIEN",
        });
        setSuccess("Đã bắt đầu làm việc!");
        await loadAssignments();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi cập nhật");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCompleteWork = async (assignmentId) => {
    if (window.confirm("Xác nhận hoàn thành công việc?")) {
      try {
        setLoading(true);
        await apiClient.put(`/booking/${assignmentId}/my-assignment`, {
          trangThai: "HOAN_THANH",
        });
        setSuccess("Đã hoàn thành công việc!");
        await loadAssignments();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.message || "Lỗi cập nhật");
      } finally {
        setLoading(false);
      }
    }
  };

  const openDetailModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      DA_XAC_NHAN: { class: "badge-info", label: "Chờ làm", icon: "⏳" },
      DANG_THUC_HIEN: { class: "badge-primary", label: "Đang làm", icon: "🔧" },
      HOAN_THANH: { class: "badge-success", label: "Hoàn thành", icon: "✅" },
    };
    const badge = badges[status] || { class: "", label: status, icon: "❓" };
    return (
      <span className={`badge ${badge.class} gap-2`}>
        <span>{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  const getPriorityColor = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    const diffHours = (appointmentDate - today) / (1000 * 60 * 60);

    if (diffHours < 2) return "border-error";
    if (diffHours < 6) return "border-warning";
    return "border-info";
  };

  const todoCount = assignments.filter(
    (a) => a.trangThai === "DA_XAC_NHAN"
  ).length;
  const inProgressCount = assignments.filter(
    (a) => a.trangThai === "DANG_THUC_HIEN"
  ).length;

  if (loading && assignments.length === 0) {
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
        <h1 className="text-3xl font-bold">🔧 Công Việc Của Tôi</h1>
        <p className="text-gray-600 mt-2">Quản lý các đơn hàng được giao</p>
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
          <span>{error}</span>
          <button onClick={() => setError("")} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Chờ Làm</div>
          <div className="stat-value text-info">{todoCount}</div>
          <div className="stat-desc">Đơn hàng cần bắt đầu</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Đang Làm</div>
          <div className="stat-value text-primary">{inProgressCount}</div>
          <div className="stat-desc">Công việc hiện tại</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Tổng Công Việc</div>
          <div className="stat-value text-secondary">{assignments.length}</div>
          <div className="stat-desc">Trong hôm nay</div>
        </div>
      </div>

      {/* Assignments Grid */}
      {assignments.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">📋 Danh Sách Công Việc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.maLichHen}
                className={`card bg-base-100 shadow-xl border-l-4 ${getPriorityColor(
                  assignment.ngayHen
                )}`}
              >
                <div className="card-body">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="card-title text-lg">
                      #{assignment.maLichHen}
                    </h3>
                    {getStatusBadge(assignment.trangThai)}
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span>👤</span>
                      <div>
                        <p className="font-semibold">
                          {assignment.KhachHang?.hoTen}
                        </p>
                        <p className="text-xs text-gray-500">
                          {assignment.KhachHang?.soDienThoai}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>
                        {new Date(assignment.ngayHen).toLocaleString("vi-VN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>🏪</span>
                      <span>{assignment.CuaHang?.tenCuaHang}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>🐾</span>
                      <span>
                        {assignment.LichHenThuCungs?.length || 0} thú cưng
                      </span>
                    </div>

                    {/* Services Summary */}
                    <div className="mt-2 p-2 bg-base-200 rounded">
                      <p className="text-xs font-semibold mb-1">Dịch vụ:</p>
                      {assignment.LichHenThuCungs?.slice(0, 1).map(
                        (pet, idx) => (
                          <div key={idx} className="text-xs">
                            {pet.LichHenChiTiets?.map((detail, i) => (
                              <div key={i}>
                                •{" "}
                                {detail.DichVuCuaShop?.DichVuHeThong?.tenDichVu}
                              </div>
                            ))}
                          </div>
                        )
                      )}
                      {assignment.LichHenThuCungs?.length > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          ...và {assignment.LichHenThuCungs.length - 1} thú cưng
                          khác
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions flex-col mt-4 gap-2">
                    <button
                      onClick={() => openDetailModal(assignment)}
                      className="btn btn-sm btn-ghost w-full"
                    >
                      👁️ Chi Tiết
                    </button>

                    {assignment.trangThai === "DA_XAC_NHAN" && (
                      <button
                        onClick={() => handleStartWork(assignment.maLichHen)}
                        className="btn btn-sm btn-primary w-full"
                      >
                        🚀 Bắt Đầu Làm
                      </button>
                    )}

                    {assignment.trangThai === "DANG_THUC_HIEN" && (
                      <button
                        onClick={() => handleCompleteWork(assignment.maLichHen)}
                        className="btn btn-sm btn-success w-full"
                      >
                        ✅ Hoàn Thành
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-2xl font-bold text-gray-600">
            Không có công việc nào!
          </p>
          <p className="text-gray-500 mt-2">
            Bạn đã hoàn thành tất cả công việc hôm nay
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAssignment && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">
              📋 Chi Tiết Công Việc #{selectedAssignment.maLichHen}
            </h3>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex justify-between items-center">
                <span>Trạng thái:</span>
                {getStatusBadge(selectedAssignment.trangThai)}
              </div>

              {/* Customer Info */}
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-bold">👤 Khách Hàng</h4>
                  <p>{selectedAssignment.KhachHang?.hoTen}</p>
                  <p className="text-sm">
                    {selectedAssignment.KhachHang?.soDienThoai}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-bold">📅 Thời Gian</h4>
                  <p>
                    {new Date(selectedAssignment.ngayHen).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              {/* Pets & Services */}
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-bold">🐾 Thú Cưng & Dịch Vụ Cần Làm</h4>
                  {selectedAssignment.LichHenThuCungs?.map((pet, idx) => (
                    <div key={idx} className="mt-2 p-2 bg-base-100 rounded">
                      <p className="font-semibold">
                        {pet.ten} - {pet.LoaiThuCung?.tenLoai}
                      </p>
                      {pet.dacDiem && (
                        <p className="text-xs text-gray-600">
                          Đặc điểm: {pet.dacDiem}
                        </p>
                      )}
                      <div className="ml-4 mt-1 space-y-1">
                        {pet.LichHenChiTiets?.map((detail, i) => (
                          <div key={i} className="text-sm flex justify-between">
                            <span>
                              • {detail.DichVuCuaShop?.DichVuHeThong?.tenDichVu}
                            </span>
                            <span className="text-xs text-gray-500">
                              ⏱️{" "}
                              {detail.DichVuCuaShop?.DichVuHeThong?.thoiLuong ||
                                "N/A"}{" "}
                              phút
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button onClick={() => setShowDetailModal(false)} className="btn">
                Đóng
              </button>

              {selectedAssignment.trangThai === "DA_XAC_NHAN" && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleStartWork(selectedAssignment.maLichHen);
                  }}
                  className="btn btn-primary"
                >
                  🚀 Bắt Đầu Làm
                </button>
              )}

              {selectedAssignment.trangThai === "DANG_THUC_HIEN" && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleCompleteWork(selectedAssignment.maLichHen);
                  }}
                  className="btn btn-success"
                >
                  ✅ Hoàn Thành
                </button>
              )}
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowDetailModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;
