import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Film, 
  Ticket, 
  MapPin, 
  Calendar, 
  Users, 
  ShoppingCart, 
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: BarChart3,
      current: location.pathname === "/admin"
    },
    {
      name: "Quản lý phim",
      href: "/admin/movies",
      icon: Film,
      current: location.pathname.startsWith("/admin/movies")
    },
    {
      name: "Quản lý vé",
      href: "/admin/tickets",
      icon: Ticket,
      current: location.pathname.startsWith("/admin/tickets")
    },
    {
      name: "Sơ đồ ghế",
      href: "/admin/seats",
      icon: MapPin,
      current: location.pathname.startsWith("/admin/seats")
    },
    {
      name: "Suất chiếu",
      href: "/admin/showtimes",
      icon: Calendar,
      current: location.pathname.startsWith("/admin/showtimes")
    },
    {
      name: "Nhân viên",
      href: "/admin/staff",
      icon: Users,
      current: location.pathname.startsWith("/admin/staff")
    },
    {
      name: "Đơn hàng",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: location.pathname.startsWith("/admin/orders")
    },
    {
      name: "Giao dịch",
      href: "/admin/transactions",
      icon: CreditCard,
      current: location.pathname.startsWith("/admin/transactions")
    }
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Lỗi", description: "Không thể đăng xuất", variant: "destructive" });
    } else {
      toast({ title: "Đăng xuất thành công" });
      window.location.href = "/auth";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-card lg:border-r lg:border-border">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <Film className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-card/50 backdrop-blur-sm border-b border-border">
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                Quản trị viên
              </Badge>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const stats = [
    {
      title: "Tổng phim",
      value: "24",
      change: "+2",
      changeType: "positive",
      icon: Film
    },
    {
      title: "Vé đã bán hôm nay",
      value: "156",
      change: "+12%",
      changeType: "positive",
      icon: Ticket
    },
    {
      title: "Doanh thu hôm nay",
      value: "₫2,340,000",
      change: "+8%",
      changeType: "positive",
      icon: CreditCard
    },
    {
      title: "Đơn hàng mới",
      value: "23",
      change: "+5",
      changeType: "positive",
      icon: ShoppingCart
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống quản lý rạp phim</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={cn(
                  "inline-flex items-center",
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                )}>
                  {stat.change}
                </span>
                {" "}so với hôm qua
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-20 flex-col gap-2">
              <Link to="/admin/movies">
                <Film className="h-6 w-6" />
                <span>Thêm phim mới</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link to="/admin/showtimes">
                <Calendar className="h-6 w-6" />
                <span>Tạo suất chiếu</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link to="/admin/transactions">
                <BarChart3 className="h-6 w-6" />
                <span>Xem báo cáo</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { AdminLayout, AdminDashboard };
