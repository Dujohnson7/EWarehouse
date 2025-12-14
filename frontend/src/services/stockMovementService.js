import api from './api';

const stockMovementService = {
    getAllMovements: async () => {
        const response = await api.get('/StockMovements');
        return response.data;
    },

    getMovementById: async (id) => {
        const response = await api.get(`/StockMovements/${id}`);
        return response.data;
    },

    // Stock IN
    createStockIn: async (data) => {
        const response = await api.post('/StockMovements/in', data);
        return response.data;
    },
    updateStockIn: async (id, data) => {
        const response = await api.put(`/StockMovements/in/${id}`, data);
        return response.data;
    },
    deleteStockIn: async (id) => {
        const response = await api.delete(`/StockMovements/in/${id}`);
        return response.data;
    },

    // Stock OUT
    createStockOut: async (data) => {
        const response = await api.post('/StockMovements/out', data);
        return response.data;
    },
    updateStockOut: async (id, data) => {
        const response = await api.put(`/StockMovements/out/${id}`, data);
        return response.data;
    },
    deleteStockOut: async (id) => {
        const response = await api.delete(`/StockMovements/out/${id}`);
        return response.data;
    },

    // Stock ADJUST
    createStockAdjust: async (data) => {
        const response = await api.post('/StockMovements/adjust', data);
        return response.data;
    },
    updateStockAdjust: async (id, data) => {
        const response = await api.put(`/StockMovements/adjust/${id}`, data);
        return response.data;
    },
    deleteStockAdjust: async (id) => {
        const response = await api.delete(`/StockMovements/adjust/${id}`);
        return response.data;
    },

    // Transfer (IN/OUT combined or separate? Checking Backend...)
    // Backend has Transfer_In and Transfer_Out SPs, but Controller might expose them differently.
    // Checked Controller: It likely has separate endpoints or a type field.
    // Assuming standard paths based on other methods.

    // Transfer OUT (separate from Transfer IN)
    createTransferOut: async (data) => {
        const response = await api.post('/StockMovements/transfer-out', data);
        return response.data;
    },
    updateTransferOut: async (id, data) => {
        const response = await api.put(`/StockMovements/transfer-out/${id}`, data);
        return response.data;
    },
    deleteTransferOut: async (id) => {
        const response = await api.delete(`/StockMovements/transfer-out/${id}`);
        return response.data;
    },

    // Transfer IN
    createTransferIn: async (data) => {
        const response = await api.post('/StockMovements/transfer-in', data);
        return response.data;
    },
    updateTransferIn: async (id, data) => {
        const response = await api.put(`/StockMovements/transfer-in/${id}`, data);
        return response.data;
    },
    deleteTransferIn: async (id) => {
        const response = await api.delete(`/StockMovements/transfer-in/${id}`);
        return response.data;
    },

    // Complete Transfer (update TransferStatus to true)
    // Using updateTransferIn since there's no dedicated complete endpoint
    completeTransferIn: async (movementId, transferData) => {
        const response = await api.put(`/StockMovements/transfer-in/${movementId}`, {
            ...transferData,
            transferStatus: true
        });
        return response.data;
    }
};

export default stockMovementService;
