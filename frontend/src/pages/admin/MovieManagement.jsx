import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const MovieManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Mock data - replace with actual API calls
  const movies = [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      genre: "Sci-Fi",
      duration: 192,
      status: "showing",
      releaseDate: "2024-01-15",
      poster: "/placeholder.svg",
      description: "Set more than a decade after the events of the first film..."
    },
    {
      id: 2,
      title: "Black Panther: Wakanda Forever",
      genre: "Action",
      duration: 161,
      status: "upcoming",
      releaseDate: "2024-02-20",
      poster: "/placeholder.svg",
      description: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje..."
    },
    {
      id: 3,
      title: "Top Gun: Maverick",
      genre: "Action",
      duration: 130,
      status: "showing",
      releaseDate: "2024-01-10",
      poster: "/placeholder.svg",
      description: "After thirty years, Maverick is still pushing the envelope..."
    }
  ];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || movie.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      duration: movie?.duration || "",
      status: movie?.status || "upcoming",
      releaseDate: movie?.releaseDate || "",
      description: movie?.description || "",
      poster: movie?.poster || ""
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission
      console.log("Movie data:", formData);
      onClose();
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
                <SelectItem value="action">Hành động</SelectItem>
                <SelectItem value="comedy">Hài kịch</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="horror">Kinh dị</SelectItem>
                <SelectItem value="sci-fi">Khoa học viễn tưởng</SelectItem>
                <SelectItem value="romance">Lãng mạn</SelectItem>
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
            <Label htmlFor="releaseDate">Ngày phát hành</Label>
            <Input
              id="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Sắp chiếu</SelectItem>
              <SelectItem value="showing">Đang chiếu</SelectItem>
              <SelectItem value="ended">Kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="poster">URL Poster</Label>
          <Input
            id="poster"
            value={formData.poster}
            onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
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
          <Button type="submit">
            {movie ? "Cập nhật" : "Thêm phim"}
          </Button>
        </div>
      </form>
    );
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
          <CardTitle>Danh sách phim ({filteredMovies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poster</TableHead>
                <TableHead>Tên phim</TableHead>
                <TableHead>Thể loại</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead>Ngày phát hành</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>{movie.duration} phút</TableCell>
                  <TableCell>{new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{getStatusBadge(movie.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
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
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phim</DialogTitle>
          </DialogHeader>
          {selectedMovie && (
            <MovieForm movie={selectedMovie} onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedMovie(null);
            }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieManagement;
