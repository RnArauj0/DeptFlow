import { Box, IconButton, Tooltip, MenuItem, Select, FormControl } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon        from '@mui/icons-material/Delete'
import VisibilityIcon    from '@mui/icons-material/Visibility'
import { DebtStatusChip } from '../common/StatusChip'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useNavigate } from 'react-router-dom'

const STATUS_OPTIONS = ['PENDING', 'OVERDUE', 'NEGOTIATING', 'PAID', 'CANCELLED']

export default function DebtTable({
                                      debts, loading, total,
                                      page, pageSize, onPageChange, onPageSizeChange,
                                      onStatusChange, onDelete
                                  }) {
    const navigate = useNavigate()

    const columns = [
        {
            field: 'clientName',
            headerName: 'Cliente',
            flex: 1.2,
            minWidth: 150
        },
        {
            field: 'description',
            headerName: 'Descripción',
            flex: 1,
            minWidth: 140,
            renderCell: ({ value }) => value || '—'
        },
        {
            field: 'amount',
            headerName: 'Monto total',
            width: 130,
            renderCell: ({ value }) => formatCurrency(value)
        },
        {
            field: 'remainingAmount',
            headerName: 'Pendiente',
            width: 130,
            renderCell: ({ value }) => (
                <Box sx={{ color: Number(value) > 0 ? 'error.main' : 'success.main', fontWeight: 600 }}>
                    {formatCurrency(value)}
                </Box>
            )
        },
        {
            field: 'dueDate',
            headerName: 'Vencimiento',
            width: 120,
            renderCell: ({ value }) => formatDate(value)
        },
        {
            field: 'status',
            headerName: 'Estado',
            width: 160,
            renderCell: ({ row }) => (
                <FormControl size="small" fullWidth>
                    <Select
                        value={row.status}
                        onChange={e => onStatusChange(row.id, e.target.value)}
                        renderValue={() => <DebtStatusChip status={row.status} />}
                        sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                    >
                        {STATUS_OPTIONS.map(s => (
                            <MenuItem key={s} value={s}>
                                <DebtStatusChip status={s} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 100,
            sortable: false,
            renderCell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Ver cliente">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/clients/${row.clientId}`)}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ]

    return (
        <DataGrid
            rows={debts}
            columns={columns}
            loading={loading}
            rowCount={total ?? 0}
            paginationMode="server"
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={({ page: p, pageSize: ps }) => {
                onPageChange(p)        // ← funciones directas garantizadas
                onPageSizeChange(ps)
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            autoHeight
            keepNonExistentRowsSelected
            sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'background.default',
                    fontWeight: 600
                }
            }}
        />
    )
}