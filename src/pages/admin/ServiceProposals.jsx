// src/pages/admin/ServiceProposals.jsx
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const ServiceProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("CHO_DUYET");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadProposals();
  }, [filter]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const params = { trangThai: filter };
      const res = await apiClient.get("/admin/service-proposals", { params });
      setProposals(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);
    setRejectReason("");
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      await apiClient.put(
        `/admin/service-proposals/${selectedProposal.maDeXuat}/approve`
      );
      setSuccess("Duyệt đề xuất thành công và đã tạo dịch vụ hệ thống!");
      setShowModal(false);
      await loadProposals();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi khi duyệt đề xuất");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      setLoading(true);
      await apiClient.put(
        `/admin/service-proposals/${selectedProposal.maDeXuat}/reject`,
        { lyDoTuChoi: rejectReason }
      );
      setSuccess("Từ chối đề xuất thành công!");
      setShowModal(false);
      setRejectReason("");
      await loadProposals();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Lỗi khi từ chối đề xuất");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      CHO_DUYET: "badge-warning",
      DA_DUYET: "badge-success",
      TU_CHOI: "badge-error",
    };
    const labels = {
      CHO_DUYET: "Chờ duyệt",
      DA_DUYET: "Đã duyệt",
      TU_CHOI: "Từ chối",
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  if (loading && proposals.length === 0) {
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
        <h1 className="text-3xl font-bold">💡 Duyệt Đề Xuất Dịch Vụ</h1>
        <p className="text-gray-600 mt-2">
          Xem xét và phê duyệt các đề xuất dịch vụ mới từ cửa hàng
        </p>
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

      {/* Filter Tabs */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="tabs tabs-boxed">
            {[
              { value: "CHO_DUYET", label: "Chờ Duyệt" },
              { value: "DA_DUYET", label: "Đã Duyệt" },
              { value: "TU_CHOI", label: "Từ Chối" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`tab ${filter === tab.value ? "tab-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Chờ duyệt</div>
          <div className="stat-value text-warning">
            {proposals.filter((p) => p.trangThai === "CHO_DUYET").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Đã duyệt</div>
          <div className="stat-value text-success">
            {proposals.filter((p) => p.trangThai === "DA_DUYET").length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Từ chối</div>
          <div className="stat-value text-error">
            {proposals.filter((p) => p.trangThai === "TU_CHOI").length}
          </div>
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <div
              key={proposal.maDeXuat}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{proposal.tenDichVu}</h2>
                  {getStatusBadge(proposal.trangThai)}
                </div>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {proposal.moTa || "Không có mô tả"}
                </p>

                <div className="divider my-2"></div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cửa hàng:</span>
                    <span className="font-semibold">
                      {proposal.CuaHang?.tenCuaHang || "N/A"}
                    </span>
                  </div>

                  {proposal.gia && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá đề xuất:</span>
                      <span className="font-semibold text-primary">
                        {parseInt(proposal.gia).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày gửi:</span>
                    <span>
                      {new Date(proposal.ngayGui).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {proposal.trangThai !== "CHO_DUYET" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Người duyệt:</span>
                        <span>{proposal.QuanTriVien?.hoTen || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày duyệt:</span>
                        <span>
                          {proposal.ngayDuyet
                            ? new Date(proposal.ngayDuyet).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </>
                  )}

                  {proposal.trangThai === "TU_CHOI" && proposal.lyDoTuChoi && (
                    <div className="alert alert-error mt-2">
                      <div>
                        <span className="font-semibold">Lý do:</span>
                        <p className="text-sm">{proposal.lyDoTuChoi}</p>
                      </div>
                    </div>
                  )}
                </div>

                {proposal.trangThai === "CHO_DUYET" && (
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => openModal(proposal)}
                      className="btn btn-primary btn-sm"
                    >
                      Xem xét
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-gray-500 text-lg">Không có đề xuất nào</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedProposal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              💡 Xem Xét Đề Xuất Dịch Vụ
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tên Dịch Vụ</p>
                <p className="text-xl font-bold">
                  {selectedProposal.tenDichVu}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Mô Tả</p>
                <p className="text-base">
                  {selectedProposal.moTa || "Không có mô tả"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Cửa Hàng</p>
                  <p className="font-semibold">
                    {selectedProposal.CuaHang?.tenCuaHang || "N/A"}
                  </p>
                </div>
                {selectedProposal.gia && (
                  <div>
                    <p className="text-sm text-gray-600">Giá Đề Xuất</p>
                    <p className="font-semibold text-primary">
                      {parseInt(selectedProposal.gia).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600">Ngày Gửi</p>
                <p className="font-semibold">
                  {new Date(selectedProposal.ngayGui).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>

              <div className="divider">Quyết Định</div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Lý Do Từ Chối (nếu từ chối)
                  </span>
                </label>
                <textarea
                  placeholder="Nhập lý do từ chối nếu muốn từ chối đề xuất này..."
                  className="textarea textarea-bordered h-24"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                ></textarea>
              </div>

              <div className="alert alert-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Nếu duyệt, dịch vụ sẽ được tạo trong Hệ Thống và có thể sử
                  dụng cho tất cả cửa hàng
                </span>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectReason("");
                }}
                className="btn btn-ghost"
              >
                Đóng
              </button>
              <button
                onClick={handleReject}
                className="btn btn-error"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Từ Chối"}
              </button>
              <button
                onClick={handleApprove}
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Duyệt"}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setShowModal(false);
              setRejectReason("");
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ServiceProposals;
