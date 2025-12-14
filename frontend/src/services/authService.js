import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/Auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Store complete user data
            localStorage.setItem('user', JSON.stringify({
                userID: response.data.userID,
                fullName: response.data.fullName,
                email: response.data.email,
                role: response.data.role
            }));
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
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;
