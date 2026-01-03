import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../api/apiClient";
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaTimes,
  FaStar,
  FaStore,
  FaMapMarkerAlt,
  FaClock,
  FaPaw,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });
  const [selectedPetType, setSelectedPetType] = useState(
    searchParams.get("petType") || ""
  );

  const itemsPerPage = 12;

  // Load data when params change
  useEffect(() => {
    loadServices();
  }, [searchParams]);

  // Update URL params
  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;

      const params = {
        search: searchTerm,
        sortBy,
        limit: itemsPerPage,
        offset,
      };

      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;
      if (selectedPetType) params.petType = selectedPetType;

      const res = await apiClient.get("/booking/public/shop-services", {
        params,
      });

      setServices(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(Math.ceil((res.total || 0) / itemsPerPage));
    } catch (err) {
      console.error("❌ Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    updateSearchParams({ q: searchTerm, page: 1 });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    updateSearchParams({ sortBy: newSort, page: 1 });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateSearchParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ⭐ AUTO-APPLY: Khi thay đổi filter, tự động áp dụng
  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
    updateSearchParams({
      minPrice: min,
      maxPrice: max,
      page: 1,
    });
  };

  const handlePetTypeChange = (petType) => {
    setSelectedPetType(petType);
    setCurrentPage(1);
    updateSearchParams({
      petType,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSelectedPetType("");
    setCurrentPage(1);
    updateSearchParams({
      minPrice: "",
      maxPrice: "",
      petType: "",
      page: 1,
    });
  };

  const hasActiveFilters = priceRange.min || priceRange.max || selectedPetType;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex gap-3 max-w-3xl mx-auto mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ, cửa hàng..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8e2800] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-[#8e2800] hover:bg-[#6d1f00] text-white rounded-xl font-semibold transition flex items-center gap-2"
            >
              <FaSearch />
              Tìm
            </button>
          </div>

          {/* Filters & Sort Bar - ⭐ MOVED TO LEFT */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition lg:hidden ${
                  hasActiveFilters
                    ? "bg-[#8e2800] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <FaFilter />
                Bộ lọc
                {hasActiveFilters && (
                  <span className="bg-white text-[#8e2800] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    !
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                >
                  <FaTimes />
                  Xóa bộ lọc
                </button>
              )}

              {/* ⭐ SORT MOVED HERE */}
              <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2">
                <FaSortAmountDown className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá thấp → cao</option>
                  <option value="price_desc">Giá cao → thấp</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>

              {/* ⭐ RESULT COUNT MOVED HERE */}
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-medium">{total}</span> kết quả
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Sidebar (Mobile Overlay) */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaFilter className="text-[#8e2800]" />
                  Bộ lọc
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <FilterPanel
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                selectedPetType={selectedPetType}
                onPetTypeChange={handlePetTypeChange}
              />

              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 px-4 py-3 bg-[#8e2800] hover:bg-[#6d1f00] text-white rounded-lg font-medium transition"
              >
                Xem kết quả
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaFilter className="text-[#8e2800]" />
                  Bộ lọc
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-[#8e2800] hover:underline font-medium"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              <FilterPanel
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                selectedPetType={selectedPetType}
                onPetTypeChange={handlePetTypeChange}
              />
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-4">
              <span
                className="hover:text-[#8e2800] cursor-pointer"
                onClick={() => navigate("/")}
              >
                Trang chủ
              </span>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">
                Kết quả tìm kiếm
                {searchTerm && `: "${searchTerm}"`}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#8e2800] border-t-transparent mb-4"></div>
                <span className="text-lg text-gray-600">Đang tìm kiếm...</span>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600 mb-6">
                  Thử thay đổi từ khóa hoặc bộ lọc
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition"
                >
                  Về trang chủ
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.maDichVuShop}
                      service={service}
                      onClick={() =>
                        navigate(`/service/${service.maDichVuShop}`)
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                      <FaChevronLeft />
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          return (
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                          );
                        })
                        .map((page, idx, arr) => {
                          const prevPage = arr[idx - 1];
                          const showEllipsis = prevPage && page - prevPage > 1;

                          return (
                            <div key={page} className="flex items-center gap-2">
                              {showEllipsis && (
                                <span className="text-gray-400">...</span>
                              )}
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg font-medium transition ${
                                  currentPage === page
                                    ? "bg-[#8e2800] text-white"
                                    : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          );
                        })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Filter Panel Component - ⭐ AUTO-APPLY khi tick
const FilterPanel = ({
  priceRange,
  onPriceRangeChange,
  selectedPetType,
  onPetTypeChange,
}) => {
  const petTypes = [
    { value: "", label: "Tất cả" },
    { value: "cho", label: "Chó" },
    { value: "meo", label: "Mèo" },
    { value: "chim", label: "Chim" },
    { value: "hamster", label: "Hamster" },
    { value: "tho", label: "Thỏ" },
    { value: "rua", label: "Rùa" },
  ];

  const priceRanges = [
    { label: "Tất cả", min: "", max: "" },
    { label: "Dưới 100k", min: "0", max: "100000" },
    { label: "100k - 200k", min: "100000", max: "200000" },
    { label: "200k - 500k", min: "200000", max: "500000" },
    { label: "Trên 500k", min: "500000", max: "999999999" },
  ];

  return (
    <div className="space-y-6">
      {/* Pet Type */}
      <div>
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FaPaw className="text-[#8e2800]" />
          Loại thú cưng
        </h4>
        <div className="space-y-2">
          {petTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <input
                type="radio"
                name="petType"
                checked={selectedPetType === type.value}
                onChange={() => onPetTypeChange(type.value)}
                className="w-4 h-4 text-[#8e2800] focus:ring-[#8e2800]"
              />
              <span className="text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#8e2800] transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-linear-to-br from-gray-200 to-gray-300">
        {service.anhCuaHang ? (
          <img
            src={`http://localhost:5000${service.anhCuaHang}`}
            alt={service.tenDichVu}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x300?text=" + service.tenDichVu;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FaPaw className="text-6xl" />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-[#8e2800] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          {parseInt(service.gia).toLocaleString("vi-VN")}đ
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-3 group-hover:text-[#8e2800] transition">
          {service.tenDichVu}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FaStore className="text-[#8e2800] mt-1 shrink-0" />
            <span className="line-clamp-1 font-medium">
              {service.tenCuaHang}
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <FaMapMarkerAlt className="text-[#8e2800] mt-0.5 shrink-0" />
            <span className="line-clamp-1">{service.diaChi}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="font-bold text-gray-900">{service.rating}</span>
            </div>
            <span className="text-xs text-gray-500">
              ({service.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaClock className="text-[#8e2800]" />
            <span>{service.thoiLuong}p</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
