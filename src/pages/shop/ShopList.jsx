// src/pages/shop/ShopList.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { shopService } from "@/api";
import { getShopImageUrl } from "@/utils/constants";
import showToast from "@/utils/toast";
import ShopCard from "@/components/shop/ShopCard";

const ShopList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filteredShops, setFilteredShops] = useState([]);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = shops.filter(
        (shop) =>
          shop.tenCuaHang.toLowerCase().includes(searchTerm.toLowerCase()) || shop.diaChi?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredShops(filtered);
    } else {
      setFilteredShops(shops);
    }
  }, [searchTerm, shops]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await shopService.getPublicShops();
      setShops(response.data || []);
      setFilteredShops(response.data || []);
    } catch (error) {
      showToast.error(error.message || "Không thể tải danh sách cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleShopClick = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-[#8e2800] rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Đang tải cửa hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh Sách Cửa Hàng</h1>
              <p className="text-gray-600">Khám phá {filteredShops.length} cửa hàng chăm sóc thú cưng uy tín</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm cửa hàng theo tên hoặc địa chỉ..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8e2800] transition-colors"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredShops.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy cửa hàng</h3>
            <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.maCuaHang} shop={shop} onClick={() => handleShopClick(shop.maCuaHang)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopList;
