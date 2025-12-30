// src/pages/customer/BookingPage.jsx - IMPROVED VERSION
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient";

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ⭐ Lấy thông tin preselected từ navigation state
  const preselectedShop = location.state?.preselectedShop;
  const preselectedService = location.state?.preselectedService;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Data states
  const [shops, setShops] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [services, setServices] = useState([]);

  // Form states
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    maCuaHang: preselectedShop || "",
    ngayHen: "",
    ghiChu: "",
    pets: [],
  });

  const [currentPet, setCurrentPet] = useState({
    ten: "",
    maLoai: "",
    tuoi: "",
    dacDiem: "",
    dichVuIds: preselectedService ? [parseInt(preselectedService)] : [],
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  // ⭐ Load services khi đã chọn shop và loại thú
  useEffect(() => {
    if (currentPet.maLoai && formData.maCuaHang) {
      loadServices();
    }
  }, [currentPet.maLoai, formData.maCuaHang]);

  // ⭐ Nếu có preselected service, auto-load services khi chọn loại thú
  useEffect(() => {
    if (preselectedService && currentPet.maLoai && formData.maCuaHang) {
      loadServices();
    }
  }, [preselectedService, currentPet.maLoai]);

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const res = await apiClient.get(
        `/booking/shop/${formData.maCuaHang}/services/pet-type/${currentPet.maLoai}`
      );
      setServices(res.data || []);
    } catch (err) {
      setError("Không thể tải dịch vụ: " + err.message);
    }
  };

  const handleAddPet = () => {
    if (
      !currentPet.ten ||
      !currentPet.maLoai ||
      currentPet.dichVuIds.length === 0
    ) {
      setError(
        "Vui lòng điền đầy đủ thông tin thú cưng và chọn ít nhất 1 dịch vụ"
      );
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
    setServices([]);
    setError("");
  };

  const loadServicesForEdit = async (petTypeId) => {
    try {
      const res = await apiClient.get(
        `/booking/shop/${formData.maCuaHang}/services/pet-type/${petTypeId}`
      );
      setServices(res.data || []);
    } catch (err) {
      console.log("Lỗi tải dịch vụ:", err.message);
    }
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
        const service = services.find((s) => s.maDichVuShop === serviceId);
        if (service) total += parseFloat(service.gia);
      });
    });
    return total;
  };

  const handleSubmit = async () => {
    if (
      !formData.maCuaHang ||
      !formData.ngayHen ||
      formData.pets.length === 0
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/booking/create", formData);
      setSuccess(true);
      setTimeout(() => navigate("/customer/history"), 2000);
    } catch (err) {
      setError(err.message || "Đặt lịch thất bại");
    } finally {
      setLoading(false);
    }
  };

  const selectedShop = shops.find(
    (s) => s.maCuaHang === parseInt(formData.maCuaHang)
  );

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-2xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="card-title text-success">Đặt lịch thành công!</h2>
            <p className="text-gray-600">
              Cửa hàng sẽ xác nhận trong ít phút...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">📅 Đặt Lịch Dịch Vụ</h1>
        <p className="text-gray-600">Chăm sóc thú cưng chuyên nghiệp</p>

        {/* ⭐ Hiển thị thông báo nếu có preselection */}
        {(preselectedShop || preselectedService) && (
          <div className="alert alert-info max-w-2xl mx-auto mt-4">
            <span>
              ✨ Bạn đang đặt lịch từ dịch vụ đã chọn. Vui lòng điền thông tin
              thú cưng để hoàn tất.
            </span>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button onClick={() => setError("")} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>
      )}

      {/* Steps */}
      <ul className="steps steps-horizontal w-full mb-8">
        <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
          Chọn Cửa Hàng
        </li>
        <li className={`step ${step >= 2 ? "step-primary" : ""}`}>
          Thông Tin Thú Cưng
        </li>
        <li className={`step ${step >= 3 ? "step-primary" : ""}`}>Xác Nhận</li>
      </ul>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* STEP 1: Chọn cửa hàng */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="card-title">🏪 Chọn Cửa Hàng & Thời Gian</h2>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Cửa Hàng *
                      </span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.maCuaHang}
                      onChange={(e) =>
                        setFormData({ ...formData, maCuaHang: e.target.value })
                      }
                      disabled={!!preselectedShop} // Disable nếu đã preselected
                    >
                      <option value="">-- Chọn cửa hàng --</option>
                      {shops.map((shop) => (
                        <option key={shop.maCuaHang} value={shop.maCuaHang}>
                          {shop.tenCuaHang} - {shop.diaChi}
                        </option>
                      ))}
                    </select>
                    {preselectedShop && (
                      <label className="label">
                        <span className="label-text-alt text-info">
                          ✨ Đã tự động chọn cửa hàng từ dịch vụ
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Ngày & Giờ Hẹn *
                      </span>
                    </label>
                    <input
                      type="datetime-local"
                      className="input input-bordered"
                      value={formData.ngayHen}
                      onChange={(e) =>
                        setFormData({ ...formData, ngayHen: e.target.value })
                      }
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Ghi Chú</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      placeholder="Yêu cầu đặc biệt..."
                      value={formData.ghiChu}
                      onChange={(e) =>
                        setFormData({ ...formData, ghiChu: e.target.value })
                      }
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="btn btn-primary w-full"
                    disabled={!formData.maCuaHang || !formData.ngayHen}
                  >
                    Tiếp Theo →
                  </button>
                </div>
              )}

              {/* STEP 2: Thông tin thú cưng */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="card-title">
                    🐾 Thông Tin Thú Cưng & Dịch Vụ
                  </h2>

                  {preselectedService && (
                    <div className="alert alert-info">
                      <span>
                        ✨ Dịch vụ đã được chọn sẵn. Bạn có thể thêm dịch vụ
                        khác nếu muốn.
                      </span>
                    </div>
                  )}

                  {/* Pet Form - GIỐNG NHƯ CŨ */}
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="font-bold mb-4">Thêm Thú Cưng</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Tên *</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Milu, Kitty..."
                            className="input input-bordered"
                            value={currentPet.ten}
                            onChange={(e) =>
                              setCurrentPet({
                                ...currentPet,
                                ten: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Loài *</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={currentPet.maLoai}
                            onChange={(e) => {
                              setCurrentPet({
                                ...currentPet,
                                maLoai: e.target.value,
                                dichVuIds: preselectedService
                                  ? [parseInt(preselectedService)]
                                  : [],
                              });
                              setServices([]);
                            }}
                          >
                            <option value="">-- Chọn loài --</option>
                            {petTypes.map((type) => (
                              <option key={type.maLoai} value={type.maLoai}>
                                {type.tenLoai}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Tuổi</span>
                          </label>
                          <input
                            type="number"
                            placeholder="VD: 2"
                            className="input input-bordered"
                            value={currentPet.tuoi}
                            onChange={(e) =>
                              setCurrentPet({
                                ...currentPet,
                                tuoi: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Đặc Điểm</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Hiền lành, sợ nước..."
                            className="input input-bordered"
                            value={currentPet.dacDiem}
                            onChange={(e) =>
                              setCurrentPet({
                                ...currentPet,
                                dacDiem: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Services Selection */}
                      {currentPet.maLoai && services.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Chọn Dịch Vụ *</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {services.map((service) => (
                              <label
                                key={service.maDichVuShop}
                                className={`card cursor-pointer transition-all ${
                                  currentPet.dichVuIds.includes(
                                    service.maDichVuShop
                                  )
                                    ? "bg-primary text-primary-content"
                                    : "bg-base-100"
                                }`}
                              >
                                <div className="card-body p-4">
                                  <div className="flex items-start gap-3">
                                    <input
                                      type="checkbox"
                                      className="checkbox checkbox-primary"
                                      checked={currentPet.dichVuIds.includes(
                                        service.maDichVuShop
                                      )}
                                      onChange={() =>
                                        handleServiceToggle(
                                          service.maDichVuShop
                                        )
                                      }
                                    />
                                    <div className="flex-1">
                                      <h5 className="font-bold">
                                        {service.tenDichVu}
                                      </h5>
                                      <p className="text-sm opacity-80">
                                        {service.moTa}
                                      </p>
                                      <p className="text-sm font-semibold mt-1">
                                        💰{" "}
                                        {parseInt(service.gia).toLocaleString(
                                          "vi-VN"
                                        )}
                                        đ
                                      </p>
                                      {service.thoiLuong && (
                                        <p className="text-xs mt-1">
                                          ⏱️ {service.thoiLuong} phút
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleAddPet}
                        className="btn btn-success mt-4"
                      >
                        ➕ Thêm Thú Cưng
                      </button>
                    </div>
                  </div>

                  {/* PHẦN CÒN LẠI GIỐNG Y NGUYÊN CODE CŨ - Added Pets List, Edit Modal, etc */}
                  {formData.pets.length > 0 && (
                    <div>
                      <h3 className="font-bold mb-3">
                        Danh Sách Thú Cưng ({formData.pets.length})
                      </h3>
                      <div className="space-y-2">
                        {formData.pets.map((pet, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-base-200 p-3 rounded"
                          >
                            <div className="flex-1">
                              <span className="font-semibold">{pet.ten}</span>
                              <span className="text-sm ml-2">
                                (
                                {
                                  petTypes.find(
                                    (p) => p.maLoai === parseInt(pet.maLoai)
                                  )?.tenLoai
                                }
                                )
                              </span>
                              <p className="text-xs text-gray-600 mt-1">
                                📋 {pet.dichVuIds.length} dịch vụ
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setCurrentPet({
                                    ...pet,
                                    petIndex: idx,
                                  });
                                  loadServicesForEdit(pet.maLoai);
                                  setShowEditModal(true);
                                }}
                                className="btn btn-sm btn-warning"
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                onClick={() => handleRemovePet(idx)}
                                className="btn btn-sm btn-error"
                              >
                                🗑️ Xóa
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Edit Modal - GIỐNG NHƯ CŨ */}
                  {showEditModal && currentPet?.petIndex !== undefined && (
                    <div className="modal modal-open">
                      <div className="modal-box w-11/12 max-w-md">
                        {/* ... code modal giống y nguyên ... */}
                        <h3 className="font-bold text-lg mb-4">
                          ✏️ Sửa Thú Cưng
                        </h3>
                        {/* Copy phần modal từ code cũ */}
                        <div className="modal-action mt-6">
                          <button
                            onClick={() => setShowEditModal(false)}
                            className="btn btn-ghost"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => {
                              const updatedPets = [...formData.pets];
                              updatedPets[currentPet.petIndex] = {
                                ten: currentPet.ten,
                                maLoai: currentPet.maLoai,
                                tuoi: currentPet.tuoi,
                                dacDiem: currentPet.dacDiem,
                                dichVuIds: currentPet.dichVuIds,
                              };
                              setFormData({ ...formData, pets: updatedPets });
                              setShowEditModal(false);
                            }}
                            className="btn btn-primary"
                          >
                            💾 Lưu
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="btn btn-ghost flex-1"
                    >
                      ← Quay Lại
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="btn btn-primary flex-1"
                      disabled={formData.pets.length === 0}
                    >
                      Tiếp Theo →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Xác nhận - GIỐNG Y NGUYÊN */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="card-title">✅ Xác Nhận Đặt Lịch</h2>
                  {/* ... code step 3 giống y nguyên ... */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="btn btn-ghost flex-1"
                    >
                      ← Quay Lại
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary flex-1"
                      disabled={loading}
                    >
                      {loading ? "Đang xử lý..." : "Xác Nhận Đặt Lịch"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Sidebar - GIỐNG NHƯ CŨ */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl sticky top-4">
            <div className="card-body">
              <h3 className="card-title">📋 Tóm Tắt</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cửa hàng:</span>
                  <span className="font-semibold">
                    {selectedShop?.tenCuaHang || "Chưa chọn"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thú cưng:</span>
                  <span className="font-semibold">{formData.pets.length}</span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Tổng:</span>
                  <span className="font-bold text-primary">
                    {calculateTotalPrice().toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
