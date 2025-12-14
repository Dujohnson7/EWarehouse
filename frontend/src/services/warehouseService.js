import api from './api';

const warehouseService = {
    getAllWarehouses: async () => {
        const response = await api.get('/Warehouses');
        return response.data;
    },

    getWarehouseById: async (id) => {
        const response = await api.get(`/Warehouses/${id}`);
        return response.data;
    },

    createWarehouse: async (warehouseData) => {
        const response = await api.post('/Warehouses', warehouseData);
        return response.data;
    },

    updateWarehouse: async (id, warehouseData) => {
        const response = await api.put(`/Warehouses/${id}`, warehouseData);
        return response.data;
    },

    deleteWarehouse: async (id) => {
        const response = await api.delete(`/Warehouses/${id}`);
        return response.data;
    }
};

export default warehouseService;
