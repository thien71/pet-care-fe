import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Data states
  const [shops, setShops] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [servicesByPetType, setServicesByPetType] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    maCuaHang: "",
    ngayHen: "",
    gioBatDau: "",
    ghiChu: "",
    pets: [],
  });

  const [currentPet, setCurrentPet] = useState({
    ten: "",
    maLoai: "",
    tuoi: "",
    dacDiem: "",
    dichVuIds: [],
  });

  const [formErrors, setFormErrors] = useState({});

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load services when shop or pet type changes
  useEffect(() => {
    if (currentPet.maLoai && formData.maCuaHang) {
      loadServicesByPetType();
    }
  }, [currentPet.maLoai, formData.maCuaHang]);

  // Load available time slots when date is selected
  useEffect(() => {
    if (formData.ngayHen && formData.maCuaHang) {
      loadAvailableTimeSlots();
    }
  }, [formData.ngayHen, formData.maCuaHang]);

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
      setError("Lỗi tải dữ liệu cửa hàng. Vui lòng thử lại.");
      console.error("Error loading initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadServicesByPetType = async () => {
    try {
      const res = await apiClient.get(
        `/booking/shop/${formData.maCuaHang}/services/pet-type/${currentPet.maLoai}`
      );
      setServicesByPetType(res.data?.data || []);
    } catch (err) {
      console.error("Error loading services:", err);
      setServicesByPetType([]);
    }
  };

  const loadAvailableTimeSlots = async () => {};

  // ==================== VALIDATION ====================

  const validateField = (name, value) => {
    const newErrors = { ...formErrors };

    switch (name) {
      case "maCuaHang":
        if (!value) {
          newErrors.maCuaHang = "Vui lòng chọn cửa hàng";
        } else {
          delete newErrors.maCuaHang;
        }
        break;

      case "ngayHen":
        if (!value) {
          newErrors.ngayHen = "Vui lòng chọn ngày";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            newErrors.ngayHen = "Không thể chọn ngày trong quá khứ";
          } else {
            delete newErrors.ngayHen;
          }
        }
        break;

      case "gioBatDau":
        if (!value) {
          newErrors.gioBatDau = "Vui lòng chọn giờ";
        } else {
          delete newErrors.gioBatDau;
        }
        break;

      case "ten":
        if (!value.trim()) {
          newErrors.ten = "Tên thú cưng không được để trống";
        } else {
          delete newErrors.ten;
        }
        break;

      case "maLoai":
        if (!value) {
          newErrors.maLoai = "Vui lòng chọn loài thú cưng";
        } else {
          delete newErrors.maLoai;
        }
        break;

      default:
        break;
    }

    setFormErrors(newErrors);
  };

  const handleShopChange = (shopId) => {
    setFormData({
      ...formData,
      maCuaHang: shopId,
      ngayHen: "",
      gioBatDau: "",
    });
    const shop = shops.find((s) => s.maCuaHang === parseInt(shopId));
    setSelectedShop(shop);
    setAvailableTimeSlots([]);
    validateField("maCuaHang", shopId);
  };

  const handleAddPet = () => {
    const petErrors = {};

    if (!currentPet.ten.trim()) petErrors.ten = "Tên không được để trống";
    if (!currentPet.maLoai) petErrors.maLoai = "Vui lòng chọn loài";
    if (currentPet.dichVuIds.length === 0) {
      petErrors.service = "Vui lòng chọn ít nhất 1 dịch vụ";
    }

    if (Object.keys(petErrors).length > 0) {
      setFormErrors(petErrors);
      return;
    }

    setFormData({
      ...formData,
      pets: [...formData.pets, { ...currentPet }],
    });

    setCurrentPet({
      ten: "",
      maLoai: "",
      tuoi: "",
      dacDiem: "",
      dichVuIds: [],
    });
    setFormErrors({});
  };

  const handleRemovePet = (index) => {
    const newPets = formData.pets.filter((_, i) => i !== index);
    setFormData({ ...formData, pets: newPets });
  };

  const handleServiceToggle = (serviceId) => {
    const newIds = currentPet.dichVuIds.includes(serviceId)
      ? currentPet.dichVuIds.filter((id) => id !== serviceId)
      : [...currentPet.dichVuIds, serviceId];

    setCurrentPet({ ...currentPet, dichVuIds: newIds });
  };

  const calculateTotalPrice = () => {
    let total = 0;
    formData.pets.forEach((pet) => {
      pet.dichVuIds.forEach((serviceId) => {
        const service = servicesByPetType.find(
          (s) => s.maDichVuShop === serviceId
        );
        if (service) total += parseFloat(service.gia);
      });
    });
    return total;
  };

  const handleSubmit = async () => {
    const errors = {};

    if (!formData.maCuaHang) errors.maCuaHang = "Chọn cửa hàng";
    if (!formData.ngayHen) errors.ngayHen = "Chọn ngày";
    if (!formData.gioBatDau) errors.gioBatDau = "Chọn giờ";
    if (formData.pets.length === 0) errors.pets = "Thêm ít nhất 1 thú cưng";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        ngayHen: new Date(formData.ngayHen).toISOString(),
      };

      await apiClient.post("/booking/create", payload);

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/customer/history";
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Đặt lịch thất bại. Vui lòng thử lại."
      );
      console.error("Error submitting booking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && shops.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">✓</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Đặt lịch thành công
            </h2>
            <p className="text-slate-600 mb-6">
              Cửa hàng sẽ xác nhận đơn của bạn trong ít phút
            </p>
            <div className="text-sm text-slate-500">Đang chuyển hướng...</div>
          </div>
        </div>
      </div>
    );
  }

  const selectedShopData = shops.find(
    (s) => s.maCuaHang === parseInt(formData.maCuaHang)
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">PC</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Đặt Lịch Dịch Vụ
              </h1>
              <p className="text-slate-600">
                Chăm sóc thú cưng của bạn một cách chuyên nghiệp
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    step >= s
                      ? "bg-slate-900 text-white"
                      : "bg-slate-300 text-slate-600"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`hidden sm:block text-sm font-medium ${
                    step >= s ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {s === 1
                    ? "Cửa Hàng & Giờ"
                    : s === 2
                    ? "Thú Cưng"
                    : "Xác Nhận"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <div className="text-red-600 font-bold text-lg">!</div>
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* STEP 1: Shop Selection & Time */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                      Chọn Cửa Hàng
                    </h2>

                    {shops.length === 0 ? (
                      <p className="text-slate-600">Không có cửa hàng nào</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {shops.map((shop) => (
                          <button
                            key={shop.maCuaHang}
                            onClick={() => handleShopChange(shop.maCuaHang)}
                            className={`text-left rounded-lg overflow-hidden transition-all border-2 ${
                              formData.maCuaHang === shop.maCuaHang
                                ? "border-slate-900 shadow-lg"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="aspect-video bg-slate-200 overflow-hidden">
                              {shop.anhCuaHang ? (
                                <img
                                  src={`http://localhost:5000${shop.anhCuaHang}`}
                                  alt={shop.tenCuaHang}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-200 to-slate-300">
                                  <span className="text-3xl">🏪</span>
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-slate-900 mb-1">
                                {shop.tenCuaHang}
                              </h3>
                              <p className="text-xs text-slate-600 mb-2">
                                {shop.diaChi}
                              </p>
                              <p className="text-sm font-medium text-slate-900">
                                {shop.soDienThoai}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {formErrors.maCuaHang && (
                      <p className="mt-2 text-sm text-red-600">
                        {formErrors.maCuaHang}
                      </p>
                    )}
                  </div>

                  {/* Date & Time Selection */}
                  {formData.maCuaHang && (
                    <>
                      <div className="border-t border-slate-200 pt-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                          Chọn Ngày & Giờ
                        </h2>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Ngày hẹn
                          </label>
                          <input
                            type="date"
                            value={formData.ngayHen}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                ngayHen: e.target.value,
                                gioBatDau: "",
                              });
                              validateField("ngayHen", e.target.value);
                              setAvailableTimeSlots([]);
                            }}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                          {formErrors.ngayHen && (
                            <p className="mt-2 text-sm text-red-600">
                              {formErrors.ngayHen}
                            </p>
                          )}
                        </div>

                        {formData.ngayHen && (
                          <div>
                            <label className="block text-sm font-medium text-slate-900 mb-3">
                              Khung giờ
                            </label>
                            {availableTimeSlots.length === 0 ? (
                              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                                Đang tải khung giờ...
                              </p>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {availableTimeSlots.map((slot) => (
                                  <button
                                    key={slot.gioBatDau}
                                    onClick={() => {
                                      setFormData({
                                        ...formData,
                                        gioBatDau: slot.gioBatDau,
                                      });
                                      validateField(
                                        "gioBatDau",
                                        slot.gioBatDau
                                      );
                                    }}
                                    disabled={!slot.available}
                                    className={`py-3 px-3 rounded-lg font-medium text-sm transition-colors ${
                                      formData.gioBatDau === slot.gioBatDau
                                        ? "bg-slate-900 text-white"
                                        : slot.available
                                        ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
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
                            {formErrors.gioBatDau && (
                              <p className="mt-2 text-sm text-red-600">
                                {formErrors.gioBatDau}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-200 pt-6">
                        <label className="block text-sm font-medium text-slate-900 mb-2">
                          Ghi chú (tùy chọn)
                        </label>
                        <textarea
                          value={formData.ghiChu}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ghiChu: e.target.value,
                            })
                          }
                          placeholder="Thêm yêu cầu đặc biệt (ví dụ: thú cưng sợ nước)..."
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                          rows="3"
                        />
                      </div>
                    </>
                  )}

                  {/* Action Button */}
                  <div className="flex gap-3 pt-6 border-t border-slate-200">
                    <button
                      onClick={() => window.history.back()}
                      className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      disabled={
                        !formData.maCuaHang ||
                        !formData.ngayHen ||
                        !formData.gioBatDau
                      }
                      className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Tiếp Theo
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Pet Information */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                      Thông Tin Thú Cưng
                    </h2>

                    <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Tên thú cưng *
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Milu, Kitty..."
                            value={currentPet.ten}
                            onChange={(e) => {
                              setCurrentPet({
                                ...currentPet,
                                ten: e.target.value,
                              });
                              validateField("ten", e.target.value);
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                              formErrors.ten
                                ? "border-red-500"
                                : "border-slate-200"
                            }`}
                          />
                          {formErrors.ten && (
                            <p className="mt-1 text-xs text-red-600">
                              {formErrors.ten}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Loài *
                          </label>
                          <select
                            value={currentPet.maLoai}
                            onChange={(e) => {
                              setCurrentPet({
                                ...currentPet,
                                maLoai: e.target.value,
                                dichVuIds: [],
                              });
                              validateField("maLoai", e.target.value);
                              setServicesByPetType([]);
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                              formErrors.maLoai
                                ? "border-red-500"
                                : "border-slate-200"
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
                            <p className="mt-1 text-xs text-red-600">
                              {formErrors.maLoai}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Tuổi (năm)
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
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Đặc điểm
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Hiền lành, sợ nước..."
                            value={currentPet.dacDiem}
                            onChange={(e) =>
                              setCurrentPet({
                                ...currentPet,
                                dacDiem: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services Selection */}
                  {currentPet.maLoai && servicesByPetType.length > 0 && (
                    <div className="border-t border-slate-200 pt-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-4">
                        Chọn Dịch Vụ
                      </h2>

                      <div className="space-y-3">
                        {servicesByPetType.map((service) => (
                          <label
                            key={service.maDichVuShop}
                            className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              currentPet.dichVuIds.includes(
                                service.maDichVuShop
                              )
                                ? "border-slate-900 bg-slate-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={currentPet.dichVuIds.includes(
                                  service.maDichVuShop
                                )}
                                onChange={() =>
                                  handleServiceToggle(service.maDichVuShop)
                                }
                                className="mt-1 w-5 h-5 accent-slate-900"
                              />
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-900">
                                  {service.tenDichVu}
                                </h4>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                  <span>
                                    {parseInt(service.gia).toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ
                                  </span>
                                  {service.thoiLuong && (
                                    <span>{service.thoiLuong} phút</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>

                      {formErrors.service && (
                        <p className="mt-3 text-sm text-red-600">
                          {formErrors.service}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleAddPet}
                    className="w-full py-3 px-4 bg-slate-100 text-slate-900 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    + Thêm Thú Cưng
                  </button>

                  {/* Added Pets List */}
                  {formData.pets.length > 0 && (
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="font-bold text-slate-900 mb-4">
                        Danh Sách Thú Cưng ({formData.pets.length})
                      </h3>

                      <div className="space-y-2">
                        {formData.pets.map((pet, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-slate-50 p-4 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-slate-900">
                                {pet.ten}
                              </p>
                              <p className="text-xs text-slate-600">
                                {
                                  petTypes.find(
                                    (p) => p.maLoai === parseInt(pet.maLoai)
                                  )?.tenLoai
                                }
                                {pet.tuoi && ` • ${pet.tuoi} tuổi`}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemovePet(idx)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-slate-200">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                      Quay Lại
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={formData.pets.length === 0}
                      className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Tiếp Theo
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Xác Nhận Đặt Lịch
                  </h2>

                  {/* Shop Info */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-slate-200">
                      {selectedShopData?.anhCuaHang ? (
                        <img
                          src={`http://localhost:5000${selectedShopData.anhCuaHang}`}
                          alt={selectedShopData?.tenCuaHang}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-200 to-slate-300">
                          <span className="text-6xl">🏪</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {selectedShopData?.tenCuaHang}
                      </h3>
                      <p className="text-slate-600 mb-4">
                        {selectedShopData?.diaChi}
                      </p>
                      <p className="text-slate-900 font-medium">
                        {selectedShopData?.soDienThoai}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ngày hẹn</span>
                      <span className="font-medium text-slate-900">
                        {new Date(formData.ngayHen).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Giờ hẹn</span>
                      <span className="font-medium text-slate-900">
                        {formData.gioBatDau}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Số thú cưng</span>
                      <span className="font-medium text-slate-900">
                        {formData.pets.length}
                      </span>
                    </div>
                  </div>

                  {/* Pets Summary */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">
                      Thú Cưng & Dịch Vụ
                    </h4>
                    <div className="space-y-3">
                      {formData.pets.map((pet, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-lg p-4">
                          <p className="font-medium text-slate-900 mb-2">
                            {pet.ten}
                          </p>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {pet.dichVuIds.map((serviceId) => {
                              const service = servicesByPetType.find(
                                (s) => s.maDichVuShop === serviceId
                              );
                              return (
                                <li key={serviceId}>
                                  • {service?.tenDichVu} (
                                  {parseInt(service?.gia).toLocaleString(
                                    "vi-VN"
                                  )}
                                  đ)
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-slate-200">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                      Quay Lại
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Đang xử lý..." : "Xác Nhận Đặt Lịch"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Tóm Tắt</h3>

              <div className="space-y-4 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Cửa hàng</span>
                  <span className="font-medium text-slate-900">
                    {selectedShopData?.tenCuaHang || "---"}
                  </span>
                </div>

                {formData.ngayHen && (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>Ngày hẹn</span>
                      <span className="font-medium text-slate-900">
                        {new Date(formData.ngayHen).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    {formData.gioBatDau && (
                      <div className="flex justify-between text-slate-600">
                        <span>Giờ hẹn</span>
                        <span className="font-medium text-slate-900">
                          {formData.gioBatDau}
                        </span>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Thú cưng</span>
                  <span className="font-medium text-slate-900">
                    {formData.pets.length} con
                  </span>
                </div>
              </div>

              <div className="pt-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-slate-600">Tổng tiền</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {calculateTotalPrice().toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <p className="text-xs text-slate-500">Bao gồm tất cả dịch vụ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
