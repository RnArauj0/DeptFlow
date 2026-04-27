import { useState } from 'react'
import { Box, Card, CardContent } from '@mui/material'
import PageHeader    from '../components/common/PageHeader'
import DebtTable     from '../components/debts/DebtTable'
import ConfirmDialog from '../components/common/ConfirmDialog'
import useDebts      from '../hooks/useDebts'

export default function DebtsPage() {
    const {
        debts, loading, total,
        page, setPage,
        pageSize, setPageSize,
        updateStatus, deleteDebt
    } = useDebts()

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selected, setSelected]       = useState(null)

    const handleDelete = (debt) => {
        setSelected(debt)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        await deleteDebt(selected.id)
        setConfirmOpen(false)
        setSelected(null)
    }

    return (
        <Box>
            <PageHeader
                title="Deudas"
                subtitle="Gestión y seguimiento de deudas"
            />

            <Card>
                <CardContent>
                    <DebtTable
                        debts={debts}
                        loading={loading}
                        total={total ?? 0}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={(newPage) => setPage(newPage)}
                        onPageSizeChange={(newSize) => setPageSize(newSize)}
                        onStatusChange={updateStatus}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar deuda"
                message={`¿Estás seguro de eliminar la deuda de ${selected?.clientName}? Esta acción no se puede deshacer.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => { setConfirmOpen(false); setSelected(null) }}
            />
        </Box>
    )
}