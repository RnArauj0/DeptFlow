import { Chip } from '@mui/material'
import {
    getDebtStatusColor,
    getDebtStatusLabel,
    getRiskColor
} from '../../utils/formatters'

export function DebtStatusChip({ status }) {
    return (
        <Chip
            label={getDebtStatusLabel(status)}
            color={getDebtStatusColor(status)}
            size="small"
            sx={{ fontWeight: 500 }}
        />
    )
}

export function RiskChip({ riskLevel }) {
    const labels = { HIGH: 'Alto', MEDIUM: 'Medio', LOW: 'Bajo' }
    return (
        <Chip
            label={labels[riskLevel] || riskLevel}
            color={getRiskColor(riskLevel)}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
        />
    )
}