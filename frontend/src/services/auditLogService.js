import api from './api';

const auditLogService = {
    getAllAuditLogs: async () => {
        const response = await api.get('/AuditLog');
        return response.data;
    },

    getLogById: async (id) => {
        const response = await api.get(`/AuditLog/${id}`);
        return response.data;
    }
};

export default auditLogService;
