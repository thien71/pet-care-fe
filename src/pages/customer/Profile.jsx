// src/pages/customer/Profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../api";
import CustomerSidebar from "../../components/customer/CustomerSidebar";
import { FaSave, FaCamera, FaEdit } from "react-icons/fa";
import { showToast } from "../../utils/toast";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: "",
    soDienThoai: "",
    diaChi: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        hoTen: user.hoTen || "",
        soDienThoai: user.soDienThoai || "",
        diaChi: user.diaChi || "",
        avatar: user.avatar || null,
      });
      setPreview(user.avatar);
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};

    if (!formData.hoTen.trim()) {
      newErrors.hoTen = "Vui lòng nhập họ tên";
    } else if (formData.hoTen.trim().length < 3) {
      newErrors.hoTen = "Họ tên phải có ít nhất 3 ký tự";
    }

    if (
      formData.soDienThoai &&
      !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.soDienThoai)
    ) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast.error("Vui lòng chọn file ảnh");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast.error("Ảnh không được vượt quá 5MB");
        return;
      }

      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    try {
      await userService.updateProfile(formData);
      showToast.success("Cập nhật thông tin thành công!");
      setEditing(false);
    } catch (err) {
      showToast.error(err.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  console.log("User", user);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      <CustomerSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Thông tin cá nhân
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý thông tin tài khoản của bạn
              </p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors"
              >
                <FaEdit />
                <span>Chỉnh sửa</span>
              </button>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#8e2800] flex items-center justify-center text-white text-4xl font-bold">
                          {user?.hoTen?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                    </div>

                    {editing && (
                      <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#8e2800] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6d1f00] transition-colors">
                        <FaCamera className="text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    {editing ? "Click để đổi ảnh" : "Ảnh đại diện"}
                  </p>
                </div>

                {/* Form Fields */}
                <div className="md:col-span-2 space-y-4">
                  {/* Email (readonly) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email không thể thay đổi
                    </p>
                  </div>

                  {/* Họ tên */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.hoTen}
                      onChange={(e) =>
                        setFormData({ ...formData, hoTen: e.target.value })
                      }
                      disabled={!editing}
                      className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                        editing
                          ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed"
                      } ${errors.hoTen ? "border-red-500" : ""}`}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.hoTen && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.hoTen}
                      </p>
                    )}
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.soDienThoai}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          soDienThoai: e.target.value,
                        })
                      }
                      disabled={!editing}
                      className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                        editing
                          ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed"
                      } ${errors.soDienThoai ? "border-red-500" : ""}`}
                      placeholder="0912345678"
                    />
                    {errors.soDienThoai && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.soDienThoai}
                      </p>
                    )}
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      value={formData.diaChi}
                      onChange={(e) =>
                        setFormData({ ...formData, diaChi: e.target.value })
                      }
                      disabled={!editing}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg transition-colors resize-none ${
                        editing
                          ? "border-gray-300 focus:border-[#8e2800] focus:ring-1 focus:ring-[#8e2800]"
                          : "border-gray-200 bg-gray-50 cursor-not-allowed"
                      }`}
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setErrors({});
                    }}
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-[#8e2800] text-white rounded-lg hover:bg-[#6d1f00] transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Ngày tham gia</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {user?.ngayTao
                  ? user.ngayTao
                  : // ? new Date(user.ngayTao).toLocaleDateString("vi-VN")
                    "N/A"}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Trạng thái tài khoản</p>
              <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Hoạt động
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Email đã xác thực</p>
              <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {user?.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
