import { useState } from "react";
import { Search, Filter, Eye, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
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

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(new Date());
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data - replace with actual API calls
  const orders = [
    {
      id: "ORD001",
      customerName: "Nguyễn Văn A",
      customerPhone: "0123456789",
      customerEmail: "nguyenvana@email.com",
      movieTitle: "Avatar: The Way of Water",
      showtime: "2024-01-20 19:30",
      room: "Phòng chiếu 1",
      seats: ["A12", "A13"],
      totalAmount: 240000,
      status: "completed",
      paymentMethod: "credit_card",
      orderDate: "2024-01-19 14:30",
      paymentDate: "2024-01-19 14:32"
    },
    {
      id: "ORD002",
      customerName: "Trần Thị B",
      customerPhone: "0987654321",
      customerEmail: "tranthib@email.com",
      movieTitle: "Black Panther: Wakanda Forever",
      showtime: "2024-01-21 20:00",
      room: "Phòng chiếu 2",
      seats: ["B05", "B06"],
      totalAmount: 240000,
      status: "pending",
      paymentMethod: "bank_transfer",
      orderDate: "2024-01-20 10:15",
      paymentDate: null
    },
    {
      id: "ORD003",
      customerName: "Lê Văn C",
      customerPhone: "0555666777",
      customerEmail: "levanc@email.com",
      movieTitle: "Top Gun: Maverick",
      showtime: "2024-01-20 16:00",
      room: "Phòng chiếu 3",
      seats: ["C15"],
      totalAmount: 120000,
      status: "cancelled",
      paymentMethod: "cash",
      orderDate: "2024-01-19 16:45",
      paymentDate: null
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.movieTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = order.orderDate.startsWith(format(dateFilter, 'yyyy-MM-dd'));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">Hoàn thành</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Chờ thanh toán</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      case "refunded":
        return <Badge variant="outline">Đã hoàn tiền</Badge>;
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

  const OrderDetails = ({ order, onClose }) => {
    const [newStatus, setNewStatus] = useState(order.status);

    const handleStatusUpdate = () => {
      // Handle status update
      console.log("Updating order status:", order.id, newStatus);
      onClose();
    };

    const handleRefund = () => {
      // Handle refund
      console.log("Processing refund for order:", order.id);
      onClose();
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Mã đơn hàng</Label>
            <p className="text-sm font-medium">{order.id}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Trạng thái hiện tại</Label>
            <div className="mt-1">{getStatusBadge(order.status)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Khách hàng</Label>
            <p className="text-sm">{order.customerName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Số điện thoại</Label>
            <p className="text-sm">{order.customerPhone}</p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
          <p className="text-sm">{order.customerEmail}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Phim</Label>
            <p className="text-sm">{order.movieTitle}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Suất chiếu</Label>
            <p className="text-sm">{order.showtime}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Phòng</Label>
            <p className="text-sm">{order.room}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Ghế</Label>
            <p className="text-sm">{order.seats.join(", ")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Tổng tiền</Label>
            <p className="text-sm font-medium">{order.totalAmount.toLocaleString('vi-VN')} ₫</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Phương thức thanh toán</Label>
            <div className="mt-1">{getPaymentMethodBadge(order.paymentMethod)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Ngày đặt</Label>
            <p className="text-sm">{new Date(order.orderDate).toLocaleString('vi-VN')}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Ngày thanh toán</Label>
            <p className="text-sm">
              {order.paymentDate ? new Date(order.paymentDate).toLocaleString('vi-VN') : 'Chưa thanh toán'}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <Label className="text-sm font-medium">Cập nhật trạng thái</Label>
          <div className="flex gap-2 mt-2">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusUpdate} disabled={newStatus === order.status}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Cập nhật
            </Button>
          </div>
        </div>

        {order.status === "completed" && (
          <div className="border-t pt-4">
            <Button variant="destructive" onClick={handleRefund}>
              <XCircle className="h-4 w-4 mr-2" />
              Hoàn tiền
            </Button>
          </div>
        )}

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
        <h1 className="text-3xl font-bold text-foreground">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">Xem và quản lý đơn hàng đặt vé của khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-bold">O</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chờ thanh toán</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã hủy</p>
                <p className="text-2xl font-bold text-red-600">
                  {orders.filter(o => o.status === 'cancelled').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
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
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="pending">Chờ thanh toán</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-48">
                    <CalendarComponent className="h-4 w-4 mr-2" />
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

      {/* Orders table */}
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng ngày {format(dateFilter, 'dd/MM/yyyy', { locale: vi })} ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Phim</TableHead>
                <TableHead>Suất chiếu</TableHead>
                <TableHead>Ghế</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.movieTitle}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{order.showtime}</p>
                      <p className="text-xs text-muted-foreground">{order.room}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.seats.join(", ")}</TableCell>
                  <TableCell>{order.totalAmount.toLocaleString('vi-VN')} ₫</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
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

      {/* Order details dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetails 
              order={selectedOrder} 
              onClose={() => {
                setIsViewDialogOpen(false);
                setSelectedOrder(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
