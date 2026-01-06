// src/pages/staff/StaffSchedule.jsx
import { useState, useEffect } from "react";
import { staffService } from "@/api";
import { showToast } from "@/utils/toast";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaCheckCircle, FaSun, FaCloudSun, FaMoon, FaCalendarDay } from "react-icons/fa";

const StaffSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(getWeekDates(new Date()));

  function getWeekDates(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date.toISOString().split("T")[0]);
    }
    return week;
  }

  useEffect(() => {
    loadSchedule();
  }, [selectedWeek]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const res = await staffService.getMySchedule();
      setSchedule(res.data || []);
    } catch (err) {
      showToast.error(err.message || "Lỗi khi tải lịch làm việc");
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousWeek = () => {
    const firstDay = new Date(selectedWeek[0]);
    firstDay.setDate(firstDay.getDate() - 7);
    setSelectedWeek(getWeekDates(firstDay));
  };

  const goToNextWeek = () => {
    const firstDay = new Date(selectedWeek[0]);
    firstDay.setDate(firstDay.getDate() + 7);
    setSelectedWeek(getWeekDates(firstDay));
  };

  const goToToday = () => {
    setSelectedWeek(getWeekDates(new Date()));
  };

  const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

  const timeSlots = [
    { maCa: 1, tenCa: "Ca sáng", time: "08:00-12:00", color: "bg-yellow-50", borderColor: "border-yellow-200", icon: FaSun },
    { maCa: 2, tenCa: "Ca chiều", time: "13:00-17:00", color: "bg-orange-50", borderColor: "border-orange-200", icon: FaCloudSun },
    { maCa: 3, tenCa: "Ca tối", time: "18:00-22:00", color: "bg-indigo-50", borderColor: "border-indigo-200", icon: FaMoon },
  ];

  if (loading && schedule.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#8e2800] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <FaCalendarAlt className="text-2xl text-[#8e2800]" />
          <h1 className="text-2xl font-bold text-gray-800">Lịch Làm Việc Của Tôi</h1>
        </div>
        <p className="text-gray-600">Xem lịch làm việc hàng tuần</p>
      </div>

      {/* Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <button onClick={goToPreviousWeek} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FaChevronLeft className="text-gray-600" />
            </button>
            <span className="px-4 py-2 font-medium text-gray-800 min-w-max">
              {new Date(selectedWeek[0]).toLocaleDateString("vi-VN")} - {new Date(selectedWeek[6]).toLocaleDateString("vi-VN")}
            </span>
            <button onClick={goToNextWeek} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors font-medium flex items-center gap-2"
          >
            <FaCalendarDay />
            Tuần này
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Tổng ca</p>
          <p className="text-3xl font-bold text-gray-800">{schedule.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Ca sáng</p>
          <p className="text-3xl font-bold text-yellow-600">{schedule.filter((s) => s.maCa === 1).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Ca chiều</p>
          <p className="text-3xl font-bold text-orange-600">{schedule.filter((s) => s.maCa === 2).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Ca tối</p>
          <p className="text-3xl font-bold text-indigo-600">{schedule.filter((s) => s.maCa === 3).length}</p>
        </div>
      </div>

      {/* Schedule View */}
      {schedule.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 space-y-4">
            {timeSlots.map((slot) => {
              const Icon = slot.icon;
              return (
                <div key={slot.maCa} className={`border rounded-lg ${slot.borderColor} ${slot.color} overflow-hidden`}>
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-2">
                      <Icon className="text-xl" />
                      <h3 className="font-bold text-lg text-gray-800">
                        {slot.tenCa} <span className="text-sm font-normal text-gray-600">({slot.time})</span>
                      </h3>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-2">
                      {selectedWeek.map((date, idx) => {
                        const shiftsInSlot = schedule.filter((s) => s.ngayLam === date && s.maCa === slot.maCa);

                        return (
                          <div key={date} className="text-center">
                            <p className="text-xs font-semibold mb-2 text-gray-700">
                              {weekDays[idx]}
                              <br />
                              {new Date(date).getDate()}/{new Date(date).getMonth() + 1}
                            </p>
                            {shiftsInSlot.length > 0 ? (
                              <div className="bg-white rounded-lg p-3 border-2 border-green-400">
                                <FaCheckCircle className="text-green-600 mx-auto mb-1" />
                                <p className="text-xs font-medium text-gray-700">{shiftsInSlot[0].CaLamViec?.tenCa}</p>
                              </div>
                            ) : (
                              <div className="bg-white rounded-lg p-3 border border-gray-200 opacity-50">
                                <span className="text-xs text-gray-400">—</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FaCalendarAlt className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-2xl font-bold text-gray-600">Chưa có lịch làm việc</p>
          <p className="text-gray-500 mt-2">Chủ cửa hàng sẽ phân công lịch cho bạn</p>
        </div>
      )}

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Hướng dẫn:</span> Kiểm tra lịch làm việc thường xuyên để không bỏ lỡ ca làm việc được phân công.
        </p>
      </div>
    </div>
  );
};

export default StaffSchedule;
