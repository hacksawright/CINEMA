// Minimal in-memory mock database for services layer
// Note: This mirrors the entities used across customer and admin UIs.

const nowIso = () => new Date().toISOString();

const mockMovies = [
  {
    id: "m_1",
    title: "Avatar: The Way of Water",
    genre: "sci-fi",
    duration: 192,
    status: "now_showing",
    release_date: "2024-01-01",
    description: "The saga continues under the sea.",
    poster: "/placeholder.svg?avatar"
  },
  {
    id: "m_2",
    title: "Black Panther: Wakanda Forever",
    genre: "action",
    duration: 161,
    status: "now_showing",
    release_date: "2024-01-05",
    description: "Return to Wakanda.",
    poster: "/placeholder.svg?panther"
  },
  {
    id: "m_3",
    title: "Top Gun: Maverick",
    genre: "action",
    duration: 130,
    status: "coming_soon",
    release_date: "2024-02-01",
    description: "Flying high again.",
    poster: "/placeholder.svg?maverick"
  }
];

const mockTheaters = [
  { id: "t_1", name: "Phòng chiếu 1", total_rows: 10, seats_per_row: 12 },
  { id: "t_2", name: "Phòng chiếu 2", total_rows: 10, seats_per_row: 10 },
  { id: "t_3", name: "Phòng chiếu 3", total_rows: 8, seats_per_row: 10 }
];

const mockShowtimes = [
  { id: "s_1", movie_id: "m_1", theater_id: "t_1", show_date: "2025-10-20", show_time: "19:30", price: 120000, status: "active", created_at: nowIso() },
  { id: "s_2", movie_id: "m_2", theater_id: "t_2", show_date: "2025-10-20", show_time: "20:00", price: 120000, status: "active", created_at: nowIso() },
  { id: "s_3", movie_id: "m_3", theater_id: "t_3", show_date: "2025-10-21", show_time: "16:00", price: 120000, status: "cancelled", created_at: nowIso() }
];

const mockBookings = [
  { id: "b_1", user_id: "u_demo", showtime_id: "s_1", seats: ["A1","A2"], status: "paid", created_at: nowIso(), payment_method: "cash" }
];

const mockTickets = [
  { id: "T001", showtime_id: "s_1", seat: "A12", price: 120000, status: "sold", customer_name: "Nguyễn Văn A", customer_phone: "0123456789", purchase_date: "2025-10-15T14:30:00Z", payment_method: "credit_card" },
  { id: "T002", showtime_id: "s_2", seat: "B05", price: 120000, status: "available", customer_name: null, customer_phone: null, purchase_date: null, payment_method: null },
  { id: "T003", showtime_id: "s_3", seat: "C15", price: 120000, status: "cancelled", customer_name: "Trần Thị B", customer_phone: "0987654321", purchase_date: "2025-10-14T10:15:00Z", payment_method: "cash" }
];

const mockOrders = [
  { id: "ORD001", user_id: "u_demo", showtime_id: "s_1", total_amount: 240000, status: "paid", created_at: nowIso() },
  { id: "ORD002", user_id: "u_demo", showtime_id: "s_2", total_amount: 120000, status: "pending", created_at: nowIso() }
];

const mockTransactions = [
  { id: "TXN001", order_id: "ORD001", amount: 240000, method: "credit_card", status: "success", transaction_date: "2025-10-15T14:32:00Z" },
  { id: "TXN002", order_id: "ORD002", amount: 240000, method: "bank_transfer", status: "pending", transaction_date: "2025-10-16T10:20:00Z" },
  { id: "TXN003", order_id: "ORD003", amount: 120000, method: "cash", status: "success", transaction_date: "2025-10-14T16:50:00Z" },
  { id: "TXN004", order_id: "ORD004", amount: 180000, method: "e_wallet", status: "success", transaction_date: "2025-10-13T20:15:00Z" }
];

const mockStaff = [
  { id: "stf_1", name: "Admin One", role: "manager", email: "admin1@example.com" },
  { id: "stf_2", name: "Staff A", role: "cashier", email: "staffa@example.com" }
];

export const db = {
  movies: mockMovies,
  theaters: mockTheaters,
  showtimes: mockShowtimes,
  bookings: mockBookings,
  tickets: mockTickets,
  orders: mockOrders,
  transactions: mockTransactions,
  staff: mockStaff,
};

export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function id(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}


