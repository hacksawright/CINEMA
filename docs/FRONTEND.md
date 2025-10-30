# 🎬 Cinema Management - Frontend Documentation

## 📋 Tổng quan

Frontend của hệ thống Cinema Management là một Single Page Application (SPA) được xây dựng bằng **React 18** với **Vite**, cung cấp giao diện người dùng hiện đại và responsive cho cả khách hàng và quản trị viên.

## 🏗️ Kiến trúc

### Tech Stack
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Framework**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: TanStack Query (React Query) 5.83.0
- **Form Handling**: React Hook Form 7.61.1
- **Validation**: Zod 3.25.76
- **HTTP Client**: Axios + Fetch API
- **Icons**: Lucide React 0.462.0
- **Date Handling**: date-fns 3.6.0
- **Dev Server Port**: 8081

### Cấu trúc thư mục

```
frontend/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/               # Images, fonts, etc.
│   │   └── hero-cinema.jpg
│   ├── components/           # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── form.jsx
│   │   │   ├── input.jsx
│   │   │   ├── table.jsx
│   │   │   ├── tabs.jsx
│   │   │   ├── toast.jsx
│   │   │   └── ...
│   │   ├── Layout.jsx       # Main layout wrapper
│   │   ├── LoginComponent.jsx
│   │   ├── MovieCard.jsx    # Movie display card
│   │   └── SeatSelection.jsx # Seat picker component
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.js
│   │   ├── use-toast.js
│   │   └── useMovies.js     # Movie-related hooks
│   ├── integrations/        # External integrations
│   │   └── supabase/
│   ├── lib/                 # Utility functions
│   │   ├── api.js          # API client
│   │   └── utils.js        # Helper functions
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   │   ├── MovieManagement.jsx
│   │   │   ├── ShowtimeManagement.jsx
│   │   │   ├── SeatManagement.jsx
│   │   │   ├── TicketManagement.jsx
│   │   │   ├── StaffManagement.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   └── TransactionManagement.jsx
│   │   ├── MoviesPage.jsx  # Home page
│   │   ├── Auth.jsx        # Login/Register
│   │   ├── MovieDetail.jsx # Movie details
│   │   ├── Booking.jsx     # Booking page
│   │   ├── Account.jsx     # User account
│   │   ├── Admin.jsx       # Admin layout & dashboard
│   │   └── NotFound.jsx    # 404 page
│   ├── services/           # API service layer
│   │   ├── api.js         # Axios instance
│   │   ├── admin.js       # Admin APIs
│   │   ├── customer.js    # Customer APIs
│   │   ├── employee.js    # Employee APIs
│   │   ├── movieService.js # Movie APIs
│   │   ├── mockDb.js      # Mock data
│   │   └── index.js       # Service exports
│   ├── App.jsx            # Main app component
│   ├── App.css
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── components.json         # shadcn/ui config
├── eslint.config.js       # ESLint config
├── index.html             # HTML template
├── package.json           # Dependencies
├── postcss.config.js      # PostCSS config
├── tailwind.config.js     # Tailwind config
└── vite.config.js         # Vite config
```

## 🎨 UI Components

### shadcn/ui Components

Dự án sử dụng các component từ shadcn/ui (built on Radix UI):

- **Button** - Nút bấm với nhiều variants (default, destructive, outline, ghost, link)
- **Card** - Container cho nội dung (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- **Dialog** - Modal popup
- **Form** - Form components với validation
- **Input** - Text input fields
- **Label** - Form labels
- **Table** - Bảng dữ liệu
- **Tabs** - Tab navigation
- **Toast/Sonner** - Thông báo
- **Badge** - Nhãn hiển thị
- **Select** - Dropdown select
- **Checkbox** - Checkbox input
- **Alert Dialog** - Confirmation dialogs
- **Accordion** - Collapsible content
- **Avatar** - User avatars
- **Dropdown Menu** - Context menus
- **Scroll Area** - Custom scrollbars

### Custom Components

#### Layout.jsx
Component layout chính cho toàn bộ ứng dụng

**Features:**
- Header với navigation
- Footer
- Responsive design
- Authentication state

**Usage:**
```jsx
import { Layout } from "@/components/Layout";

function Page() {
  return (
    <Layout>
      <div>Your content here</div>
    </Layout>
  );
}
```

#### MovieCard.jsx
Component hiển thị thông tin phim dạng card

**Props:**
- `id`: Movie ID
- `title`: Tên phim
- `description`: Mô tả
- `duration`: Thời lượng (phút)
- `posterUrl`: URL poster
- `status`: Trạng thái (showing/upcoming/ended)

**Usage:**
```jsx
<MovieCard
  id={1}
  title="Avengers: Endgame"
  description="..."
  duration={181}
  posterUrl="https://..."
  status="showing"
/>
```

#### SeatSelection.jsx
Component chọn ghế ngồi

**Props:**
- `totalRows`: Số hàng ghế
- `seatsPerRow`: Số ghế mỗi hàng
- `bookedSeats`: Danh sách ghế đã đặt
- `onSeatsChange`: Callback khi chọn ghế

**Features:**
- Visual seat map
- Seat types: Standard, VIP, Couple
- Booked/Available status
- Multi-select

## 📱 Pages & Routing

### Public Routes

#### 1. MoviesPage (`/`)
Trang chủ - Danh sách phim

**Features:**
- Hero section với banner
- Tabs: Tất cả phim / Đang chiếu / Sắp chiếu
- Grid layout responsive
- Movie cards với hover effects
- Thống kê rạp chiếu

**API Calls:**
- `GET /api/movies` - Lấy tất cả phim
- `GET /api/movies/showing` - Phim đang chiếu
- `GET /api/movies/upcoming` - Phim sắp chiếu

#### 2. Auth (`/auth`)
Trang đăng nhập / đăng ký

**Features:**
- Tabs: Login / Register
- Form validation với React Hook Form
- JWT token storage
- Auto redirect sau login

**API Calls:**
- `POST /api/auth/login`
- `POST /api/auth/register`

#### 3. MovieDetail (`/movie/:id`)
Trang chi tiết phim

**Features:**
- Thông tin đầy đủ về phim
- Poster và trailer
- Danh sách suất chiếu
- Nút đặt vé

**API Calls:**
- `GET /api/movies/:id`
- `GET /api/showtimes?movieId=:id`

#### 4. Booking (`/booking/:showtimeId`)
Trang đặt vé

**Features:**
- Thông tin suất chiếu
- Sơ đồ ghế
- Chọn ghế
- Tính tổng tiền
- Xác nhận đặt vé

**API Calls:**
- `GET /api/booking/showtime/:showtimeId/seats`
- `POST /api/booking`

### Protected Routes

#### 5. Account (`/account`)
Trang tài khoản người dùng

**Features:**
- Thông tin cá nhân
- Lịch sử đặt vé
- Quản lý đơn hàng

**API Calls:**
- `GET /api/users/:userId`
- `GET /api/orders?userId=:userId`

### Admin Routes (`/admin`)

#### AdminLayout
Layout cho trang admin với sidebar navigation

**Navigation Items:**
- Dashboard
- Quản lý phim
- Quản lý vé
- Sơ đồ ghế
- Suất chiếu
- Nhân viên
- Đơn hàng
- Giao dịch

#### AdminDashboard (`/admin`)
Dashboard tổng quan

**Features:**
- Thống kê tổng quan (doanh thu, đơn hàng, khách hàng)
- Biểu đồ
- Quick actions

#### MovieManagement (`/admin/movies`)
Quản lý phim

**Features:**
- Danh sách phim với table
- Tìm kiếm phim
- Thêm/Sửa/Xóa phim
- Filter theo status
- Thống kê phim

**API Calls:**
- `GET /api/movies`
- `POST /api/movies`
- `PUT /api/movies/:id`
- `DELETE /api/movies/:id`
- `GET /api/movies/search?title=...`

#### ShowtimeManagement (`/admin/showtimes`)
Quản lý suất chiếu

**Features:**
- Danh sách suất chiếu
- Tạo suất chiếu mới
- Chọn phim, phòng, thời gian
- Cập nhật/Xóa suất chiếu

**API Calls:**
- `GET /api/showtimes`
- `POST /api/showtimes`
- `PUT /api/showtimes/:id`
- `DELETE /api/showtimes/:id`

#### SeatManagement (`/admin/seats`)
Quản lý phòng và sơ đồ ghế

**Features:**
- Danh sách phòng chiếu
- Tạo/Sửa/Xóa phòng
- Chỉnh sửa sơ đồ ghế
- Visual seat editor
- Seat types: Standard, VIP, Couple, Aisle

**API Calls:**
- `GET /api/admin/rooms`
- `POST /api/admin/rooms`
- `PUT /api/admin/rooms/:id`
- `DELETE /api/admin/rooms/:id`
- `GET /api/admin/rooms/:id/layout`
- `PUT /api/admin/rooms/:id/layout`

#### OrderManagement (`/admin/orders`)
Quản lý đơn hàng

**Features:**
- Danh sách đơn hàng
- Chi tiết đơn hàng
- Cập nhật trạng thái
- Filter và search

**API Calls:**
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PUT /api/admin/orders/:id/status`

#### TransactionManagement (`/admin/transactions`)
Quản lý giao dịch

**Features:**
- Danh sách giao dịch
- Thông tin thanh toán
- Báo cáo doanh thu

**API Calls:**
- `GET /api/admin/transactions`

#### StaffManagement (`/admin/staff`)
Quản lý nhân viên

**Features:**
- Danh sách nhân viên
- Thêm/Sửa/Xóa nhân viên
- Phân quyền

**API Calls:**
- `GET /api/staff`
- `POST /api/staff`
- `PUT /api/staff/:id`
- `DELETE /api/staff/:id`

## 🔌 API Integration

### API Client Configuration

#### lib/api.js
Fetch-based API client

```javascript
const API_BASE_URL = 'http://localhost:8080/api';

async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

export const api = {
  getShowtimeSeatInfo: (showtimeId) => 
    fetchApi(`/booking/showtime/${showtimeId}/seats`),
  createBooking: (bookingData) => 
    fetchApi('/booking', { method: 'POST', body: JSON.stringify(bookingData) }),
  // ... more methods
};
```

#### services/api.js
Axios-based API client với interceptors

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('jwtToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};
```

### Service Layer

#### services/movieService.js
Movie-related API calls

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getAllMoviesList = async () => {
  const response = await axios.get(`${API_BASE_URL}/movies`);
  return response.data.content || response.data;
};

export const getShowingMovies = async () => {
  const response = await axios.get(`${API_BASE_URL}/movies/showing`);
  return response.data;
};

export const getUpcomingMovies = async () => {
  const response = await axios.get(`${API_BASE_URL}/movies/upcoming`);
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
  return response.data;
};

export const createMovie = async (movieData) => {
  const response = await axios.post(`${API_BASE_URL}/movies`, movieData);
  return response.data;
};

export const updateMovie = async (id, movieData) => {
  const response = await axios.put(`${API_BASE_URL}/movies/${id}`, movieData);
  return response.data;
};

export const deleteMovie = async (id) => {
  await axios.delete(`${API_BASE_URL}/movies/${id}`);
};
```

#### services/admin.js
Admin-related API calls

```javascript
import { api } from '@/lib/api';

export async function getAllRoomsAdmin() {
  return api.getAllRooms();
}

export async function createRoomAdmin(roomData) {
  const payload = {
    name: roomData.name,
    totalRows: parseInt(roomData.totalRows, 10),
    seatsPerRow: parseInt(roomData.seatsPerRow, 10)
  };
  return api.createRoom(payload);
}

export async function updateRoomAdmin(roomId, roomData) {
  const payload = {
    name: roomData.name,
    totalRows: parseInt(roomData.totalRows, 10),
    seatsPerRow: parseInt(roomData.seatsPerRow, 10)
  };
  return api.updateRoom(roomId, payload);
}

export async function deleteRoomAdmin(roomId) {
  return api.deleteRoom(roomId);
}
```

## 🎣 Custom Hooks

### useMovies.js
Custom hooks cho movie operations

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as movieService from '@/services/movieService';

// Fetch all movies
export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: movieService.getAllMoviesList,
  });
};

// Create movie
export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: movieService.createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
    },
  });
};

// Update movie
export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => movieService.updateMovie(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
    },
  });
};

// Delete movie
export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: movieService.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
    },
  });
};
```

---

**Xem thêm:**
- [Hướng dẫn cài đặt Frontend](./FRONTEND_SETUP.md)
- [Component Library](./COMPONENTS.md)
- [State Management](./STATE_MANAGEMENT.md)

