import { db, delay, id } from "./mockDb";

export async function getMovies() {
  await delay();
  return [...db.movies];
}

export async function getMovieById(movieId) {
  await delay();
  return db.movies.find(m => m.id === movieId) ?? null;
}

export async function getShowtimesByMovie(movieId, fromDateIso) {
  await delay();
  const from = fromDateIso ?? new Date().toISOString().split("T")[0];
  return db.showtimes
    .filter(s => s.movie_id === movieId && String(s.show_date) >= String(from))
    .sort((a,b) => (a.show_date + a.show_time).localeCompare(b.show_date + b.show_time));
}

export async function getShowtime(showtimeId) {
  await delay();
  const s = db.showtimes.find(s => s.id === showtimeId);
  if (!s) return null;
  const movie = db.movies.find(m => m.id === s.movie_id);
  const theater = db.theaters.find(t => t.id === s.theater_id);
  return { ...s, movie, theater };
}

export async function getBookedSeats(showtimeId) {
  await delay();
  const booked = db.bookings
    .filter(b => b.showtime_id === showtimeId && ["paid","processing"].includes(b.status))
    .flatMap(b => b.seats);
  return booked;
}

export async function createBooking({ userId, showtimeId, seats, paymentMethod }) {
  await delay();
  const booking = {
    id: id("b"),
    user_id: userId,
    showtime_id: showtimeId,
    seats: [...seats],
    status: paymentMethod === "cash" ? "paid" : "processing",
    payment_method: paymentMethod,
    created_at: new Date().toISOString(),
  };
  db.bookings.push(booking);
  return booking;
}

export async function cancelBooking(bookingId) {
  await delay();
  const b = db.bookings.find(b => b.id === bookingId);
  if (!b) return null;
  b.status = "canceled";
  return b;
}

export async function getUserBookings(userId) {
  await delay();
  return db.bookings
    .filter(b => b.user_id === userId)
    .sort((a,b)=> String(b.created_at).localeCompare(String(a.created_at)));
}


