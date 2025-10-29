import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/services/employee";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"; // ✅ import thêm

// 🆕 Component Badge hiển thị trạng thái
function StatusBadge({ status }) {
  let color = "bg-gray-400 text-white";
  if (status === "Hoạt động") color = "bg-green-500 text-white";
  else if (status === "Tạm nghỉ") color = "bg-yellow-300 text-black";
  else if (status === "Nghỉ việc") color = "bg-red-500 text-white";

  return (
    <Badge className={`px-3 py-1 rounded-full font-semibold ${color}`}>
      {status || "Chưa cập nhật"}
    </Badge>
  );
}

export default function Staff() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  // Lấy danh sách nhân viên
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => (await getEmployees()).data,
  });

  // CRUD mutations
  const addMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setEditing(null);
      reset();
    },
  });

  const delMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries(["employees"]),
  });

  const handleEdit = (emp) => {
    setEditing(emp.id);
    setValue("name", emp.name);
    setValue("email", emp.email);
    setValue("phone", emp.phone);
    setValue("role", emp.role);
    setValue("status", emp.status);
  };

  const onSubmit = (data) => {
    if (editing) {
      updateMutation.mutate({ id: editing, data });
    } else {
      addMutation.mutate(data);
    }
  };

  if (isLoading) return <p className="p-4">Đang tải dữ liệu...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>

      {/* Form thêm/sửa nhân viên */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editing ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <Label>Tên nhân viên</Label>
              <Input
                {...register("name")}
                placeholder="Nguyễn Văn A"
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input {...register("phone")} placeholder="0123 456 789" />
            </div>
            <div>
              <Label>Chức vụ</Label>
              <Input
                {...register("role")}
                placeholder="Quản lý, thu ngân, ..."
              />
            </div>
            {/* 🆕 Dropdown Trạng thái */}
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                {...register("status")}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
                <option value="Nghỉ việc">Nghỉ việc</option>
              </select>
            </div>

            <div className="col-span-2 flex gap-2 mt-2">
              <Button type="submit">{editing ? "Cập nhật" : "Thêm mới"}</Button>
              {editing && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    reset();
                    setEditing(null);
                  }}
                >
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danh sách nhân viên */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border-collapse">
            <thead className="bg-muted">
              <tr>
                <th className="border p-2">Tên</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Số điện thoại</th>
                <th className="border p-2">Chức vụ</th>
                <th className="border p-2 text-center">Trạng thái</th>
                <th className="border p-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((e) => (
                <tr key={e.id}>
                  <td className="border p-2">{e.name}</td>
                  <td className="border p-2">{e.email}</td>
                  <td className="border p-2">{e.phone}</td>
                  <td className="border p-2">{e.role}</td>
                  <td className="border p-2 text-center">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(e)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => delMutation.mutate(e.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}