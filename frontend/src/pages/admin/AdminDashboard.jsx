import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    window.location.href = "/";
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-red-600">🎬 Bảng Quản Trị</h1>
      <p className="mt-2 text-gray-600">
        Chào mừng Admin! Từ đây bạn có thể quản lý phim, nhân viên, lịch
        chiếu...
      </p>

      <div className="mt-6">
        <Button onClick={handleLogout} className="bg-red-500">
          Đăng Xuất
        </Button>
      </div>
    </div>
  );
}