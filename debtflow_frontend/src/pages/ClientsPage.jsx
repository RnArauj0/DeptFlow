import { useState } from 'react'
import { Box, Card, CardContent } from '@mui/material'
import AddIcon       from '@mui/icons-material/Add'
import PageHeader    from '../components/common/PageHeader'
import ClientTable   from '../components/clients/ClientTable'
import ClientForm    from '../components/clients/ClientForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import useClients    from '../hooks/useClients'

export default function ClientsPage() {
    const {
        clients, loading, total,
        page, setPage,
        pageSize, setPageSize,
        search, setSearch,
        createClient, updateClient, deactivateClient
    } = useClients()

    const [formOpen, setFormOpen]       = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selected, setSelected]       = useState(null)
    const [submitting, setSubmitting]   = useState(false)

    const handleEdit = (client) => {
        setSelected(client)
        setFormOpen(true)
    }

    const handleDelete = (client) => {
        setSelected(client)
        setConfirmOpen(true)
    }

    const handleNewClient = () => {
        setSelected(null)
        setFormOpen(true)
    }

    const handleSubmit = async (data) => {
        setSubmitting(true)
        try {
            if (selected) {
                await updateClient(selected.id, data)
            } else {
                await createClient(data)
            }
            setFormOpen(false)
            setSelected(null)
        } finally {
            setSubmitting(false)
        }
    }

    const handleConfirmDelete = async () => {
        await deactivateClient(selected.id)
        setConfirmOpen(false)
        setSelected(null)
    }

    return (
        <Box>
            <PageHeader
                title="Clientes"
                subtitle="Gestión de cartera de clientes"
                action={{
                    label: 'Nuevo cliente',
                    icon: <AddIcon />,
                    onClick: handleNewClient
                }}
            />

            <Card>
                <CardContent>
                    <ClientTable
                        clients={clients}
                        loading={loading}
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        search={search}
                        onSearchChange={setSearch}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <ClientForm
                open={formOpen}
                onClose={() => { setFormOpen(false); setSelected(null) }}
                onSubmit={handleSubmit}
                initialData={selected}
                loading={submitting}
            />

            <ConfirmDialog
                open={confirmOpen}
                title="Desactivar cliente"
                message={`¿Estás seguro de desactivar a ${selected?.name}? Esta acción no elimina sus deudas.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => { setConfirmOpen(false); setSelected(null) }}
            />
        </Box>
    )
}