import api from './api';

const zoneService = {
    getAllZones: async () => {
        const response = await api.get('/Zones');
        return response.data;
    },

    getZoneById: async (id) => {
        const response = await api.get(`/Zones/${id}`);
        return response.data;
    },

    createZone: async (zoneData) => {
        const response = await api.post('/Zones', zoneData);
        return response.data;
    },

    updateZone: async (id, zoneData) => {
        const response = await api.put(`/Zones/${id}`, zoneData);
        return response.data;
    },

    deleteZone: async (id) => {
        const response = await api.delete(`/Zones/${id}`);
        return response.data;
    }
};

export default zoneService;
