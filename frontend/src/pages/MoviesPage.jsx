import { useLocation, useNavigate } from "react-router-dom"; // 🆕 bổ sung nếu chưa có
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout.jsx";
import { MovieCard } from "@/components/MovieCard.jsx";
import {
  getAllMoviesList,
  getShowingMovies,
  getUpcomingMovies,
} from "@/services/movieService";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Clock,
  Users,
  Award,
  Gift,
  Calendar,
  TrendingUp,
  Heart,
  MessageCircle,
  Play,
  ChevronRight,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react";
import heroImage from "@/assets/hero-cinema.jpg";

export default function MoviesPage() {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const urlTab = queryParams.get("tab");

  // ✅ khớp 100% với giá trị của TabsTrigger
  const [tabValue, setTabValue] = useState(
    urlTab === "coming-soon" ? "coming-soon" : "now-showing"
  );

  // Khi đổi tab (người dùng click tab) → cập nhật lại URL
  useEffect(() => {
    navigate(`/?tab=${tabValue}`, { replace: true });
  }, [tabValue, navigate]);

  // Khi URL thay đổi (ví dụ click footer) → cập nhật lại tabValue
  useEffect(() => {
    const tabFromURL = new URLSearchParams(location.search).get("tab");
    if (tabFromURL && tabFromURL !== tabValue) {
      setTabValue(tabFromURL);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        if (tabValue === "coming-soon") {
          const data = await getUpcomingMovies();
          setComingSoon(data || []);
        } else {
          const data = await getShowingMovies();
          setNowShowing(data || []);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách phim.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [tabValue]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const [showingData, upcomingData] = await Promise.all([
        getShowingMovies(),
        getUpcomingMovies(),
      ]);

      setNowShowing(showingData || []);
      setComingSoon(upcomingData || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách phim. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const featuredMovies = nowShowing.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section với Slider */}
      <section className="relative">
        <div className="relative h-[70vh] overflow-hidden">
          <img
            src={heroImage}
            alt="Rạp chiếu phim cao cấp"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-foreground px-4 max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Trải Nghiệm Điện Ảnh Đỉnh Cao
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Đặt vé cho những bộ phim bom tấn mới nhất với chất lượng hình
                ảnh và âm thanh tuyệt vời
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    // Cập nhật URL sang tab now-showing
                    navigate("/?tab=now-showing");

                    // Đợi React Router cập nhật, rồi scroll xuống khu vực phim
                    setTimeout(() => {
                      document
                        .getElementById("movie-section")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 400);
                  }}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Xem Phim Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Phim Nổi Bật */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Crown className="h-8 w-8 text-secondary" />
              Phim Nổi Bật
            </h2>
            <p className="text-lg text-muted-foreground">
              Những bộ phim được yêu thích nhất hiện tại
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Đang tải phim...</p>
            </div>
          ) : featuredMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredMovies.map((movie, index) => (
                <Card
                  key={movie.id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-card border-border group"
                >
                  <div className="aspect-[2/3] overflow-hidden bg-muted relative">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-6xl font-bold text-muted-foreground">
                          {movie.title[0]}
                        </span>
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                      #{index + 1} Trending
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() =>
                          (window.location.href = `/movie/${movie.id}`)
                        }
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Xem Chi Tiết
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 line-clamp-1 text-foreground">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {movie.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{movie.durationMinutes} phút</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có phim nổi bật</p>
            </div>
          )}
        </div>
      </section>

      {/* Section Tính Năng Nổi Bật */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-lg text-muted-foreground">
              Trải nghiệm điện ảnh tuyệt vời với những tính năng độc đáo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Hệ Thống Âm Thanh 4D
              </h3>
              <p className="text-muted-foreground">
                Trải nghiệm âm thanh vòm Dolby Atmos với hiệu ứng rung động chân
                thực
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Ghế VIP Cao Cấp
              </h3>
              <p className="text-muted-foreground">
                Ghế massage tự động với không gian riêng tư và dịch vụ phục vụ
                tận nơi
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Đặt Vé Online
              </h3>
              <p className="text-muted-foreground">
                Đặt vé nhanh chóng, chọn ghế yêu thích và thanh toán an toàn
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Dịch Vụ 24/7
              </h3>
              <p className="text-muted-foreground">
                Hỗ trợ khách hàng 24/7 với đội ngũ nhân viên chuyên nghiệp
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Đánh Giá Khách Hàng */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <MessageCircle className="h-8 w-8 text-primary" />
              Khách Hàng Nói Gì Về Chúng Tôi?
            </h2>
            <p className="text-lg text-muted-foreground">
              Những chia sẻ chân thực từ khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-card border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Trải nghiệm xem phim tuyệt vời! Âm thanh và hình ảnh chất lượng
                cao, ghế ngồi thoải mái. Dịch vụ đặt vé online rất tiện lợi."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">N</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Nguyễn Thanh Tùng
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Khách hàng VIP
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-card border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Rạp chiếu phim hiện đại với công nghệ tiên tiến. Con tôi rất
                thích xem phim ở đây. Nhân viên phục vụ nhiệt tình và chuyên
                nghiệp."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-secondary">T</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Trần Thanh Tâm
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Khách hàng thường xuyên
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-card border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Chất lượng dịch vụ xuất sắc! Ghế VIP với massage tự động rất
                thoải mái. Sẽ quay lại nhiều lần nữa. Nhân viên thân thiện."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">L</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Nguyễn Bảo Trân
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Khách hàng mới
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Tin Tức Điện Ảnh */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Tin Tức Điện Ảnh
            </h2>
            <p className="text-lg text-muted-foreground">
              Cập nhật những tin tức nổi bật nhất về điện ảnh Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bài 1 - VNExpress */}
            <Card className="overflow-hidden bg-gradient-to-br from-red-800/40 to-gray-900 border-red-900/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <img
                    src="https://i1-vnexpress.vnecdn.net/2025/07/16/phim-viet-100-ty-anh-1719539250-2258-1719539494.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=nKqDJv5r5Hk8h_0sxdCcdw"
                    alt="9 phim Việt vượt 100 tỷ đồng nửa đầu 2025"
                    className="rounded-md mb-4"
                  />
                  <h3 className="text-lg font-bold text-white mb-2">
                    9 phim Việt vượt 100 tỷ đồng nửa đầu năm 2025
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Điện ảnh Việt ghi nhận 9 tác phẩm đạt doanh thu trên 100 tỷ
                    đồng trong 6 tháng đầu năm 2025 — con số kỷ lục của nền phim
                    nội địa.
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>16/07/2025</span>
                  <a
                    href="https://vnexpress.net/9-phim-viet-vuot-100-ty-dong-nua-dau-nam-2025-4925017.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ef4444] font-medium hover:underline"
                  >
                    Đọc thêm →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Bài 2 - Nhân Dân */}
            <Card className="overflow-hidden bg-gradient-to-br from-yellow-700/40 to-gray-900 border-yellow-900/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <img
                    src="https://nhandan.vn/imgs/2025/07/28/17/20250728170700-1.jpg"
                    alt="Mưa Đỏ trở thành phim Việt có doanh thu cao nhất lịch sử điện ảnh"
                    className="rounded-md mb-4"
                  />
                  <h3 className="text-lg font-bold text-white mb-2">
                    “Mưa Đỏ” trở thành phim Việt có doanh thu cao nhất lịch sử
                    điện ảnh
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Sau hơn một tháng công chiếu, phim “Mưa Đỏ” của đạo diễn
                    Victor Vũ chính thức lập kỷ lục doanh thu mới, vượt mốc mọi
                    phim Việt trước đó.
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>28/07/2025</span>
                  <a
                    href="https://nhandan.vn/mua-do-tro-thanh-phim-viet-co-doanh-thu-cao-nhat-lich-su-dien-anh-post906496.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ef4444] font-medium hover:underline"
                  >
                    Đọc thêm →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Bài 3 - Tuổi Trẻ */}
            <Card className="overflow-hidden bg-gradient-to-br from-pink-800/40 to-gray-900 border-pink-900/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <img
                    src="https://cdn.tuoitre.vn/thumb_w/730/2025/8/11/tran-thanh-tho-oi-1-1723370408377756991923.jpg"
                    alt="Trấn Thành khởi quay phim Tết Thờ Ơi, giấu toàn bộ diễn viên"
                    className="rounded-md mb-4"
                  />
                  <h3 className="text-lg font-bold text-white mb-2">
                    Trấn Thành khởi quay phim Tết “Thờ Ơi”, giấu kín toàn bộ dàn
                    diễn viên
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Dự án phim Tết 2026 của Trấn Thành mang tên “Thờ Ơi” bắt đầu
                    bấm máy tại TP.HCM, giữ bí mật dàn diễn viên cho đến ngày ra
                    mắt.
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>11/08/2025</span>
                  <a
                    href="https://tuoitre.vn/tran-thanh-khai-may-phim-tet-tho-oi-giau-mat-toan-bo-dien-vien-2025081118000006.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ef4444] font-medium hover:underline"
                  >
                    Đọc thêm →
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Danh Sách Phim */}
      <section id="movie-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Play className="h-8 w-8 text-primary" />
              Danh Sách Phim
            </h2>
            <p className="text-lg text-muted-foreground">
              Khám phá những bộ phim hay nhất hiện tại
            </p>
          </div>

          {/* ✅ Chỉ đổi defaultValue thành value + onValueChange (để phản ứng với URL tab) */}
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="now-showing">Đang Chiếu</TabsTrigger>
              <TabsTrigger value="coming-soon">Sắp Chiếu</TabsTrigger>
            </TabsList>

            <TabsContent value="now-showing">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Đang tải phim...</p>
                </div>
              ) : nowShowing.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {nowShowing.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      description={movie.description || ""}
                      duration={movie.durationMinutes}
                      posterUrl={movie.posterUrl}
                      status={movie.status}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Hiện tại chưa có phim nào đang chiếu
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="coming-soon">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Đang tải phim...</p>
                </div>
              ) : comingSoon.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {comingSoon.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      description={movie.description || ""}
                      duration={movie.durationMinutes}
                      posterUrl={movie.posterUrl}
                      status={movie.status}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Chưa có phim nào sắp chiếu
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}