

import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState({ 
        isLoggedIn: false, 
        fullName: null, 
        userId: null 
    });

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const name = localStorage.getItem('fullName');
        const id = localStorage.getItem('userId');

        if (token && name && id) {
            setUser({
                isLoggedIn: true,
                fullName: name,
                userId: id,
            });
        }
    }, []);

    // Hàm gọi khi đăng xuất
    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('fullName');
        localStorage.removeItem('userId');
        setUser({ isLoggedIn: false, fullName: null, userId: null });
    };

    return { user, logout };
};