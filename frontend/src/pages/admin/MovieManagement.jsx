import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Filter, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Import our custom hooks and constants
import {
  useMovies,
  useSearchMoviesByTitle,
  useMovieStatistics,
  useCreateMovie,
  useUpdateMovie,
  useDeleteMovie,
  useUpdateMovieStatus
} from "@/hooks/useMovies";

// Import constants from a separate file or define them here
const MOVIE_STATUS = {
  UPCOMING: 'upcoming',
  SHOWING: 'showing',
  ENDED: 'ended'
};

const MOVIE_RATING = {
  G: 'G',
  PG: 'PG',
  PG13: 'PG-13',
  R: 'R',
  NC17: 'NC-17'
};

const MOVIE_GENRE = {
  ACTION: 'Action',
  COMEDY: 'Comedy',
  DRAMA: 'Drama',
  HORROR: 'Horror',
  ROMANCE: 'Romance',
  SCIFI: 'Sci-Fi',
  THRILLER: 'Thriller',
  ADVENTURE: 'Adventure',
  ANIMATION: 'Animation',
  DOCUMENTARY: 'Documentary'
};

const MovieManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // API hooks
  const { 
    data: moviesData, 
    isLoading: moviesLoading, 
    error: moviesError,
    refetch: refetchMovies
  } = useMovies({
    page: currentPage,
    size: pageSize
  });

  const { 
    data: searchResults, 
    isLoading: searchLoading 
  } = useSearchMoviesByTitle(searchTerm);

  const { data: statistics } = useMovieStatistics();

  // Mutation hooks
  const createMovieMutation = useCreateMovie();
  const updateMovieMutation = useUpdateMovie();
  const deleteMovieMutation = useDeleteMovie();
  const updateStatusMutation = useUpdateMovieStatus();

  // Determine which data to display
  const displayMovies = searchTerm ? searchResults : moviesData?.content || moviesData;
  const isLoading = searchTerm ? searchLoading : moviesLoading;

  const getStatusBadge = (status) => {
    switch (status) {
      case "showing":
        return <Badge className="bg-green-600">Đang chiếu</Badge>;
      case "upcoming":
        return <Badge variant="secondary">Sắp chiếu</Badge>;
      case "ended":
        return <Badge variant="outline">Kết thúc</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const MovieForm = ({ movie = null, onClose }) => {
    const [formData, setFormData] = useState({
      title: movie?.title || "",
      genre: movie?.genre || "",
      duration: movie?.durationMinutes || "",
      rating: movie?.rating || "",
      status: movie?.status || MOVIE_STATUS.UPCOMING,
      releaseDate: movie?.releaseDate || "",
      description: movie?.description || "",
      posterUrl: movie?.posterUrl || ""
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const movieData = {
        ...formData,
        durationMinutes: parseInt(formData.duration),
        releaseDate: formData.releaseDate || null
      };
      
      // Remove the old duration field to avoid confusion
      delete movieData.duration;

      try {
        if (movie) {
          await updateMovieMutation.mutateAsync({ id: movie.id, data: movieData });
          toast.success("Cập nhật phim thành công!");
        } else {
          await createMovieMutation.mutateAsync(movieData);
          toast.success("Thêm phim mới thành công!");
        }
        onClose();
      } catch (error) {
        toast.error(`Lỗi: ${error.message}`);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Tên phim</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="genre">Thể loại</Label>
            <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thể loại" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MOVIE_GENRE).map((genre) => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Thời lượng (phút)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn rating" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MOVIE_RATING).map((rating) => (
                  <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="releaseDate">Ngày phát hành</Label>
            <Input
              id="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MOVIE_STATUS.UPCOMING}>Sắp chiếu</SelectItem>
                <SelectItem value={MOVIE_STATUS.SHOWING}>Đang chiếu</SelectItem>
                <SelectItem value={MOVIE_STATUS.ENDED}>Kết thúc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="poster">URL Poster</Label>
          <Input
            id="poster"
            value={formData.posterUrl}
            onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
            placeholder="https://example.com/poster.jpg"
          />
        </div>

        <div>
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={createMovieMutation.isPending || updateMovieMutation.isPending}
          >
            {(createMovieMutation.isPending || updateMovieMutation.isPending) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {movie ? "Cập nhật" : "Thêm phim"}
          </Button>
        </div>
      </form>
    );
  };

  // Handle delete movie
  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteMovieMutation.mutateAsync(movieId);
      toast.success("Xóa phim thành công!");
    } catch (error) {
      toast.error(`Lỗi xóa phim: ${error.message}`);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (movieId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: movieId, status: newStatus });
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      toast.error(`Lỗi cập nhật trạng thái: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý phim</h1>
          <p className="text-muted-foreground">Thêm, sửa, xóa và quản lý thông tin phim</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm phim mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm phim mới</DialogTitle>
            </DialogHeader>
            <MovieForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      {statistics && (
        <Card>
          <CardHeader>
            <CardTitle>Thống kê phim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{statistics.totalMovies}</div>
                <div className="text-sm text-muted-foreground">Tổng phim</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.showingMovies}</div>
                <div className="text-sm text-muted-foreground">Đang chiếu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.upcomingMovies}</div>
                <div className="text-sm text-muted-foreground">Sắp chiếu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{statistics.endedMovies}</div>
                <div className="text-sm text-muted-foreground">Kết thúc</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {moviesError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Lỗi tải dữ liệu: {moviesError.message}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => refetchMovies()}
            >
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm phim..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="showing">Đang chiếu</SelectItem>
                <SelectItem value="upcoming">Sắp chiếu</SelectItem>
                <SelectItem value="ended">Kết thúc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Movies table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách phim ({displayMovies?.length || 0})
            {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poster</TableHead>
                  <TableHead>Tên phim</TableHead>
                  <TableHead>Thể loại</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Ngày phát hành</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayMovies?.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell>
                      <img
                        src={movie.posterUrl || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell>{movie.genre || "N/A"}</TableCell>
                    <TableCell>{movie.durationMinutes} phút</TableCell>
                    <TableCell>{movie.rating || "N/A"}</TableCell>
                    <TableCell>
                      {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('vi-VN') : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={movie.status}
                        onValueChange={(newStatus) => handleStatusUpdate(movie.id, newStatus)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={MOVIE_STATUS.UPCOMING}>Sắp chiếu</SelectItem>
                          <SelectItem value={MOVIE_STATUS.SHOWING}>Đang chiếu</SelectItem>
                          <SelectItem value={MOVIE_STATUS.ENDED}>Kết thúc</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMovie(movie);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              disabled={deleteMovieMutation.isPending}
                            >
                              {deleteMovieMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa phim</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa phim "{movie.title}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMovie(movie.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!displayMovies || displayMovies.length === 0) && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Không có phim nào được tìm thấy
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phim</DialogTitle>
          </DialogHeader>
          {selectedMovie && (
            <MovieForm 
              movie={selectedMovie} 
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedMovie(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieManagement;
