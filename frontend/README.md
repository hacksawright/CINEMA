# 🎬 Cinema Management Frontend

## 📋 Tổng quan

Đây là ứng dụng web frontend cho hệ thống quản lý rạp chiếu phim, được xây dựng bằng React và các công nghệ hiện đại. Ứng dụng cho phép người dùng xem phim, đặt vé, và quản trị viên quản lý toàn bộ hệ thống.

## 🚀 Công nghệ sử dụng

### Core Technologies
- **React 18.3.1** - Thư viện JavaScript để xây dựng giao diện người dùng
- **Vite 5.4.19** - Build tool nhanh và hiện đại thay thế Webpack
- **React Router DOM 6.30.1** - Quản lý routing (điều hướng trang)

### UI Framework & Styling
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **shadcn/ui** - Thư viện component UI hiện đại
- **Radix UI** - Các component UI không có style, chỉ có logic
- **Lucide React** - Thư viện icon

### State Management & Data Fetching
- **TanStack Query 5.83.0** - Quản lý server state và caching
- **React Hook Form 7.61.1** - Quản lý form và validation
- **Zod 3.25.76** - Schema validation

### Additional Libraries
- **Supabase** - Backend-as-a-Service (hiện tại sử dụng mock data)
- **Date-fns** - Thư viện xử lý ngày tháng
- **Sonner** - Toast notifications

## 📁 Cấu trúc thư mục

```
frontend/
├── public/                 # Static files
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Layout.jsx     # Main layout component
│   │   ├── MovieCard.jsx  # Movie card component
│   │   └── SeatSelection.jsx
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── MoviesPage.jsx # Home page
│   │   ├── Auth.jsx       # Authentication page
│   │   ├── Booking.jsx    # Booking page
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── integrations/      # External service integrations
│   │   └── supabase/
│   ├── assets/            # Images and static assets
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── components.json         # shadcn/ui configuration
```

## 🛠️ Cài đặt và chạy dự án

### Yêu cầu hệ thống
- **Node.js** phiên bản 16.0 trở lên
- **npm** hoặc **yarn** để quản lý packages

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd cinema-management/frontend
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Chạy ứng dụng
```bash
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ chạy tại: `http://localhost:8080`

### Các script khác
```bash
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Chạy ESLint
```

## 🎨 Design System

### Theme Colors (HSL format)
Dự án sử dụng hệ thống màu cinema với theme tối:

```css
:root {
  --background: 220 18% 12%;      /* Nền tối */
  --foreground: 210 20% 98%;       /* Chữ sáng */
  --primary: 350 90% 60%;          /* Màu chính (burgundy) */
  --secondary: 45 95% 58%;         /* Màu phụ (gold) */
  --card: 220 16% 16%;             /* Nền card */
  --border: 220 14% 24%;           /* Viền */
}
```

### Component Usage
Tất cả components sử dụng Tailwind classes và shadcn/ui:

```jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function MyComponent() {
  return (
    <Card className="bg-card text-card-foreground">
      <CardContent>
        <Button className="bg-primary text-primary-foreground">
          Click me
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 📱 Các trang chính

### 1. Trang chủ (MoviesPage.jsx)
- Hiển thị danh sách phim đang chiếu và sắp chiếu
- Hero section với hình ảnh cinema
- Thống kê và thông tin rạp chiếu
- Responsive design

### 2. Trang đăng nhập (Auth.jsx)
- Form đăng nhập và đăng ký
- Validation với React Hook Form
- Integration với Supabase Auth

### 3. Trang chi tiết phim (MovieDetail.jsx)
- Thông tin chi tiết phim
- Trailer và poster
- Lịch chiếu và đặt vé

### 4. Trang đặt vé (Booking.jsx)
- Chọn ghế ngồi
- Thanh toán
- Xác nhận đặt vé

### 5. Trang Admin
- Dashboard tổng quan
- Quản lý phim, suất chiếu, ghế ngồi
- Quản lý đơn hàng và giao dịch

## 🔧 Cấu hình quan trọng

### Vite Configuration (vite.config.js)
```javascript
export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080 },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
```

### Path Aliases
- `@/` → `src/`
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`

### Tailwind Configuration
- Dark mode: `class`
- Container: centered với padding 2rem
- Custom colors: cinema theme
- Animations: accordion animations

## 📊 State Management

### TanStack Query
Quản lý server state và caching:

```jsx
import { useQuery } from "@tanstack/react-query";

function MoviesPage() {
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: () => supabase.from('movies').select('*')
  });
  
  // Component logic...
}
```

### React Hook Form
Quản lý form state và validation:

```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function AuthForm() {
  const form = useForm({
    resolver: zodResolver(schema)
  });
  
  // Form logic...
}
```

## 🎯 Routing

Sử dụng React Router DOM với nested routes:

```jsx
<Routes>
  <Route path="/" element={<MoviesPage />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/movie/:id" element={<MovieDetail />} />
  <Route path="/booking/:showtimeId" element={<Booking />} />
  
  {/* Admin routes */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="movies" element={<MovieManagement />} />
    <Route path="tickets" element={<TicketManagement />} />
    {/* ... */}
  </Route>
</Routes>
```

## 🗄️ Database Integration

Hiện tại sử dụng mock data thay vì Supabase thực:

```javascript
// Mock database với các bảng: movies, showtimes, theaters, bookings
const mockDb = {
  movies: [],
  showtimes: [],
  theaters: [],
  bookings: [],
};
```

## 🎨 UI Components

### shadcn/ui Components
Dự án sử dụng các component từ shadcn/ui:

- **Button** - Nút bấm với nhiều variants
- **Card** - Container cho nội dung
- **Dialog** - Modal popup
- **Form** - Form components với validation
- **Table** - Bảng dữ liệu
- **Toast** - Thông báo
- **Tabs** - Tab navigation
- **Badge** - Nhãn hiển thị

### Custom Components
- **Layout** - Layout chính với header và footer
- **MovieCard** - Card hiển thị thông tin phim
- **SeatSelection** - Component chọn ghế ngồi

## 📱 Responsive Design

Sử dụng Tailwind CSS responsive utilities:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔍 Development Tips

### 1. Sử dụng Path Aliases
```jsx
// ✅ Good
import { Button } from "@/components/ui/button";

// ❌ Avoid
import { Button } from "../../components/ui/button";
```

### 2. Component Structure
```jsx
// ✅ Good component structure
export function MyComponent({ className, children, ...props }) {
  return (
    <div className={cn("default-classes", className)} {...props}>
      {children}
    </div>
  );
}
```

### 3. Error Handling
```jsx
try {
  const { data, error } = await supabase.from('movies').select('*');
  if (error) throw error;
  setMovies(data);
} catch (error) {
  toast({ 
    title: "Lỗi", 
    description: "Không thể tải dữ liệu", 
    variant: "destructive" 
  });
}
```

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Module not found**
   - Kiểm tra path aliases trong `vite.config.js`
   - Đảm bảo import đúng đường dẫn

2. **Tailwind classes không hoạt động**
   - Kiểm tra `tailwind.config.js`
   - Đảm bảo file được include trong content

3. **Component không render**
   - Kiểm tra console errors
   - Đảm bảo component được export đúng

## 📚 Tài liệu tham khảo

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [React Router](https://reactrouter.com/)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

---

**Lưu ý**: Đây là dự án học tập, phù hợp cho sinh viên muốn tìm hiểu về React, modern frontend development và quản lý state.