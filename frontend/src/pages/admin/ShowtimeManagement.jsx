import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

const ShowtimeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // State for dynamic data loaded from API
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  const fetchShowtimes = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/showtimes");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // API returns pageable response with `content` array
      const mapped = (data.content || []).map((s) => {
        let starts = s.startsAt ? parseISO(s.startsAt) : new Date();
        const movie = movies.find(m => String(m.id) === String(s.movieId));
        const room = rooms.find(r => String(r.id) === String(s.roomId));
        return {
          id: s.id,
          movieId: s.movieId?.toString() ?? String(s.movieId),
          // prefer local movies list title, then API field, then fallback
          movieTitle: movie?.title ?? s.movieTitle ?? `Phim #${s.movieId}`,
          roomId: s.roomId?.toString() ?? String(s.roomId),
          roomName: room?.name ?? s.roomName ?? `Phòng ${s.roomId}`,
          date: format(starts, "yyyy-MM-dd"),
          time: format(starts, "HH:mm"),
          price: s.basePrice ?? s.price ?? 0,
          // status is not provided by this API shape; leave undefined
          ticketsSold: s.ticketsSold ?? 0,
          totalTickets: s.totalTickets ?? 0
        };
      });
      setShowtimes(mapped);
    } catch (err) {
      console.error("Failed to fetch showtimes:", err);
    }
  };

  // On mount: fetch movies/rooms first so we can display titles, then fetch showtimes
  useEffect(() => {
    const init = async () => {
      try {
        const [moviesRes, roomsRes] = await Promise.all([
          fetch('http://localhost:8080/api/movies'),
          fetch('http://localhost:8080/api/rooms')
        ]);
        if (moviesRes.ok) {
          const moviesData = await moviesRes.json();
          const moviesList = moviesData.content || moviesData || [];
          setMovies(moviesList.map(m => ({ ...m, id: m.id?.toString ? m.id.toString() : String(m.id) })));
        }
        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          const roomsList = roomsData.content || roomsData || [];
          setRooms(roomsList.map(r => ({ ...r, id: r.id?.toString ? r.id.toString() : String(r.id) })));
        }
      } catch (err) {
        console.warn('Failed to prefetch movies/rooms on mount:', err);
      } finally {
        // fetch showtimes after attempting to load names
        await fetchShowtimes();
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredShowtimes = showtimes.filter(showtime => {
    const matchesSearch = showtime.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         showtime.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = showtime.date === format(dateFilter, 'yyyy-MM-dd');
    return matchesSearch && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Hoạt động</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      case "completed":
        return <Badge variant="outline">Hoàn thành</Badge>;
      default:
        return <Badge variant="outline">—</Badge>;
    }
  };

  // When opening the add dialog, fetch movies and rooms concurrently
  useEffect(() => {
    if (!isAddDialogOpen) return;

    const fetchLists = async () => {
      try {
        const [moviesRes, roomsRes] = await Promise.all([
          fetch('http://localhost:8080/api/movies'),
          fetch('http://localhost:8080/api/rooms')
        ]);
        if (!moviesRes.ok || !roomsRes.ok) {
          console.warn('Failed to fetch movies or rooms', moviesRes.status, roomsRes.status);
          return;
        }
        const moviesData = await moviesRes.json();
        const roomsData = await roomsRes.json();
        const moviesList = moviesData.content || moviesData || [];
        const roomsList = roomsData.content || roomsData || [];
        setMovies(moviesList.map(m => ({ ...m, id: m.id?.toString ? m.id.toString() : String(m.id) })));
        setRooms(roomsList.map(r => ({ ...r, id: r.id?.toString ? r.id.toString() : String(r.id) })));
      } catch (err) {
        console.error('Failed to fetch movies/rooms:', err);
      }
    };

    fetchLists();
  }, [isAddDialogOpen]);

  const ShowtimeForm = ({ showtime = null, onClose }) => {
    const [formData, setFormData] = useState({
      movieId: showtime?.movieId || "",
      roomId: showtime?.roomId || "",
      date: showtime?.date || format(new Date(), 'yyyy-MM-dd'),
      time: showtime?.time || "",
      price: showtime?.price || 120000,
      // status removed per request
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      (async () => {
        try {
          // Build payload matching ShowtimeDto expected by backend
          const movieIdNum = formData.movieId ? Number(formData.movieId) : null;
          const roomIdNum = formData.roomId ? Number(formData.roomId) : null;
          const startsAt = `${formData.date}T${formData.time}:00`;

          // Try to compute endsAt using movie duration (minutes) when available
          let endsAt = null;
          const movie = movies.find(m => String(m.id) === String(formData.movieId));
          const durationMinutes = movie?.durationMinutes ?? movie?.duration ?? null;
          if (durationMinutes) {
            // create a Date from local date/time
            const [h, min] = formData.time.split(":").map(Number);
            const startDate = new Date(formData.date);
            startDate.setHours(h, min, 0, 0);
            const endDate = new Date(startDate.getTime() + Number(durationMinutes) * 60000);
            const pad = (n) => String(n).padStart(2, '0');
            endsAt = `${endDate.getFullYear()}-${pad(endDate.getMonth()+1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:00`;
          }

          const payload = {
            movieId: movieIdNum,
            roomId: roomIdNum,
            startsAt,
            endsAt,
            basePrice: Number(formData.price)
          };

          let res;
          if (showtime && showtime.id) {
            // update existing
            res = await fetch(`http://localhost:8080/api/showtimes/${showtime.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (!res.ok) {
              const errText = await res.text();
              throw new Error(`PUT ${res.status} ${errText}`);
            }
          } else {
            // create new
            res = await fetch('http://localhost:8080/api/showtimes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (!res.ok) {
              const errText = await res.text();
              throw new Error(`POST ${res.status} ${errText}`);
            }
          }

          // success: refresh showtimes and close
          await fetchShowtimes();
          onClose();
        } catch (err) {
          console.error('Failed to save showtime:', err);
          // Optionally show UI feedback here
        }
      })();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="movie">Phim</Label>
            <Select value={formData.movieId} onValueChange={(value) => setFormData({ ...formData, movieId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phim" />
              </SelectTrigger>
              <SelectContent>
                {movies.map((movie) => (
                  <SelectItem key={movie.id} value={String(movie.id)}>
                    {movie.title ?? movie.name ?? `Phim #${movie.id}`}{movie.duration ? ` (${movie.duration} phút)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="room">Phòng chiếu</Label>
            <Select value={formData.roomId} onValueChange={(value) => setFormData({ ...formData, roomId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={String(room.id)}>
                    {room.name ?? room.roomName ?? `Phòng ${room.id}`}{room.capacity ? ` (${room.capacity} ghế)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Ngày chiếu</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Giờ chiếu</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Giá vé</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">
            {showtime ? "Cập nhật" : "Tạo suất chiếu"}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý suất chiếu</h1>
          <p className="text-muted-foreground">Tạo và quản lý lịch chiếu phim</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo suất chiếu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo suất chiếu mới</DialogTitle>
            </DialogHeader>
            <ShowtimeForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng suất chiếu</p>
                <p className="text-2xl font-bold text-foreground">{showtimes.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">
                  {showtimes.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-600/10 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã hủy</p>
                <p className="text-2xl font-bold text-red-600">
                  {showtimes.filter(s => s.status === 'cancelled').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-600/10 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">✗</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tỷ lệ lấp đầy</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    showtimes.reduce((acc, s) => acc + (s.ticketsSold / s.totalTickets), 0) / showtimes.length * 100
                  )}%
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-600/10 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm suất chiếu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-48">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(dateFilter, 'dd/MM/yyyy', { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Showtimes table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch chiếu ngày {format(dateFilter, 'dd/MM/yyyy', { locale: vi })} ({filteredShowtimes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phim</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Giờ chiếu</TableHead>
                <TableHead>Giá vé</TableHead>
                <TableHead>Vé đã bán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShowtimes.map((showtime) => (
                <TableRow key={showtime.id}>
                  <TableCell className="font-medium">{showtime.movieTitle}</TableCell>
                  <TableCell>{showtime.roomName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {showtime.time}
                    </div>
                  </TableCell>
                  <TableCell>{showtime.price.toLocaleString('vi-VN')} ₫</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{showtime.ticketsSold}/{showtime.totalTickets}</span>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(showtime.ticketsSold / showtime.totalTickets) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(showtime.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedShowtime(showtime);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={async () => {
                          if (!confirm('Bạn có chắc muốn xóa suất chiếu này?')) return;
                          try {
                            const res = await fetch(`http://localhost:8080/api/showtimes/${showtime.id}`, {
                              method: 'DELETE'
                            });
                            if (!res.ok) {
                              const txt = await res.text();
                              throw new Error(`${res.status} ${txt}`);
                            }
                            await fetchShowtimes();
                          } catch (err) {
                            console.error('Failed to delete showtime:', err);
                          }
                        }}
                      >
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
            <DialogTitle>Chỉnh sửa suất chiếu</DialogTitle>
          </DialogHeader>
          {selectedShowtime && (
            <ShowtimeForm showtime={selectedShowtime} onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedShowtime(null);
            }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowtimeManagement;