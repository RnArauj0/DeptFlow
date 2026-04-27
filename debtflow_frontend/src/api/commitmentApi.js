import api from './axiosConfig'

export const commitmentApi = {
    getByDebt:    (debtId, params) =>
        api.get(`/commitments/debt/${debtId}`, { params }),
    create:       (data)           => api.post('/commitments', data),
    updateStatus: (id, status)     =>
        api.patch(`/commitments/${id}/status`, null, { params: { status } })
}