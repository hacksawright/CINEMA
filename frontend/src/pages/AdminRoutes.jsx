import { Navigate, Outlet } from "react-router-dom";

/**
 * Bảo vệ các route /admin/*
 * - Nếu đã đăng nhập admin (localStorage['admin-auth'] === 'true') => cho vào
 * - Nếu chưa => chuyển hướng sang /admin/login
 */
export default function AdminRoutes() {
  const isAdmin = localStorage.getItem("admin-auth") === "true";
  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
