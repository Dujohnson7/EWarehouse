import api from './api';

const productService = {
    getAllProducts: async () => {
        const response = await api.get('/Products');
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/Products/${id}`);
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await api.post('/Products', productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await api.put(`/Products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/Products/${id}`);
        return response.data;
    }
};

export default productService;
