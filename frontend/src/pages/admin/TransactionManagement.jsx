import { useState } from "react";
import { Search, Filter, Download, TrendingUp, DollarSign, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

const TransactionManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  // Mock data - replace with actual API calls
  const transactions = [
    {
      id: "TXN001",
      orderId: "ORD001",
      customerName: "Nguyễn Văn A",
      amount: 240000,
      method: "credit_card",
      status: "success",
      transactionDate: "2024-01-19 14:32:00",
      movieTitle: "Avatar: The Way of Water",
      showtime: "2024-01-20 19:30"
    },
    {
      id: "TXN002",
      orderId: "ORD002",
      customerName: "Trần Thị B",
      amount: 240000,
      method: "bank_transfer",
      status: "pending",
      transactionDate: "2024-01-20 10:20:00",
      movieTitle: "Black Panther: Wakanda Forever",
      showtime: "2024-01-21 20:00"
    },
    {
      id: "TXN003",
      orderId: "ORD003",
      customerName: "Lê Văn C",
      amount: 120000,
      method: "cash",
      status: "success",
      transactionDate: "2024-01-19 16:50:00",
      movieTitle: "Top Gun: Maverick",
      showtime: "2024-01-20 16:00"
    },
    {
      id: "TXN004",
      orderId: "ORD004",
      customerName: "Phạm Thị D",
      amount: 180000,
      method: "e_wallet",
      status: "success",
      transactionDate: "2024-01-18 20:15:00",
      movieTitle: "Avatar: The Way of Water",
      showtime: "2024-01-19 19:30"
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === "all" || transaction.method === methodFilter;
    const transactionDate = new Date(transaction.transactionDate);
    const matchesDateRange = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    return matchesSearch && matchesMethod && matchesDateRange;
  });

  const getStatusBadge = (status) => {
    switch (status) {
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
    switch (method) {
      case "credit_card":
        return <Badge variant="outline">Thẻ tín dụng</Badge>;
      case "cash":
        return <Badge variant="outline">Tiền mặt</Badge>;
      case "bank_transfer":
        return <Badge variant="outline">Chuyển khoản</Badge>;
      case "e_wallet":
        return <Badge variant="outline">Ví điện tử</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  // Calculate statistics
  const totalRevenue = filteredTransactions
    .filter(t => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTransactions = filteredTransactions.length;
  const successfulTransactions = filteredTransactions.filter(t => t.status === "success").length;
  const successRate = totalTransactions > 0 ? Math.round((successfulTransactions / totalTransactions) * 100) : 0;

  // Revenue by payment method
  const revenueByMethod = filteredTransactions
    .filter(t => t.status === "success")
    .reduce((acc, t) => {
      acc[t.method] = (acc[t.method] || 0) + t.amount;
      return acc;
    }, {});

  const exportReport = () => {
    // Export transaction report
    console.log("Exporting transaction report...");
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

      {/* Revenue stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalRevenue.toLocaleString('vi-VN')} ₫
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-foreground">{totalTransactions}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Thành công</p>
                <p className="text-2xl font-bold text-green-600">{successfulTransactions}</p>
              </div>
              <div className="h-8 w-8 bg-green-600/10 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tỷ lệ thành công</p>
                <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by payment method */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(revenueByMethod).map(([method, amount]) => (
              <div key={method} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {method === "credit_card" && "Thẻ tín dụng"}
                    {method === "cash" && "Tiền mặt"}
                    {method === "bank_transfer" && "Chuyển khoản"}
                    {method === "e_wallet" && "Ví điện tử"}
                  </span>
                  <Badge variant="outline">{method}</Badge>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {amount.toLocaleString('vi-VN')} ₫
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((amount / totalRevenue) * 100)}% tổng doanh thu
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm giao dịch..."
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
                  <Button variant="outline" className="w-full sm:w-48">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(dateRange.from, 'dd/MM')} - {format(dateRange.to, 'dd/MM')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Phim</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.orderId}</TableCell>
                  <TableCell>{transaction.customerName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{transaction.movieTitle}</p>
                      <p className="text-xs text-muted-foreground">{transaction.showtime}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.amount.toLocaleString('vi-VN')} ₫
                  </TableCell>
                  <TableCell>{getMethodBadge(transaction.method)}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>
                    {new Date(transaction.transactionDate).toLocaleString('vi-VN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Daily revenue chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ doanh thu theo ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border border-border rounded-lg bg-muted/20">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
              <p className="text-sm text-muted-foreground">Tích hợp với thư viện chart như Chart.js hoặc Recharts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManagement;
