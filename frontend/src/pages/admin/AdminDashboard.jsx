import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Film, 
  Calendar,
  Ticket,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { listOrders, listTransactions, listMovies } from "@/services/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalMovies: 0,
    todayRevenue: 0,
    todayOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [orders, transactions, movies] = await Promise.all([
        listOrders().catch(() => []),
        listTransactions().catch(() => []),
        listMovies().catch(() => [])
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const completedOrders = orders.filter(o => 
        o.status?.toUpperCase() === "COMPLETED"
      ).length;
      const pendingOrders = orders.filter(o => 
        o.status?.toUpperCase() === "PENDING" || 
        o.status?.toUpperCase() === "PROCESSING"
      ).length;

      const successfulTransactions = transactions.filter(t => 
        t.status?.toLowerCase() === "success"
      );
      const totalRevenue = successfulTransactions.reduce(
        (sum, t) => sum + (parseFloat(t.amount) || 0), 
        0
      );

      const todayTransactions = successfulTransactions.filter(t => {
        if (!t.transactionDate) return false;
        try {
          const txDate = new Date(t.transactionDate);
          txDate.setHours(0, 0, 0, 0);
          return txDate.getTime() === today.getTime();
        } catch {
          return false;
        }
      });
      const todayRevenue = todayTransactions.reduce(
        (sum, t) => sum + (parseFloat(t.amount) || 0), 
        0
      );

      const todayOrdersCount = orders.filter(o => {
        if (!o.orderDate) return false;
        try {
          const orderDate = new Date(o.orderDate);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        } catch {
          return false;
        }
      }).length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalTransactions: transactions.length,
        completedOrders,
        pendingOrders,
        totalMovies: movies.length,
        todayRevenue,
        todayOrders: todayOrdersCount
      });
    } catch (error) {
      toast({ 
        title: "Lỗi", 
        description: `Không thể tải dữ liệu dashboard: ${error.message}`, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [toast]);

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    window.location.href = "/";
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">🎬 Bảng Quản Trị</h1>
          <p className="mt-2 text-muted-foreground">
            Tổng quan về hoạt động của hệ thống rạp chiếu phim
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            Đăng Xuất
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-8">
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng đơn hàng
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.completedOrders} hoàn thành • {stats.pendingOrders} đang chờ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng doanh thu
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalRevenue.toLocaleString('vi-VN')} ₫
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Hôm nay: {stats.todayRevenue.toLocaleString('vi-VN')} ₫
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng giao dịch
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Từ {stats.totalOrders} đơn hàng
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Số phim
                </CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMovies}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Đang được quản lý
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Thống kê đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Hoàn thành</span>
                    <span className="font-semibold text-green-600">{stats.completedOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Đang chờ xử lý</span>
                    <span className="font-semibold text-yellow-600">{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tổng đơn hàng</span>
                    <span className="font-semibold">{stats.totalOrders}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Hôm nay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Đơn hàng mới</span>
                    <span className="font-semibold">{stats.todayOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Doanh thu hôm nay</span>
                    <span className="font-semibold text-green-600">
                      {stats.todayRevenue.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  {stats.todayOrders > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Trung bình/đơn</span>
                      <span className="font-semibold">
                        {Math.round(stats.todayRevenue / stats.todayOrders).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}