import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout.jsx";
import { SeatSelection } from "@/components/SeatSelection.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getShowtimeSeatInfo, createBooking } from "@/services/customer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, parse } from "date-fns";

export default function Booking() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtimeDetails, setShowtimeDetails] = useState(null);
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
      toast({ title: "Error", description: "Showtime ID is missing", variant: "destructive" });
      navigate("/");
    }
  }, [showtimeId]);

  const fetchShowtimeDetails = async () => {
    setLoading(true);
    try {
      const data = await getShowtimeSeatInfo(showtimeId);
      setShowtimeDetails(data);
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to load booking details", variant: "destructive" });
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
      if (!user) {
        toast({ title: "Authentication required", description: "Please sign in to book tickets.", variant: "destructive" });
        navigate("/auth");
        return;
      }

      const bookingData = await createBooking({
        userId: user.id,
        showtimeId: parseInt(showtimeId, 10),
        seats: selectedSeats,
        paymentMethod: paymentMethod,
      });

      toast({ title: "Booking successful!", description: `Your ticket code: ${bookingData.ticket_code}` });
      navigate("/account");

    } catch (error) {
      toast({ title: "Booking Failed", description: error.message || "Failed to create booking", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading showtime details...</p>
        </div>
      </Layout>
    );
  }

  if (!showtimeDetails) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Showtime not found or failed to load.</p>
        </div>
      </Layout>
    );
  }

  const totalAmount = selectedSeats.length * (showtimeDetails.price || 0);
  const showDateObj = parseISO(showtimeDetails.show_date + 'T00:00:00');
  const showTimeStr = showtimeDetails.show_time.substring(0, 5);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Book Your Seats</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div>
            <Card className="mb-6 border-border">
              <CardHeader>
                <CardTitle>{showtimeDetails.movie.title}</CardTitle>
                <p className="text-muted-foreground">
                  {format(showDateObj, "EEEE, MMMM d, yyyy")} at {showTimeStr}
                </p>
              </CardHeader>
            </Card>

            <SeatSelection
              totalRows={showtimeDetails.theater.total_rows}
              seatsPerRow={showtimeDetails.theater.seats_per_row}
              bookedSeats={showtimeDetails.bookedSeatIds || []}
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
                  <p className="font-semibold">{showtimeDetails.price ? showtimeDetails.price.toLocaleString('vi-VN') : 'N/A'} ₫</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">{totalAmount.toLocaleString('vi-VN')} ₫</p>
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