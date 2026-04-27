import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Box, Grid, Card, CardContent, Typography,
    Chip, Button, Divider, CircularProgress, Tab, Tabs
} from '@mui/material'
import ArrowBackIcon   from '@mui/icons-material/ArrowBack'
import AddIcon         from '@mui/icons-material/Add'
import PageHeader      from '../components/common/PageHeader'
import { RiskChip }    from '../components/common/StatusChip'
import { DebtStatusChip } from '../components/common/StatusChip'
import { clientApi }   from '../api/clientApi'
import { debtApi }     from '../api/debtApi'
import { formatCurrency, formatDate } from '../utils/formatters'
import toast           from 'react-hot-toast'
import DebtForm        from '../components/debts/DebtForm'

export default function ClientDetailPage() {
    const { id }       = useParams()
    const navigate     = useNavigate()
    const [client, setClient]   = useState(null)
    const [debts, setDebts]     = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab]         = useState(0)
    const [debtFormOpen, setDebtFormOpen] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [clientRes, debtsRes] = await Promise.all([
                clientApi.getById(id),
                debtApi.getByClient(id, { page: 0, size: 50 })
            ])
            setClient(clientRes.data)
            setDebts(debtsRes.data.content)
        } catch {
            toast.error('Error al cargar el cliente')
            navigate('/clients')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [id])

    const handleCreateDebt = async (data) => {
        await debtApi.create({ ...data, clientId: Number(id) })
        toast.success('Deuda registrada correctamente')
        setDebtFormOpen(false)
        fetchData()
    }

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
        </Box>
    )

    if (!client) return null

    const totalDebt = debts.reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0)

    return (
        <Box>
            <PageHeader
                title={client.name}
                subtitle={`DNI: ${client.dni}`}
                action={{
                    label: 'Nueva deuda',
                    icon: <AddIcon />,
                    onClick: () => setDebtFormOpen(true)
                }}
            />

            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/clients')}
                sx={{ mb: 2 }}
            >
                Volver a clientes
            </Button>

            <Grid container spacing={3}>
                {/* Info del cliente */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" mb={2}>Información</Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Estado</Typography>
                                    <Chip
                                        label={client.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                        color={client.status === 'ACTIVE' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Riesgo</Typography>
                                    <RiskChip riskLevel={client.riskLevel} />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Email</Typography>
                                    <Typography variant="body2">{client.email || '—'}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Teléfono</Typography>
                                    <Typography variant="body2">{client.phone || '—'}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Registrado</Typography>
                                    <Typography variant="body2">{formatDate(client.createdAt)}</Typography>
                                </Box>

                                <Divider />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Deuda total</Typography>
                                    <Typography variant="body2" fontWeight={700} color="error.main">
                                        {formatCurrency(totalDebt)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Nº deudas</Typography>
                                    <Typography variant="body2">{client.totalDebts}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Deudas */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                                <Tab label={`Todas (${debts.length})`} />
                                <Tab label={`Vencidas (${debts.filter(d => d.status === 'OVERDUE').length})`} />
                                <Tab label={`Pagadas (${debts.filter(d => d.status === 'PAID').length})`} />
                            </Tabs>

                            {debts
                                .filter(d => {
                                    if (tab === 1) return d.status === 'OVERDUE'
                                    if (tab === 2) return d.status === 'PAID'
                                    return true
                                })
                                .map(debt => (
                                    <Card
                                        key={debt.id}
                                        variant="outlined"
                                        sx={{ mb: 1.5, '&:hover': { borderColor: 'primary.main' } }}
                                    >
                                        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {debt.description || 'Sin descripción'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Vence: {formatDate(debt.dueDate)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body1" fontWeight={700}>
                                                        {formatCurrency(debt.remainingAmount)}
                                                    </Typography>
                                                    <DebtStatusChip status={debt.status} />
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))
                            }

                            {debts.length === 0 && (
                                <Typography color="text.secondary" textAlign="center" py={4}>
                                    No hay deudas registradas
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <DebtForm
                open={debtFormOpen}
                onClose={() => setDebtFormOpen(false)}
                onSubmit={handleCreateDebt}
                clientId={Number(id)}
                clientName={client.name}
            />
        </Box>
    )
}