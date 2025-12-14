import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/Auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
 
            const user = {
                userID: response.data.userID,
                fullName: response.data.fullName,
                email: response.data.email,
                role: response.data.role,
                warehouseID: response.data.warehouseID,
                isInsert: response.data.isInsert,
                isUpdate: response.data.isUpdate,
                isDelete: response.data.isDelete,
                isActive: response.data.isActive
            };

            localStorage.setItem('user', JSON.stringify(user)); 
            localStorage.setItem('userRole', user.role || '');
            localStorage.setItem('userWarehouseId', user.warehouseID || '');
            localStorage.setItem('userId', user.userID || '');
        }
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/Auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (email, otpCode, newPassword) => {
        const response = await api.post('/Auth/reset-password', {
            email,
            otpCode,
            newPassword
        });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/Auth/register', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userWarehouseId');
        localStorage.removeItem('userId');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
 
    getCurrentUserId: () => {
        return localStorage.getItem('userId') || null;
    },
 
    getUserRole: () => {
        return localStorage.getItem('userRole') || null;
    },
 
    getUserWarehouse: () => {
        return localStorage.getItem('userWarehouseId') || null;
    },
 
    getUserPermissions: () => {
        const user = authService.getCurrentUser();
        if (!user) return { isInsert: false, isUpdate: false, isDelete: false };

        return {
            isInsert: user.isInsert === true, 
            isUpdate: user.isUpdate === true,
            isDelete: user.isDelete === true
        };
    },
 
    isAdmin: () => {
        return authService.getUserRole() === 'Admin';
    },
 
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;
