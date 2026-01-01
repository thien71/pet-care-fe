import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [shopServices, setShopServices] = useState([]);
  const [topShops, setTopShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesRes, shopsRes] = await Promise.all([
        apiClient.get("/booking/public/shop-services?limit=20"),
        apiClient.get("/booking/public/top-shops?limit=6"),
      ]);

      setShopServices(servicesRes.data || []);
      setTopShops(shopsRes.data || []);
    } catch (err) {
      console.error("❌ Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      const res = await apiClient.get(
        `/booking/public/shop-services?search=${searchTerm}`
      );
      setShopServices(res.data?.data || []);
    } catch (err) {
      console.error("❌ Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const moveCarousel = (direction) => {
    const maxIndex = Math.ceil(shopServices.length / itemsPerPage) - 1;
    if (direction === "next") {
      setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    } else {
      setCarouselIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const visibleServices = shopServices.slice(
    carouselIndex * itemsPerPage,
    carouselIndex * itemsPerPage + itemsPerPage
  );

  const features = [
    { icon: "⚡", title: "Đặt lịch nhanh", desc: "Online dễ dàng" },
    { icon: "🏆", title: "Chất lượng cao", desc: "Đội ngũ chuyên" },
    { icon: "💰", title: "Giá hợp lý", desc: "Ưu đãi thường xuyên" },
    { icon: "📍", title: "Khắp nơi", desc: "Nhiều chi nhánh" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white border-b-4 border-[#8e2800] py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl md:text-7xl mb-6">🐾</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Chăm Sóc Thú Cưng
              <br />
              <span style={{ color: "#8e2800" }}>Chuyên Nghiệp</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Tìm kiếm và đặt lịch dịch vụ chăm sóc thú cưng tại Đà Nẵng
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm dịch vụ, cửa hàng..."
                  className="w-full px-6 py-4 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "#8e2800" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
              <button
                onClick={handleSearch}
                style={{ backgroundColor: "#8e2800" }}
                className="px-8 py-4 hover:opacity-90 text-white rounded-lg font-semibold transition"
              >
                Tìm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services with Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Dịch Vụ Nổi Bật
              </h2>
              <p className="text-gray-600">
                Được cung cấp bởi các cửa hàng uy tín
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="text-xl text-gray-600">Đang tải...</span>
            </div>
          ) : shopServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Không có dịch vụ nào</p>
            </div>
          ) : (
            <>
              {/* Carousel */}
              <div className="relative px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {visibleServices.map((service) => (
                    <div
                      key={service.maDichVuShop}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                      onClick={() =>
                        navigate(`/service/${service.maDichVuShop}`)
                      }
                    >
                      {/* Image */}
                      <div className="h-48 overflow-hidden bg-gray-200">
                        {service.anhCuaHang ? (
                          <img
                            src={`http://localhost:5000${service.anhCuaHang}`}
                            alt={service.tenDichVu}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=" +
                                service.tenDichVu;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600">
                            Không có ảnh
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
                          {service.tenDichVu}
                        </h3>

                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                          <p className="flex items-center gap-1">
                            <span>🏪</span>
                            <span className="line-clamp-1">
                              {service.tenCuaHang}
                            </span>
                          </p>
                          <p className="flex items-center gap-1">
                            <span>📍</span>
                            <span className="text-xs line-clamp-1">
                              {service.diaChi}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold text-gray-900">
                            {service.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({service.reviewCount})
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span
                            className="text-xl font-bold"
                            style={{ color: "#8e2800" }}
                          >
                            {parseInt(service.gia).toLocaleString("vi-VN")}đ
                          </span>
                          <span className="text-xs text-gray-500">
                            ⏱️ {service.thoiLuong}p
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {Math.ceil(shopServices.length / itemsPerPage) > 1 && (
                  <>
                    <button
                      onClick={() => moveCarousel("prev")}
                      style={{ backgroundColor: "#8e2800" }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 text-white rounded-full flex items-center justify-center transition hover:opacity-90 shadow-lg text-xl"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveCarousel("next")}
                      style={{ backgroundColor: "#8e2800" }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 text-white rounded-full flex items-center justify-center transition hover:opacity-90 shadow-lg text-xl"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Pagination Dots */}
              {Math.ceil(shopServices.length / itemsPerPage) > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({
                    length: Math.ceil(shopServices.length / itemsPerPage),
                  }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      style={{
                        backgroundColor:
                          idx === carouselIndex ? "#8e2800" : "#d1d5db",
                      }}
                      className="w-3 h-3 rounded-full transition"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Top Shops */}
      {topShops.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Cửa Hàng Nổi Bật
              </h2>
              <p className="text-gray-600">Được khách hàng tin tưởng</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topShops.map((shop) => (
                <div
                  key={shop.maCuaHang}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100"
                  onClick={() => navigate(`/shop/${shop.maCuaHang}`)}
                >
                  <div className="h-48 overflow-hidden bg-gray-200">
                    {shop.anhCuaHang ? (
                      <img
                        src={`http://localhost:5000${shop.anhCuaHang}`}
                        alt={shop.tenCuaHang}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=" +
                            shop.tenCuaHang;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600">
                        Không có ảnh
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {shop.tenCuaHang}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      📍 {shop.diaChi}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      📞 {shop.soDienThoai}
                    </p>
                    <button
                      style={{ backgroundColor: "#8e2800" }}
                      className="w-full hover:opacity-90 text-white py-2 rounded-lg font-semibold transition"
                    >
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="text-center p-6 bg-white rounded-xl shadow-lg border-t-4"
                style={{ borderTopColor: "#8e2800" }}
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div
            style={{ backgroundColor: "#8e2800" }}
            className="text-white rounded-2xl p-12 text-center"
          >
            <div className="text-6xl mb-6">🏪</div>
            <h2 className="text-4xl font-bold mb-4">Bạn là chủ cửa hàng?</h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Đăng ký ngay để mở rộng khách hàng và tăng doanh thu!
            </p>
            <button className="px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-lg transition hover:opacity-90">
              🚀 Đăng ký cửa hàng
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{ backgroundColor: "#1f2937" }}
        className="text-gray-200 py-12"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="text-4xl mb-2">🐾</div>
          <p className="font-bold text-2xl mb-2">Pet Care Da Nang</p>
          <p className="text-gray-400">© 2024 Pet Care. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
