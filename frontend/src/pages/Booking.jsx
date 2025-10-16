import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout.jsx";
import { SeatSelection } from "@/components/SeatSelection.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Booking() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { if (showtimeId) { fetchShowtimeDetails(); } }, [showtimeId]);

  const fetchShowtimeDetails = async () => {
    try {
      const { data: showtimeData, error: showtimeError } = await supabase
        .from("showtimes")
        .select("*")
        .eq("id", showtimeId)
        .single();
      if (showtimeError) throw showtimeError;
      // hydrate minimal nested fields used in UI
      const movie = (await supabase.from("movies").select("*").eq("id", showtimeData.movie_id).single()).data;
      const theater = (await supabase.from("theaters").select("*").eq("id", showtimeData.theater_id).single()).data;
      setShowtime({ ...showtimeData, movie: { title: movie?.title }, theater: { total_rows: theater?.total_rows, seats_per_row: theater?.seats_per_row } });

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("seats")
        .eq("showtime_id", showtimeId)
        .in("status", ["paid", "processing"]);
      if (bookingsError) throw bookingsError;
      const allBookedSeats = bookingsData?.flatMap(b => b.seats) || [];
      setBookedSeats(allBookedSeats);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load booking details", variant: "destructive" });
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const totalAmount = selectedSeats.length * (showtime?.price || 0);
      const ticketCode = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        showtime_id: showtimeId,
        seats: selectedSeats,
        total_amount: totalAmount,
        status: paymentMethod === "cash" ? "pending" : "processing",
        payment_method: paymentMethod,
        ticket_code: ticketCode,
      });

      if (error) throw error;
      toast({ title: "Booking successful!", description: `Your ticket code: ${ticketCode}` });
      navigate("/account");
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to create booking", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!showtime) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Showtime not found</p>
        </div>
      </Layout>
    );
  }

  const totalAmount = selectedSeats.length * showtime.price;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Book Your Seats</h1>
        
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div>
            <Card className="mb-6 border-border">
              <CardHeader>
                <CardTitle>{showtime.movie.title}</CardTitle>
                <p className="text-muted-foreground">
                  {format(new Date(showtime.show_date), "EEEE, MMMM d, yyyy")} at {showtime.show_time.substring(0, 5)}
                </p>
              </CardHeader>
            </Card>

            <SeatSelection
              totalRows={showtime.theater.total_rows}
              seatsPerRow={showtime.theater.seats_per_row}
              bookedSeats={bookedSeats}
              onSeatsChange={setSelectedSeats}
            />
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Selected Seats</p>
                  <p className="font-semibold">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price per seat</p>
                  <p className="font-semibold">${showtime.price.toFixed(2)}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</p>
                </div>

                <div>
                  <Label className="text-base mb-3 block">Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="cursor-pointer">Cash (Pay at counter)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank" />
                      <Label htmlFor="bank" className="cursor-pointer">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={handleBooking} disabled={selectedSeats.length === 0 || submitting} className="w-full" size="lg">
                  {submitting ? "Processing..." : "Confirm Booking"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}


