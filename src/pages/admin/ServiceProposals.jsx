// src/pages/admin/ServiceProposals.jsx
import { useState, useEffect } from "react";
import { serviceService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaEye, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import ConfirmModal from "@/components/common/ConfirmModal";

const ServiceProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("CHO_DUYET");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    proposal: null,
    action: null,
  });
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadProposals();
  }, [filter]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const params = { trangThai: filter };
      const res = await serviceService.getServiceProposals(params);
      setProposals(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetailModal(true);
  };

  const openApproveModal = (proposal) => {
    setConfirmModal({
      isOpen: true,
      proposal,
      action: "approve",
    });
  };

  const openRejectModal = (proposal) => {
    setSelectedProposal(proposal);
    setConfirmModal({
      isOpen: true,
      proposal,
      action: "reject",
    });
    setRejectReason("");
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      proposal: null,
      action: null,
    });
    setRejectReason("");
  };

  const handleApprove = async () => {
    const { proposal } = confirmModal;
    if (!proposal) return;

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang duyệt...");

    try {
      await serviceService.approveServiceProposal(proposal.maDeXuat);
      showToast.dismiss(loadingToast);
      showToast.success("Duyệt đề xuất thành công và đã tạo dịch vụ hệ thống!");
      closeConfirmModal();
      await loadProposals();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi khi duyệt đề xuất");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const { proposal } = confirmModal;
    if (!proposal) return;

    if (!rejectReason.trim()) {
      showToast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setActionLoading(true);
    const loadingToast = showToast.loading("Đang từ chối...");

    try {
      await serviceService.rejectServiceProposal(proposal.maDeXuat, rejectReason);
      showToast.dismiss(loadingToast);
      showToast.success("Từ chối đề xuất thành công!");
      closeConfirmModal();
      await loadProposals();
    } catch (err) {
      showToast.dismiss(loadingToast);
      showToast.error(err.message || "Lỗi khi từ chối đề xuất");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      CHO_DUYET: { text: "Chờ duyệt", class: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      DA_DUYET: { text: "Đã duyệt", class: "bg-green-100 text-green-700 border-green-300" },
      TU_CHOI: { text: "Từ chối", class: "bg-red-100 text-red-700 border-red-300" },
    };
    const { text, class: className } = config[status] || config.CHO_DUYET;
    return <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${className}`}>{text}</span>;
  };

  const filterStats = {
    CHO_DUYET: proposals.filter((p) => p.trangThai === "CHO_DUYET").length,
    DA_DUYET: proposals.filter((p) => p.trangThai === "DA_DUYET").length,
    TU_CHOI: proposals.filter((p) => p.trangThai === "TU_CHOI").length,
  };

  const filterButtons = [
    { value: "CHO_DUYET", label: "Chờ Duyệt", count: filterStats.CHO_DUYET },
    { value: "DA_DUYET", label: "Đã Duyệt", count: filterStats.DA_DUYET },
    { value: "TU_CHOI", label: "Từ Chối", count: filterStats.TU_CHOI },
  ];

  if (loading) {
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
        <h1 className="text-2xl font-bold text-gray-800">Duyệt Đề Xuất Dịch Vụ</h1>
        <p className="text-gray-600 mt-1">Xem xét và phê duyệt các đề xuất dịch vụ mới từ cửa hàng</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === tab.value ? "bg-[#8e2800] text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên Dịch Vụ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cửa Hàng</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Giá Đề Xuất</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ngày Gửi</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng Thái</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proposals.length > 0 ? (
                proposals.map((proposal) => (
                  <tr key={proposal.maDeXuat} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-800">{proposal.tenDichVu}</div>
                        <div className="text-sm text-gray-600 line-clamp-1">{proposal.moTa || "Không có mô tả"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{proposal.CuaHang?.tenCuaHang || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      {proposal.gia && (
                        <span className="font-medium text-[#8e2800]">{parseInt(proposal.gia).toLocaleString("vi-VN")}đ</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{new Date(proposal.ngayGui).toLocaleDateString("vi-VN")}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(proposal.trangThai)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openDetailModal(proposal)}
                          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        {proposal.trangThai === "CHO_DUYET" && (
                          <>
                            <button
                              onClick={() => openApproveModal(proposal)}
                              disabled={actionLoading}
                              className="p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-200 disabled:opacity-50"
                              title="Duyệt"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => openRejectModal(proposal)}
                              disabled={actionLoading}
                              className="p-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
                              title="Từ chối"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">Không có đề xuất nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedProposal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full border border-gray-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Chi Tiết Đề Xuất</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tên Dịch Vụ</p>
                <p className="text-lg font-bold text-gray-800">{selectedProposal.tenDichVu}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Mô Tả</p>
                <p className="text-gray-800">{selectedProposal.moTa || "Không có mô tả"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cửa Hàng</p>
                  <p className="font-medium text-gray-800">{selectedProposal.CuaHang?.tenCuaHang || "N/A"}</p>
                </div>
                {selectedProposal.gia && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Giá Đề Xuất</p>
                    <p className="font-medium text-[#8e2800]">{parseInt(selectedProposal.gia).toLocaleString("vi-VN")}đ</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Ngày Gửi</p>
                <p className="font-medium text-gray-800">{new Date(selectedProposal.ngayGui).toLocaleDateString("vi-VN")}</p>
              </div>
              {selectedProposal.trangThai !== "CHO_DUYET" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Người Duyệt</p>
                      <p className="font-medium text-gray-800">{selectedProposal.QuanTriVien?.hoTen || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ngày Duyệt</p>
                      <p className="font-medium text-gray-800">
                        {selectedProposal.ngayDuyet ? new Date(selectedProposal.ngayDuyet).toLocaleDateString("vi-VN") : "N/A"}
                      </p>
                    </div>
                  </div>
                  {selectedProposal.trangThai === "TU_CHOI" && selectedProposal.lyDoTuChoi && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-1">Lý Do Từ Chối</p>
                      <p className="text-red-700">{selectedProposal.lyDoTuChoi}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.action === "approve"}
        onClose={closeConfirmModal}
        onConfirm={handleApprove}
        title="Xác Nhận Duyệt"
        message={`Bạn có chắc chắn muốn duyệt đề xuất "${confirmModal.proposal?.tenDichVu}"? Dịch vụ sẽ được tạo trong hệ thống và có thể sử dụng cho tất cả cửa hàng.`}
        confirmText="Duyệt"
        cancelText="Hủy"
        type="success"
        loading={actionLoading}
      />

      {/* Reject Modal */}
      {confirmModal.isOpen && confirmModal.action === "reject" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Xác Nhận Từ Chối</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <p className="text-gray-700">Bạn có chắc chắn muốn từ chối đề xuất "{confirmModal.proposal?.tenDichVu}"?</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lý Do Từ Chối *</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Nhập lý do từ chối..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={closeConfirmModal}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 transition-colors"
              >
                {actionLoading ? "Đang xử lý..." : "Từ Chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProposals;
