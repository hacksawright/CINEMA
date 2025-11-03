import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/services/api.js";
import { Layout } from "@/components/Layout.jsx";
import { SeatSelection } from "@/components/SeatSelection.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns"; 

// Hàm helper để định dạng tiền tệ sang VND
const formatVND = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'N/A VND';
    // Sử dụng Intl.NumberFormat cho định dạng tiền tệ chuẩn Việt Nam
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount);
};


export default function Booking() {
  console.log("🎯 Booking component đã render");
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  console.log("📍 showtimeId từ URL:", showtimeId);
  
  const [showtime, setShowtime] = useState(null);
  const [bookedSeatCodes, setBookedSeatCodes] = useState([]); // Chứa mã ghế đã đặt (vd: ["A1", "A2"])
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { 
    console.log("🔍 useEffect chạy, showtimeId:", showtimeId);
    if (showtimeId) { 
        console.log("✅ showtimeId hợp lệ, bắt đầu fetch");
        fetchShowtimeDetails(); 
    } else {
        console.warn("⚠️ showtimeId không tồn tại");
        setLoading(false);
    }
}, [showtimeId]);

  const fetchShowtimeDetails = async () => {
    try {
        const apiUrl = `/showtimes/${showtimeId}/details`;
        console.log("🔄 Đang tải thông tin showtime ID:", showtimeId);
        console.log("🌐 API URL:", apiUrl);
        
        const response = await api.get(apiUrl);
        const data = response.data; // Dữ liệu từ ShowtimeDetailResponse DTO
        
        console.log("🎬 API trả về:", data);
        console.log("📊 Dữ liệu chi tiết:", {
            showtimeId: data.showtimeId,
            movieTitle: data.movieTitle,
            startsAt: data.startsAt,
            basePrice: data.basePrice,
            totalRows: data.totalRows,
            seatsPerRow: data.seatsPerRow,
            bookedSeatCodes: data.bookedSeatCodes
        });

        // Validate dữ liệu trước khi set state
        if (!data.showtimeId || !data.movieTitle) {
            throw new Error("Dữ liệu showtime không đầy đủ từ API");
        }

        if (!data.totalRows || !data.seatsPerRow) {
            console.warn("⚠️ TotalRows hoặc seatsPerRow không có giá trị. Sử dụng giá trị mặc định.");
        }

        setShowtime({
            id: data.showtimeId,
            movie: { title: data.movieTitle },
            starts_at: new Date(data.startsAt), 
            price: data.basePrice, // <<-- basePrice từ Backend
            theater: {
                total_rows: data.totalRows || 10, // Giá trị mặc định nếu null
                seats_per_row: data.seatsPerRow || 12 // Giá trị mặc định nếu null
            },
        });
        // Lấy danh sách mã ghế đã đặt
        setBookedSeatCodes(data.bookedSeatCodes || []);
        console.log("✅ Đã set showtime state thành công");
        
    } catch (error) {
        console.error("❌ API Fetch Error:", error);
        console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText
        });
        
        // Xử lý lỗi 404/500 từ Backend. Server trả 404 nếu không tìm thấy.
        let errorMessage = "Failed to load booking details";
        if (error.response?.status === 404) {
            errorMessage = "Suất chiếu không tồn tại";
        } else if (error.response?.status === 500) {
            errorMessage = "Lỗi server. Vui lòng thử lại sau.";
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        toast({ 
            title: "Lỗi", 
            description: errorMessage, 
            variant: "destructive" 
        });
        setShowtime(null); // Đặt showtime là null để hiển thị lỗi "not found"
    } finally {
        setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({ title: "Error", description: "Please select at least one seat", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
        // Lấy token từ sessionStorage
        const userId = sessionStorage.getItem('userId'); 
        // Kiểm tra xem token có tồn tại không
        if (!userId) { 
            toast({ title: "Authentication Error", description: "Vui lòng đăng nhập để đặt vé.", variant: "destructive" });
            navigate("/login"); 
            return;
        }
        
        const requestBody = {
            showtimeId: parseInt(showtimeId),
            selectedSeats: selectedSeats, 
            paymentMethod: paymentMethod,
            userId: parseInt(userId) 
        };

        const response = await api.post('/booking', requestBody); 

        const ticketCode = response.data.ticketCode; 

        toast({ 
  title: "Booking successful!", 
  description: `Mã vé của bạn: ${ticketCode}`, 
  variant: "success" 
});

// ⚡ Cập nhật giao diện ngay lập tức
setBookedSeatCodes((prev) => [...prev, ...selectedSeats]);

// Xóa danh sách ghế đang chọn
setSelectedSeats([]);

// Gọi lại API để đồng bộ hóa dữ liệu chính xác từ backend (nếu cần)
await fetchShowtimeDetails();
        
    } catch (error) { 
        // Xử lý lỗi 403 Forbidden (không xác thực) hoặc lỗi nghiệp vụ (ghế đã bị chiếm)
        const status = error.response?.status;
        let errorMessage = "Failed to create booking";
        
        if (status === 403 || status === 401) {
             errorMessage = "Bạn cần đăng nhập để thực hiện giao dịch này.";
        } else if (error.response?.data?.message) {
             errorMessage = error.response.data.message; // Thông báo lỗi nghiệp vụ từ Backend
        }

        toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally { setSubmitting(false); }
  };
    
    // TÍNH TOÁN AN TOÀN TRƯỚC KHI RENDER
  const totalAmount = selectedSeats.length * (showtime?.price || 0);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!showtime) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Không tìm thấy suất chiếu</h2>
              <p className="text-muted-foreground mb-6">
                Suất chiếu với ID {showtimeId} không tồn tại hoặc đã bị xóa.
              </p>
              <Button onClick={() => navigate(-1)} variant="outline">
                Quay lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  

return (
  <Layout>
    <div className="px-4 py-12 max-w-7xl mx-auto"> 
      <h1 className="text-3xl font-bold mb-8">ĐẶT VÉ</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Cột trái: chọn ghế */}
        <div>
          <Card className="mb-6 border-border">
            <CardHeader>
              <CardTitle>{showtime?.movie?.title}</CardTitle>
              <p className="text-muted-foreground">
                {showtime?.starts_at instanceof Date && !isNaN(showtime.starts_at)
                  ? `${format(showtime.starts_at, "EEEE, MMMM d, yyyy")} at ${format(showtime.starts_at, "HH:mm")}`
                  : "Đang tải thông tin..."}
              </p>
            </CardHeader>
          </Card>

          {showtime?.theater?.total_rows && showtime?.theater?.seats_per_row ? (
            <SeatSelection
              totalRows={showtime.theater.total_rows}
              seatsPerRow={showtime.theater.seats_per_row}
              bookedSeats={bookedSeatCodes}
              selectedSeats={selectedSeats}
              onSeatsChange={setSelectedSeats}
            />
          ) : (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Đang tải thông tin phòng chiếu...
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ✅ Cột phải: Booking Summary (được căn giữa) */}
        <div className="flex justify-center items-center lg:sticky lg:top-24 h-fit">
          <Card className="border-border w-full max-w-sm">
            <CardHeader>
              <CardTitle>Tổng quan</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ghế đã chọn</p>
                <p className="font-semibold">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Trống"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Giá vé</p>
                <p className="font-semibold">{formatVND(showtime?.price)}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1">Tổng thanh toán</p>
                <p className="text-2xl font-bold text-primary">{formatVND(totalAmount)}</p>
              </div>

              <div>
                <Label className="text-base mb-3 block">Hình thức thanh toán</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="cursor-pointer">
                      Tiền mặt
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_transfer" id="bank" />
                    <Label htmlFor="bank" className="cursor-pointer">
                      Chuyển khoản
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? "Processing..." : "Xác nhận"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="my-8 h-4"></div> {/* Vùng đệm */}
    </div>
  </Layout>
);
}