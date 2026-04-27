import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, TextField, Button, CircularProgress, Typography
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const schema = yup.object({
    amount:      yup.number().min(0.01, 'El monto debe ser mayor a 0').required('El monto es obligatorio'),
    description: yup.string().max(255).nullable(),
    dueDate:     yup.date().min(new Date(), 'La fecha debe ser futura').required('La fecha es obligatoria')
})

export default function DebtForm({ open, onClose, onSubmit, clientId, clientName, loading }) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { amount: '', description: '', dueDate: null }
    })

    useEffect(() => {
        if (!open) reset({ amount: '', description: '', dueDate: null })
    }, [open, reset])

    const handleFormSubmit = (data) => {
        onSubmit({
            clientId,
            amount:      data.amount,
            description: data.description,
            dueDate:     dayjs(data.dueDate).format('YYYY-MM-DD')
        })
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Nueva Deuda
                    {clientName && (
                        <Typography variant="body2" color="text.secondary">
                            Cliente: {clientName}
                        </Typography>
                    )}
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Monto (S/.)"
                                        fullWidth
                                        type="number"
                                        inputProps={{ min: 0.01, step: 0.01 }}
                                        error={!!errors.amount}
                                        helperText={errors.amount?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="dueDate"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Fecha de vencimiento"
                                        value={field.value ? dayjs(field.value) : null}
                                        onChange={field.onChange}
                                        minDate={dayjs().add(1, 'day')}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.dueDate,
                                                helperText: errors.dueDate?.message
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Descripción"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={onClose} variant="outlined" disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit(handleFormSubmit)}
                        variant="contained"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={16} color="inherit" />}
                    >
                        Registrar deuda
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    )
}