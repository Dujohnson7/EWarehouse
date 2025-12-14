import api from './api';

const binService = {
    getAllBins: async () => {
        const response = await api.get('/Bins');
        return response.data;
    },

    getBinByCode: async (code) => {
        const response = await api.get(`/Bins/${code}`);
        return response.data;
    },

    createBin: async (binData) => {
        const response = await api.post('/Bins', binData);
        return response.data;
    },

    updateBin: async (code, binData) => {
        const response = await api.put(`/Bins/${code}`, binData);
        return response.data;
    },

    deleteBin: async (code) => {
        const response = await api.delete(`/Bins/${code}`);
        return response.data;
    }
};

export default binService;
