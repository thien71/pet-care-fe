// src/components/owner/ShopLockedBanner.jsx
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaClock, FaCreditCard } from "react-icons/fa";

const ShopLockedBanner = ({ status }) => {
  const { isTrial, daysLeft, expiryDate } = status;

  // Nếu đang trong trial period và gần hết hạn (≤ 3 ngày)
  if (isTrial && daysLeft <= 3) {
    return (
      <div className="bg-yellow-50 border-b-4 border-yellow-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <FaClock className="text-yellow-600 text-2xl shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-yellow-800">Thời gian dùng thử sắp hết hạn!</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Cửa hàng của bạn đang trong thời gian dùng thử. Còn <strong>{daysLeft} ngày</strong> (đến{" "}
              {new Date(expiryDate).toLocaleDateString("vi-VN")}). Vui lòng thanh toán để tiếp tục sử dụng dịch vụ.
            </p>
          </div>
          <Link
            to="/owner/payments"
            className="px-6 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-colors shrink-0 flex items-center gap-2"
          >
            <FaCreditCard />
            Thanh toán ngay
          </Link>
        </div>
      </div>
    );
  }

  // Nếu shop bị khóa
  if (status.isLocked) {
    return (
      <div className="bg-red-50 border-b-4 border-red-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <FaExclamationTriangle className="text-red-600 text-2xl shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-red-800">Cửa hàng đã bị khóa!</h3>
            <p className="text-sm text-red-700 mt-1">Gói dịch vụ đã hết hạn. Vui lòng thanh toán để mở khóa và tiếp tục sử dụng.</p>
          </div>
          <Link
            to="/owner/payments"
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shrink-0 flex items-center gap-2"
          >
            <FaCreditCard />
            Thanh toán ngay
          </Link>
        </div>
      </div>
    );
  }

  return null;
};

export default ShopLockedBanner;
