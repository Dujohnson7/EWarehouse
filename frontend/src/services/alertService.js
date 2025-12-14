import api from './api';

const alertService = {
    getAllAlerts: async () => {
        const response = await api.get('/Alerts');
        return response.data;
    },

    getAlertById: async (id) => {
        const response = await api.get(`/Alerts/${id}`);
        return response.data;
    },

    createAlert: async (alertData) => {
        const response = await api.post('/Alerts', alertData);
        return response.data;
    },

    updateAlert: async (id, alertData) => {
        const response = await api.put(`/Alerts/${id}`, alertData);
        return response.data;
    },

    deleteAlert: async (id) => {
        const response = await api.delete(`/Alerts/${id}`);
        return response.data;
    }
};

export default alertService;
