import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Account() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }
    setUser(user);
    fetchBookings(user.id);
  };

  const fetchBookings = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể tải danh sách đặt vé", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "canceled" })
        .eq("id", bookingId);
      if (error) throw error;
      toast({ title: "Đã hủy đặt vé" });
      if (user) { fetchBookings(user.id); }
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể hủy đặt vé", variant: "destructive" });
    }
  };

  const getStatusBadge = (status) => {
    const variants = { paid: "default", pending: "secondary", processing: "secondary", canceled: "destructive" };
    const statusText = {
      paid: "Đã Thanh Toán",
      pending: "Chờ Thanh Toán", 
      processing: "Đang Xử Lý",
      canceled: "Đã Hủy"
    };
    return <Badge variant={variants[status] || "default"}>{statusText[status] || status.toUpperCase()}</Badge>;
  };

  const paidBookings = bookings.filter(b => b.status === "paid");
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
          <TabsList>
            <TabsTrigger value="all">Tất Cả Đặt Vé</TabsTrigger>
            <TabsTrigger value="paid">Đã Thanh Toán ({paidBookings.length})</TabsTrigger>
            <TabsTrigger value="pending">Chờ Thanh Toán ({pendingBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <BookingsList bookings={bookings} onCancel={handleCancelBooking} getStatusBadge={getStatusBadge} />
          </TabsContent>

          <TabsContent value="paid" className="mt-6">
            <BookingsList bookings={paidBookings} onCancel={handleCancelBooking} getStatusBadge={getStatusBadge} />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <BookingsList bookings={pendingBookings} onCancel={handleCancelBooking} getStatusBadge={getStatusBadge} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function BookingsList({ bookings, onCancel, getStatusBadge }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy đặt vé nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <Card key={booking.id} className="border-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{booking.showtime?.movie?.title || "Phim"}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(booking.showtime?.show_date || booking.created_at), "dd/MM/yyyy")} lúc {String(booking.showtime?.show_time || "00:00").substring(0, 5)}
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
                <p className="font-semibold">{booking.total_amount.toFixed(0)} VNĐ</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mã Vé</p>
                <p className="font-semibold font-mono text-primary">{booking.ticket_code || "N/A"}</p>
              </div>
            </div>
            {booking.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <Button variant="destructive" size="sm" onClick={() => onCancel(booking.id)}>
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


