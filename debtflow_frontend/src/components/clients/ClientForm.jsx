import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, TextField, Button, CircularProgress
} from '@mui/material'

const schema = yup.object({
    name:  yup.string().min(2, 'Mínimo 2 caracteres').max(100).required('El nombre es obligatorio'),
    dni:   yup.string().matches(/^[0-9]{8}$/, 'El DNI debe tener 8 dígitos').required('El DNI es obligatorio'),
    email: yup.string().email('Email inválido').nullable(),
    phone: yup.string().matches(/^[0-9+\-\s]{7,20}$/, 'Teléfono inválido').nullable()
})

export default function ClientForm({ open, onClose, onSubmit, initialData, loading }) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { name: '', dni: '', email: '', phone: '' }
    })

    useEffect(() => {
        if (initialData) {
            reset({
                name:  initialData.name  || '',
                dni:   initialData.dni   || '',
                email: initialData.email || '',
                phone: initialData.phone || ''
            })
        } else {
            reset({ name: '', dni: '', email: '', phone: '' })
        }
    }, [initialData, reset, open])

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {initialData ? 'Editar Cliente' : 'Nuevo Cliente'}
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre completo"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="dni"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="DNI"
                                    fullWidth
                                    inputProps={{ maxLength: 8 }}
                                    error={!!errors.dni}
                                    helperText={errors.dni?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Teléfono"
                                    fullWidth
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    fullWidth
                                    type="email"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={handleClose} variant="outlined" disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={16} color="inherit" />}
                >
                    {initialData ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}