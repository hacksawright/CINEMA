import { api } from '@/lib/api';
import { db, delay } from "./mockDb";

export async function getMovies() {
  await delay(); return [...db.movies];
}

export async function getMovieById(movieId) {
  await delay(); return db.movies.find(m => m.id === movieId) ?? null;
}

export async function getShowtimesByMovie(movieId, fromDateIso) {
   await delay();
   const from = fromDateIso ?? new Date().toISOString().split("T")[0];
   return db.showtimes
     .filter(s => s.movie_id === movieId && String(s.show_date) >= String(from))
     .sort((a,b) => (a.show_date + a.show_time).localeCompare(b.show_date + b.show_time));
}

export async function getShowtimeSeatInfo(showtimeId) {
  const data = await api.getShowtimeSeatInfo(showtimeId);
  return {
      id: data.showtimeId,
      movie: { title: data.movieTitle },
      theater: {
          total_rows: data.totalRows,
          seats_per_row: data.seatsPerRow,
      },
      show_date: data.showDate,
      show_time: data.showTime,
      price: data.pricePerSeat,
      bookedSeatIds: data.bookedSeatIds || []
  };
}

export async function createBooking({ userId, showtimeId, seats, paymentMethod }) {
  const payload = {
    showtimeId: showtimeId,
    selectedSeats: seats,
    paymentMethod: paymentMethod,
  };
  const responseData = await api.createBooking(payload);
  return {
      id: responseData.bookingId,
      user_id: userId,
      showtime_id: showtimeId,
      seats: responseData.seats,
      status: responseData.status,
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
      total_amount: responseData.totalAmount,
      ticket_code: responseData.ticketCode
  };
}

export async function cancelBooking(bookingId) {
  return api.cancelBookingUser(bookingId);
}

export async function getUserBookings(userId) {
  const orders = await api.getUserBookings();
  return orders.map(order => ({
      id: order.id.toString(),
      user_id: userId,
      showtime_id: null,
      seats: order.seatLabels || [],
      status: order.status.toLowerCase(),
      payment_method: order.paymentMethod,
      created_at: order.orderDate,
      total_amount: order.totalAmount,
      ticket_code: order.ticketCode,
      showtime: {
          movie: { title: order.movieTitle },
          show_date: order.showtimeStartsAt ? order.showtimeStartsAt.split('T')[0] : null,
          show_time: order.showtimeStartsAt ? order.showtimeStartsAt.split('T')[1]?.substring(0, 8) : null,
      }
  }));
}