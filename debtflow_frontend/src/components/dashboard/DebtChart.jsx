import { Card, CardContent, Typography, Box } from '@mui/material'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts'

const COLORS = {
    PENDING:     '#1E88E5',
    OVERDUE:     '#C62828',
    NEGOTIATING: '#F57F17',
    PAID:        '#2E7D32'
}

export function DebtBarChart({ data }) {
    const chartData = [
        { name: 'Pendientes', valor: data?.activeDebts  || 0, fill: COLORS.PENDING },
        { name: 'Vencidas',   valor: data?.overdueDebts || 0, fill: COLORS.OVERDUE },
    ]

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" mb={2}>Estado de Deudas</Typography>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} barSize={48}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip
                            formatter={(value) => [value, 'Deudas']}
                            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                        />
                        <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export function CollectionPieChart({ data }) {
    const chartData = [
        { name: 'Cobrado',   value: Number(data?.totalCollected || 0) },
        { name: 'Pendiente', value: Number(data?.totalPending   || 0) },
    ]

    const PIE_COLORS = ['#2E7D32', '#C62828']

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" mb={2}>Cobrado vs Pendiente</Typography>
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={PIE_COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`S/. ${Number(value).toFixed(2)}`, '']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}