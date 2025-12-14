import api from './api';

const productLocationService = {
    getAllProductLocations: async () => {
        const response = await api.get('/ProductLocations');
        return response.data;
    },

    getLocationById: async (id) => {
        const response = await api.get(`/ProductLocations/${id}`);
        return response.data;
    },

    createLocation: async (data) => {
        const response = await api.post('/ProductLocations', data);
        return response.data;
    },

    deleteLocation: async (id) => {
        const response = await api.delete(`/ProductLocations/${id}`);
        return response.data;
    },

    updateLocation: async (id, data) => {
        const response = await api.put(`/ProductLocations/${id}`, data);
        return response.data;
    }
};

export default productLocationService;
