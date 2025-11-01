import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/services/employee";
import { useToast } from "@/hooks/use-toast";

const StaffManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // role mapping
  const roles = {
    admin: {
      label: "Quản trị viên",
      color: "bg-red-600",
      permissions: "Toàn quyền",
    },
    ticket_seller: {
      label: "Nhân viên bán vé",
      color: "bg-blue-600",
      permissions: "Bán vé, xem báo cáo",
    },
    usher: {
      label: "Nhân viên kiểm soát",
      color: "bg-green-600",
      permissions: "Kiểm soát vé, ghế",
    },
    accountant: {
      label: "Kế toán",
      color: "bg-purple-600",
      permissions: "Quản lý tài chính, báo cáo",
    },
  };

  // ===== React Query Hooks =====
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await getEmployees();
      console.log("📦 Employee data from API:", res.data);
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      toast({
        title: "✅ Thêm thành công",
        description: "Nhân viên mới đã được thêm.",
      });
      setIsAddDialogOpen(false);
    },
    onError: () =>
      toast({
        title: "❌ Lỗi",
        description: "Không thể thêm nhân viên.",
        variant: "destructive",
      }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateEmployee(id, data);
      return res.data; // trả về dữ liệu mới (nếu API có)
    },
    onSuccess: (updatedEmployee, variables) => {
      // ⚡ Cập nhật cache tức thời
      queryClient.setQueryData(["employees"], (oldData) =>
        oldData
          ? oldData.map((emp) =>
              emp.id === (updatedEmployee?.id || variables.id)
                ? { ...emp, ...(updatedEmployee || variables.data) }
                : emp
            )
          : []
      );

      toast({ title: "✅ Cập nhật thành công" });

      // ✅ Đảm bảo đồng bộ với backend
      queryClient.invalidateQueries(["employees"]);

      setIsEditDialogOpen(false);
      setSelectedStaff(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      toast({ title: "🗑️ Đã xóa nhân viên" });
    },
    onError: () => toast({ title: "❌ Lỗi khi xóa", variant: "destructive" }),
  });

  // ===== Form component =====
  const StaffForm = ({ staffMember = null, onClose }) => {
    const [formData, setFormData] = useState({
      name: staffMember?.name || "",
      email: staffMember?.email || "",
      phone: staffMember?.phone || "",
      role: staffMember?.role || "ticket_seller",
      status: staffMember?.status || "active",
      address: staffMember?.address || "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      if (staffMember) {
        updateMutation.mutate({ id: staffMember.id, data: formData });
      } else {
        addMutation.mutate(formData);
      }
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Họ và tên</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Số điện thoại</Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Vai trò</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => setFormData({ ...formData, role: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roles).map(([key, role]) => (
                  <SelectItem key={key} value={key}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 w-full bg-background text-foreground"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="suspended">Tạm khóa</option>
            </select>
          </div>
        </div>

        <div>
          <Label>Địa chỉ</Label>
          <Textarea
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">
            {staffMember ? "Cập nhật" : "Thêm nhân viên"}
          </Button>
        </div>
      </form>
    );
  };

  // ===== Render badges =====
  const getRoleBadge = (role) => {
    const r = roles[role];
    if (!r) {
      return <Badge className="bg-gray-500 text-white">Chưa phân quyền</Badge>;
    }
    return <Badge className={cn("text-white", r.color)}>{r.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Hoạt động</Badge>;
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>;
      case "suspended":
        return <Badge variant="destructive">Tạm khóa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // ===== Filter data =====
  const filteredStaff = (employees || []).filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "all" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (isLoading) return <p className="p-4">Đang tải dữ liệu...</p>;

  // ===== UI =====
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
          <p className="text-muted-foreground">
            Thêm, sửa, xóa và phân quyền nhân viên
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhân viên
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm nhân viên mới</DialogTitle>
            </DialogHeader>
            <StaffForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
                <p className="text-2xl font-bold">{employees?.length || 0}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees?.filter((s) => s.status === "active").length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-600/10 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quản trị viên</p>
                <p className="text-2xl font-bold text-red-600">
                  {employees?.filter((s) => s.role === "admin").length || 0}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Nhân viên bán vé
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {employees?.filter((s) => s.role === "ticket_seller")
                    .length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {Object.entries(roles).map(([k, r]) => (
                  <SelectItem key={k} value={k}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bảng */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên ({filteredStaff.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{m.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {m.phone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{getRoleBadge(m.role)}</TableCell>
                  <TableCell>{getStatusBadge(m.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedStaff(m);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(m.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog chỉnh sửa */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <StaffForm
              staffMember={selectedStaff}
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedStaff(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
