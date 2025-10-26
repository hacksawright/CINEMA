import { useState } from "react";
import { Search, Filter, Eye, Edit, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TicketManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Mock data - replace with actual API calls
  const tickets = [
    {
      id: "T001",
      movieTitle: "Avatar: The Way of Water",
      showtime: "2024-01-20 19:30",
      seat: "A12",
      price: 120000,
      status: "sold",
      customerName: "Nguyễn Văn A",
      customerPhone: "0123456789",
      purchaseDate: "2024-01-19 14:30",
      paymentMethod: "credit_card"
    },
    {
      id: "T002",
      movieTitle: "Black Panther: Wakanda Forever",
      showtime: "2024-01-21 20:00",
      seat: "B05",
      price: 120000,
      status: "available",
      customerName: null,
      customerPhone: null,
      purchaseDate: null,
      paymentMethod: null
    },
    {
      id: "T003",
      movieTitle: "Top Gun: Maverick",
      showtime: "2024-01-20 16:00",
      seat: "C15",
      price: 120000,
      status: "cancelled",
      customerName: "Trần Thị B",
      customerPhone: "0987654321",
      purchaseDate: "2024-01-19 10:15",
      paymentMethod: "cash"
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ticket.customerName && ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "sold":
        return <Badge className="bg-green-600">Đã bán</Badge>;
      case "available":
        return <Badge variant="secondary">Còn trống</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodBadge = (method) => {
    switch (method) {
      case "credit_card":
        return <Badge variant="outline">Thẻ tín dụng</Badge>;
      case "cash":
        return <Badge variant="outline">Tiền mặt</Badge>;
      case "bank_transfer":
        return <Badge variant="outline">Chuyển khoản</Badge>;
      case "e_wallet":
        return <Badge variant="outline">Ví điện tử</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const TicketDetails = ({ ticket, onClose }) => {
    const [newStatus, setNewStatus] = useState(ticket.status);

    const handleStatusUpdate = () => {
      // Handle status update
      console.log("Updating ticket status:", ticket.id, newStatus);
      onClose();
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Mã vé</Label>
            <p className="text-sm font-medium">{ticket.id}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Trạng thái hiện tại</Label>
            <div className="mt-1">{getStatusBadge(ticket.status)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Phim</Label>
            <p className="text-sm">{ticket.movieTitle}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Suất chiếu</Label>
            <p className="text-sm">{ticket.showtime}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Ghế</Label>
            <p className="text-sm">{ticket.seat}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Giá vé</Label>
            <p className="text-sm font-medium">{ticket.price.toLocaleString('vi-VN')} ₫</p>
          </div>
        </div>

        {ticket.customerName && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Khách hàng</Label>
                <p className="text-sm">{ticket.customerName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Số điện thoại</Label>
                <p className="text-sm">{ticket.customerPhone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Ngày mua</Label>
                <p className="text-sm">{ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleString('vi-VN') : '-'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phương thức thanh toán</Label>
                <div className="mt-1">{getPaymentMethodBadge(ticket.paymentMethod)}</div>
              </div>
            </div>
          </>
        )}

        <div className="border-t pt-4">
          <Label className="text-sm font-medium">Cập nhật trạng thái</Label>
          <div className="flex gap-2 mt-2">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Còn trống</SelectItem>
                <SelectItem value="sold">Đã bán</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusUpdate} disabled={newStatus === ticket.status}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Cập nhật
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý vé</h1>
        <p className="text-muted-foreground">Xem và quản lý thông tin vé, trạng thái thanh toán</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng vé</p>
                <p className="text-2xl font-bold text-foreground">{tickets.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-bold">T</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã bán</p>
                <p className="text-2xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 'sold').length}
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
                <p className="text-sm font-medium text-muted-foreground">Còn trống</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tickets.filter(t => t.status === 'available').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-600/10 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">○</span>
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
                  {tickets.filter(t => t.status === 'cancelled').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-600/10 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">✗</span>
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
                  placeholder="Tìm kiếm vé..."
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
                <SelectItem value="sold">Đã bán</SelectItem>
                <SelectItem value="available">Còn trống</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách vé ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã vé</TableHead>
                <TableHead>Phim</TableHead>
                <TableHead>Suất chiếu</TableHead>
                <TableHead>Ghế</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.movieTitle}</TableCell>
                  <TableCell>{ticket.showtime}</TableCell>
                  <TableCell>{ticket.seat}</TableCell>
                  <TableCell>{ticket.price.toLocaleString('vi-VN')} ₫</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{ticket.customerName || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ticket details dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết vé</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <TicketDetails 
              ticket={selectedTicket} 
              onClose={() => {
                setIsViewDialogOpen(false);
                setSelectedTicket(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketManagement;
