// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { FaStore, FaUsers, FaCheckCircle, FaClock, FaMoneyBillWave, FaChartLine, FaSpinner } from "react-icons/fa";
import { shopService, userService, paymentService } from "@/api";
import { showToast } from "@/utils/toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    pendingShops: 0,
    activeShops: 0,
    totalUsers: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  });
  const [recentShops, setRecentShops] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [shopsRes, usersRes, paymentsRes] = await Promise.all([
        shopService.getShops(),
        userService.getUsers(),
        paymentService.getPaymentConfirmations(),
      ]);

      const shops = shopsRes.data || [];
      const users = usersRes.data || [];
      const payments = paymentsRes.data || [];

      // Calculate stats
      setStats({
        totalShops: shops.length,
        pendingShops: shops.filter((s) => s.trangThai === "CHO_DUYET").length,
        activeShops: shops.filter((s) => s.trangThai === "HOAT_DONG").length,
        totalUsers: users.length,
        pendingPayments: payments.filter((p) => p.trangThai === "CHUA_THANH_TOAN").length,
        totalRevenue: payments.filter((p) => p.trangThai === "DA_THANH_TOAN").reduce((sum, p) => sum + parseFloat(p.soTien || 0), 0),
      });

      // Get recent items
      setRecentShops(shops.slice(0, 5));
      setRecentUsers(users.slice(0, 5));
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`text-xl ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#8e2800]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={FaStore} title="Tổng Cửa Hàng" value={stats.totalShops} color="text-blue-700" bgColor="bg-blue-50" />
        <StatCard icon={FaClock} title="Chờ Duyệt" value={stats.pendingShops} color="text-yellow-700" bgColor="bg-yellow-50" />
        <StatCard icon={FaCheckCircle} title="Đang Hoạt Động" value={stats.activeShops} color="text-green-700" bgColor="bg-green-50" />
        <StatCard icon={FaUsers} title="Tổng Người Dùng" value={stats.totalUsers} color="text-purple-700" bgColor="bg-purple-50" />
        <StatCard
          icon={FaMoneyBillWave}
          title="Thanh Toán Chờ"
          value={stats.pendingPayments}
          color="text-orange-700"
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={FaChartLine}
          title="Tổng Doanh Thu"
          value={`${stats.totalRevenue.toLocaleString("vi-VN")}đ`}
          color="text-[#8e2800]"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shops */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Cửa Hàng Mới</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentShops.length > 0 ? (
              recentShops.map((shop) => (
                <div key={shop.maCuaHang} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{shop.tenCuaHang}</p>
                      <p className="text-sm text-gray-600">{shop.diaChi}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        shop.trangThai === "CHO_DUYET"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          : shop.trangThai === "HOAT_DONG"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                      {shop.trangThai === "CHO_DUYET" ? "Chờ duyệt" : shop.trangThai === "HOAT_DONG" ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">Không có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Người Dùng Mới</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.maNguoiDung} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#8e2800] text-white flex items-center justify-center font-bold">
                      {user.hoTen.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{user.hoTen}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className="px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                      {user.VaiTro?.tenVaiTro || "N/A"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
