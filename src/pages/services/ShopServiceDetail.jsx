// src/pages/services/ShopServiceDetail.jsx - REDESIGNED
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { serviceService } from "@/api";
import ServiceCard from "@/components/service/ServiceCard";
import { FaStore, FaMapMarkerAlt, FaStar, FaClock, FaCalendarAlt } from "react-icons/fa";

const ShopServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [service, setService] = useState(null);
  const [starFilter, setStarFilter] = useState(0);

  useEffect(() => {
    loadServiceDetail();
  }, [serviceId]);

  const loadServiceDetail = async () => {
    try {
      setLoading(true);
      const res = await serviceService.getShopServiceDetail(serviceId);
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

    navigate("/customer/booking", {
      state: {
        preselectedShop: service.shop.maCuaHang,
        preselectedServiceId: parseInt(serviceId),
        preselectedServiceName: service.tenDichVu,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg" style={{ color: "#8e2800" }}></span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Không tìm thấy dịch vụ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#8e2800] text-white rounded-lg font-semibold hover:bg-[#6d1f00] transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const avgRating = parseFloat(service.rating || 0);
  const reviewCount = service.reviewCount || 0;
  const bookingCount = service.bookingCount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <span className="hover:text-[#8e2800] cursor-pointer" onClick={() => navigate("/")}>
            Trang chủ
          </span>
          <span className="mx-2">/</span>
          <span className="hover:text-[#8e2800] cursor-pointer" onClick={() => navigate("/search")}>
            Dịch vụ
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{service.tenDichVu}</span>
        </div>

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column - Shop Info (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
              {/* Shop Image */}
              <Link to={`/shop/${service.shop.maCuaHang}`} className="block">
                <div className="h-64 bg-gray-100 overflow-hidden">
                  {service.shop.anhCuaHang ? (
                    <img
                      src={`http://localhost:5000${service.shop.anhCuaHang}`}
                      alt={service.shop.tenCuaHang}
                      className="w-full h-full object-cover hover:scale-105 transition"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaStore className="text-6xl text-gray-300" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Shop Details */}
              <div className="p-4 space-y-2">
                {/* Shop name */}
                <Link to={`/shop/${service.shop.maCuaHang}`} className="group inline-flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#8e2800] line-clamp-2">{service.shop.tenCuaHang}</h3>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#8e2800]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <FaMapMarkerAlt className="mt-0.5 text-[#8e2800] shrink-0" />
                  <span className="line-clamp-2">{service.shop.diaChi}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Service Info (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              {/* Service Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.tenDichVu}</h1>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    {avgRating.toFixed(1) > 0 && <span className="font-bold text-gray-900">{avgRating.toFixed(1)}</span>}

                    {reviewCount > 0 ? (
                      <span className="text-gray-600">({reviewCount} đánh giá)</span>
                    ) : (
                      <span className="text-gray-600">Chưa có đánh giá</span>
                    )}
                  </div>
                  <div className="text-gray-600">
                    Đã đặt <span className="font-semibold text-gray-900">{bookingCount}</span> lần
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{service.moTa || "Chưa có mô tả chi tiết"}</p>
              </div>

              {/* Price, Duration, Book Button Row */}
              <div className="flex flex-wrap items-end gap-4">
                {/* Price */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-gray-600 mb-1">Giá dịch vụ</p>
                  <p className="text-3xl font-bold text-[#8e2800]">{Number.parseInt(service.gia).toLocaleString("vi-VN")}đ</p>
                </div>

                {/* Duration */}
                {service.thoiLuong && (
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-sm text-gray-600 mb-1">Thời lượng</p>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-[#8e2800]" />
                      <span className="text-2xl font-bold text-gray-900">{service.thoiLuong}</span>
                      <span className="text-gray-600 font-semibold">phút</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleBookNow}
                  className="flex-1 min-w-[200px] bg-[#8e2800] hover:bg-[#6d1f00] text-white py-4 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaCalendarAlt />
                  {isAuthenticated ? "Đặt Lịch Ngay" : "Đăng nhập để đặt"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              Đánh giá dịch vụ
            </h2>

            {/* Star Filter */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Lọc:</span>
                <div className="flex gap-1">
                  {[0, 5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => setStarFilter(star)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        starFilter === star ? "bg-[#8e2800] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {star === 0 ? "Tất cả" : `${star}⭐`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-200">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#8e2800] mb-2">{avgRating.toFixed(1)}</div>
              <div className="flex gap-1 mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar key={i} className={i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"} />
                  ))}
              </div>
              <p className="text-sm text-gray-600">{reviewCount} đánh giá</p>
            </div>

            {reviewCount === 0 && (
              <div className="flex-1">
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">Chưa có đánh giá nào</p>
                  <p className="text-gray-500 text-sm mt-2">Hãy là người đầu tiên đánh giá dịch vụ này</p>
                </div>
              </div>
            )}
          </div>

          {/* Reviews List */}
          {reviewCount > 0 && (
            <div className="space-y-4">
              {service.reviews && service.reviews.length > 0 ? (
                service.reviews
                  .filter((review) => starFilter === 0 || review.rating === starFilter)
                  .map((review, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#8e2800] text-white flex items-center justify-center font-bold text-lg shrink-0">
                          {review.userName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-bold text-gray-900">{review.userName}</p>
                              <div className="flex gap-1">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <FaStar key={i} className={i < review.rating ? "text-yellow-400 text-sm" : "text-gray-300 text-sm"} />
                                  ))}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString("vi-VN")}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-center text-gray-600 py-8">Không có đánh giá nào phù hợp với bộ lọc</p>
              )}
            </div>
          )}
        </div>

        {/* Related Services */}
        {service.otherServices && service.otherServices.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dịch vụ khác của cửa hàng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.otherServices.map((s) => (
                <ServiceCard
                  key={s.maDichVuShop}
                  service={{
                    ...s,
                    tenCuaHang: service.shop.tenCuaHang,
                    diaChi: service.shop.diaChi,
                    anhCuaHang: service.shop.anhCuaHang,
                  }}
                  onClick={() => navigate(`/service/${s.maDichVuShop}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopServiceDetail;
