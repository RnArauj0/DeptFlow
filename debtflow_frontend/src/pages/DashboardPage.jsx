import { Grid, Box, Typography, LinearProgress, Card, CardContent } from '@mui/material'
import PeopleIcon          from '@mui/icons-material/People'
import ReceiptLongIcon     from '@mui/icons-material/ReceiptLong'
import WarningAmberIcon    from '@mui/icons-material/WarningAmber'
import TrendingUpIcon      from '@mui/icons-material/TrendingUp'
import AccountBalanceIcon  from '@mui/icons-material/AccountBalance'
import PageHeader          from '../components/common/PageHeader'
import KpiCard             from '../components/dashboard/KpiCard'
import { DebtBarChart, CollectionPieChart } from '../components/dashboard/DebtChart'
import useDashboard        from '../hooks/useDashboard'
import { formatCurrency }  from '../utils/formatters'

export default function DashboardPage() {
    const { data, loading } = useDashboard()

    return (
        <Box>
            <PageHeader
                title="Dashboard"
                subtitle="Resumen general del sistema de cobranzas"
            />

            {/* KPI Cards */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="Total Clientes"
                        value={data?.totalClients ?? '—'}
                        icon={<PeopleIcon />}
                        color="primary.main"
                        loading={loading}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="Deudas Activas"
                        value={data?.activeDebts ?? '—'}
                        icon={<ReceiptLongIcon />}
                        color="info.main"
                        loading={loading}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="Deudas Vencidas"
                        value={data?.overdueDebts ?? '—'}
                        icon={<WarningAmberIcon />}
                        color="error.main"
                        loading={loading}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        title="Total Deuda"
                        value={formatCurrency(data?.totalDebtAmount)}
                        icon={<AccountBalanceIcon />}
                        color="secondary.main"
                        loading={loading}
                    />
                </Grid>
            </Grid>

            {/* Tasa de cobro */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrendingUpIcon color="success" />
                                    <Typography variant="h6">Tasa de Cobro</Typography>
                                </Box>
                                <Typography variant="h6" color="success.main" fontWeight={700}>
                                    {loading ? '...' : `${(data?.collectionRate ?? 0).toFixed(1)}%`}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant={loading ? 'indeterminate' : 'determinate'}
                                value={data?.collectionRate ?? 0}
                                color="success"
                                sx={{ height: 10, borderRadius: 5 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Cobrado: {formatCurrency(data?.totalCollected)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Pendiente: {formatCurrency(data?.totalPending)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráficas */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <DebtBarChart data={data} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CollectionPieChart data={data} />
                </Grid>
            </Grid>
        </Box>
    )
}