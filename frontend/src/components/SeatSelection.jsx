import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const SeatSelection = ({
  totalRows,
  seatsPerRow,
  bookedSeats = [],
  selectedSeats: parentSelectedSeats = [], // ✅ nhận từ Booking.jsx
  onSeatsChange,
  allSeats = [] // ✅ Nhận thông tin tất cả ghế với type
}) => {
  const [selectedSeats, setSelectedSeats] = useState(parentSelectedSeats);

  // ✅ Đồng bộ lại khi Booking.jsx reset hoặc thay đổi danh sách ghế
  useEffect(() => {
    setSelectedSeats(parentSelectedSeats);
  }, [parentSelectedSeats]);

  // Validate và sử dụng giá trị mặc định nếu không có
  const validTotalRows = totalRows && totalRows > 0 ? totalRows : 10;
  const validSeatsPerRow = seatsPerRow && seatsPerRow > 0 ? seatsPerRow : 12;

  const rows = Array.from({ length: validTotalRows }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const seats = Array.from({ length: validSeatsPerRow }, (_, i) => i + 1);

  // ✅ Hàm lấy thông tin ghế từ allSeats
  const getSeatInfo = (seatId) => {
    const rowLabel = seatId.charAt(0);
    const seatNumber = parseInt(seatId.substring(1));
    return allSeats.find(
      seat => seat.rowLabel === rowLabel && seat.seatNumber === seatNumber
    );
  };

  const toggleSeat = (seatId) => {
    const seatInfo = getSeatInfo(seatId);

    // Không cho phép chọn ghế đã đặt hoặc ghế hỏng
    if (bookedSeats.includes(seatId) || seatInfo?.type === 'DISABLED') return;

    const newSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter((s) => s !== seatId)
      : [...selectedSeats, seatId];

    setSelectedSeats(newSeats);
    onSeatsChange(newSeats);
  };

  const getSeatStatus = (seatId) => {
    const seatInfo = getSeatInfo(seatId);
    if (seatInfo?.type === 'DISABLED') return "disabled";
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  // ✅ Hàm lấy màu sắc theo loại ghế
  const getSeatColor = (seatId, status) => {
    const seatInfo = getSeatInfo(seatId);

    if (status === "disabled") return "#1a1a1a"; // Ghế hỏng - màu đen
    if (status === "booked") return "#3B1F23"; // Ghế đã đặt - màu đỏ đậm
    if (status === "selected") return "#F74C56"; // Ghế đang chọn - màu đỏ

    // Ghế available - màu theo type
    switch (seatInfo?.type) {
      case 'VIP':
        return "#FFD700"; // Vàng gold cho VIP
      case 'COUPLE':
        return "#FF69B4"; // Hồng cho ghế đôi
      case 'STANDARD':
      default:
        return "#2B2F38"; // Xám cho ghế thường
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-6 rounded-lg">
        {/* SCREEN */}
        <div className="text-center mb-8">
          <div className="w-full h-2 bg-gradient-to-b from-muted to-transparent rounded-t-full mb-2" />
          <p className="text-sm text-muted-foreground">SCREEN</p>
        </div>

        {/* SEAT GRID */}
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-2">
              <span className="w-6 text-sm text-muted-foreground font-medium">{row}</span>
              <div className="flex gap-2">
                {seats.map((seat) => {
                  const seatId = `${row}${seat}`;
                  const status = getSeatStatus(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      disabled={status === "booked" || status === "disabled"}
                      className={cn(
                        "w-8 h-8 rounded-t-full text-xs font-medium transition-all duration-200 flex items-center justify-center",
                        status === "available" && "hover:scale-110",
                        status === "selected" && "scale-110 shadow-lg",
                        (status === "booked" || status === "disabled") && "opacity-70 cursor-not-allowed"
                      )}
                      style={{
                        backgroundColor: getSeatColor(seatId, status),
                        color: "#fff",
                      }}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEGEND */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-full bg-[#2B2F38]" />
          <span className="text-muted-foreground">Standard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-full" style={{ backgroundColor: "#FFD700" }} />
          <span className="text-muted-foreground">VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-full" style={{ backgroundColor: "#FF69B4" }} />
          <span className="text-muted-foreground">Couple</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-full bg-[#F74C56]" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-full bg-[#3B1F23]" />
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-full bg-[#1a1a1a]" />
          <span className="text-muted-foreground">Disabled</span>
        </div>
      </div>

      {/* SELECTED SEATS BADGE */}
      {selectedSeats.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Selected Seats:</p>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <Badge key={seat} variant="secondary">
                {seat}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
