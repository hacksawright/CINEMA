import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import component bảo vệ mới
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 

import MoviesPage from "./pages/MoviesPage.jsx";
import Auth from "./pages/Auth.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Booking from "./pages/Booking.jsx";
import Account from "./pages/Account.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AdminLayout, AdminDashboard } from "./pages/Admin.jsx";
import MovieManagement from "./pages/admin/MovieManagement.jsx";
import TicketManagement from "./pages/admin/TicketManagement.jsx";
import SeatManagement from "./pages/admin/SeatManagement.jsx";
import ShowtimeManagement from "./pages/admin/ShowtimeManagement.jsx";
import StaffManagement from "./pages/admin/StaffManagement.jsx";
import OrderManagement from "./pages/admin/OrderManagement.jsx";
import TransactionManagement from "./pages/admin/TransactionManagement.jsx";

const queryClient = new QueryClient();

const App = () => (
   <QueryClientProvider client={queryClient}>
   <TooltipProvider>
       <Toaster />
      <Sonner />
       <BrowserRouter>
         <Routes>
            {/* CÁC ROUTE CÔNG KHAI HOẶC KHÔNG CẦN BẢO VỆ */}
          <Route path="/" element={<MoviesPage />} />
          <Route path="/auth" element={<Auth />} /> 
          <Route path="/movie/:id" element={<MovieDetail />} />

            {/* ROUTE BẢO VỆ: Chỉ cho phép truy cập nếu có JWT Token */}
            <Route element={<ProtectedRoute />}>
              <Route path="/booking/:showtimeId" element={<Booking />} />
                <Route path="/account" element={<Account />} /> 
                
                {/* BẢO VỆ TẤT CẢ ADMIN ROUTES */}
                <Route path="/admin" element={<AdminLayout />}>
                     <Route index element={<AdminDashboard />} />
                     <Route path="movies" element={<MovieManagement />} />
                     <Route path="tickets" element={<TicketManagement />} />
                     <Route path="seats" element={<SeatManagement />} />
                     <Route path="showtimes" element={<ShowtimeManagement />} />
                     <Route path="staff" element={<StaffManagement />} />
                     <Route path="orders" element={<OrderManagement />} />
                     <Route path="transactions" element={<TransactionManagement />} />
                 </Route>
            </Route>

          <Route path="*" element={<NotFound />} />
         </Routes>
       </BrowserRouter>
     </TooltipProvider>
   </QueryClientProvider>
);

export default App;