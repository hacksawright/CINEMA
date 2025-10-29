import { api } from '@/lib/api';
import { db, delay, id } from "./mockDb";

export async function getAllRoomsAdmin() {
  return api.getAllRooms();
}

export async function createRoomAdmin(roomData) {
  const payload = {
      name: roomData.name,
      totalRows: parseInt(roomData.totalRows, 10),
      seatsPerRow: parseInt(roomData.seatsPerRow, 10)
  };
  return api.createRoom(payload);
}

export async function updateRoomAdmin(roomId, roomData) {
  const payload = {
      name: roomData.name,
      totalRows: parseInt(roomData.totalRows, 10),
      seatsPerRow: parseInt(roomData.seatsPerRow, 10)
  };
  return api.updateRoom(roomId, payload);
}

export async function deleteRoomAdmin(roomId) {
  return api.deleteRoom(roomId);
}

export async function getRoomLayoutAdmin(roomId) {
   return api.getRoomLayout(roomId);
}

export async function updateRoomLayoutAdmin(roomId, layoutData) {
   return api.updateRoomLayout(roomId, layoutData);
}

export async function listOrders() {
  return api.getAllOrdersAdmin();
}
export async function updateOrder(id_, payload) {
  return api.updateOrderStatusAdmin(id_, payload.status);
}
export async function getOrderDetailsAdmin(orderId) {
    return api.getOrderDetailAdmin(orderId);
}

export async function listTransactions() {
  return api.getAllTransactionsAdmin();
}

export async function listMovies() { return api.getAllMovies(); }
export async function createMovie(payload) { return api.createMovie(payload); }
export async function updateMovie(id_, payload) { return api.updateMovie(id_, payload); }
export async function deleteMovie(id_) { return api.deleteMovie(id_); }

export async function listShowtimes() { return api.getAllShowtimesAdmin(); }
export async function createShowtime(payload) { return api.createShowtime(payload); }
export async function updateShowtime(id_, payload) { return api.updateShowtime(id_, payload); }
export async function deleteShowtime(id_) { return api.deleteShowtime(id_); }

export async function listTickets() { return api.getAllTicketsAdmin(); }
export async function updateTicket(id_, payload) { return api.updateTicketStatusAdmin(id_, payload.status); }

export async function listStaff() { return api.getAllStaffAdmin(); }
export async function createStaff(payload) { return api.createStaffAdmin(payload); }
export async function updateStaff(id_, payload) { return api.updateStaffAdmin(id_, payload); }
export async function deleteStaff(id_) { return api.deleteStaffAdmin(id_); }