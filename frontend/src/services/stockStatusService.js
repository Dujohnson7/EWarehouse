import api from './api';

const stockStatusService = {
    getAllStockStatuses: async () => {
        const response = await api.get('/StockStatus');
        return response.data;
    },

    getStockByWarehouse: async (warehouseId) => {
        const response = await api.get(`/StockStatus/warehouse/${warehouseId}`);
        return response.data;
    },

    getStockByProductAndWarehouse: async (productId, warehouseId) => {
        const response = await api.get(`/StockStatus/${productId}/${warehouseId}`);
        return response.data;
    }
};

export default stockStatusService;
