import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
    baseURL: '/api/v1',    // Nginx redirige al backend automáticamente
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.response.use(
    response => response.data,
    error => {
        const message = error.response?.data?.message || 'Error inesperado'
        toast.error(message)
        return Promise.reject(error)
    }
)

export default api