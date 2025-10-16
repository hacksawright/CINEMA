import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const SeatSelection = ({ totalRows, seatsPerRow, bookedSeats, onSeatsChange }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const rows = Array.from({ length: totalRows }, (_, i) => String.fromCharCode(65 + i));
  const seats = Array.from({ length: seatsPerRow }, (_, i) => i + 1);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    const newSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter(s => s !== seatId)
      : [...selectedSeats, seatId];
    
    setSelectedSeats(newSeats);
    onSeatsChange(newSeats);
  };

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-6 rounded-lg">
        <div className="text-center mb-8">
          <div className="w-full h-2 bg-gradient-to-b from-muted to-transparent rounded-t-full mb-2" />
          <p className="text-sm text-muted-foreground">SCREEN</p>
        </div>

        <div className="space-y-2">
          {rows.map(row => (
            <div key={row} className="flex items-center justify-center gap-2">
              <span className="w-6 text-sm text-muted-foreground font-medium">{row}</span>
              <div className="flex gap-2">
                {seats.map(seat => {
                  const seatId = `${row}${seat}`;
                  const status = getSeatStatus(seatId);
                  
                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      disabled={status === "booked"}
                      className={cn(
                        "w-8 h-8 rounded-t-lg text-xs font-medium transition-all duration-200",
                        status === "available" && "bg-muted hover:bg-muted/70 text-foreground hover:scale-110",
                        status === "selected" && "bg-primary text-primary-foreground scale-110 shadow-lg",
                        status === "booked" && "bg-destructive/20 text-destructive cursor-not-allowed"
                      )}
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

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-muted" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-primary" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-destructive/20" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Selected Seats:</p>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seat => (
              <Badge key={seat} variant="secondary">{seat}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


