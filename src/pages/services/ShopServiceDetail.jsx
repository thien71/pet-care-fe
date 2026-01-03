// src/pages/services/ShopServiceDetail.jsx - UPDATED
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../api/apiClient";

const ShopServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [service, setService] = useState(null);

  useEffect(() => {
    loadServiceDetail();
  }, [serviceId]);

  const loadServiceDetail = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(
        `/booking/public/shop-service/${serviceId}`
      );
      setService(res.data);
      setError("");
    } catch (err) {
      setError(err.message || "Không thể tải thông tin dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: `/service/${serviceId}` },
      });
      return;
    }

    // ⭐ Navigate với đầy đủ thông tin pre-fill
    navigate("/customer/booking", {
      state: {
        preselectedShop: service.shop.maCuaHang,
        preselectedServiceId: parseInt(serviceId),
        preselectedServiceName: service.tenDichVu, // Để detect pet type
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span
          className="loading loading-spinner loading-lg"
          style={{ color: "#8e2800" }}
        ></span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="card w-96 bg-white shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="card-title text-red-600">Không tìm thấy dịch vụ</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="btn mt-4 text-white"
              style={{ backgroundColor: "#8e2800" }}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors duration-200"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Service Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Left: Service Image */}
          <div className="lg:col-span-2">
            <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-lg h-96 flex items-center justify-center sticky top-20">
              {service.shop.anhCuaHang ? (
                <img
                  src={`http://localhost:5000${service.shop.anhCuaHang}`}
                  alt={service.tenDichVu}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `/placeholder.svg?height=400&width=400&query=${service.tenDichVu}`;
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-4">
                    {service.tenDichVu?.includes("Tắm")
                      ? "🛁"
                      : service.tenDichVu?.includes("Khám")
                      ? "💉"
                      : service.tenDichVu?.includes("Cắt")
                      ? "✂️"
                      : service.tenDichVu?.includes("Trông")
                      ? "🏠"
                      : "✨"}
                  </div>
                  <p className="text-gray-500 font-semibold">
                    {service.tenDichVu}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Service Details & Booking */}
          <div className="lg:col-span-3 space-y-6">
            {/* Service Name & Rating */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {service.tenDichVu}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {service.rating || "N/A"}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({service.reviewCount || 0} đánh giá)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Price */}
              <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm">
                <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">
                  Giá dịch vụ
                </p>
                <p className="text-3xl font-bold" style={{ color: "#8e2800" }}>
                  {Number.parseInt(service.gia).toLocaleString("vi-VN")}đ
                </p>
              </div>

              {/* Duration */}
              {service.thoiLuong && (
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm">
                  <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">
                    Thời lượng
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {service.thoiLuong}
                    </span>
                    <span className="text-gray-600 font-semibold">phút</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookNow}
                className="w-full text-white py-5 rounded-xl font-bold text-base transition hover:opacity-90 shadow-lg h-full"
                style={{ backgroundColor: "#8e2800" }}
              >
                📅 {isAuthenticated ? "Đặt Lịch Ngay" : "Đăng nhập để đặt"}
              </button>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {service.moTa || "Chưa có mô tả chi tiết"}
              </p>
            </div>
          </div>
        </div>

        {/* Shop Info Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🏪 Thông Tin Cửa Hàng
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tên cửa hàng</p>
                <p className="text-lg font-bold text-gray-900 line-clamp-2">
                  {service.shop.tenCuaHang}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">📍 Địa chỉ</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {service.shop.diaChi}
                </p>
              </div>
              <div className="flex items-end">
                <Link
                  to={`/shop/${service.shop.maCuaHang}`}
                  className="w-full text-center py-2 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: "#8e2800" }}
                >
                  Xem trang cửa hàng →
                </Link>
              </div>
            </div>
            {service.shop.moTa && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Giới thiệu:</span>{" "}
                  {service.shop.moTa}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ⭐ Đánh Giá & Nhận Xét
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
              <p
                className="text-5xl font-bold mb-2"
                style={{ color: "#8e2800" }}
              >
                {service.rating || "N/A"}
              </p>
              <div className="text-2xl text-yellow-500 mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i}>
                      {i < Math.round(service.rating || 0) ? "⭐" : "☆"}
                    </span>
                  ))}
              </div>
              <p className="text-gray-600">
                {service.reviewCount || 0} đánh giá
              </p>
            </div>
            <div className="md:col-span-2 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="font-bold text-gray-900 mb-4">Phân bố đánh giá</p>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3 mb-2">
                  <span className="w-12 text-sm font-semibold text-gray-600">
                    {star} ⭐
                  </span>
                  <progress
                    className="progress progress-warning flex-1"
                    value={star * 20}
                    max="100"
                  />
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {Math.floor(Math.random() * 30)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {service.reviews && service.reviews.length > 0 ? (
              service.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="avatar placeholder">
                      <div
                        className="rounded-full w-12 text-white"
                        style={{ backgroundColor: "#8e2800" }}
                      >
                        <span className="text-lg">
                          {review.userName?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-900">
                            {review.userName}
                          </p>
                          <div className="flex gap-1 text-yellow-500">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <span key={i}>
                                  {i < review.rating ? "⭐" : "☆"}
                                </span>
                              ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-8">
                Chưa có đánh giá nào
              </p>
            )}
          </div>
        </div>

        {/* Related Services */}
        {service.otherServices && service.otherServices.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ✨ Các Dịch Vụ Khác Của Cửa Hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.otherServices.map((s) => (
                <Link
                  key={s.maDichVuShop}
                  to={`/service/${s.maDichVuShop}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {s.anhCuaHang ? (
                      <img
                        src={`http://localhost:5000${s.anhCuaHang}`}
                        alt={s.tenDichVu}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-4xl">✨</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                      {s.tenDichVu}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span
                        className="font-bold text-lg"
                        style={{ color: "#8e2800" }}
                      >
                        {Number.parseInt(s.gia).toLocaleString("vi-VN")}đ
                      </span>
                      {s.thoiLuong && (
                        <span className="text-xs text-gray-500">
                          ⏱️ {s.thoiLuong}p
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-12" />
    </div>
  );
};

export default ShopServiceDetail;
