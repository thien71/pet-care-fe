// src/pages/home/HomePage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  const services = [
    {
      icon: "🛁",
      title: "Tắm & Vệ sinh",
      desc: "Dịch vụ tắm, cắt tỉa lông chuyên nghiệp cho thú cưng",
      price: "Từ 150.000đ",
    },
    {
      icon: "💉",
      title: "Khám & Chữa bệnh",
      desc: "Khám sức khỏe định kỳ, điều trị bệnh",
      price: "Từ 200.000đ",
    },
    {
      icon: "🏠",
      title: "Khách sạn thú cưng",
      desc: "Dịch vụ lưu trú an toàn, thoải mái",
      price: "Từ 100.000đ/ngày",
    },
    {
      icon: "🎨",
      title: "Spa & Làm đẹp",
      desc: "Chăm sóc da lông, nhuộm móng chuyên nghiệp",
      price: "Từ 180.000đ",
    },
  ];

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

      {/* Services Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="card-body items-center text-center">
                  <div className="text-6xl mb-4">{service.icon}</div>
                  <h3 className="card-title text-2xl">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                  <div className="badge badge-primary badge-lg mt-4">
                    {service.price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn btn-primary btn-lg gap-2">
              <span>🔍</span>
              Xem tất cả dịch vụ
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-xl text-gray-600">
              Những lý do bạn nên tin tùng
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
              <div className="stat-value">50+</div>
              <div className="stat-title text-white/80">Cửa hàng</div>
              <div className="stat-desc text-white/60">Trên toàn Đà Nẵng</div>
            </div>

            <div className="stat bg-transparent">
              <div className="stat-figure text-4xl">👥</div>
              <div className="stat-value">10K+</div>
              <div className="stat-title text-white/80">Khách hàng</div>
              <div className="stat-desc text-white/60">Tin tưởng sử dụng</div>
            </div>

            <div className="stat bg-transparent">
              <div className="stat-figure text-4xl">✨</div>
              <div className="stat-value">5K+</div>
              <div className="stat-title text-white/80">Dịch vụ/tháng</div>
              <div className="stat-desc text-white/60">Hoàn thành xuất sắc</div>
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
        <div>
          <div className="grid grid-flow-col gap-4">
            <a className="link link-hover">📱 Facebook</a>
            <a className="link link-hover">📷 Instagram</a>
            <a className="link link-hover">📧 Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
