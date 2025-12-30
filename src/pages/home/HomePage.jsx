// src/pages/home/HomePage.jsx - VERSION MỚI
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../api/apiClient";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shopServices, setShopServices] = useState([]);
  const [topShops, setTopShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadData();
  }, [sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesRes, shopsRes] = await Promise.all([
        apiClient.get(
          `/booking/public/shop-services?limit=12&sortBy=${sortBy}`
        ),
        apiClient.get("/booking/public/top-shops?limit=6"),
      ]);

      setShopServices(servicesRes.data || []);
      setTopShops(shopsRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(
        `/booking/public/shop-services?search=${searchTerm}&sortBy=${sortBy}`
      );
      setShopServices(res.data || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: "⚡", title: "Đặt lịch nhanh", desc: "Đặt lịch online dễ dàng" },
    { icon: "🏆", title: "Chất lượng đảm bảo", desc: "Đội ngũ chuyên nghiệp" },
    { icon: "💰", title: "Giá cả hợp lý", desc: "Nhiều gói ưu đãi" },
    { icon: "📍", title: "Nhiều chi nhánh", desc: "Khắp Đà Nẵng" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[500px] bg-linear-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="hero-overlay bg-opacity-30"></div>
        <div className="hero-content text-center text-white">
          <div className="max-w-3xl">
            <div className="text-7xl mb-6">🐾</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Chăm Sóc Thú Cưng{" "}
              <span className="text-yellow-300">Chuyên Nghiệp</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow">
              Tìm kiếm và đặt lịch dịch vụ chăm sóc thú cưng tại Đà Nẵng
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                className="input input-lg flex-1 text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button onClick={handleSearch} className="btn btn-warning btn-lg">
                🔍 Tìm
              </button>
            </div>

            {!isAuthenticated && (
              <div className="flex gap-4 justify-center mt-6">
                <Link to="/register" className="btn btn-warning btn-lg">
                  ✨ Đăng ký ngay
                </Link>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-lg text-white border-white"
                >
                  🔐 Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-base-200 py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">🎯 Dịch Vụ Nổi Bật</h2>
              <p className="text-gray-600">
                Được cung cấp bởi các cửa hàng uy tín
              </p>
            </div>

            {/* Sort */}
            <select
              className="select select-bordered"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : shopServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600">
                Không tìm thấy dịch vụ nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shopServices.map((service) => (
                <div
                  key={service.maDichVuShop}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/service/${service.maDichVuShop}`)}
                >
                  {/* Image */}
                  <figure className="h-48 bg-linear-to-br from-blue-400 to-purple-500">
                    {service.anhCuaHang ? (
                      <img
                        src={`http://localhost:5000${service.anhCuaHang}`}
                        alt={service.tenDichVu}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-white text-6xl">
                        {service.tenDichVu?.includes("Tắm")
                          ? "🛁"
                          : service.tenDichVu?.includes("Khám")
                          ? "💉"
                          : service.tenDichVu?.includes("Cắt")
                          ? "✂️"
                          : "✨"}
                      </div>
                    )}
                  </figure>

                  <div className="card-body p-4">
                    {/* Service Name */}
                    <h3 className="card-title text-lg line-clamp-1">
                      {service.tenDichVu}
                    </h3>

                    {/* Shop Info */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-1">
                        <span>🏪</span>
                        <span className="line-clamp-1">
                          {service.tenCuaHang}
                        </span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span>📍</span>
                        <span className="line-clamp-1">{service.diaChi}</span>
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold">{service.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({service.reviewCount} đánh giá)
                      </span>
                    </div>

                    {/* Price & Duration */}
                    <div className="flex justify-between items-center mt-3">
                      <div className="badge badge-primary badge-lg">
                        {parseInt(service.gia).toLocaleString("vi-VN")}đ
                      </div>
                      {service.thoiLuong && (
                        <div className="text-xs text-gray-500">
                          ⏱️ {service.thoiLuong}p
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      className="btn btn-primary btn-sm mt-3 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/service/${service.maDichVuShop}`);
                      }}
                    >
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/services/all" className="btn btn-primary btn-lg">
              🔍 Xem tất cả dịch vụ
            </Link>
          </div>
        </div>
      </div>

      {/* Top Shops Section */}
      {topShops.length > 0 && (
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-2">🏆 Cửa Hàng Nổi Bật</h2>
              <p className="text-gray-600">Được khách hàng tin tưởng</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topShops.map((shop) => (
                <Link
                  key={shop.maCuaHang}
                  to={`/shop/${shop.maCuaHang}`}
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
                    <p className="text-sm text-gray-600">📍 {shop.diaChi}</p>
                    <p className="text-sm text-gray-600">
                      📞 {shop.soDienThoai}
                    </p>
                    <button className="btn btn-primary btn-sm mt-2">
                      Xem chi tiết →
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="bg-base-200 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA for Shop Owners */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="card bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl">
            <div className="card-body items-center text-center p-12">
              <div className="text-6xl mb-6">🏪</div>
              <h2 className="text-4xl font-bold mb-4">Bạn là chủ cửa hàng?</h2>
              <p className="text-xl mb-8 max-w-2xl">
                Đăng ký ngay để mở rộng khách hàng và tăng doanh thu!
              </p>
              <Link
                to="/customer/register-shop"
                className="btn btn-warning btn-lg"
              >
                🚀 Đăng ký cửa hàng ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content">
        <div>
          <div className="text-4xl mb-2">🐾</div>
          <p className="font-bold text-2xl">Pet Care Da Nang</p>
          <p>© 2024 Pet Care. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
