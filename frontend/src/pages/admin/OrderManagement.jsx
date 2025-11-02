import { useState, useEffect } from "react";
import { Search, Filter, Eye, RefreshCw, CheckCircle, XCircle, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { listOrders, getOrderDetailsAdmin, updateOrder } from "@/services/admin";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(new Date());
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { toast } = useToast();

  const fetchOrders = async () => {
      setLoading(true);
      try {
          const data = await listOrders();
          setOrders(data || []);
      } catch (error) {
          toast({ title: "Lỗi", description: `Không thể tải danh sách đơn hàng: ${error.message}`, variant: "destructive"});
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchOrders();
  }, [toast]);

  const handleOpenViewDialog = async (orderId) => {
      setIsViewDialogOpen(true);
      setSelectedOrderDetail(null);
      setLoadingDetail(true);
      try {
          const data = await getOrderDetailsAdmin(orderId);
          setSelectedOrderDetail(data);
      } catch (error) {
           toast({ title: "Lỗi", description: `Không thể tải chi tiết đơn hàng: ${error.message}`, variant: "destructive"});
           setIsViewDialogOpen(false);
      } finally {
          setLoadingDetail(false);
      }
  };

  const filteredOrders = orders.filter(order => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = (order.id?.toString().toLowerCase().includes(lowerSearchTerm) ||
                         order.ticketCode?.toLowerCase().includes(lowerSearchTerm) ||
                         order.customerName?.toLowerCase().includes(lowerSearchTerm) ||
                         order.movieTitle?.toLowerCase().includes(lowerSearchTerm));
    const matchesStatus = statusFilter === "all" || 
                         (order.status?.toUpperCase() === statusFilter.toUpperCase());
    let matchesDate = true;
     if (order.orderDate) {
         try {
             const orderDateStr = format(parseISO(order.orderDate), 'yyyy-MM-dd');
             const filterDateStr = format(dateFilter, 'yyyy-MM-dd');
             matchesDate = orderDateStr === filterDateStr;
         } catch { matchesDate = false;}
     }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="outline">Không xác định</Badge>;
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case "completed": return <Badge className="bg-green-600">Hoàn thành</Badge>;
      case "pending": return <Badge className="bg-yellow-600">Chờ xác nhận/TT</Badge>;
      case "processing": return <Badge className="bg-blue-600">Đang xử lý TT</Badge>;
      case "cancelled": return <Badge variant="destructive">Đã hủy</Badge>;
      case "refunded": return <Badge variant="outline">Đã hoàn tiền</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

   const getPaymentMethodBadge = (method) => {
     if (!method) return <Badge variant="outline">-</Badge>;
     const lowerMethod = method.toLowerCase();
     switch (lowerMethod) {
       case "credit_card": return <Badge variant="outline">Thẻ tín dụng</Badge>;
       case "cash": return <Badge variant="outline">Tiền mặt</Badge>;
       case "bank_transfer": return <Badge variant="outline">Chuyển khoản</Badge>;
       case "e_wallet": return <Badge variant="outline">Ví điện tử</Badge>;
       default: return <Badge variant="outline">{method}</Badge>;
     }
   };

   const OrderDetails = ({ order, onClose }) => {
     const [newStatus, setNewStatus] = useState(order.status?.toUpperCase() || order.status);
     const [isUpdating, setIsUpdating] = useState(false);

     const handleStatusUpdate = async () => {
       setIsUpdating(true);
       try {
         const updatedOrder = await updateOrder(order.id, { status: newStatus });
         setSelectedOrderDetail(updatedOrder);
         setOrders(prevOrders => prevOrders.map(o => o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o));
         toast({ title: "Thành công", description: "Đã cập nhật trạng thái đơn hàng." });
         setNewStatus(updatedOrder.status);
       } catch (error) {
         toast({ title: "Lỗi", description: `Không thể cập nhật trạng thái: ${error.message}`, variant: "destructive" });
       } finally {
         setIsUpdating(false);
       }
     };

     const handleRefund = () => {
       console.log("Processing refund for order:", order.id);
       toast({ title: "Chức năng đang phát triển", description: "Hoàn tiền chưa được hỗ trợ." });
     };

     const formatDateTime = (dateTimeString) => {
         if (!dateTimeString) return '-';
         try {
             return format(parseISO(dateTimeString), 'dd/MM/yyyy HH:mm:ss');
         } catch {
             return 'Invalid Date';
         }
     };
      const showtimeDateTime = order.showtimeStartsAt ? formatDateTime(order.showtimeStartsAt) : '-';

     return (
       <div className="space-y-4">
         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Mã đơn hàng</Label>
             <p className="text-sm font-medium">{order.id}</p>
           </div>
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Mã Vé</Label>
             <p className="text-sm font-medium">{order.ticketCode}</p>
           </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
           <div>
            <Label className="text-sm font-medium text-muted-foreground">Trạng thái hiện tại</Label>
            <div className="mt-1">{getStatusBadge(order.status)}</div>
           </div>
            <div>
               <Label className="text-sm font-medium text-muted-foreground">Phương thức thanh toán</Label>
               <div className="mt-1">{getPaymentMethodBadge(order.paymentMethod)}</div>
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

         {order.customerEmail && (
              <div>
                 <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                 <p className="text-sm">{order.customerEmail}</p>
              </div>
         )}


         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Phim</Label>
             <p className="text-sm">{order.movieTitle}</p>
           </div>
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Suất chiếu</Label>
             <p className="text-sm">{showtimeDateTime}</p>
           </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Phòng</Label>
             <p className="text-sm">{order.roomName}</p>
           </div>
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Ghế</Label>
             <p className="text-sm">{order.seatLabels?.join(", ")}</p>
           </div>
         </div>

         <div>
            <Label className="text-sm font-medium text-muted-foreground">Tổng tiền</Label>
            <p className="text-sm font-medium">{order.totalAmount?.toLocaleString('vi-VN')} ₫</p>
         </div>


         <div className="grid grid-cols-2 gap-4">
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Ngày đặt</Label>
             <p className="text-sm">{formatDateTime(order.orderDate)}</p>
           </div>
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Ngày thanh toán</Label>
             <p className="text-sm">{formatDateTime(order.paymentDate)}</p>
           </div>
         </div>

          {(order.transactions && order.transactions.length > 0) && (
              <div>
                  <Label className="text-sm font-medium text-muted-foreground">Lịch sử giao dịch</Label>
                  <ul className="list-disc list-inside text-sm mt-1">
                      {order.transactions.map(tx => (
                          <li key={tx.id}>
                              {formatDateTime(tx.transactionDate)} - {tx.paymentMethod} - {tx.amount?.toLocaleString('vi-VN')} ₫ - {getStatusBadge(tx.status)}
                          </li>
                      ))}
                  </ul>
              </div>
          )}


         <div className="border-t pt-4">
           <Label className="text-sm font-medium">Cập nhật trạng thái</Label>
           <div className="flex gap-2 mt-2">
             <Select value={newStatus} onValueChange={setNewStatus} disabled={isUpdating}>
               <SelectTrigger className="flex-1">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="PENDING">Chờ xác nhận/TT</SelectItem>
                 <SelectItem value="PROCESSING">Đang xử lý TT</SelectItem>
                 <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                 <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                 <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
               </SelectContent>
             </Select>
             <Button onClick={handleStatusUpdate} disabled={newStatus?.toUpperCase() === order.status?.toUpperCase() || isUpdating}>
               {isUpdating ? "Đang cập nhật..." : <><RefreshCw className="h-4 w-4 mr-2" /> Cập nhật</>}
             </Button>
           </div>
         </div>

         {(order.status?.toUpperCase() === "COMPLETED" || order.status?.toUpperCase() === "PROCESSING") && (
           <div className="border-t pt-4">
             <Button variant="destructive" onClick={handleRefund} disabled={isUpdating}>
               <XCircle className="h-4 w-4 mr-2" />
               Hoàn tiền (Chưa hoạt động)
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

   const totalOrders = orders.length;
   const completedOrders = orders.filter(o => o.status?.toUpperCase() === 'COMPLETED').length;
   const pendingOrders = orders.filter(o => {
     const status = o.status?.toUpperCase();
     return status === 'PENDING' || status === 'PROCESSING';
   }).length;
   const cancelledOrders = orders.filter(o => o.status?.toUpperCase() === 'CANCELLED').length;


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">Xem và quản lý đơn hàng đặt vé của khách hàng</p>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card><CardContent className="p-4"><p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p><p className="text-2xl font-bold">{totalOrders}</p></CardContent></Card>
         <Card><CardContent className="p-4"><p className="text-sm font-medium text-muted-foreground">Hoàn thành</p><p className="text-2xl font-bold text-green-600">{completedOrders}</p></CardContent></Card>
         <Card><CardContent className="p-4"><p className="text-sm font-medium text-muted-foreground">Chờ xử lý</p><p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p></CardContent></Card>
         <Card><CardContent className="p-4"><p className="text-sm font-medium text-muted-foreground">Đã hủy</p><p className="text-2xl font-bold text-red-600">{cancelledOrders}</p></CardContent></Card>
       </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo Mã đơn, Tên KH, Phim..."
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
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="PENDING">Chờ xác nhận/TT</SelectItem>
                  <SelectItem value="PROCESSING">Đang xử lý TT</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-48">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(dateFilter, 'dd/MM/yyyy', { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dateFilter}
                    onSelect={(date) => date && setDateFilter(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng ngày {format(dateFilter, 'dd/MM/yyyy', { locale: vi })} ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
           {loading ? <p className="text-center text-muted-foreground">Đang tải...</p> : (
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn/Vé</TableHead>
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
                  {filteredOrders.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center">Không có đơn hàng nào khớp.</TableCell></TableRow>
                  ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.ticketCode || order.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.movieTitle}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{order.showtimeStartsAt ? format(parseISO(order.showtimeStartsAt), 'HH:mm dd/MM') : '-'}</p>
                              <p className="text-xs text-muted-foreground">{order.roomName}</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.seatLabels?.join(", ")}</TableCell>
                          <TableCell>{order.totalAmount?.toLocaleString('vi-VN')} ₫</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenViewDialog(order.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
            </Table>
           )}
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>
          {loadingDetail ? <p>Đang tải chi tiết...</p> :
           selectedOrderDetail ? (
            <OrderDetails
              order={selectedOrderDetail}
              onClose={() => setIsViewDialogOpen(false)}
            />
          ) : <p>Không thể tải chi tiết đơn hàng.</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;