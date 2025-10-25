import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout.jsx";
import { MovieCard } from "@/components/MovieCard.jsx";
import { supabase } from "@/integrations/supabase/client";
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
  Zap
} from "lucide-react";
import heroImage from "@/assets/hero-cinema.jpg";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("release_date", { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể tải danh sách phim", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const nowShowing = movies.filter(m => m.status === "now_showing");
  const comingSoon = movies.filter(m => m.status === "coming_soon");
  const featuredMovies = nowShowing.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section với Slider */}
      <section className="relative">
        <div className="relative h-[70vh] overflow-hidden">
          <img src={heroImage} alt="Rạp chiếu phim cao cấp" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-foreground px-4 max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Trải Nghiệm Điện Ảnh Đỉnh Cao
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Đặt vé cho những bộ phim bom tấn mới nhất với chất lượng hình ảnh và âm thanh tuyệt vời
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Play className="h-5 w-5 mr-2" />
                  Xem Phim Ngay
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Calendar className="h-5 w-5 mr-2" />
                  Đặt Lịch Chiếu
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
            <p className="text-lg text-muted-foreground">Những bộ phim được yêu thích nhất hiện tại</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Đang tải phim...</p>
            </div>
          ) : featuredMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredMovies.map((movie, index) => (
                <Card key={movie.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-card border-border group">
                  <div className="aspect-[2/3] overflow-hidden bg-muted relative">
                    {movie.poster_url ? (
                      <img 
                        src={movie.poster_url} 
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-6xl font-bold text-muted-foreground">{movie.title[0]}</span>
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                      #{index + 1} Trending
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Play className="h-4 w-4 mr-2" />
                        Xem Chi Tiết
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 line-clamp-1 text-foreground">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{movie.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{movie.duration} phút</span>
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
            <p className="text-lg text-muted-foreground">Trải nghiệm điện ảnh tuyệt vời với những tính năng độc đáo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Hệ Thống Âm Thanh 4D</h3>
              <p className="text-muted-foreground">Trải nghiệm âm thanh vòm Dolby Atmos với hiệu ứng rung động chân thực</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Ghế VIP Cao Cấp</h3>
              <p className="text-muted-foreground">Ghế massage tự động với không gian riêng tư và dịch vụ phục vụ tận nơi</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Đặt Vé Online</h3>
              <p className="text-muted-foreground">Đặt vé nhanh chóng, chọn ghế yêu thích và thanh toán an toàn</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Dịch Vụ 24/7</h3>
              <p className="text-muted-foreground">Hỗ trợ khách hàng 24/7 với đội ngũ nhân viên chuyên nghiệp</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Khuyến Mãi */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Gift className="h-8 w-8 text-secondary" />
              Ưu Đãi Đặc Biệt
            </h2>
            <p className="text-lg text-muted-foreground">Những chương trình khuyến mãi hấp dẫn dành cho bạn</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Giảm 50% Thứ 2</h3>
                    <p className="text-sm text-muted-foreground">Mỗi thứ 2 hàng tuần</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">Tất cả vé xem phim được giảm giá 50% vào thứ 2 hàng tuần</p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Áp Dụng Ngay
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Combo Gia Đình</h3>
                    <p className="text-sm text-muted-foreground">Từ 3 người trở lên</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">Giảm 30% khi mua vé cho gia đình từ 3 người trở lên</p>
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Mua Ngay
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Thành Viên VIP</h3>
                    <p className="text-sm text-muted-foreground">Ưu đãi độc quyền</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">Giảm giá 20% cho tất cả vé và nhận nhiều ưu đãi khác</p>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Đăng Ký VIP
                </Button>
              </CardContent>
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
            <p className="text-lg text-muted-foreground">Những chia sẻ chân thực từ khách hàng</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-card border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Trải nghiệm xem phim tuyệt vời! Âm thanh và hình ảnh chất lượng cao, ghế ngồi thoải mái. 
                Dịch vụ đặt vé online rất tiện lợi."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">N</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Nguyễn Văn A</p>
                  <p className="text-sm text-muted-foreground">Khách hàng VIP</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-card border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Rạp chiếu phim hiện đại với công nghệ tiên tiến. Con tôi rất thích xem phim ở đây. 
                Nhân viên phục vụ nhiệt tình và chuyên nghiệp."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-secondary">T</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Trần Thị B</p>
                  <p className="text-sm text-muted-foreground">Khách hàng thường xuyên</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-card border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Chất lượng dịch vụ xuất sắc! Ghế VIP với massage tự động rất thoải mái. 
                Sẽ quay lại nhiều lần nữa."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">L</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Lê Văn C</p>
                  <p className="text-sm text-muted-foreground">Khách hàng mới</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Tin Tức Điện Ảnh */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Tin Tức Điện Ảnh
            </h2>
            <p className="text-lg text-muted-foreground">Cập nhật những tin tức mới nhất về thế giới điện ảnh</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-border group">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Play className="h-12 w-12 text-primary" />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-primary/10 text-primary">Tin Tức</Badge>
                <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2">
                  Top 10 Phim Hay Nhất Tháng 12/2024
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  Khám phá những bộ phim được đánh giá cao nhất trong tháng 12 với những câu chuyện hấp dẫn...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">15/12/2024</span>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    Đọc Thêm <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-border group">
              <div className="aspect-video bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                <Award className="h-12 w-12 text-secondary" />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-secondary/10 text-secondary">Giải Thưởng</Badge>
                <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2">
                  Lễ Trao Giải Oscar 2025 Sắp Diễn Ra
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  Các ứng cử viên sáng giá cho giải Oscar 2025 đã được công bố với nhiều bất ngờ thú vị...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">12/12/2024</span>
                  <Button variant="ghost" size="sm" className="group-hover:text-secondary">
                    Đọc Thêm <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-border group">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <Zap className="h-12 w-12 text-accent" />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3 bg-accent/10 text-accent">Công Nghệ</Badge>
                <h3 className="text-xl font-bold mb-3 text-foreground line-clamp-2">
                  Công Nghệ Chiếu Phim 8K Mới Nhất
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  Khám phá công nghệ chiếu phim 8K mới nhất sẽ thay đổi cách chúng ta xem phim...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">10/12/2024</span>
                  <Button variant="ghost" size="sm" className="group-hover:text-accent">
                    Đọc Thêm <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Danh Sách Phim */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Play className="h-8 w-8 text-primary" />
              Danh Sách Phim
            </h2>
            <p className="text-lg text-muted-foreground">Khám phá những bộ phim hay nhất hiện tại</p>
          </div>

          <Tabs defaultValue="now-showing" className="w-full">
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
                  {nowShowing.map(movie => (
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      description={movie.description || ""}
                      duration={movie.duration}
                      posterUrl={movie.poster_url}
                      status={movie.status}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Hiện tại chưa có phim nào đang chiếu</p>
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
                  {comingSoon.map(movie => (
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      description={movie.description || ""}
                      duration={movie.duration}
                      posterUrl={movie.poster_url}
                      status={movie.status}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Chưa có phim nào sắp chiếu</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}


