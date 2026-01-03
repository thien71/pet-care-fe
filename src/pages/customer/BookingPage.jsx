// src/pages/customer/BookingPage.jsx - FIXED & IMPROVED LAYOUT
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { IoIosArrowBack } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import {
  FaCheckCircle,
  FaClipboardList,
  FaEdit,
  FaExchangeAlt,
  FaLightbulb,
  FaMapMarkerAlt,
  FaPaw,
  FaPhoneAlt,
  FaPlus,
  FaSave,
  FaSearch,
  FaStore,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ⭐ Lấy pre-fill data từ navigate state
  const preselectedShopId = location.state?.preselectedShop;
  const preselectedServiceId = location.state?.preselectedServiceId;
  const preselectedServiceName = location.state?.preselectedServiceName;

  // UI States
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Modal States
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [shopSearchTerm, setShopSearchTerm] = useState("");

  // ⭐ Edit Mode State
  const [editingPetId, setEditingPetId] = useState(null);

  // Data States
  const [shops, setShops] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [servicesCache, setServicesCache] = useState({}); // ⭐ LƯU TẤT CẢ SERVICES ĐÃ LOAD

  // Form States
  const [selectedShop, setSelectedShop] = useState(null);
  const [pets, setPets] = useState([]);
  const [currentPet, setCurrentPet] = useState({
    ten: "",
    maLoai: "",
    tuoi: 1,
    dacDiem: "",
    dichVuIds: [],
  });
  const [booking, setBooking] = useState({
    ngayHen: "",
    gioBatDau: "",
    ghiChu: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // ⭐ SMART PET TYPE DETECTION - FIXED
  const detectPetTypeFromService = (serviceName, petTypesArray) => {
    if (!serviceName || !petTypesArray || petTypesArray.length === 0)
      return null;

    const lowerName = serviceName.toLowerCase();

    // Mapping keywords
    const petTypeKeywords = {
      chó: ["chó", "cún", "dog"],
      mèo: ["mèo", "cat", "kitty"],
      chim: ["chim", "bird"],
      hamster: ["hamster", "chuột"],
      thỏ: ["thỏ", "rabbit"],
      rùa: ["rùa", "tortoise", "turtle"],
    };

    for (const [petTypeName, keywords] of Object.entries(petTypeKeywords)) {
      if (keywords.some((keyword) => lowerName.includes(keyword))) {
        const petType = petTypesArray.find(
          (pt) => pt.tenLoai.toLowerCase() === petTypeName
        );
        if (petType) {
          console.log(
            "✅ Detected pet type:",
            petType.tenLoai,
            "for service:",
            serviceName
          );
          return petType.maLoai;
        }
      }
    }

    console.log("⚠️ Could not detect pet type from:", serviceName);
    return null;
  };

  // ==================== LOAD INITIAL DATA ====================
  useEffect(() => {
    loadInitialData();
  }, []);

  // ⭐ AUTO-SELECT SHOP FROM PRE-FILL
  useEffect(() => {
    if (preselectedShopId && shops.length > 0) {
      const shop = shops.find(
        (s) => s.maCuaHang === parseInt(preselectedShopId)
      );
      if (shop) {
        console.log("✅ Auto-selected shop:", shop.tenCuaHang);
        setSelectedShop(shop);
      }
    }
  }, [preselectedShopId, shops]);

  // ⭐ AUTO-DETECT PET TYPE - FIXED WITH PROPER DEPENDENCIES
  useEffect(() => {
    if (
      selectedShop &&
      petTypes.length > 0 &&
      preselectedServiceName &&
      !currentPet.maLoai
    ) {
      const detectedPetType = detectPetTypeFromService(
        preselectedServiceName,
        petTypes
      );

      if (detectedPetType) {
        console.log("✅ Setting pet type to:", detectedPetType);
        setCurrentPet((prev) => ({
          ...prev,
          maLoai: detectedPetType.toString(),
        }));
      } else {
        // Nếu không detect được, mặc định chọn loài đầu tiên
        console.log("⚠️ Using default pet type:", petTypes[0].tenLoai);
        setCurrentPet((prev) => ({
          ...prev,
          maLoai: petTypes[0].maLoai.toString(),
        }));
      }
    }
  }, [selectedShop, petTypes, preselectedServiceName]);

  // ⭐ LOAD SERVICES WHEN PET TYPE SELECTED
  useEffect(() => {
    if (currentPet.maLoai && selectedShop) {
      loadServicesByPetType();
    }
  }, [currentPet.maLoai, selectedShop]);

  // ⭐ AUTO-SELECT SERVICE AFTER SERVICES LOADED
  useEffect(() => {
    if (
      preselectedServiceId &&
      availableServices.length > 0 &&
      currentPet.dichVuIds.length === 0
    ) {
      const service = availableServices.find(
        (s) => s.maDichVuShop === parseInt(preselectedServiceId)
      );

      if (service) {
        console.log("✅ Auto-selected service:", service.tenDichVu);
        setCurrentPet((prev) => ({
          ...prev,
          dichVuIds: [service.maDichVuShop],
        }));
      }
    }
  }, [preselectedServiceId, availableServices]);

  // ==================== LOAD TIME SLOTS ====================
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
      console.log("✅ Loaded pet types:", petTypesRes.data);
    } catch (err) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      console.error("Load initial data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadServicesByPetType = async () => {
    try {
      console.log("📡 Loading services for pet type:", currentPet.maLoai);
      const res = await apiClient.get(
        `/booking/shop/${selectedShop.maCuaHang}/services/pet-type/${currentPet.maLoai}`
      );
      setAvailableServices(res.data || []);

      // ⭐ LƯU VÀO CACHE
      setServicesCache((prev) => {
        const newCache = { ...prev };
        (res.data || []).forEach((service) => {
          newCache[service.maDichVuShop] = service;
        });
        return newCache;
      });

      console.log("✅ Loaded services:", res.data);
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
    setPets([]);
    setCurrentPet({
      ten: "",
      maLoai: "",
      tuoi: 1,
      dacDiem: "",
      dichVuIds: [],
    });
    setBooking({
      ngayHen: "",
      gioBatDau: "",
      ghiChu: "",
    });
    setFormErrors({});
    setServicesCache({}); // ⭐ RESET CACHE KHI ĐỔI SHOP
  };

  const handleServiceToggle = (serviceId) => {
    setCurrentPet((prev) => ({
      ...prev,
      dichVuIds: prev.dichVuIds.includes(serviceId)
        ? prev.dichVuIds.filter((id) => id !== serviceId)
        : [...prev.dichVuIds, serviceId],
    }));
  };

  // ⭐ NEW: Edit Pet Handler
  const handleEditPet = (pet) => {
    setEditingPetId(pet.id);
    setCurrentPet({
      ten: pet.ten,
      maLoai: pet.maLoai,
      tuoi: pet.tuoi,
      dacDiem: pet.dacDiem,
      dichVuIds: pet.dichVuIds,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    if (editingPetId) {
      // ⭐ UPDATE existing pet
      setPets((prev) =>
        prev.map((p) =>
          p.id === editingPetId ? { ...currentPet, id: editingPetId } : p
        )
      );
      setEditingPetId(null);
    } else {
      // ADD new pet
      setPets((prev) => [...prev, { ...currentPet, id: Date.now() }]);
    }

    // ⭐ RESET FORM HOÀN TOÀN
    setCurrentPet({
      ten: "",
      maLoai: "",
      tuoi: 1,
      dacDiem: "",
      dichVuIds: [],
    });
    setFormErrors({});
  };

  // ⭐ NEW: Cancel Edit
  const handleCancelEdit = () => {
    setEditingPetId(null);
    setCurrentPet({
      ten: "",
      maLoai: "",
      tuoi: 1,
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
          const service = servicesCache[serviceId]; // ⭐ SỬ DỤNG CACHE
          return petTotal + (service ? parseFloat(service.gia) : 0);
        }, 0)
      );
    }, 0);
  };

  // ⭐ SORT SERVICES: Selected first
  const sortedServices = [...availableServices].sort((a, b) => {
    const aSelected = currentPet.dichVuIds.includes(a.maDichVuShop);
    const bSelected = currentPet.dichVuIds.includes(b.maDichVuShop);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-0 py-2">
          <div className="flex items-center justify-between">
            {/* Left: Back button + Title */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => navigate(-1)}
                className="text-2xl hover:bg-gray-100 w-16 h-10 rounded-full flex items-center justify-center shrink-0"
              >
                <IoIosArrowBack />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Đặt Dịch Vụ</h1>
              </div>
            </div>

            {/* Center: Progress Steps */}
            <div className="flex items-center gap-3">
              {steps.map((step, idx) => (
                <div key={step.num} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        currentStep >= step.num
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step.num}
                    </div>
                    <span
                      className={`hidden md:block text-sm font-medium ${
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
                      className={`w-8 md:w-12 h-0.5 mx-2 ${
                        currentStep > step.num ? "bg-gray-900" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right: Dummy để cân bằng (invisible, width bằng left) */}
            <div className="shrink-0 opacity-0 pointer-events-none flex items-center gap-4">
              <div className="w-16 h-10"></div>
              <div>
                <h1 className="text-lg font-bold">Đặt Dịch Vụ</h1>
              </div>
            </div>
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

      {/* ⭐ NEW GRID: 0.8 - 2.4 - 0.8 */}
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* LEFT: Shop Info (0.8 part) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24 transition-shadow hover:shadow-xl">
              {!selectedShop ? (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaStore className="text-xl text-gray-700" />
                    Chọn Cửa Hàng
                  </h3>
                  <button
                    onClick={() => setShopModalOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                  >
                    + Chọn cửa hàng
                  </button>
                </div>
              ) : (
                <>
                  {selectedShop.anhCuaHang && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={`http://localhost:5000${selectedShop.anhCuaHang}`}
                        alt={selectedShop.tenCuaHang}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                      <span className="line-clamp-2">
                        {selectedShop.tenCuaHang}
                      </span>
                      <button
                        onClick={() => setShopModalOpen(true)}
                        className="flex items-center gap-1 px-5 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium text-sm hover:bg-blue-200 hover:text-blue-800 transition-all duration-200 shrink-0 cursor-pointer"
                      >
                        <FaExchangeAlt className="text-sm" />
                        <span>Đổi</span>
                      </button>
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p className="flex items-start gap-3">
                        <FaMapMarkerAlt className="shrink-0 text-red-400 mt-1 text-base" />
                        <span className="line-clamp-2">
                          {selectedShop.diaChi}
                        </span>
                      </p>
                      <p className="flex items-center gap-3">
                        <FaPhoneAlt className="text-green-600 text-base" />
                        <span>{selectedShop.soDienThoai}</span>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ⭐ MIDDLE: Form (2.4 parts - 3 COLUMNS) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              {/* STEP 1: 3 COLUMN LAYOUT */}
              {currentStep === 1 && (
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingPetId
                      ? "✏️ Chỉnh Sửa Thú Cưng"
                      : "Thông Tin Thú Cưng & Dịch Vụ"}
                  </h2>

                  {!selectedShop ? (
                    <div className="text-center py-12 text-gray-500">
                      Vui lòng chọn cửa hàng trước
                    </div>
                  ) : (
                    <>
                      {editingPetId && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-1 flex items-center justify-between">
                          <p className="text-sm text-yellow-800">
                            ✏️ Đang chỉnh sửa thú cưng. Cập nhật thông tin và
                            bấm "Cập Nhật".
                          </p>
                          <button
                            onClick={handleCancelEdit}
                            className="text-sm text-yellow-700 hover:underline font-medium cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      )}

                      {/* ⭐ 3 COLUMN LAYOUT */}
                      <div className="bg-gray-50 rounded-lg pt-4 pb-0">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 h-96">
                          {/* COLUMN 1: Pet Info */}
                          <div className="space-y-3 overflow-y-auto">
                            <h3 className="font-bold text-gray-900 text-sm mb-3">
                              🐾 Thông Tin Thú Cưng
                            </h3>

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
                                <option value="">-- Chọn loài --</option>
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
                                autoFocus
                              />
                              {formErrors.ten && (
                                <p className="text-xs text-red-600 mt-1">
                                  {formErrors.ten}
                                </p>
                              )}
                            </div>

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
                              <textarea
                                placeholder="Màu sắc, đặc điểm nhận dạng..."
                                value={currentPet.dacDiem}
                                onChange={(e) =>
                                  setCurrentPet({
                                    ...currentPet,
                                    dacDiem: e.target.value,
                                  })
                                }
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none"
                              />
                            </div>
                          </div>

                          {/* COLUMN 2: Services */}
                          <div className="space-y-3 overflow-y-auto pr-2">
                            <h3 className="font-bold text-gray-900 text-sm mb-3">
                              ✨ Chọn Dịch Vụ *
                            </h3>

                            {!currentPet.maLoai ? (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                <p className="text-sm text-yellow-800">
                                  Vui lòng chọn loài thú cưng trước
                                </p>
                              </div>
                            ) : availableServices.length === 0 ? (
                              <div className="text-center py-8">
                                <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                  Đang tải...
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2 max-h-96">
                                {sortedServices.map((service) => {
                                  const isSelected =
                                    currentPet.dichVuIds.includes(
                                      service.maDichVuShop
                                    );
                                  return (
                                    <label
                                      key={service.maDichVuShop}
                                      className={`flex items-start gap-3 p-2 border rounded-lg cursor-pointer transition-all ${
                                        isSelected
                                          ? "border-gray-900 bg-gray-900 text-white shadow-md"
                                          : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() =>
                                          handleServiceToggle(
                                            service.maDichVuShop
                                          )
                                        }
                                        className="w-5 h-5 mt-0.5 accent-gray-900"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p
                                          className={`font-medium mb-1 ${
                                            isSelected
                                              ? "text-white"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {isSelected && "📌 "}
                                          {service.tenDichVu}
                                        </p>
                                        <p
                                          className={`text-sm ${
                                            isSelected
                                              ? "text-gray-200"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          💰{" "}
                                          {parseInt(service.gia).toLocaleString(
                                            "vi-VN"
                                          )}
                                          đ
                                          {service.thoiLuong &&
                                            ` • ⏱️ ${service.thoiLuong}p`}
                                        </p>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                            {formErrors.services && (
                              <p className="text-xs text-red-600 mt-2">
                                {formErrors.services}
                              </p>
                            )}
                          </div>

                          {/* ⭐ COLUMN 3: Pet List */}
                          <div className="space-y-3 overflow-y-auto">
                            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                              <FaClipboardList className="text-blue-600 text-lg" />
                              Danh Sách ({pets.length})
                            </h3>
                            {pets.length === 0 ? (
                              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 text-center">
                                <p className="text-sm text-gray-500">
                                  Chưa có thú cưng nào
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                {pets.map((pet) => {
                                  const petType = petTypes.find(
                                    (t) => t.maLoai === parseInt(pet.maLoai)
                                  );
                                  const isEditing = editingPetId === pet.id;
                                  return (
                                    <div
                                      key={pet.id}
                                      className={`border rounded-lg p-2 transition-all shadow-sm hover:shadow-md ${
                                        isEditing
                                          ? "border-yellow-400 bg-yellow-50"
                                          : "border-blue-200 bg-blue-50"
                                      }`}
                                    >
                                      <div className="mb-3">
                                        <div className="flex items-center justify-between mb-1">
                                          <p className="font-medium text-gray-900 text-base flex items-center gap-2">
                                            <FaPaw className="text-blue-600" />
                                            {pet.ten}
                                          </p>
                                          <button
                                            onClick={() => handleEditPet(pet)}
                                            className="p-1 rounded-lg hover:bg-gray-100 text-blue-600 hover:text-blue-800 transition-colors"
                                          >
                                            <FaEdit className="text-base" />
                                          </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <p className="text-sm text-gray-600">
                                            {petType?.tenLoai}
                                            {pet.tuoi && ` • ${pet.tuoi} tuổi`}
                                          </p>
                                          <button
                                            onClick={() =>
                                              handleRemovePet(pet.id)
                                            }
                                            className="p-1 rounded-lg hover:bg-gray-100 text-red-600 hover:text-red-800 transition-colors"
                                          >
                                            <FaTrash className="text-base" />
                                          </button>
                                        </div>
                                      </div>
                                      <ul className="text-sm text-gray-700 space-y-1">
                                        {pet.dichVuIds.map((serviceId) => {
                                          const service =
                                            servicesCache[serviceId]; // ⭐ SỬ DỤNG CACHE
                                          return service ? (
                                            <li
                                              key={serviceId}
                                              className="line-clamp-1 flex items-center gap-1"
                                            >
                                              <FaCheckCircle className="text-green-500 text-xs" />
                                              {service.tenDichVu}
                                            </li>
                                          ) : null;
                                        })}
                                      </ul>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Add/Update Button */}
                        <div className="w-full bg-white pt-2 flex justify-center border-t-3 border-gray-200">
                          <button
                            onClick={handleAddPet}
                            className="flex items-center gap-2 px-6 py-2 bg-[#8e2800] text-white rounded-lg text-sm font-medium hover:bg-[#6d1e00] transition-colors"
                          >
                            {editingPetId ? (
                              <>
                                <FaSave />
                                <span>Cập Nhật Thú Cưng</span>
                              </>
                            ) : (
                              <>
                                <FaPlus />
                                <span>Thêm Thú Cưng</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
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
                                const service = servicesCache[serviceId]; // ⭐ SỬ DỤNG CACHE
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
              <div className="flex gap-3 mt-2 pt-2 border-t border-gray-200">
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
                  className="flex-1 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Đang xử lý..."
                    : currentStep === 3
                    ? "Xác nhận đặt lịch"
                    : "Tiếp theo →"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Summary (0.8 part) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                📋 Tóm Tắt
              </h3>

              <div className="space-y-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cửa hàng:</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%] line-clamp-2">
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
                    <p className="flex items-center gap-2">
                      <FaLightbulb className="text-yellow-400 text-lg" />
                      <span>Lưu ý</span>
                    </p>
                  </h4>

                  <ul className="text-xs text-gray-700 space-y-1">
                    <li className="flex items-center gap-1">
                      <TiTick className="text-green-600 text-xl" />
                      <span>Đến đúng giờ hẹn</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <TiTick className="text-green-600 text-xl" />
                      <span>Đặt lịch miễn phí</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <TiTick className="text-green-600 text-xl" />
                      <span>Có thể hủy trước 24h</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Selector Modal */}
      {shopModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShopModalOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chọn Cửa Hàng
                </h2>
                <button
                  onClick={() => setShopModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm cửa hàng, địa chỉ..."
                  value={shopSearchTerm}
                  onChange={(e) => setShopSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 bg-white transition-colors"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {filteredShops.length === 0 ? (
                <div className="text-center py-12">
                  <FaSearch className="text-6xl mb-4 text-gray-400" />
                  <p className="text-gray-600 font-medium">
                    Không tìm thấy cửa hàng nào
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredShops.map((shop) => (
                    <button
                      key={shop.maCuaHang}
                      onClick={() => handleShopSelect(shop)}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-gray-900 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {shop.anhCuaHang ? (
                            <img
                              src={`http://localhost:5000${shop.anhCuaHang}`}
                              alt={shop.tenCuaHang}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                              <FaStore />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                            {shop.tenCuaHang}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex items-start gap-2">
                            <FaMapMarkerAlt className="text-red-400 mt-0.5" />
                            {shop.diaChi}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaPhoneAlt className="text-green-600" />
                            {shop.soDienThoai}
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
