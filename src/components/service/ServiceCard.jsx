const ServiceCard = ({ service, onClick }) => {
  const rating = service.rating || service.danhGiaTrungBinh || 0;
  const reviewCount = service.reviewCount || service.soLuotDanhGia || 0;
  const bookingCount = service.soLanDat || 0;

  console.log("Service", service);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#8e2800] hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {service.hinhAnh || service.anhCuaHang ? (
          <img
            src={`http://localhost:5000${service.hinhAnh || service.anhCuaHang}`}
            alt={service.tenDichVu}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg class="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                  </svg>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-base text-gray-900 line-clamp-2 mb-3 h-12">{service.tenDichVu}</h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-[#8e2800] shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="line-clamp-1 text-sm">{service.tenCuaHang}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-[#8e2800] shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="line-clamp-1">{service.diaChi}</span>
          </div>
        </div>

        {/* Price & Booking Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-2">
          <div className="text-xl font-bold text-[#8e2800]">{parseInt(service.gia).toLocaleString("vi-VN")}đ</div>
          {service.thoiLuong && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4 text-[#8e2800]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{service.thoiLuong}p</span>
            </div>
          )}
        </div>

        {/* Rating & Booking Count */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating > 0 && <span className="font-semibold text-gray-900">{parseFloat(rating).toFixed(1)}</span>}
            <span className="text-gray-500">({reviewCount}) đánh giá</span>
          </div>

          <span className="text-gray-500">Đã đặt {bookingCount}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
