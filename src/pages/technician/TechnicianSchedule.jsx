// src/pages/technician/TechnicianSchedule.jsx - LỊCH LÀM VIỆC CỦA KỸ THUẬT VIÊN
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const TechnicianSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      const res = await apiClient.get("/staff/schedule");
      setSchedule(res.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Lỗi khi tải lịch làm việc");
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

  const weekDays = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];
  const timeSlots = [
    {
      maCa: 1,
      tenCa: "Ca sáng",
      time: "08:00-12:00",
      color: "bg-sky-100",
      borderColor: "border-sky-300",
    },
    {
      maCa: 2,
      tenCa: "Ca chiều",
      time: "13:00-17:00",
      color: "bg-amber-100",
      borderColor: "border-amber-300",
    },
    {
      maCa: 3,
      tenCa: "Ca tối",
      time: "18:00-22:00",
      color: "bg-purple-100",
      borderColor: "border-purple-300",
    },
  ];

  if (loading && schedule.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">🔧 Lịch Làm Việc Của Tôi</h1>
        <p className="text-gray-600 mt-2">
          Xem lịch làm việc và công việc được giao
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError("")} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>
      )}

      {/* Navigation & Week Info */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 items-center">
              <button
                onClick={goToPreviousWeek}
                className="btn btn-sm btn-outline"
              >
                ◀️ Tuần trước
              </button>
              <span className="font-semibold min-w-max">
                {new Date(selectedWeek[0]).toLocaleDateString("vi-VN")} -{" "}
                {new Date(selectedWeek[6]).toLocaleDateString("vi-VN")}
              </span>
              <button onClick={goToNextWeek} className="btn btn-sm btn-outline">
                Tuần sau ▶️
              </button>
            </div>
            <button onClick={goToToday} className="btn btn-sm btn-primary">
              📍 Tuần này
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Tổng ca</div>
          <div className="stat-value text-2xl text-primary">
            {schedule.length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Ca sáng</div>
          <div className="stat-value text-2xl text-info">
            {schedule.filter((s) => s.maCa === 1).length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Ca chiều</div>
          <div className="stat-value text-2xl text-warning">
            {schedule.filter((s) => s.maCa === 2).length}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg p-4">
          <div className="stat-title">Ca tối</div>
          <div className="stat-value text-2xl text-accent">
            {schedule.filter((s) => s.maCa === 3).length}
          </div>
        </div>
      </div>

      {/* Schedule View - Week Grid */}
      {schedule.length > 0 ? (
        <div className="card bg-base-100 shadow-xl overflow-x-auto">
          <div className="card-body p-0">
            <div className="grid gap-4 p-6">
              {timeSlots.map((slot) => (
                <div
                  key={slot.maCa}
                  className={`rounded-lg border-2 ${slot.borderColor} ${slot.color}`}
                >
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-4">
                      {slot.tenCa} ({slot.time})
                    </h3>

                    <div className="grid grid-cols-7 gap-2">
                      {selectedWeek.map((date, idx) => {
                        const shiftsInSlot = schedule.filter(
                          (s) => s.ngayLam === date && s.maCa === slot.maCa
                        );

                        return (
                          <div key={date} className="text-center">
                            <p className="text-xs font-semibold mb-2">
                              {weekDays[idx]}
                              <br />
                              {new Date(date).getDate()}/
                              {new Date(date).getMonth() + 1}
                            </p>
                            {shiftsInSlot.length > 0 ? (
                              <div className="bg-white rounded p-2 border-2 border-green-400">
                                <span className="text-sm font-bold text-success">
                                  ✅
                                </span>
                                <p className="text-xs text-gray-700 mt-1">
                                  {shiftsInSlot[0].CaLamViec?.tenCa}
                                </p>
                              </div>
                            ) : (
                              <div className="bg-white rounded p-2 opacity-50">
                                <span className="text-xs text-gray-400">—</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-2xl font-bold text-gray-600">
            Chưa có lịch làm việc
          </p>
          <p className="text-gray-500 mt-2">
            Chủ cửa hàng sẽ phân công lịch cho bạn
          </p>
        </div>
      )}

      {/* Alerts */}
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>
          Bạn sẽ nhận công việc tương ứng với các ca làm được phân công. Hãy
          kiểm tra thường xuyên!
        </span>
      </div>
    </div>
  );
};

export default TechnicianSchedule;
