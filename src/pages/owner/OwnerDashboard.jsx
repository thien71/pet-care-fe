// src/pages/owner/OwnerDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { staffService, bookingService, serviceService } from "@/api";
import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaClock,
  FaChartLine,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaStore,
} from "react-icons/fa";
import { showToast } from "@/utils/toast";
import { Link } from "react-router-dom";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalServices: 0,
    pendingBookings: 0,
    completedBookings: 0,
    todayBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [employeesRes, bookingsRes, servicesRes] = await Promise.all([
        staffService.getEmployees().catch(() => ({ data: [] })),
        bookingService.getShopBookings({}).catch(() => ({ data: [] })),
        serviceService.getShopServices().catch(() => ({ data: [] })),
      ]);

      const employees = employeesRes.data || [];
      const bookings = bookingsRes.data || [];
      const services = servicesRes.data || [];

      // Calculate stats
      const pending = bookings.filter((b) => b.trangThai === "CHO_XAC_NHAN").length;
      const completed = bookings.filter((b) => b.trangThai === "HOAN_THANH").length;
      const today = new Date().toISOString().split("T")[0];
      const todayCount = bookings.filter((b) => b.ngayHen?.split("T")[0] === today).length;

      const totalRevenue = bookings.filter((b) => b.trangThai === "HOAN_THANH").reduce((sum, b) => sum + parseFloat(b.tongTien || 0), 0);

      setStats({
        totalEmployees: employees.length,
        totalBookings: bookings.length,
        totalRevenue,
        totalServices: services.length,
        pendingBookings: pending,
        completedBookings: completed,
        todayBookings: todayCount,
      });

      // Get recent bookings (last 5)
      setRecentBookings(bookings.slice(0, 5));
    } catch (err) {
      showToast.error("Lỗi khi tải dữ liệu dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      CHO_XAC_NHAN: { text: "Chờ xác nhận", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      DA_XAC_NHAN: { text: "Đã xác nhận", class: "bg-blue-100 text-blue-700 border-blue-200" },
      DANG_THUC_HIEN: { text: "Đang thực hiện", class: "bg-purple-100 text-purple-700 border-purple-200" },
      HOAN_THANH: { text: "Hoàn thành", class: "bg-green-100 text-green-700 border-green-200" },
      HUY: { text: "Đã hủy", class: "bg-red-100 text-red-700 border-red-200" },
    };
    const cfg = config[status] || config.CHO_XAC_NHAN;
    return <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${cfg.class}`}>{cfg.text}</span>;
  };

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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <FaStore className="text-2xl text-[#8e2800]" />
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <p className="text-gray-600">Chào mừng trở lại, {user?.hoTen}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FaCalendarCheck className="text-2xl text-blue-600" />
            </div>
            <FaChartLine className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Tổng đơn hàng</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalBookings}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <FaMoneyBillWave className="text-2xl text-green-600" />
            </div>
            <FaChartLine className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Doanh thu</p>
          <p className="text-3xl font-bold text-gray-800">{Math.round(stats.totalRevenue).toLocaleString("vi-VN")}đ</p>
        </div>

        {/* Total Employees */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <FaUsers className="text-2xl text-purple-600" />
            </div>
            <FaChartLine className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Nhân viên</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalEmployees}</p>
        </div>

        {/* Total Services */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <FaClock className="text-2xl text-orange-600" />
            </div>
            <FaChartLine className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Dịch vụ</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalServices}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaExclamationCircle className="text-2xl text-yellow-600" />
            <p className="text-sm text-gray-600">Chờ xác nhận</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.pendingBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaCheckCircle className="text-2xl text-green-600" />
            <p className="text-sm text-gray-600">Hoàn thành</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.completedBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FaCalendarCheck className="text-2xl text-blue-600" />
            <p className="text-sm text-gray-600">Đơn hôm nay</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.todayBookings}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Đơn hàng gần đây</h2>
          <Link to="/owner/bookings" className="text-sm text-[#8e2800] hover:text-[#6d1f00] font-medium">
            Xem tất cả →
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ngày hẹn</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.maLichHen} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">#{booking.maLichHen}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{booking.KhachHang?.hoTen}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{new Date(booking.ngayHen).toLocaleDateString("vi-VN")}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#8e2800]">{parseInt(booking.tongTien).toLocaleString("vi-VN")}đ</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.trangThai)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">Chưa có đơn hàng nào</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/owner/bookings"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#8e2800] transition-colors group"
        >
          <FaCalendarCheck className="text-3xl text-[#8e2800] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-gray-800 mb-1">Quản lý đơn hàng</h3>
          <p className="text-sm text-gray-600">Xem và xử lý đơn hàng</p>
        </Link>

        <Link
          to="/owner/employees"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#8e2800] transition-colors group"
        >
          <FaUsers className="text-3xl text-[#8e2800] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-gray-800 mb-1">Quản lý nhân viên</h3>
          <p className="text-sm text-gray-600">Thêm và quản lý nhân viên</p>
        </Link>

        <Link
          to="/owner/services"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#8e2800] transition-colors group"
        >
          <FaClock className="text-3xl text-[#8e2800] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-gray-800 mb-1">Quản lý dịch vụ</h3>
          <p className="text-sm text-gray-600">Cập nhật dịch vụ của shop</p>
        </Link>

        <Link
          to="/owner/schedule"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#8e2800] transition-colors group"
        >
          <FaCalendarCheck className="text-3xl text-[#8e2800] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-gray-800 mb-1">Lịch làm việc</h3>
          <p className="text-sm text-gray-600">Phân công ca cho nhân viên</p>
        </Link>
      </div>
    </div>
  );
};

export default OwnerDashboard;
