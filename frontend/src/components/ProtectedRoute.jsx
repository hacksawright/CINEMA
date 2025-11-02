import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  console.log("🛡️ ProtectedRoute được render");
  // Lấy token user lưu trong sessionStorage (không dính với admin)
  const userToken = sessionStorage.getItem("jwtToken");
  console.log("🔑 Token từ sessionStorage:", userToken ? "Có token" : "Không có token");

  // Nếu chưa đăng nhập thì ép qua trang /auth
  if (!userToken) {
    console.log("❌ Không có token, redirect về /auth");
    return <Navigate to="/auth" replace />;
  }

  // Nếu có token thì cho render component con thông qua Outlet
  console.log("✅ Có token, cho phép truy cập - render Outlet");
  return <Outlet />;
};

export default ProtectedRoute;
