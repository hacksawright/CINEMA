import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { getUserBookings, cancelBooking } from "@/services/customer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";


export default function Account() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }
    setUser(user);
    fetchBookings(user.id);
  };

  const fetchBookings = async (userId) => {
    setLoading(true);
    try {
      const data = await getUserBookings(userId);
      setBookings(data || []);
    } catch (error) {
      toast({ title: "Lỗi", description: `Không thể tải danh sách đặt vé: ${error.message}`, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleCancelBookingConfirm = async () => {
      if (!cancellingId) return;
      const bookingIdToCancel = cancellingId;
      setCancellingId(null);

      try {
          await cancelBooking(bookingIdToCancel);
          toast({ title: "Thành công", description: "Đã gửi yêu cầu hủy đặt vé." });
           if (user) { fetchBookings(user.id); }
      } catch (error) {
           toast({ title: "Lỗi", description: `Không thể hủy đặt vé: ${error.message}`, variant: "destructive" });
      }
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="outline">Không xác định</Badge>;
     const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case "completed": return <Badge className="bg-green-600">Hoàn thành</Badge>;
      case "pending": return <Badge className="bg-yellow-600">Chờ xác nhận/TT</Badge>;
      case "processing": return <Badge className="bg-blue-600">Đang xử lý TT</Badge>;
      case "cancelled": return <Badge variant="destructive">Đã hủy</Badge>;
      case "refunded": return <Badge variant="outline">Đã hoàn tiền</Badge>;
      default: return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

   const paidBookings = bookings.filter(b => b.status === "completed");
   const pendingBookings = bookings.filter(b => b.status === "pending" || b.status === "processing");

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Tài Khoản Của Tôi</h1>
        <p className="text-muted-foreground mb-8">{user?.email}</p>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tất Cả ({bookings.length})</TabsTrigger>
            <TabsTrigger value="paid">Hoàn thành ({paidBookings.length})</TabsTrigger>
            <TabsTrigger value="pending">Chờ xử lý ({pendingBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <BookingsList bookings={bookings} onCancelRequest={(id) => setCancellingId(id)} getStatusBadge={getStatusBadge} />
          </TabsContent>
          <TabsContent value="paid" className="mt-6">
             <BookingsList bookings={paidBookings} onCancelRequest={(id) => setCancellingId(id)} getStatusBadge={getStatusBadge} />
          </TabsContent>
          <TabsContent value="pending" className="mt-6">
             <BookingsList bookings={pendingBookings} onCancelRequest={(id) => setCancellingId(id)} getStatusBadge={getStatusBadge} />
          </TabsContent>
        </Tabs>
      </div>

       <AlertDialog open={!!cancellingId} onOpenChange={(open) => { if (!open) setCancellingId(null); }}>
          <AlertDialogContent>
             <AlertDialogHeader>
               <AlertDialogTitle>Xác nhận hủy đặt vé?</AlertDialogTitle>
               <AlertDialogDescription>
                 Bạn có chắc chắn muốn hủy đặt vé với mã {bookings.find(b => b.id === cancellingId)?.ticket_code}? Hành động này có thể không được hoàn tiền tùy theo chính sách.
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel onClick={() => setCancellingId(null)}>Không</AlertDialogCancel>
               <AlertDialogAction onClick={handleCancelBookingConfirm} className={cn(buttonVariants({ variant: "destructive" }))}>
                 Xác nhận hủy
               </AlertDialogAction>
             </AlertDialogFooter>
          </AlertDialogContent>
       </AlertDialog>
    </Layout>
  );
}

function BookingsList({ bookings, onCancelRequest, getStatusBadge }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy đặt vé nào</p>
      </div>
    );
  }

     const formatDateTime = (dateTimeString) => {
         if (!dateTimeString) return '-';
         try {
              const dateToFormat = dateTimeString;
              if (!dateToFormat) return '-';
             return format(parseISO(dateToFormat), 'dd/MM/yyyy HH:mm');
         } catch {
             return 'Invalid Date';
         }
     };

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <Card key={booking.id} className="border-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{booking.showtime?.movie?.title || booking.movieTitle || "Phim"}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                   Suất: {formatDateTime(booking.showtimeStartsAt)} - Phòng: {booking.roomName || '?'}
                </p>
              </div>
              {getStatusBadge(booking.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ghế Ngồi</p>
                <p className="font-semibold">{booking.seats.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tổng Tiền</p>
                <p className="font-semibold">{booking.total_amount?.toLocaleString('vi-VN')} ₫</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mã Vé</p>
                <p className="font-semibold font-mono text-primary">{booking.ticket_code || "N/A"}</p>
              </div>
            </div>
            {(booking.status === "pending" || booking.status === "processing") && (
              <div className="mt-4 flex gap-2">
                 <Button variant="destructive" size="sm" onClick={() => onCancelRequest(booking.id)}>
                   Hủy Đặt Vé
                 </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}