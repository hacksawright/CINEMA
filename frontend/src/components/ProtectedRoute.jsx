// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = sessionStorage.getItem('jwtToken'); 
    
    // Nếu token không tồn tại, người dùng chưa đăng nhập.
    if (!token) {
        // Chuyển hướng người dùng về trang đăng nhập
        return <Navigate to="/auth" replace />; 
    }

    // Nếu token tồn tại, cho phép truy cập trang đích
    return <Outlet />;
};

export default ProtectedRoute;