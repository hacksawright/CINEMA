import { Link, useNavigate } from "react-router-dom";
import {
  Film,
  User,
  LogOut,
  Home,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 🧩 Khai báo state lưu tên người dùng
  const [userFullName, setUserFullName] = useState(null);

  // 🧩 Lấy tên từ sessionStorage khi load trang
  useEffect(() => {
    const name = sessionStorage.getItem("fullName");
    setUserFullName(name);
  }, []);

  // 🧩 Hàm đăng xuất
  const handleLogout = () => {
    try {
      sessionStorage.removeItem("jwtToken");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("fullName");

      toast({ title: "Thành công!", description: "Đã đăng xuất thành công!" });
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đăng xuất. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // 🆕 Hàm scroll lên đầu trang khi nhấn Trang Chủ
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/"); // Quay về trang chủ
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
            onClick={scrollToTop}
          >
            <Film className="h-6 w-6" />
            <span>CinemaTickets</span>
          </Link>

          {/* NAVIGATION */}
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={scrollToTop}>
              <Home className="h-4 w-4 mr-2" />
              Trang Chủ
            </Button>

            <Link to="/account">
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-semibold">
                  {userFullName || "Tài Khoản"}
                </span>
              </Button>
            </Link>

            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng Xuất
            </Button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer className="border-t border-border mt-16 py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Giới thiệu */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-bold text-primary">
                <Film className="h-6 w-6" />
                <span>CinemaTickets</span>
              </div>
              <p className="text-muted-foreground">
                Hệ thống rạp chiếu phim cao cấp với công nghệ hiện đại và dịch
                vụ chuyên nghiệp.
              </p>
            </div>

            {/* Liên kết nhanh */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Liên Kết Nhanh
              </h3>
              <div className="space-y-2">
                <button
                  onClick={scrollToTop}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Trang Chủ
                </button>

                <button
                  onClick={() => {
                    navigate("/?tab=now-showing");
                    setTimeout(() => {
                      document
                        .getElementById("movie-section")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 400);
                  }}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Phim Đang Chiếu
                </button>

                <button
                  onClick={() => {
                    navigate("/?tab=coming-soon");
                    setTimeout(() => {
                      document
                        .getElementById("movie-section")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 400);
                  }}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Phim Sắp Chiếu
                </button>

                <Link
                  to="/account"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Tài Khoản
                </Link>
              </div>
            </div>

            {/* Liên hệ */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Liên Hệ</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>1900 1234</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>info@cinematickets.vn</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>123 Đường Quang Trung, Quận Hà Đông, TP.Hà Nội</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 CinemaTickets. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
