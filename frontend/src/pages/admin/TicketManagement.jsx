import { useState, useEffect } from "react";
import { Search, Filter, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Gọi API lấy danh sách vé
  useEffect(() => {
  console.log("🚀 useEffect chạy – bắt đầu gọi API");
  const fetchTickets = async () => {
    console.log("🔄 Fetching tickets...");
    const response = await fetch("http://localhost:8080/api/tickets");
    const data = await response.json();
    console.log("✅ Nhận được data:", data);
    setTickets(data);
  };
  fetchTickets();
}, []);


  // 🔹 Lọc vé
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.ticketId.toString().includes(searchTerm.toLowerCase()) ||
      (ticket.seatLabel && ticket.seatLabel.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge variant="secondary">Còn trống</Badge>;
      case "BOOKED":
      case "SOLD":
        return <Badge className="bg-green-600">Đã bán</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const TicketDetails = ({ ticket, onClose }) => {
    const [newStatus, setNewStatus] = useState(ticket.status);

    const handleStatusUpdate = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/tickets/${ticket.ticketId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Cập nhật thất bại");

        // Cập nhật lại FE
        setTickets((prev) =>
          prev.map((t) =>
            t.ticketId === ticket.ticketId ? { ...t, status: newStatus } : t
          )
        );
        onClose();
      } catch (err) {
        console.error("Lỗi cập nhật vé:", err);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Mã vé</Label>
            <p>{ticket.ticketId}</p>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <div>{getStatusBadge(ticket.status)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Ghế</Label>
            <p>{ticket.seatLabel}</p>
          </div>
          <div>
            <Label>Giá vé</Label>
            <p>{ticket.price?.toLocaleString("vi-VN")} ₫</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Giờ bắt đầu</Label>
            <p>{new Date(ticket.startsAt).toLocaleString("vi-VN")}</p>
          </div>
          <div>
            <Label>Giờ kết thúc</Label>
            <p>{new Date(ticket.endsAt).toLocaleString("vi-VN")}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <Label>Cập nhật trạng thái</Label>
          <div className="flex gap-2 mt-2">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Còn trống</SelectItem>
                <SelectItem value="SOLD">Đã bán</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusUpdate} disabled={newStatus === ticket.status}>
              <RefreshCw className="h-4 w-4 mr-2" /> Cập nhật
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý vé</h1>

      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm vé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="AVAILABLE">Còn trống</SelectItem>
              <SelectItem value="SOLD">Đã bán</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách vé ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã vé</TableHead>
                  <TableHead>Ghế</TableHead>
                  <TableHead>Giờ bắt đầu</TableHead>
                  <TableHead>Giờ kết thúc</TableHead>
                  <TableHead>Giá vé</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.ticketId}>
                    <TableCell>{ticket.ticketId}</TableCell>
                    <TableCell>{ticket.seatLabel}</TableCell>
                    <TableCell>{new Date(ticket.startsAt).toLocaleString("vi-VN")}</TableCell>
                    <TableCell>{new Date(ticket.endsAt).toLocaleString("vi-VN")}</TableCell>
                    <TableCell>{ticket.price?.toLocaleString("vi-VN")} ₫</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết vé</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <TicketDetails
              ticket={selectedTicket}
              onClose={() => {
                setIsViewDialogOpen(false);
                setSelectedTicket(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketManagement;