// src/pages/shop/ShopDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shopService } from "@/api";
import { getShopImageUrl, getServiceImageUrl } from "@/utils/constants";
import showToast from "@/utils/toast";
import ServiceCard from "@/components/service/ServiceCard";

const ShopDetail = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  useEffect(() => {
    fetchShopDetail();
  }, [shopId]);

  const fetchShopDetail = async () => {
    try {
      setLoading(true);
      const response = await shopService.getShopProfile(shopId);
      setShop(response.shop);
      setServices(response.services || []);
    } catch (error) {
      showToast.error(error.message || "Không thể tải thông tin cửa hàng");
      navigate("/shops");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-[#8e2800] rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!shop) return null;

  const imageUrl = getShopImageUrl(shop.anhCuaHang);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Compact */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
            {/* Shop Image - Small */}
            <div className="lg:col-span-1">
              <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={shop.tenCuaHang}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Shop Info */}
            <div className="lg:col-span-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{shop.tenCuaHang}</h1>

              <div className="space-y-1 text-sm">
                {shop.diaChi && (
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#8e2800] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-gray-600">{shop.diaChi}</p>
                  </div>
                )}

                {shop.soDienThoai && (
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#8e2800] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href={`tel:${shop.soDienThoai}`} className="text-[#8e2800] hover:underline">
                      {shop.soDienThoai}
                    </a>
                  </div>
                )}
              </div>

              {shop.moTa && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{shop.moTa}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("services")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "services" ? "border-[#8e2800] text-[#8e2800]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Dịch vụ ({services.length})
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "about" ? "border-[#8e2800] text-[#8e2800]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Thông tin
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "services" ? (
          services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.maDichVuShop}
                  service={{
                    ...service,
                    hinhAnh: service.hinhAnh,
                    anhCuaHang: shop.anhCuaHang,
                    tenCuaHang: shop.tenCuaHang,
                    diaChi: shop.diaChi,
                  }}
                  onClick={() => handleServiceClick(service.maDichVuShop)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Chưa có dịch vụ</h3>
              <p className="text-gray-500">Cửa hàng chưa cung cấp dịch vụ nào</p>
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin cửa hàng</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Tên cửa hàng</h3>
                <p className="text-gray-600">{shop.tenCuaHang}</p>
              </div>
              {shop.diaChi && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Địa chỉ</h3>
                  <p className="text-gray-600">{shop.diaChi}</p>
                </div>
              )}
              {shop.soDienThoai && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Số điện thoại</h3>
                  <p className="text-gray-600">{shop.soDienThoai}</p>
                </div>
              )}
              {shop.moTa && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Mô tả</h3>
                  <p className="text-gray-600 leading-relaxed">{shop.moTa}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
