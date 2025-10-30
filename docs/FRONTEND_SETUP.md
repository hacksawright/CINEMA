# 🚀 Hướng dẫn cài đặt Frontend - Cinema Management

## 📋 Yêu cầu hệ thống

### Phần mềm cần thiết
- **Node.js**: Version 18.x hoặc 20.x (LTS recommended)
- **npm**: Version 9.x+ (đi kèm với Node.js) hoặc **yarn**, **pnpm**
- **Git**: Để clone repository
- **Code Editor**: VS Code (recommended), WebStorm, hoặc editor khác

### Kiểm tra phiên bản

```bash
# Kiểm tra Node.js version
node --version
# Output mong đợi: v18.x.x hoặc v20.x.x

# Kiểm tra npm version
npm --version
# Output mong đợi: 9.x.x hoặc cao hơn

# Kiểm tra Git
git --version
```

## 🔧 Cài đặt từng bước

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd cinema-management/frontend
```

### Bước 2: Cài đặt dependencies

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install

# Hoặc sử dụng pnpm
pnpm install
```

**Lưu ý:** Lần cài đặt đầu tiên sẽ mất vài phút để download tất cả packages.

### Bước 3: Cấu hình environment variables (Optional)

Tạo file `.env` trong thư mục `frontend/`:

```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:8080/api

# API URL (alternative)
VITE_API_URL=http://localhost:8080
```

**Lưu ý:** Nếu không tạo file `.env`, ứng dụng sẽ sử dụng giá trị mặc định `http://localhost:8080`.

### Bước 4: Chạy development server

```bash
# Sử dụng npm
npm run dev

# Hoặc sử dụng yarn
yarn dev

# Hoặc sử dụng pnpm
pnpm dev
```

**Output mong đợi:**
```
  VITE v5.4.19  ready in 500 ms

  ➜  Local:   http://localhost:8081/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Bước 5: Mở trình duyệt

Truy cập: **http://localhost:8081**

Bạn sẽ thấy trang chủ của Cinema Management với danh sách phim.

## 📦 Scripts trong package.json

```json
{
  "scripts": {
    "dev": "vite",                    // Chạy dev server
    "build": "vite build",            // Build production
    "build:dev": "vite build --mode development",  // Build dev mode
    "lint": "eslint .",               // Chạy ESLint
    "preview": "vite preview"         // Preview production build
  }
}
```

### Sử dụng scripts

```bash
# Development
npm run dev

# Build cho production
npm run build

# Build cho development (với source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build locally
npm run preview
```

## 🔧 Cấu hình quan trọng

### 1. Vite Configuration (vite.config.js)

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8081,  // Port của dev server
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Path alias
    },
  },
});
```

**Giải thích:**
- `server.port: 8081`: Frontend chạy trên port 8081
- `@` alias: Cho phép import `@/components/...` thay vì `../../components/...`
- `react-swc`: Sử dụng SWC compiler (nhanh hơn Babel)

### 2. Tailwind Configuration (tailwind.config.js)

```javascript
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Custom cinema theme colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### 3. Path Aliases

Trong `vite.config.js` và `jsconfig.json` (hoặc `tsconfig.json`):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Sử dụng:**
```javascript
// Thay vì
import Button from '../../components/ui/button';

// Dùng
import Button from '@/components/ui/button';
```

## 🎨 Cài đặt shadcn/ui Components

### Thêm component mới

```bash
# Cài đặt shadcn/ui CLI (nếu chưa có)
npx shadcn-ui@latest init

# Thêm component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
```

Components sẽ được thêm vào `src/components/ui/`.

### Danh sách components đã cài

Xem file `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## 🔌 Kết nối với Backend

### Đảm bảo Backend đang chạy

```bash
# Kiểm tra backend health
curl http://localhost:8080/actuator/health

# Hoặc mở trình duyệt
# http://localhost:8080/actuator/health
```

### Cấu hình CORS

Backend phải cho phép CORS từ `http://localhost:8081`.

File: `server/cinema-server/src/main/java/com/cinema/config/WebConfig.java`

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8081")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Test API connection

Mở DevTools Console trong trình duyệt và chạy:

```javascript
fetch('http://localhost:8080/api/movies')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

## 🐛 Troubleshooting

### Lỗi: "Cannot find module '@/components/...'"

**Nguyên nhân:** Path alias chưa được cấu hình đúng

**Giải pháp:**
1. Kiểm tra `vite.config.js` có alias `@`
2. Restart dev server: `Ctrl+C` rồi `npm run dev`
3. Restart VS Code nếu dùng VS Code

### Lỗi: "Port 8081 already in use"

**Nguyên nhân:** Port 8081 đã được sử dụng

**Giải pháp 1:** Thay đổi port trong `vite.config.js`
```javascript
export default defineConfig({
  server: {
    port: 3000,  // Hoặc port khác
  },
});
```

**Giải pháp 2:** Kill process đang dùng port 8081
```bash
# Linux/Mac
lsof -i :8081
kill -9 <PID>

# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### Lỗi: "CORS policy blocked"

**Nguyên nhân:** Backend chưa cấu hình CORS cho frontend

**Giải pháp:**
1. Kiểm tra backend có file `WebConfig.java` với CORS config
2. Restart backend
3. Kiểm tra URL trong `allowedOrigins` khớp với frontend URL

### Lỗi: "Failed to fetch" khi gọi API

**Nguyên nhân:** Backend chưa chạy hoặc URL sai

**Giải pháp:**
1. Kiểm tra backend đang chạy: `curl http://localhost:8080/actuator/health`
2. Kiểm tra API URL trong code
3. Kiểm tra network tab trong DevTools

### Lỗi: "npm install" failed

**Nguyên nhân:** Node version không tương thích hoặc network issue

**Giải pháp:**
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Cài lại
npm install

# Hoặc thử với yarn
yarn install
```

### Lỗi: Build failed với Tailwind CSS

**Nguyên nhân:** PostCSS hoặc Tailwind config sai

**Giải pháp:**
1. Kiểm tra `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

2. Kiểm tra `tailwind.config.js` có đúng content paths
3. Restart dev server

## 🧪 Testing

### Chạy ESLint

```bash
npm run lint
```

### Test trong trình duyệt

1. Mở DevTools (F12)
2. Kiểm tra Console tab cho errors
3. Kiểm tra Network tab cho API calls
4. Kiểm tra Application tab cho localStorage (JWT token)

### Test responsive design

1. Mở DevTools (F12)
2. Click icon "Toggle device toolbar" (Ctrl+Shift+M)
3. Test với các kích thước: Mobile, Tablet, Desktop

## 🏗️ Build cho Production

### Build

```bash
npm run build
```

Output sẽ được tạo trong thư mục `dist/`:

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── index.html
└── ...
```

### Preview production build

```bash
npm run preview
```

Mở http://localhost:4173 để xem production build.

### Deploy

**Option 1: Static hosting (Netlify, Vercel, GitHub Pages)**

```bash
# Build
npm run build

# Deploy dist/ folder
```

**Option 2: Docker**

Tạo `Dockerfile`:

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build và run:

```bash
docker build -t cinema-frontend .
docker run -p 80:80 cinema-frontend
```

## 🔄 Development Workflow

### Hot Module Replacement (HMR)

Vite hỗ trợ HMR mặc định. Khi bạn sửa code, trình duyệt sẽ tự động cập nhật mà không cần refresh.

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Tailwind CSS IntelliSense** - Autocomplete cho Tailwind
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Auto Rename Tag** - Tự động rename paired tags
- **Path Intellisense** - Autocomplete cho file paths

### VS Code Settings

Tạo `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## 📚 Tài liệu tham khảo

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)

---

**Tiếp theo:** [Component Documentation](./COMPONENTS.md) | [Backend Setup](./BACKEND_SETUP.md)

