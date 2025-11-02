import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Dùng React Router để chuyển hướng

// Component Đăng nhập
const LoginComponent = () => {
    // State để lưu trữ dữ liệu form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    // Hook chuyển hướng
    const navigate = useNavigate();

    // Hàm xử lý khi nhấn nút Đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault(); // Ngăn chặn tải lại trang

        setError(null); // Reset lỗi
        
        try {
            // 1. Gửi yêu cầu POST đến Backend
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // 2. Xử lý phản hồi
            if (response.ok) {
                // Đăng nhập thành công!
                
                // Lưu Token và ID vào Local Storage
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('userId', data.userId); 
                
                // Chuyển hướng người dùng về trang chủ
                navigate('/'); 
            } else {
                // Đăng nhập thất bại (401 Unauthorized)
                const errorMessage = data.message || 'Email hoặc mật khẩu không đúng.';
                setError(errorMessage);
            }
        } catch (err) {
            // Lỗi kết nối mạng hoặc server không phản hồi
            setError('Không thể kết nối tới server. Vui lòng thử lại.');
        }
    };

    return (
        <form onSubmit={handleLogin} className="login-form">
            <h2>Đăng Nhập</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            
            <input
                type="password"
                placeholder="Mật Khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            
            <button type="submit">Đăng Nhập</button>
        </form>
    );
};

export default LoginComponent;