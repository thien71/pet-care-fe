// src/components/admin/ShopDetailModal.jsx
import { useState } from "react";
import { FaTimes, FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { getShopImageUrl } from "@/utils/constants";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/400x300?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const ShopDetailModal = ({ shop, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = (imagePath) => {
    setSelectedImage(getImageUrl(imagePath));
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  const getStatusBadge = (status) => {
    const config = {
      CHO_DUYET: { text: "Chờ duyệt", class: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      HOAT_DONG: { text: "Hoạt động", class: "bg-green-100 text-green-700 border-green-300" },
      BI_KHOA: { text: "Bị khóa", class: "bg-red-100 text-red-700 border-red-300" },
    };
    const { text, class: className } = config[status] || config.CHO_DUYET;
    return <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${className}`}>{text}</span>;
  };

  const documents = [
    { label: "Giấy Phép KD", path: shop?.giayPhepKD },
    { label: "CCCD Mặt Trước", path: shop?.cccdMatTruoc },
    { label: "CCCD Mặt Sau", path: shop?.cccdMatSau },
    { label: "Ảnh Cửa Hàng", path: shop?.anhCuaHang },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
        <div className="bg-white rounded-lg max-w-4xl w-full border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-800">{shop?.tenCuaHang}</h3>
              {getStatusBadge(shop?.trangThai)}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Thông tin cơ bản */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-[#8e2800] mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Địa Chỉ</p>
                    <p className="font-medium text-gray-800">{shop?.diaChi}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaPhone className="text-[#8e2800] mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Số Điện Thoại</p>
                    <p className="font-medium text-gray-800">{shop?.soDienThoai}</p>
                  </div>
                </div>
              </div>

              {shop?.moTa && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mô Tả</p>
                  <p className="text-gray-800">{shop.moTa}</p>
                </div>
              )}

              {(shop?.kinhDo || shop?.viDo) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Kinh Độ</p>
                    <p className="font-medium text-gray-800">{shop.kinhDo || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vĩ Độ</p>
                    <p className="font-medium text-gray-800">{shop.viDo || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Người đại diện */}
            {shop?.NguoiDaiDien && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3">Người Đại Diện</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Họ Tên</p>
                    <p className="font-medium text-gray-800">{shop.NguoiDaiDien.hoTen}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{shop.NguoiDaiDien.email}</p>
                    </div>
                  </div>
                  {shop.NguoiDaiDien.soDienThoai && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Số Điện Thoại</p>
                        <p className="font-medium text-gray-800">{shop.NguoiDaiDien.soDienThoai}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tài liệu */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Tài Liệu</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {documents.map((doc, index) => (
                  <div key={index} className="group cursor-pointer" onClick={() => doc.path && handleImageClick(doc.path)}>
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 hover:border-[#8e2800] transition-all">
                      <img
                        src={getImageUrl(doc.path)}
                        alt={doc.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/200x200?text=No+Image";
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-center">{doc.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ngày tạo */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Ngày tạo: <span className="font-medium text-gray-800">{new Date(shop?.ngayTao).toLocaleDateString("vi-VN")}</span>
              </p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60 p-4" onClick={closeImagePreview}>
          <button
            onClick={closeImagePreview}
            className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <FaTimes className="text-white text-2xl" />
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ShopDetailModal;
