import {
    Box, IconButton, Tooltip, TextField,
    InputAdornment, Chip
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon       from '@mui/icons-material/Edit'
import DeleteIcon     from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SearchIcon     from '@mui/icons-material/Search'
import { RiskChip }   from '../common/StatusChip'
import { formatDate } from '../../utils/formatters'
import { useNavigate } from 'react-router-dom'

export default function ClientTable({
                                        clients, loading, total,
                                        page, pageSize, onPageChange, onPageSizeChange,
                                        search, onSearchChange,
                                        onEdit, onDelete
                                    }) {
    const navigate = useNavigate()

    const columns = [
        {
            field: 'name',
            headerName: 'Nombre',
            flex: 1.5,
            minWidth: 160
        },
        {
            field: 'dni',
            headerName: 'DNI',
            width: 110
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            minWidth: 160,
            renderCell: ({ value }) => value || '—'
        },
        {
            field: 'phone',
            headerName: 'Teléfono',
            width: 130,
            renderCell: ({ value }) => value || '—'
        },
        {
            field: 'status',
            headerName: 'Estado',
            width: 120,
            renderCell: ({ value }) => (
                <Chip
                    label={value === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    color={value === 'ACTIVE' ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                />
            )
        },
        {
            field: 'riskLevel',
            headerName: 'Riesgo',
            width: 110,
            renderCell: ({ value }) => <RiskChip riskLevel={value} />
        },
        {
            field: 'createdAt',
            headerName: 'Registrado',
            width: 120,
            renderCell: ({ value }) => formatDate(value)
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 130,
            sortable: false,
            renderCell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Ver detalle">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/clients/${row.id}`)}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => onEdit(row)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Desactivar">
                        <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ]

    return (
        <Box>
            {/* Buscador */}
            <TextField
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Buscar por nombre o DNI..."
                size="small"
                sx={{ mb: 2, width: { xs: '100%', sm: 320 } }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    )
                }}
            />

            <DataGrid
                rows={clients}
                columns={columns}
                loading={loading}
                rowCount={total ?? 0}                    // ← fallback a 0
                paginationMode="server"
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={({ page: p, pageSize: ps }) => {
                    onPageChange(p)
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
        </Box>
    )
}