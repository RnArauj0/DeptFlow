import api from './axiosConfig'

export const debtApi = {
    getAll:      (params)         => api.get('/debts', { params }),
    getByClient: (clientId, params) =>
        api.get(`/debts/client/${clientId}`, { params }),
    getById:     (id)             => api.get(`/debts/${id}`),
    create:      (data)           => api.post('/debts', data),
    updateStatus:(id, status)     =>
        api.patch(`/debts/${id}/status`, null, { params: { status } }),
    delete:      (id)             => api.delete(`/debts/${id}`)
}