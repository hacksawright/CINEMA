import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Film } from "lucide-react";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/admin/login",
        form
      );
      if (res.data.status === "success") {
        localStorage.setItem("admin-auth", "true");
        toast({
          title: "Đăng nhập thành công 🎉",
          description: "Chào mừng bạn quay lại trang quản trị.",
        });
        setTimeout(() => (window.location.href = "/admin/dashboard"), 800);
      } else {
        toast({
          title: "Sai thông tin đăng nhập",
          description: "Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Lỗi kết nối server",
        description: "Không thể kết nối tới máy chủ backend.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827]">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo + tiêu đề */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="h-6 w-6 text-[#ef4444]" />
            <h1 className="text-2xl font-bold text-[#ef4444]">CinemaTickets</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Hệ thống quản trị đặt vé phim cao cấp
          </p>
        </div>

        {/* Form đăng nhập */}
        <Card className="w-[380px] bg-[#1f2937] border border-gray-700 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-lg font-semibold text-gray-100">
              Đăng Nhập Quản Trị
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-300">Tên đăng nhập</label>
                <Input
                  name="username"
                  placeholder="Nhập tên đăng nhập"
                  onChange={handleChange}
                  className="bg-[#111827] border-gray-700 text-white focus-visible:ring-[#ef4444]"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Mật khẩu</label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  onChange={handleChange}
                  className="bg-[#111827] border-gray-700 text-white focus-visible:ring-[#ef4444]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold rounded-md transition-all duration-200"
              >
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-gray-500 text-xs">
          © 2025 CinemaTickets Admin Portal
        </p>
      </div>
    </div>
  );
}
