import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

const ShowtimeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);

  const fetchShowtimes = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/showtimes");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const mapped = (data.content || []).map((s) => {
        const starts = s.startsAt ? parseISO(s.startsAt) : new Date();
        const movie = movies.find(m => String(m.id) === String(s.movieId));
        const room = rooms.find(r => String(r.id) === String(s.roomId));
        return {
          id: s.id,
          movieTitle: movie?.title ?? s.movieTitle ?? `Phim #${s.movieId}`,
          roomName: room?.name ?? s.roomName ?? `Phòng ${s.roomId}`,
          time: format(starts, "HH:mm"),
          date: format(starts, "yyyy-MM-dd")
        };
      });
      setShowtimes(mapped);
    } catch (err) {
      console.error("Failed to fetch showtimes:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [moviesRes, roomsRes] = await Promise.all([
          fetch("http://localhost:8000/api/movies"),
          fetch("http://localhost:8000/api/rooms")
        ]);
        if (moviesRes.ok) {
          const moviesData = await moviesRes.json();
          setMovies(Array.isArray(moviesData) ? moviesData : moviesData.content || []);
        }

        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(Array.isArray(roomsData) ? roomsData : roomsData.content || []);
        }

      } catch (err) {
        console.warn("Failed to prefetch:", err);
      } finally {
        await fetchShowtimes();
      }
    };
    init();
  }, []);

  const filteredShowtimes = showtimes.filter(showtime => {
    const matchesSearch =
      showtime.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = showtime.date === format(dateFilter, "yyyy-MM-dd");
    return matchesSearch && matchesDate;
  });

  const ShowtimeForm = ({ showtime = null, onClose }) => {
    const [formData, setFormData] = useState({
      movieId: showtime?.movieId || "",
      roomId: showtime?.roomId || "",
      date: showtime?.date || format(new Date(), "yyyy-MM-dd"),
      time: showtime?.time || ""
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          movieId: Number(formData.movieId),
          roomId: Number(formData.roomId),
          startsAt: `${formData.date}T${formData.time}:00`
        };
        const url = showtime
          ? `http://localhost:8000/api/showtimes/${showtime.id}`
          : "http://localhost:8000/api/showtimes";
        const method = showtime ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        await fetchShowtimes();
        onClose();
      } catch (err) {
        console.error("Failed to save showtime:", err);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Phim</Label>
            <Select
              value={formData.movieId}
              onValueChange={(v) => setFormData({ ...formData, movieId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phim" />
              </SelectTrigger>
              <SelectContent>
                {movies.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.title ?? m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Phòng</Label>
            <Select
              value={formData.roomId}
              onValueChange={(v) => setFormData({ ...formData, roomId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name ?? `Phòng ${r.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Ngày chiếu</Label>
            <Input
              type="date"
              className="text-white calendar-white bg-gray-800 border-gray-600"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

          </div>
          <div>
            <Label>Giờ chiếu</Label>
            <Input
              type="time"
              className="text-white calendar-white bg-gray-800 border-gray-600"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">{showtime ? "Cập nhật" : "Tạo suất chiếu"}</Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý suất chiếu</h1>
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

      {/* Bảng suất chiếu (đã bỏ 3 cột) */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lịch chiếu ngày {format(dateFilter, "dd/MM/yyyy", { locale: vi })} (
            {filteredShowtimes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phim</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Giờ chiếu</TableHead>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
                          if (!confirm("Bạn có chắc muốn xóa suất chiếu này?")) return;
                          try {
                            const res = await fetch(
                              `http://localhost:8000/api/showtimes/${showtime.id}`,
                              { method: "DELETE" }
                            );
                            if (!res.ok) throw new Error(`HTTP ${res.status}`);
                            await fetchShowtimes();
                          } catch (err) {
                            console.error("Failed to delete showtime:", err);
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa suất chiếu</DialogTitle>
          </DialogHeader>
          {selectedShowtime && (
            <ShowtimeForm
              showtime={selectedShowtime}
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedShowtime(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowtimeManagement;
