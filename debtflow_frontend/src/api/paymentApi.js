import api from './axiosConfig'

export const paymentApi = {
    getByDebt: (debtId, params) =>
        api.get(`/payments/debt/${debtId}`, { params }),
    register:  (data) => api.post('/payments', data)
}