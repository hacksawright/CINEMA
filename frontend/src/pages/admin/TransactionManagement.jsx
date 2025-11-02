import { useState, useEffect } from "react";
import { Search, Download, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO, startOfMonth, endOfDay, startOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { listTransactions } from "@/services/admin";

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  });
  const { toast } = useToast();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await listTransactions();
      setTransactions(data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể tải danh sách giao dịch: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [toast]);

  const filteredTransactions = transactions.filter((transaction) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      transaction.id?.toString().toLowerCase().includes(lowerSearchTerm) ||
      transaction.customerName?.toLowerCase().includes(lowerSearchTerm) ||
      transaction.orderId?.toString().toLowerCase().includes(lowerSearchTerm) ||
      transaction.ticketCode?.toLowerCase().includes(lowerSearchTerm);

    const matchesMethod =
      methodFilter === "all" ||
      transaction.paymentMethod?.toLowerCase() === methodFilter;

    let matchesDateRange = true;
    if (dateRange?.from && transaction.transactionDate) {
      try {
        const transactionDate = parseISO(transaction.transactionDate);
        const fromDateStart = startOfDay(dateRange.from);
        const toDateEnd = dateRange.to ? endOfDay(dateRange.to) : null;
        matchesDateRange =
          transactionDate >= fromDateStart &&
          (!toDateEnd || transactionDate <= toDateEnd);
      } catch {
        matchesDateRange = false;
      }
    } else if (dateRange?.from) {
      matchesDateRange = false;
    }

    return matchesSearch && matchesMethod && matchesDateRange;
  });

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="outline">Không xác định</Badge>;
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case "success":
        return <Badge className="bg-green-600">Thành công</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Chờ xử lý</Badge>;
      case "failed":
        return <Badge variant="destructive">Thất bại</Badge>;
      case "refunded":
        return <Badge variant="outline">Đã hoàn tiền</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodBadge = (method) => {
    if (!method) return <Badge variant="outline">-</Badge>;
    const lowerMethod = method.toLowerCase();
    switch (lowerMethod) {
      case "credit_card":
        return <Badge variant="outline">Thẻ tín dụng</Badge>;
      case "cash":
        return <Badge variant="outline">Tiền mặt</Badge>;
      case "bank_transfer":
        return <Badge variant="outline">Chuyển khoản</Badge>;
      case "e_wallet":
        return <Badge variant="outline">Ví điện tử</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  const totalRevenue = filteredTransactions
    .filter((t) => t.status?.toLowerCase() === "success")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalTransactions = filteredTransactions.length;
  const successfulTransactions = filteredTransactions.filter(
    (t) => t.status?.toLowerCase() === "success"
  ).length;
  const successRate =
    totalTransactions > 0
      ? Math.round((successfulTransactions / totalTransactions) * 100)
      : 0;
  const revenueByMethod = filteredTransactions
    .filter((t) => t.status?.toLowerCase() === "success")
    .reduce((acc, t) => {
      if (t.paymentMethod) {
        const methodKey = t.paymentMethod.toLowerCase();
        acc[methodKey] = (acc[methodKey] || 0) + (t.amount || 0);
      }
      return acc;
    }, {});

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    try {
      return format(parseISO(dateTimeString), "dd/MM/yyyy HH:mm:ss");
    } catch {
      return "Invalid Date";
    }
  };

  const formatShortDateTime = (dateTimeString) => {
    if (!dateTimeString) return "-";
    try {
      return format(parseISO(dateTimeString), "HH:mm dd/MM");
    } catch {
      return "Invalid";
    }
  };

  const escapeCSV = (value) => {
    if (value == null) return '""';
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const exportReport = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "Không có dữ liệu",
        description: "Không có giao dịch nào để xuất.",
        variant: "secondary",
      });
      return;
    }

    const headers = [
      "Ma Giao Dich",
      "Ma Don Hang",
      "Khach Hang",
      "Phim",
      "Suat Chieu",
      "So Tien",
      "Phuong Thuc",
      "Trang Thai",
      "Thoi Gian GD",
    ];

    const csvRows = [headers.join(",")];

    for (const transaction of filteredTransactions) {
      const showtime = transaction.showtimeStartsAt
        ? format(parseISO(transaction.showtimeStartsAt), "HH:mm dd/MM/yyyy")
        : "-";
      const row = [
        escapeCSV(transaction.id),
        escapeCSV(transaction.ticketCode || transaction.orderId),
        escapeCSV(transaction.customerName),
        escapeCSV(transaction.movieTitle),
        escapeCSV(showtime),
        escapeCSV(transaction.amount),
        escapeCSV(transaction.paymentMethod),
        escapeCSV(transaction.status),
        escapeCSV(formatDateTime(transaction.transactionDate)),
      ];
      csvRows.push(row.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob(["\uFEFF" + csvString], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const formattedDate = format(new Date(), "yyyy-MM-dd");
    link.setAttribute("download", `bao_cao_giao_dich_${formattedDate}.csv`);

    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Đã xuất báo cáo",
      description: "File CSV đã được tải về.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý giao dịch</h1>
          <p className="text-muted-foreground">Theo dõi và báo cáo doanh thu</p>
        </div>
        <Button onClick={exportReport}>
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-green-600">
              {totalRevenue.toLocaleString("vi-VN")} ₫
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">Tổng giao dịch</p>
            <p className="text-2xl font-bold">{totalTransactions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">Thành công</p>
            <p className="text-2xl font-bold text-green-600">{successfulTransactions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground">Tỷ lệ thành công</p>
            <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải...</p>
          ) : Object.keys(revenueByMethod).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(revenueByMethod).map(([method, amount]) => (
                <div key={method} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground capitalize">
                      {method.replace("_", " ")}
                    </span>
                    {getMethodBadge(method)}
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {amount.toLocaleString("vi-VN")} ₫
                  </p>
                  {totalRevenue > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {Math.round((amount / totalRevenue) * 100)}% tổng doanh thu
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Không có dữ liệu doanh thu.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm Mã GD, Mã ĐH, Tên KH..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Phương thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                  <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                  <SelectItem value="e_wallet">Ví điện tử</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-64">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yy")} -{" "}
                          {format(dateRange.to, "dd/MM/yy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Chọn khoảng ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Đang tải...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Phim / Suất chiếu</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian GD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không có giao dịch nào khớp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.ticketCode || transaction.orderId}</TableCell>
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{transaction.movieTitle || "-"}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatShortDateTime(transaction.showtimeStartsAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.amount?.toLocaleString("vi-VN")} ₫
                      </TableCell>
                      <TableCell>{getMethodBadge(transaction.paymentMethod)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{formatDateTime(transaction.transactionDate)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManagement;
