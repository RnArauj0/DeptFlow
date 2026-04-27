import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export const formatCurrency = (amount) => {
    if (amount == null) return 'S/. 0.00'
    return `S/. ${Number(amount).toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}

export const formatDate = (date) => {
    if (!date) return '—'
    return dayjs(date).format('DD/MM/YYYY')
}

export const formatDateTime = (date) => {
    if (!date) return '—'
    return dayjs(date).format('DD/MM/YYYY HH:mm')
}

export const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
        case 'HIGH':   return 'error'
        case 'MEDIUM': return 'warning'
        case 'LOW':    return 'success'
        default:       return 'default'
    }
}

export const getDebtStatusColor = (status) => {
    switch (status) {
        case 'PAID':        return 'success'
        case 'OVERDUE':     return 'error'
        case 'NEGOTIATING': return 'warning'
        case 'PENDING':     return 'info'
        case 'CANCELLED':   return 'default'
        default:            return 'default'
    }
}

export const getDebtStatusLabel = (status) => {
    const labels = {
        PAID:        'Pagado',
        OVERDUE:     'Vencido',
        NEGOTIATING: 'Negociando',
        PENDING:     'Pendiente',
        CANCELLED:   'Cancelado'
    }
    return labels[status] || status
}