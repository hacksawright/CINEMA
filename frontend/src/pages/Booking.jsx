import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Layout } from "@/components/Layout.jsx";
import { SeatSelection } from "@/components/SeatSelection.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Cổng của Backend Server. Thay đổi cổng này nếu Backend không chạy ở 8080.
const API_BASE_URL = 'http://localhost:8080/api'; 

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
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [bookedSeatCodes, setBookedSeatCodes] = useState([]); // Chứa mã ghế đã đặt (vd: ["A1", "A2"])
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { 
    if (showtimeId) { 
        fetchShowtimeDetails(); 
    } else {
        setLoading(false);
    }
}, [showtimeId]);

  const fetchShowtimeDetails = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/showtimes/${showtimeId}/details`);
        const data = response.data; // Dữ liệu từ ShowtimeDetailResponse DTO
        
        console.log("🎬 API trả về:", data);

        setShowtime({
            id: data.showtimeId,
            movie: { title: data.movieTitle },
            starts_at: new Date(data.startsAt), 
            price: data.basePrice, // <<-- basePrice từ Backend
            theater: {
                total_rows: data.totalRows,
                seats_per_row: data.seatsPerRow
            },
        });
        // Lấy danh sách mã ghế đã đặt
        setBookedSeatCodes(data.bookedSeatCodes || []);
 
        
    } catch (error) {
        console.error("API Fetch Error:", error);
        // Xử lý lỗi 404/500 từ Backend. Server trả 404 nếu không tìm thấy.
        toast({ title: "Error", description: "Failed to load booking details", variant: "destructive" });
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

        const response = await axios.post(`${API_BASE_URL}/booking`, requestBody, {

        }); 

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
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Showtime not found</p>
        </div>
      </Layout>
    );
  }
  

return (
  <Layout>
    <div className="px-4 py-12 max-w-7xl mx-auto"> 
      <h1 className="text-3xl font-bold mb-8">Book Your Seats</h1>

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

          <SeatSelection
            totalRows={showtime?.theater?.total_rows}
            seatsPerRow={showtime?.theater?.seats_per_row}
            bookedSeats={bookedSeatCodes}
            onSeatsChange={setSelectedSeats}
          />
        </div>

        {/* ✅ Cột phải: Booking Summary (được căn giữa) */}
        <div className="flex justify-center items-center lg:sticky lg:top-24 h-fit">
          <Card className="border-border w-full max-w-sm">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Selected Seats</p>
                <p className="font-semibold">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Price per seat</p>
                <p className="font-semibold">{formatVND(showtime?.price)}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-primary">{formatVND(totalAmount)}</p>
              </div>

              <div>
                <Label className="text-base mb-3 block">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="cursor-pointer">
                      Cash (Pay at counter)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank_transfer" id="bank" />
                    <Label htmlFor="bank" className="cursor-pointer">
                      Bank Transfer
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
                {submitting ? "Processing..." : "Confirm Booking"}
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
