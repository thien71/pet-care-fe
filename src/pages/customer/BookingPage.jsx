// src/pages/customer/BookingPage.jsx - FULL IMPLEMENTATION
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedShopId = searchParams.get("shopId");
  const preselectedServiceId = searchParams.get("serviceId");

  // UI States
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Modal States
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [shopSearchTerm, setShopSearchTerm] = useState("");

  // Data States
  const [shops, setShops] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Form States
  const [selectedShop, setSelectedShop] = useState(null);
  const [pets, setPets] = useState([]);
  const [currentPet, setCurrentPet] = useState({
    ten: "",
    maLoai: "",
    tuoi: "",
    dacDiem: "",
    dichVuIds: [],
  });
  const [booking, setBooking] = useState({
    ngayHen: "",
    gioBatDau: "",
    ghiChu: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // ==================== LOAD INITIAL DATA ====================
  useEffect(() => {
    loadInitialData();
  }, []);

  // ==================== PRELOAD FROM URL ====================
  useEffect(() => {
    if (preselectedShopId && shops.length > 0) {
      const shop = shops.find(
        (s) => s.maCuaHang === parseInt(preselectedShopId)
      );
      if (shop) {
        setSelectedShop(shop);
      }
    }
  }, [preselectedShopId, shops]);

  // ==================== LOAD SERVICES WHEN PET TYPE CHANGES ====================
  useEffect(() => {
    if (currentPet.maLoai && selectedShop) {
      loadServicesByPetType();
    }
  }, [currentPet.maLoai, selectedShop]);

  // ==================== LOAD TIME SLOTS WHEN DATE SELECTED ====================
  useEffect(() => {
    if (booking.ngayHen && selectedShop) {
      loadAvailableTimeSlots();
    }
  }, [booking.ngayHen, selectedShop]);

  // ==================== API CALLS ====================

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [shopsRes, petTypesRes] = await Promise.all([
        apiClient.get("/booking/public/shops"),
        apiClient.get("/booking/public/pet-types"),
      ]);
      setShops(shopsRes.data || []);
      setPetTypes(petTypesRes.data || []);
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      console.error("Load initial data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadServicesByPetType = async () => {
    try {
      const res = await apiClient.get(
        `/booking/shop/${selectedShop.maCuaHang}/services/pet-type/${currentPet.maLoai}`
      );
      setAvailableServices(res.data || []);

      // Auto-select preselected service if exists
      if (preselectedServiceId) {
        const service = res.data.find(
          (s) => s.maDichVuShop === parseInt(preselectedServiceId)
        );
        if (service) {
          setCurrentPet((prev) => ({
            ...prev,
            dichVuIds: [service.maDichVuShop],
          }));
        }
      }
    } catch (err) {
      console.error("Load services error:", err);
      setAvailableServices([]);
    }
  };

  const loadAvailableTimeSlots = async () => {
    try {
      const res = await apiClient.get(
        `/booking/shop/${selectedShop.maCuaHang}/available-slots`,
        { params: { date: booking.ngayHen } }
      );
      setAvailableTimeSlots(res.slots || []);
    } catch (err) {
      console.error("Load time slots error:", err);
      setAvailableTimeSlots([]);
    }
  };

  // ==================== HANDLERS ====================

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    setShopModalOpen(false);
    // Reset dependent data
    setPets([]);
    setCurrentPet({
      ten: "",
      maLoai: "",
      tuoi: "",
      dacDiem: "",
      dichVuIds: [],
    });
    setBooking({
      ngayHen: "",
      gioBatDau: "",
      ghiChu: "",
    });
    setFormErrors({});
  };

  const handleServiceToggle = (serviceId) => {
    setCurrentPet((prev) => ({
      ...prev,
      dichVuIds: prev.dichVuIds.includes(serviceId)
        ? prev.dichVuIds.filter((id) => id !== serviceId)
        : [...prev.dichVuIds, serviceId],
    }));
  };

  const handleAddPet = () => {
    const errors = {};
    if (!currentPet.ten.trim()) errors.ten = "Vui lòng nhập tên";
    if (!currentPet.maLoai) errors.maLoai = "Vui lòng chọn loài";
    if (currentPet.dichVuIds.length === 0)
      errors.services = "Vui lòng chọn ít nhất 1 dịch vụ";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setPets((prev) => [...prev, { ...currentPet, id: Date.now() }]);
    setCurrentPet({
      ten: "",
      maLoai: "",
      tuoi: "",
      dacDiem: "",
      dichVuIds: [],
    });
    setFormErrors({});
  };

  const handleRemovePet = (petId) => {
    setPets((prev) => prev.filter((p) => p.id !== petId));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        maCuaHang: selectedShop.maCuaHang,
        ngayHen: `${booking.ngayHen}T${booking.gioBatDau}:00`,
        ghiChu: booking.ghiChu || null,
        pets: pets.map((pet) => ({
          ten: pet.ten,
          maLoai: parseInt(pet.maLoai),
          tuoi: pet.tuoi ? parseInt(pet.tuoi) : null,
          dacDiem: pet.dacDiem || null,
          dichVuIds: pet.dichVuIds,
        })),
      };

      await apiClient.post("/booking/create", payload);
      setSuccess(true);
      setTimeout(() => navigate("/customer/history"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Đặt lịch thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return pets.reduce((total, pet) => {
      return (
        total +
        pet.dichVuIds.reduce((petTotal, serviceId) => {
          const service = availableServices.find(
            (s) => s.maDichVuShop === serviceId
          );
          return petTotal + (service ? parseFloat(service.gia) : 0);
        }, 0)
      );
    }, 0);
  };

  const filteredShops = shops.filter(
    (shop) =>
      shop.tenCuaHang.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
      shop.diaChi.toLowerCase().includes(shopSearchTerm.toLowerCase())
  );

  const steps = [
    { num: 1, label: "Thông Tin Thú" },
    { num: 2, label: "Ngày & Giờ" },
    { num: 3, label: "Xác Nhận" },
  ];

  // ==================== SUCCESS SCREEN ====================
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Đặt lịch thành công!
          </h2>
          <p className="text-gray-600 mb-6">
            Cửa hàng sẽ xác nhận đơn của bạn trong ít phút
          </p>
          <div className="animate-pulse text-gray-500">
            Đang chuyển hướng...
          </div>
        </div>
      </div>
    );
  }

  // ==================== LOADING SCREEN ====================
  if (loading && shops.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // ==================== MAIN UI ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-2xl hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Đặt Lịch Dịch Vụ
              </h1>
              <p className="text-sm text-gray-600">Hoàn thành trong 3 bước</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step.num
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.num}
                  </div>
                  <span
                    className={`hidden sm:block font-medium ${
                      currentStep >= step.num
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-16 h-0.5 mx-2 ${
                      currentStep > step.num ? "bg-gray-900" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <span className="text-red-600 font-bold text-lg">!</span>
            <div className="flex-1">
              <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Shop Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              {!selectedShop ? (
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    🏪 Chọn Cửa Hàng
                  </h3>
                  <button
                    onClick={() => setShopModalOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                  >
                    + Chọn cửa hàng
                  </button>
                </div>
              ) : (
                <>
                  {selectedShop.anhCuaHang && (
                    <div className="aspect-video w-full">
                      <img
                        src={`http://localhost:5000${selectedShop.anhCuaHang}`}
                        alt={selectedShop.tenCuaHang}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                      {selectedShop.tenCuaHang}
                      <button
                        onClick={() => setShopModalOpen(true)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Đổi
                      </button>
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-start gap-2">
                        <span className="shrink-0">📍</span>
                        <span>{selectedShop.diaChi}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span>📞</span>
                        <span>{selectedShop.soDienThoai}</span>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN - Main Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* STEP 1: Pet Info & Services */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Thông Tin Thú Cưng & Dịch Vụ
                  </h2>

                  {!selectedShop ? (
                    <div className="text-center py-12 text-gray-500">
                      Vui lòng chọn cửa hàng trước
                    </div>
                  ) : (
                    <>
                      {/* Pet Form */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tên thú cưng *
                            </label>
                            <input
                              type="text"
                              placeholder="VD: Milu"
                              value={currentPet.ten}
                              onChange={(e) =>
                                setCurrentPet({
                                  ...currentPet,
                                  ten: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-900 ${
                                formErrors.ten
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {formErrors.ten && (
                              <p className="text-xs text-red-600 mt-1">
                                {formErrors.ten}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Loài *
                            </label>
                            <select
                              value={currentPet.maLoai}
                              onChange={(e) =>
                                setCurrentPet({
                                  ...currentPet,
                                  maLoai: e.target.value,
                                  dichVuIds: [],
                                })
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-900 ${
                                formErrors.maLoai
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">-- Chọn --</option>
                              {petTypes.map((type) => (
                                <option key={type.maLoai} value={type.maLoai}>
                                  {type.tenLoai}
                                </option>
                              ))}
                            </select>
                            {formErrors.maLoai && (
                              <p className="text-xs text-red-600 mt-1">
                                {formErrors.maLoai}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tuổi
                            </label>
                            <input
                              type="number"
                              placeholder="VD: 2"
                              min="0"
                              value={currentPet.tuoi}
                              onChange={(e) =>
                                setCurrentPet({
                                  ...currentPet,
                                  tuoi: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Đặc điểm
                            </label>
                            <input
                              type="text"
                              placeholder="VD: Hiền lành"
                              value={currentPet.dacDiem}
                              onChange={(e) =>
                                setCurrentPet({
                                  ...currentPet,
                                  dacDiem: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                            />
                          </div>
                        </div>

                        {/* Services */}
                        {currentPet.maLoai && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chọn dịch vụ *
                            </label>
                            {availableServices.length === 0 ? (
                              <p className="text-sm text-gray-500 text-center py-4">
                                Đang tải dịch vụ...
                              </p>
                            ) : (
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {availableServices.map((service) => (
                                  <label
                                    key={service.maDichVuShop}
                                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                                      currentPet.dichVuIds.includes(
                                        service.maDichVuShop
                                      )
                                        ? "border-gray-900 bg-gray-50"
                                        : "border-gray-200"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={currentPet.dichVuIds.includes(
                                        service.maDichVuShop
                                      )}
                                      onChange={() =>
                                        handleServiceToggle(
                                          service.maDichVuShop
                                        )
                                      }
                                      className="w-5 h-5 accent-gray-900"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">
                                        {service.tenDichVu}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {parseInt(service.gia).toLocaleString(
                                          "vi-VN"
                                        )}
                                        đ
                                        {service.thoiLuong &&
                                          ` • ${service.thoiLuong}p`}
                                      </p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            )}
                            {formErrors.services && (
                              <p className="text-xs text-red-600 mt-2">
                                {formErrors.services}
                              </p>
                            )}
                          </div>
                        )}

                        <button
                          onClick={handleAddPet}
                          className="w-full mt-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200"
                        >
                          + Thêm Thú Cưng
                        </button>
                      </div>

                      {/* Added Pets List */}
                      {pets.length > 0 && (
                        <div>
                          <h3 className="font-bold text-gray-900 mb-3">
                            Danh Sách Thú Cưng ({pets.length})
                          </h3>
                          <div className="space-y-2">
                            {pets.map((pet) => {
                              const petType = petTypes.find(
                                (t) => t.maLoai === parseInt(pet.maLoai)
                              );
                              return (
                                <div
                                  key={pet.id}
                                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-medium text-gray-900">
                                        {pet.ten}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {petType?.tenLoai}
                                        {pet.tuoi && ` • ${pet.tuoi} tuổi`}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleRemovePet(pet.id)}
                                      className="text-red-600 text-sm font-medium hover:underline"
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                  <ul className="text-xs text-gray-700 space-y-1">
                                    {pet.dichVuIds.map((serviceId) => {
                                      const service = availableServices.find(
                                        (s) => s.maDichVuShop === serviceId
                                      );
                                      return service ? (
                                        <li key={serviceId}>
                                          • {service.tenDichVu}
                                        </li>
                                      ) : null;
                                    })}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* STEP 2: Date & Time */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Chọn Ngày & Giờ
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày hẹn *
                    </label>
                    <input
                      type="date"
                      value={booking.ngayHen}
                      onChange={(e) =>
                        setBooking({
                          ...booking,
                          ngayHen: e.target.value,
                          gioBatDau: "",
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                    />
                  </div>

                  {booking.ngayHen && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khung giờ *
                      </label>
                      {availableTimeSlots.length === 0 ? (
                        <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                          Đang tải khung giờ...
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {availableTimeSlots.map((slot) => (
                            <button
                              key={slot.gioBatDau}
                              onClick={() =>
                                setBooking({
                                  ...booking,
                                  gioBatDau: slot.gioBatDau,
                                })
                              }
                              disabled={!slot.available}
                              className={`py-3 rounded-lg font-medium text-sm transition-colors ${
                                booking.gioBatDau === slot.gioBatDau
                                  ? "bg-gray-900 text-white"
                                  : slot.available
                                  ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {slot.gioBatDau}
                              {!slot.available && (
                                <div className="text-xs">Hết</div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={booking.ghiChu}
                      onChange={(e) =>
                        setBooking({ ...booking, ghiChu: e.target.value })
                      }
                      placeholder="Thêm yêu cầu đặc biệt..."
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Xác Nhận Đặt Lịch
                  </h2>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ngày hẹn:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(booking.ngayHen).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giờ hẹn:</span>
                      <span className="font-medium text-gray-900">
                        {booking.gioBatDau}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số thú cưng:</span>
                      <span className="font-medium text-gray-900">
                        {pets.length}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">
                      Chi tiết dịch vụ:
                    </h3>
                    <div className="space-y-3">
                      {pets.map((pet) => {
                        const petType = petTypes.find(
                          (t) => t.maLoai === parseInt(pet.maLoai)
                        );
                        return (
                          <div
                            key={pet.id}
                            className="bg-blue-50 rounded-lg p-4"
                          >
                            <p className="font-medium text-gray-900 mb-2">
                              {pet.ten} ({petType?.tenLoai})
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {pet.dichVuIds.map((serviceId) => {
                                const service = availableServices.find(
                                  (s) => s.maDichVuShop === serviceId
                                );
                                return service ? (
                                  <li
                                    key={serviceId}
                                    className="flex justify-between"
                                  >
                                    <span>• {service.tenDichVu}</span>
                                    <span className="font-medium">
                                      {parseInt(service.gia).toLocaleString(
                                        "vi-VN"
                                      )}
                                      đ
                                    </span>
                                  </li>
                                ) : null;
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50"
                  >
                    ← Quay Lại
                  </button>
                )}
                <button
                  onClick={() => {
                    if (currentStep === 1 && pets.length === 0) {
                      setError("Vui lòng thêm ít nhất 1 thú cưng");
                      return;
                    }
                    if (
                      currentStep === 2 &&
                      (!booking.ngayHen || !booking.gioBatDau)
                    ) {
                      setError("Vui lòng chọn ngày và giờ");
                      return;
                    }
                    if (currentStep < 3) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      handleSubmit();
                    }
                  }}
                  disabled={loading || (currentStep === 1 && !selectedShop)}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Đang xử lý..."
                    : currentStep === 3
                    ? "Xác Nhận Đặt Lịch"
                    : "Tiếp Theo →"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                📋 Tóm Tắt
              </h3>

              <div className="space-y-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cửa hàng:</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%]">
                    {selectedShop?.tenCuaHang || "---"}
                  </span>
                </div>
                {booking.ngayHen && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày hẹn:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(booking.ngayHen).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}
                {booking.gioBatDau && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giờ hẹn:</span>
                    <span className="font-medium text-gray-900">
                      {booking.gioBatDau}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thú cưng:</span>
                  <span className="font-medium text-gray-900">
                    {pets.length} con
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {calculateTotal().toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <p className="text-xs text-gray-500">Bao gồm tất cả dịch vụ</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm">
                    💡 Lưu ý
                  </h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>✓ Đến đúng giờ hẹn</li>
                    <li>✓ Mang theo sổ tiêm chủng</li>
                    <li>✓ Có thể hủy trước 24h</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Selector Modal */}
      {shopModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chọn Cửa Hàng
                </h2>
                <button
                  onClick={() => setShopModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm cửa hàng, địa chỉ..."
                  value={shopSearchTerm}
                  onChange={(e) => setShopSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  🔍
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredShops.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-600">Không tìm thấy cửa hàng nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredShops.map((shop) => (
                    <button
                      key={shop.maCuaHang}
                      onClick={() => handleShopSelect(shop)}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-gray-900 hover:shadow-lg transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {shop.anhCuaHang ? (
                            <img
                              src={`http://localhost:5000${shop.anhCuaHang}`}
                              alt={shop.tenCuaHang}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              🏪
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                            {shop.tenCuaHang}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            📍 {shop.diaChi}
                          </p>
                          <p className="text-sm text-gray-600">
                            📞 {shop.soDienThoai}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
