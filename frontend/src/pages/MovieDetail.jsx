import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
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
    }
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const { data: movieData, error: movieError } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

      if (movieError) throw movieError;
      setMovie(movieData);

      const { data: showtimesData, error: showtimesError } = await supabase
        .from("showtimes")
        .select("*")
        .eq("movie_id", id)
        .gte("show_date", new Date().toISOString().split("T")[0])
        .order("show_date", { ascending: true })
        .order("show_time", { ascending: true });

      if (showtimesError) throw showtimesError;
      setShowtimes(showtimesData || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load movie details", variant: "destructive" });
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
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <span className="text-8xl font-bold text-muted-foreground">{movie.title[0]}</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <span>{movie.duration} min</span>
              </div>
            </div>

            {movie.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
                <p className="text-muted-foreground">{movie.description}</p>
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
              <h2 className="text-2xl font-semibold mb-4">Showtimes</h2>
              {Object.keys(groupedShowtimes).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedShowtimes).map(([date, times]) => (
                    <Card key={date} className="border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{format(new Date(date), "EEEE, MMMM d, yyyy")}</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {times.map(showtime => (
                            <Button
                              key={showtime.id}
                              variant="outline"
                              onClick={() => navigate(`/booking/${showtime.id}`)}
                              className="hover:bg-primary hover:text-primary-foreground"
                            >
                              {showtime.show_time.substring(0, 5)} - ${showtime.price}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No showtimes available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


