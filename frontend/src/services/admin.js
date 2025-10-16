import { db, delay, id } from "./mockDb";

// Movies
export async function listMovies() { await delay(); return [...db.movies]; }
export async function createMovie(payload) { await delay(); const m = { id: id("m"), ...payload }; db.movies.push(m); return m; }
export async function updateMovie(id_, payload) { await delay(); const m = db.movies.find(m=>m.id===id_); if (!m) return null; Object.assign(m, payload); return m; }
export async function deleteMovie(id_) { await delay(); const i = db.movies.findIndex(m=>m.id===id_); if (i>-1) db.movies.splice(i,1); return true; }

// Showtimes
export async function listShowtimes() { await delay(); return [...db.showtimes]; }
export async function createShowtime(payload) { await delay(); const s = { id: id("s"), created_at: new Date().toISOString(), ...payload }; db.showtimes.push(s); return s; }
export async function updateShowtime(id_, payload) { await delay(); const s = db.showtimes.find(s=>s.id===id_); if (!s) return null; Object.assign(s, payload); return s; }
export async function deleteShowtime(id_) { await delay(); const i = db.showtimes.findIndex(s=>s.id===id_); if (i>-1) db.showtimes.splice(i,1); return true; }

// Tickets
export async function listTickets() { await delay(); return [...db.tickets]; }
export async function updateTicket(id_, payload) { await delay(); const t = db.tickets.find(t=>t.id===id_); if (!t) return null; Object.assign(t, payload); return t; }

// Orders
export async function listOrders() { await delay(); return [...db.orders]; }
export async function updateOrder(id_, payload) { await delay(); const o = db.orders.find(o=>o.id===id_); if (!o) return null; Object.assign(o, payload); return o; }

// Transactions
export async function listTransactions() { await delay(); return [...db.transactions]; }

// Staff
export async function listStaff() { await delay(); return [...db.staff]; }
export async function createStaff(payload) { await delay(); const s = { id: id("stf"), ...payload }; db.staff.push(s); return s; }
export async function updateStaff(id_, payload) { await delay(); const s = db.staff.find(s=>s.id===id_); if (!s) return null; Object.assign(s, payload); return s; }
export async function deleteStaff(id_) { await delay(); const i = db.staff.findIndex(s=>s.id===id_); if (i>-1) db.staff.splice(i,1); return true; }


