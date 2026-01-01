// src/pages/services/ShopServiceDetail.jsx - TRANG MỚI
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

    // Chuyển sang trang đặt lịch với thông tin đã chọn
    navigate("/customer/booking", {
      state: {
        preselectedShop: service.shop.maCuaHang,
        preselectedService: serviceId,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="card-title text-error">Không tìm thấy dịch vụ</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary mt-4"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost text-white mb-4"
          >
            ← Quay lại
          </button>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Service Icon */}
            <div className="text-7xl">
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

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {service.tenDichVu}
              </h1>
              <div className="flex flex-wrap gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300">⭐</span>
                  <span>{service.rating}</span>
                  <span className="opacity-80">
                    ({service.reviewCount} đánh giá)
                  </span>
                </div>
                {service.thoiLuong && (
                  <div className="opacity-90">⏱️ {service.thoiLuong} phút</div>
                )}
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-yellow-300">
                  {parseInt(service.gia).toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mô tả dịch vụ */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">📋 Mô Tả Dịch Vụ</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {service.moTa || "Chưa có mô tả chi tiết"}
                </p>

                {service.thoiLuong && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">
                      ⏱️ Thời lượng dự kiến:
                    </h3>
                    <p className="text-gray-600">
                      Khoảng {service.thoiLuong} phút
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin cửa hàng */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">🏪 Thông Tin Cửa Hàng</h2>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">
                      {service.shop.tenCuaHang}
                    </h3>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-xl">📍</span>
                    <div>
                      <p className="font-semibold">Địa chỉ:</p>
                      <p className="text-gray-600">{service.shop.diaChi}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-xl">📞</span>
                    <div>
                      <p className="font-semibold">Số điện thoại:</p>
                      <p className="text-gray-600">
                        {service.shop.soDienThoai}
                      </p>
                    </div>
                  </div>

                  {service.shop.moTa && (
                    <div className="flex items-start gap-2">
                      <span className="text-xl">📝</span>
                      <div>
                        <p className="font-semibold">Giới thiệu:</p>
                        <p className="text-gray-600">{service.shop.moTa}</p>
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/shop/${service.shop.maCuaHang}`}
                    className="btn btn-outline btn-sm w-full mt-4"
                  >
                    Xem trang cửa hàng →
                  </Link>
                </div>
              </div>
            </div>

            {/* Các dịch vụ khác của shop */}
            {service.otherServices && service.otherServices.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl">
                    ✨ Dịch Vụ Khác Của Cửa Hàng
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {service.otherServices.map((s) => (
                      <Link
                        key={s.maDichVuShop}
                        to={`/service/${s.maDichVuShop}`}
                        className="card bg-base-200 hover:shadow-lg transition-all"
                      >
                        <div className="card-body p-4">
                          <h3 className="font-bold">{s.tenDichVu}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-primary font-bold">
                              {parseInt(s.gia).toLocaleString("vi-VN")}đ
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
              </div>
            )}

            {/* Đánh giá */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">⭐ Đánh Giá & Nhận Xét</h2>

                {/* Tổng quan đánh giá */}
                <div className="flex items-center gap-6 mb-6 p-4 bg-base-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary">
                      {service.rating}
                    </div>
                    <div className="text-yellow-500 text-2xl">⭐⭐⭐⭐⭐</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {service.reviewCount} đánh giá
                    </div>
                  </div>

                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <span className="text-xs w-8">{star} ⭐</span>
                        <progress
                          className="progress progress-warning w-full"
                          value={star * 20}
                          max="100"
                        ></progress>
                        <span className="text-xs text-gray-500 w-12">
                          {Math.floor(Math.random() * 30)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danh sách reviews */}
                <div className="space-y-4">
                  {service.reviews &&
                    service.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-white rounded-full w-12">
                              <span>{review.userName.charAt(0)}</span>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold">{review.userName}</p>
                                <div className="flex gap-1 text-yellow-500">
                                  {"⭐".repeat(review.rating)}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-2">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <button className="btn btn-outline btn-sm w-full mt-4">
                  Xem thêm đánh giá
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-4">
              <div className="card-body">
                <h3 className="card-title text-2xl">📅 Đặt Lịch Ngay</h3>

                <div className="space-y-4">
                  {/* Price */}
                  <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                    <span className="text-gray-600">Giá dịch vụ:</span>
                    <span className="text-2xl font-bold text-primary">
                      {parseInt(service.gia).toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  {/* Duration */}
                  {service.thoiLuong && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Thời lượng:</span>
                      <span className="font-semibold">
                        ⏱️ {service.thoiLuong} phút
                      </span>
                    </div>
                  )}

                  <div className="divider"></div>

                  {/* Booking Button */}
                  <button
                    onClick={handleBookNow}
                    className="btn btn-primary btn-lg w-full gap-2"
                  >
                    <span>📅</span>
                    {isAuthenticated
                      ? "Đặt Lịch Ngay"
                      : "Đăng nhập để đặt lịch"}
                  </button>

                  {/* Contact Shop */}
                  <a
                    href={`tel:${service.shop.soDienThoai}`}
                    className="btn btn-outline w-full gap-2"
                  >
                    <span>📞</span>
                    Gọi ngay: {service.shop.soDienThoai}
                  </a>
                </div>

                <div className="divider"></div>

                {/* Benefits */}
                <div>
                  <h4 className="font-bold mb-3">✅ Lợi ích khi đặt lịch:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Đặt lịch online tiện lợi</li>
                    <li>✓ Xác nhận nhanh chóng</li>
                    <li>✓ Theo dõi trạng thái đơn hàng</li>
                    <li>✓ Tích điểm và ưu đãi</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="card bg-base-100 shadow-xl mt-6">
              <div className="card-body">
                <h4 className="font-bold">💡 Cần Hỗ Trợ?</h4>
                <p className="text-sm text-gray-600">
                  Liên hệ với chúng tôi nếu bạn cần tư vấn
                </p>
                <button className="btn btn-sm btn-outline">
                  📧 Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopServiceDetail;
