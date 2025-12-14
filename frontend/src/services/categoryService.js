import api from './api';

const categoryService = {
    getAllCategories: async () => {
        const response = await api.get('/Categories');
        return response.data;
    },

    getCategoryById: async (id) => {
        const response = await api.get(`/Categories/${id}`);
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post('/Categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/Categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/Categories/${id}`);
        return response.data;
    }
};

export default categoryService;
