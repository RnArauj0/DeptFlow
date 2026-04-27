import api from './axiosConfig.js'

export const clientApi = {
    getAll: (params)    => api.get('/clients', {params}),
    getById: (id)       => api.get(`/clients/${id }`),
    getByDni: (dni)     => api.get(`/clients/dni/${dni}`),
    create: (data)      => api.post('/clients', data),
    update: (id, data)  => api.put(`/clients/${id}`, data),
    deactivate: (id)    => api.delete(`/clients/${id}`)
}