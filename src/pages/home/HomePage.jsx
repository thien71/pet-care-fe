// src/pages/home/HomePage.jsx - UPDATED với dynamic services
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../api/apiClient";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [topShops, setTopShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesRes, shopsRes] = await Promise.all([
        apiClient.get("/booking/public/services"),
        apiClient.get("/booking/public/top-shops?limit=6"),
      ]);
      console.log("ServiceRes", servicesRes);
      console.log("ShopRes", shopsRes);

      setServices(servicesRes.data || []);
      setTopShops(shopsRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "⚡",
      title: "Đặt lịch nhanh",
      desc: "Đặt lịch online dễ dàng, tiết kiệm thời gian",
    },
    {
      icon: "🏆",
      title: "Chất lượng đảm bảo",
      desc: "Đội ngũ chuyên nghiệp, tận tâm",
    },
    {
      icon: "💰",
      title: "Giá cả hợp lý",
      desc: "Nhiều gói dịch vụ, ưu đãi hấp dẫn",
    },
    {
      icon: "📍",
      title: "Nhiều chi nhánh",
      desc: "Hệ thống cửa hàng trên khắp Đà Nẵng",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[600px] bg-linear-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="hero-overlay bg-opacity-30"></div>
        <div className="hero-content text-center text-white">
          <div className="max-w-3xl">
            <div className="text-7xl mb-6">🐾</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Chăm Sóc Thú Cưng
              <br />
              <span className="text-yellow-300">Chuyên Nghiệp</span> Tại Đà Nẵng
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow">
              Hệ thống đặt lịch dịch vụ chăm sóc thú cưng hiện đại.
              <br />
              Kết nối nhanh chóng với các cửa hàng uy tín.
            </p>

            {isAuthenticated ? (
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/customer/booking"
                  className="btn btn-warning btn-lg gap-2"
                >
                  <span>📅</span>
                  Đặt lịch ngay
                </Link>
                <Link
                  to="/customer/history"
                  className="btn btn-ghost btn-lg text-white border-white hover:bg-white hover:text-primary"
                >
                  <span>📜</span>
                  Lịch sử
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register" className="btn btn-warning btn-lg gap-2">
                  <span>✨</span>
                  Đăng ký ngay
                </Link>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-lg text-white border-white hover:bg-white hover:text-primary"
                >
                  <span>🔐</span>
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Section - DYNAMIC */}
      <div className="bg-base-200 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Dịch Vụ Của Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600">
              Chăm sóc toàn diện cho thú cưng của bạn
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.slice(0, 4).map((service) => (
                  <Link
                    key={service.maDichVu}
                    to={`/services/${service.maDichVu}`}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="card-body items-center text-center">
                      <div className="text-6xl mb-4">
                        {service.tenDichVu.includes("Tắm")
                          ? "🛁"
                          : service.tenDichVu.includes("Khám")
                          ? "💉"
                          : service.tenDichVu.includes("Trông")
                          ? "🏠"
                          : service.tenDichVu.includes("Cắt")
                          ? "✂️"
                          : "✨"}
                      </div>
                      <h3 className="card-title text-2xl">
                        {service.tenDichVu}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {service.moTa}
                      </p>
                      <div className="badge badge-primary badge-lg mt-4">
                        Từ{" "}
                        {parseInt(service.giaThapNhat || 0).toLocaleString(
                          "vi-VN"
                        )}
                        đ
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {service.soLuongShop} cửa hàng cung cấp
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/services" className="btn btn-primary btn-lg gap-2">
                  <span>🔍</span>
                  Xem tất cả {services.length} dịch vụ
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Shops Section - NEW */}
      {topShops.length > 0 && (
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Cửa Hàng Nổi Bật
              </h2>
              <p className="text-xl text-gray-600">
                Được khách hàng tin tưởng và đánh giá cao
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topShops.map((shop) => (
                <Link
                  key={shop.maCuaHang}
                  to={`/shops/${shop.maCuaHang}`}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                >
                  <figure className="h-48 bg-linear-to-br from-blue-400 to-purple-500">
                    {shop.anhCuaHang ? (
                      <img
                        src={`http://localhost:5000${shop.anhCuaHang}`}
                        alt={shop.tenCuaHang}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-white text-6xl">
                        🏪
                      </div>
                    )}
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">{shop.tenCuaHang}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      📍 {shop.diaChi}
                    </p>
                    <p className="text-sm text-gray-600">
                      📞 {shop.soDienThoai}
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-primary btn-sm">
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/shops" className="btn btn-outline btn-lg gap-2">
                <span>🏪</span>
                Xem tất cả cửa hàng
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-base-200 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-xl text-gray-600">
              Những lý do bạn nên tin tưởng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="stat bg-transparent">
              <div className="stat-figure text-4xl">🏪</div>
              <div className="stat-value">{topShops.length || 50}+</div>
              <div className="stat-title text-white/80">Cửa hàng</div>
              <div className="stat-desc text-white/60">Trên toàn Đà Nẵng</div>
            </div>

            <div className="stat bg-transparent">
              <div className="stat-figure text-4xl">✨</div>
              <div className="stat-value">{services.length || 10}+</div>
              <div className="stat-title text-white/80">Dịch vụ</div>
              <div className="stat-desc text-white/60">Đa dạng lựa chọn</div>
            </div>

            <div className="stat bg-transparent">
              <div className="stat-figure text-4xl">👥</div>
              <div className="stat-value">10K+</div>
              <div className="stat-title text-white/80">Khách hàng</div>
              <div className="stat-desc text-white/60">Tin tưởng sử dụng</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA for Shop Owners */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="card bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl">
            <div className="card-body items-center text-center p-12">
              <div className="text-6xl mb-6">🏪</div>
              <h2 className="card-title text-4xl mb-4">
                Bạn là chủ cửa hàng chăm sóc thú cưng?
              </h2>
              <p className="text-xl mb-8 max-w-2xl">
                Đăng ký ngay để mở rộng khách hàng, tăng doanh thu
                <br />
                và phát triển cùng nền tảng của chúng tôi!
              </p>
              <div className="card-actions">
                <Link
                  to="/customer/register-shop"
                  className="btn btn-warning btn-lg gap-2"
                >
                  <span>🚀</span>
                  Đăng ký cửa hàng ngay
                </Link>
              </div>
              <div className="flex gap-8 mt-8 text-sm">
                <div>
                  <div className="font-bold text-lg">0đ</div>
                  <div className="opacity-80">Phí đăng ký</div>
                </div>
                <div>
                  <div className="font-bold text-lg">24/7</div>
                  <div className="opacity-80">Hỗ trợ</div>
                </div>
                <div>
                  <div className="font-bold text-lg">30 ngày</div>
                  <div className="opacity-80">Dùng thử miễn phí</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content">
        <div>
          <div className="text-4xl mb-2">🐾</div>
          <p className="font-bold text-2xl">Pet Care Da Nang</p>
          <p className="max-w-md">
            Chăm sóc thú cưng chuyên nghiệp tại Đà Nẵng
            <br />
            Hệ thống đặt lịch online tiện lợi, nhanh chóng
          </p>
          <p>© 2024 Pet Care. All rights reserved.</p>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <Link to="/about" className="link link-hover">
              Về chúng tôi
            </Link>
            <Link to="/contact" className="link link-hover">
              Liên hệ
            </Link>
            <Link to="/terms" className="link link-hover">
              Điều khoản
            </Link>
            <Link to="/privacy" className="link link-hover">
              Chính sách
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
