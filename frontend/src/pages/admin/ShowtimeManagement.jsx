import { useState } from "react";
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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

const ShowtimeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Mock data - replace with actual API calls
  const movies = [
    { id: 1, title: "Avatar: The Way of Water", duration: 192 },
    { id: 2, title: "Black Panther: Wakanda Forever", duration: 161 },
    { id: 3, title: "Top Gun: Maverick", duration: 130 }
  ];

  const rooms = [
    { id: "room1", name: "Phòng chiếu 1", capacity: 120 },
    { id: "room2", name: "Phòng chiếu 2", capacity: 100 },
    { id: "room3", name: "Phòng chiếu 3", capacity: 80 }
  ];

  const showtimes = [
    {
      id: 1,
      movieId: 1,
      movieTitle: "Avatar: The Way of Water",
      roomId: "room1",
      roomName: "Phòng chiếu 1",
      date: "2024-01-20",
      time: "19:30",
      price: 120000,
      status: "active",
      ticketsSold: 85,
      totalTickets: 120
    },
    {
      id: 2,
      movieId: 2,
      movieTitle: "Black Panther: Wakanda Forever",
      roomId: "room2",
      roomName: "Phòng chiếu 2",
      date: "2024-01-20",
      time: "20:00",
      price: 120000,
      status: "active",
      ticketsSold: 45,
      totalTickets: 100
    },
    {
      id: 3,
      movieId: 3,
      movieTitle: "Top Gun: Maverick",
      roomId: "room3",
      roomName: "Phòng chiếu 3",
      date: "2024-01-21",
      time: "16:00",
      price: 120000,
      status: "cancelled",
      ticketsSold: 0,
      totalTickets: 80
    }
  ];

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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const ShowtimeForm = ({ showtime = null, onClose }) => {
    const [formData, setFormData] = useState({
      movieId: showtime?.movieId || "",
      roomId: showtime?.roomId || "",
      date: showtime?.date || format(new Date(), 'yyyy-MM-dd'),
      time: showtime?.time || "",
      price: showtime?.price || 120000,
      status: showtime?.status || "active"
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission
      console.log("Showtime data:", formData);
      onClose();
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
                  <SelectItem key={movie.id} value={movie.id}>
                    {movie.title} ({movie.duration} phút)
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
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} ({room.capacity} ghế)
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
          <div>
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
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
