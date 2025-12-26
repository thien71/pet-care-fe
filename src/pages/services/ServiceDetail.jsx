// src/pages/services/ServiceDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [service, setService] = useState(null);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    loadServiceDetail();
  }, [serviceId]);

  const loadServiceDetail = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/booking/service/${serviceId}`);
      setService(res.service);
      setShops(res.shops || []);
      setError("");
    } catch (err) {
      setError(err.message || "Không thể tải thông tin dịch vụ");
    } finally {
      setLoading(false);
    }
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

  const minPrice =
    shops.length > 0 ? Math.min(...shops.map((s) => parseFloat(s.gia))) : 0;
  const maxPrice =
    shops.length > 0 ? Math.max(...shops.map((s) => parseFloat(s.gia))) : 0;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost text-white mb-4"
          >
            ← Quay lại
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">✨</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                {service.tenDichVu}
              </h1>
              <p className="text-xl mt-2 opacity-90">
                {shops.length} cửa hàng cung cấp
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Info */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title text-2xl">📋 Thông Tin Dịch Vụ</h2>
                <div className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Mô tả:</h3>
                    <p className="text-gray-600">
                      {service.moTa || "Chưa có mô tả"}
                    </p>
                  </div>
                  {service.thoiLuong && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Thời lượng:
                      </h3>
                      <p className="text-gray-600">
                        ⏱️ Khoảng {service.thoiLuong} phút
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Giá cả:</h3>
                    <p className="text-gray-600">
                      💰 Từ {parseInt(minPrice).toLocaleString("vi-VN")}đ
                      {minPrice !== maxPrice &&
                        ` - ${parseInt(maxPrice).toLocaleString("vi-VN")}đ`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shops List */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">
                  🏪 Cửa Hàng Cung Cấp ({shops.length})
                </h2>

                {shops.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Chưa có cửa hàng nào cung cấp dịch vụ này
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {shops.map((shop) => (
                      <div
                        key={shop.maCuaHang}
                        className="card bg-base-200 hover:shadow-lg transition-all"
                      >
                        <div className="card-body p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">
                                {shop.tenCuaHang}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                📍 {shop.diaChi}
                              </p>
                              <p className="text-sm text-gray-600">
                                📞 {shop.soDienThoai}
                              </p>
                              <p className="text-lg font-bold text-primary mt-2">
                                {parseInt(shop.gia).toLocaleString("vi-VN")}đ
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Link
                                to={`/shops/${shop.maCuaHang}`}
                                className="btn btn-sm btn-ghost"
                              >
                                Xem shop
                              </Link>
                              <Link
                                to={`/customer/booking?shopId=${shop.maCuaHang}&serviceId=${shop.maDichVuShop}`}
                                className="btn btn-sm btn-primary"
                              >
                                Đặt ngay
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-4">
              <div className="card-body">
                <h3 className="card-title">💡 Lưu Ý</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Đặt lịch trước ít nhất 1 ngày</li>
                  <li>✓ Mang theo sổ tiêm chủng (nếu có)</li>
                  <li>✓ Thông báo trước nếu thú cưng có vấn đề sức khỏe</li>
                  <li>✓ Đến đúng giờ hẹn để phục vụ tốt nhất</li>
                </ul>
                <div className="divider"></div>
                <Link
                  to="/customer/booking"
                  className="btn btn-primary w-full gap-2"
                >
                  <span>📅</span>
                  Đặt Lịch Ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
