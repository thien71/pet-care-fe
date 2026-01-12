// src/components/shop/ShopCard.jsx
import { getShopImageUrl } from "@/utils/constants";

const ShopCard = ({ shop, onClick }) => {
  const imageUrl = getShopImageUrl(shop.anhCuaHang);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#8e2800] transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={shop.tenCuaHang}
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

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-1">{shop.tenCuaHang}</h3>

        <div className="space-y-2 mb-4">
          {shop.diaChi && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-[#8e2800] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="line-clamp-2">{shop.diaChi}</span>
            </div>
          )}

          {shop.soDienThoai && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-[#8e2800] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{shop.soDienThoai}</span>
            </div>
          )}
        </div>

        {shop.moTa && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{shop.moTa}</p>}

        <button className="w-full py-2.5 bg-[#8e2800] text-white rounded-lg font-medium hover:bg-[#6d1f00] transition-colors">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default ShopCard;
