import { Link, useNavigate } from "react-router-dom";
import {
  Film,
  User,
  LogOut,
  Settings,
  Home,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    try {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userId");

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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
            onClick={scrollToTop} // 🆕 Thêm vào logo
          >
            <Film className="h-6 w-6" />
            <span>CinemaTickets</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={scrollToTop}>
              {/* 🆕 Gọi scrollToTop khi nhấn Trang Chủ */}
              <Home className="h-4 w-4 mr-2" />
              Trang Chủ
            </Button>

            <Link to="/account">
              <Button variant="ghost">
                <User className="h-4 w-4 mr-2" />
                Tài Khoản
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng Xuất
            </Button>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border mt-16 py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                {/* Phim Đang Chiếu */}
                <button
                  onClick={() => {
                    navigate("/?tab=now-showing"); // ✅ đúng key
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

                {/* Phim Sắp Chiếu */}
                <button
                  onClick={() => {
                    navigate("/?tab=coming-soon"); // ✅ đúng key
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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Dịch Vụ</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground">Đặt vé online</p>
                <p className="text-muted-foreground">Ghế VIP</p>
                <p className="text-muted-foreground">Combo gia đình</p>
                <p className="text-muted-foreground">Khuyến mãi</p>
              </div>
            </div>

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
