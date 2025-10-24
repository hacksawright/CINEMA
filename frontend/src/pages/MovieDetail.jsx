import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMovieById } from "@/services/movieService";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Star, Users, Award } from "lucide-react";
import { format } from "date-fns";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchMovieDetails();
      // Scroll to top when component mounts
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const movieData = await getMovieById(id);
      setMovie(movieData);

      // TODO: Implement showtimes API when available
      // For now, we'll show a placeholder
      setShowtimes([]);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      toast({ 
        title: "Lỗi", 
        description: "Không thể tải thông tin phim. Vui lòng thử lại sau.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const date = showtime.show_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(showtime);
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
          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <span className="text-8xl font-bold text-muted-foreground">{movie.title[0]}</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">{movie.title}</h1>
            
            {/* Movie Info */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{movie.durationMinutes} phút</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>{movie.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(movie.releaseDate), "dd/MM/yyyy")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{movie.genre}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">4.8/5</span>
              <span className="text-muted-foreground">(1,234 đánh giá)</span>
            </div>

            {movie.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-foreground">Tóm tắt</h2>
                <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
              </div>
            )}

            {movie.trailer_url && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Trailer</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={movie.trailer_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Lịch Chiếu</h2>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Lịch chiếu sắp có</h3>
                    <p className="text-muted-foreground mb-4">
                      Chúng tôi đang cập nhật lịch chiếu cho phim này. Vui lòng quay lại sau.
                    </p>
                    <Button 
                      onClick={() => navigate('/movies')}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Xem Phim Khác
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


