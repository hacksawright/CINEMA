import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMovieById } from "@/services/movieService"; 
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Star, Users, Award } from "lucide-react"; 
import { format } from "date-fns";
import { vi } from 'date-fns/locale'; 

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // KHAI BÁO HOOKS PHẢI LUÔN Ở ĐẦU
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Hàm gọi API và lọc dữ liệu
    const fetchMovieDetails = async () => {
    try {
        const movieData = await getMovieById(id); 
        setMovie(movieData);

        const timeThresholdMs = new Date().getTime() - (30 * 60 * 1000); 
        
        const validShowtimes = (movieData.showtimes || [])
            .filter(showtime => {
                const showtimeStartMs = new Date(showtime.startsAt).getTime(); // Lấy thời gian bắt đầu dưới dạng ms
                
                // So sánh trực tiếp bằng mili giây
                return showtimeStartMs > timeThresholdMs; 
            }) 
            .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

        setShowtimes(validShowtimes);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        toast({ 
            title: "Lỗi", 
            description: "Không thể tải thông tin phim. Vui lòng kiểm tra Backend.", 
            variant: "destructive" 
        });
    } finally {
        setLoading(false);
    }
};

    // USE EFFECT để gọi hàm
    useEffect(() => {
        if (id) {
            fetchMovieDetails();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [id]);

    // Gom nhóm lịch chiếu theo ngày
    const groupedShowtimes = showtimes.reduce((acc, showtime) => {
        const dateKey = format(new Date(showtime.startsAt), 'yyyy-MM-dd'); 
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(showtime);
        return acc;
    }, {});

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </Layout>
        );
    }

    if (!movie) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-muted-foreground">Movie not found</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-[300px_1fr] gap-8">
                    {/* Poster */}
                    <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                        {}
                        {movie?.posterUrl ? (
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                <span className="text-8xl font-bold text-muted-foreground">{movie?.title ? movie.title[0] : 'F'}</span>
                            </div>
                        )}
                    </div>

                    {/* Phần Thông tin Phim */}
                    <div>
                        <h1 className="text-4xl font-bold mb-4 text-foreground">{movie?.title}</h1> {}
                        
                        {/* Movie Info */}
                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{movie?.durationMinutes} phút</span> {}
                            </div>
                            <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                <span>{movie?.rating}</span> {}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{movie?.releaseDate ? format(new Date(movie.releaseDate), "dd/MM/yyyy") : 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{movie?.genre}</span> {}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <Star className="h-5 w-5 fill-yellow-400/50 text-yellow-400" />
                            </div>
                            <span className="text-lg font-semibold text-foreground">4.8/5</span>
                            <span className="text-muted-foreground">(1,234 đánh giá)</span>
                        </div>

                        {movie?.description && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-3 text-foreground">Tóm tắt</h2>
                                <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
                            </div>
                        )}

                        {/* 2. HIỂN THỊ LỊCH CHIẾU  */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-foreground">Lịch Chiếu</h2>
                            <Card className="border-border">
                                <CardContent className="p-6">
                                    {Object.keys(groupedShowtimes).length > 0 ? (
                                        <div className="space-y-6">
                                            {Object.entries(groupedShowtimes).map(([dateKey, times]) => (
                                                <div key={dateKey}>
                                                    <h3 className="text-xl font-bold mb-3 text-primary">
                                                        {format(new Date(dateKey), 'EEEE, dd/MM/yyyy', { locale: vi })}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {times.map(showtime => (
                                                            <Link key={showtime.id} to={`/booking/${showtime.id}`}>
                                                                <Button variant="outline" className="text-lg font-semibold hover:bg-primary hover:text-white transition-colors border-primary">
                                                                    {format(new Date(showtime.startsAt), 'HH:mm')}
                                                                </Button>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // PHẦN HIỂN THỊ NẾU KHÔNG CÓ LỊCH CHIẾU HỢP LỆ/TƯƠNG LAI
                                        <div className="text-center py-8">
                                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2 text-foreground">Lịch chiếu sắp có</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Chúng tôi đang cập nhật lịch chiếu cho phim này. Vui lòng quay lại sau.
                                            </p>
                                            <Button onClick={() => navigate('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                                Xem Phim Khác
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}