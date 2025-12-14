import api from './api';

const userService = {
    getAllUsers: async () => {
        const response = await api.get('/Users');
        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/Users/${id}`);
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/Users', userData);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/Users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/Users/${id}`);
        return response.data;
    }
};

export default userService;
