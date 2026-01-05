import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serviceService, shopService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaRocket,
  FaSearch,
  FaStar,
  FaStore,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaPaw,
  FaBolt,
  FaTrophy,
  FaDollarSign,
} from "react-icons/fa";
import Logo from "@/components/common/Logo";
import Footer from "@/components/common/Footer";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const HomePage = () => {
  const navigate = useNavigate();
  const { hasShop } = useAuth();
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
        serviceService.getAllShopServices({ limit: 20 }),
        shopService.getTopShops({ limit: 6 }),
      ]);

      setShopServices(servicesRes.data || []);
      setTopShops(shopsRes.data || []);
    } catch (err) {
      console.error("❌ Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    // Navigate to search page with query params
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const moveCarousel = (direction) => {
    const maxIndex = Math.ceil(shopServices.length / itemsPerPage) - 1;
    if (direction === "next") {
      setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    } else {
      setCarouselIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const visibleServices = shopServices.slice(carouselIndex * itemsPerPage, carouselIndex * itemsPerPage + itemsPerPage);

  const features = [
    { icon: "⚡", title: "Đặt lịch nhanh", desc: "Online dễ dàng" },
    { icon: "🏆", title: "Chất lượng cao", desc: "Đội ngũ chuyên" },
    { icon: "💰", title: "Giá hợp lý", desc: "Ưu đãi thường xuyên" },
    { icon: "📍", title: "Khắp nơi", desc: "Nhiều chi nhánh" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white border-b-4 border-[#8e2800] py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Logo />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Chăm Sóc Thú Cưng
              <br />
              <span style={{ color: "#8e2800" }}>Chuyên Nghiệp</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">Tìm kiếm và đặt lịch dịch vụ chăm sóc thú cưng tại Đà Nẵng</p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm dịch vụ..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 text-gray-900 outline-1 outline-red-800 focus:outline-none focus:ring-2 focus:ring-[#8e2800] transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-4 bg-[#8e2800] hover:bg-[#6d1f00] text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <FaSearch /> Tìm kiếm
                </button>
              </div>
            </div>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["Tắm rửa", "Cắt tỉa", "Khám sức khỏe", "Tiêm chủng"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchTerm(tag);
                    navigate(`/search?q=${encodeURIComponent(tag)}`);
                  }}
                  className="px-4 py-2 bg-blue-200 hover:bg-blue-300 backdrop-blur-sm text-black rounded-full text-sm font-medium transition cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services with Carousel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FaStar className="text-[#8e2800]" />
                Dịch vụ nổi bật
              </h2>
              <p className="text-gray-600 text-lg">Được cung cấp bởi các cửa hàng uy tín</p>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#8e2800] hover:bg-[#6d1f00] text-white rounded-xl font-semibold transition cursor-pointer"
            >
              Xem tất cả
              <FaSearch />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8e2800] border-t-transparent mb-4"></div>
              <span className="text-xl text-gray-600">Đang tải...</span>
            </div>
          ) : shopServices.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <FaPaw className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Không có dịch vụ nào</p>
            </div>
          ) : (
            <>
              {/* Carousel */}
              <div className="relative px-0 md:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {visibleServices.map((service) => (
                    <div
                      key={service.maDichVuShop}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 transform hover:-translate-y-0.5"
                      onClick={() => navigate(`/service/${service.maDichVuShop}`)}
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden bg-linear-to-br from-gray-200 to-gray-300">
                        {service.anhCuaHang ? (
                          <img
                            src={`http://localhost:5000${service.anhCuaHang}`}
                            alt={service.tenDichVu}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/400x300?text=" + service.tenDichVu;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaPaw className="text-6xl" />
                          </div>
                        )}
                      </div>

                      <div className="px-5 pt-5 pb-3">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-3 transition">{service.tenDichVu}</h3>

                        <div className="space-y-2 mb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <FaStore className="text-[#8e2800] mt-1 shrink-0" />
                              <span className="line-clamp-1 font-medium">{service.tenCuaHang}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <FaClock className="text-[#8e2800]" />
                              <span>{service.thoiLuong}p</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2 text-xs text-gray-500">
                              <FaMapMarkerAlt className="text-[#8e2800] mt-0.5 shrink-0" />
                              <span className="line-clamp-1">{service.diaChi}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <FaStar className="text-yellow-400 text-sm" />
                                <span className="font-bold text-gray-900">{service.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">({service.reviewCount})</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center items-center pt-2 border-t border-gray-100">
                          <span className="text-xl font-bold text-center" style={{ color: "#8e2800" }}>
                            {parseInt(service.gia).toLocaleString("vi-VN")}đ
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
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#8e2800] hover:bg-[#6d1f00] text-white rounded-full items-center justify-center transition shadow-lg"
                    >
                      <IoIosArrowBack className="text-2xl" />
                    </button>
                    <button
                      onClick={() => moveCarousel("next")}
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#8e2800] hover:bg-[#6d1f00] text-white rounded-full items-center justify-center transition shadow-lg"
                    >
                      <IoIosArrowForward className="text-2xl" />
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
                      className={`h-2 rounded-full transition-all ${
                        idx === carouselIndex ? "w-8 bg-[#8e2800]" : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
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
        <section className="py-20 bg-linear-to-b from-white to-orange-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                <FaStore className="text-[#8e2800]" />
                Cửa Hàng Nổi Bật
              </h2>
              <p className="text-gray-600 text-lg">Được khách hàng tin tưởng nhất</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topShops.map((shop) => (
                <div
                  key={shop.maCuaHang}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 transform hover:-translate-y-0.5"
                  onClick={() => navigate(`/shop/${shop.maCuaHang}`)}
                >
                  <div className="relative h-56 overflow-hidden bg-linear-to-br from-gray-200 to-gray-300">
                    {shop.anhCuaHang ? (
                      <img
                        src={`http://localhost:5000${shop.anhCuaHang}`}
                        alt={shop.tenCuaHang}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=" + shop.tenCuaHang;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaStore className="text-7xl" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-[#8e2800] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <FaTrophy className="text-yellow-300" />
                      Uy tín
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#8e2800] transition">{shop.tenCuaHang}</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 text-gray-600">
                        <FaMapMarkerAlt className="text-[#8e2800] mt-1 shrink-0" />
                        <span className="text-sm">{shop.diaChi}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaPhone className="text-[#8e2800] shrink-0" />
                        <span className="text-sm font-medium">{shop.soDienThoai}</span>
                      </div>
                    </div>

                    <button className="w-full bg-linear-to-r from-[#8e2800] to-[#b83400] hover:from-[#6d1f00] hover:to-[#8e2800] text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Tại Sao Chọn Chúng Tôi?</h2>
          <p className="text-center text-gray-600 text-lg mb-12">Những lợi ích khi sử dụng dịch vụ của chúng tôi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => {
              return (
                <div
                  key={i}
                  className="group text-center p-8 bg-linear-to-br from-white to-orange-50 rounded-2xl shadow-lg border-t-4 border-[#8e2800]"
                >
                  <div className="text-5xl mb-4">{f.icon}</div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      {hasShop() ? null : (
        <section className="py-20 bg-linear-to-b from-white to-orange-50">
          <div className="container mx-auto px-4">
            <div className="bg-linear-to-br from-[#8e2800] via-[#b83400] to-[#8e2800] text-white rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10">
                <div className="inline-block p-6 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <FaStore className="text-white text-6xl" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Bạn là chủ cửa hàng?</h2>
                <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">Đăng ký ngay để mở rộng khách hàng và tăng doanh thu!</p>
                <button className="px-10 py-4 bg-white text-[#8e2800] font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center gap-3">
                  <FaRocket />
                  Đăng ký cửa hàng ngay
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default HomePage;
