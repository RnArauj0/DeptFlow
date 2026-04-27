import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button
} from '@mui/material'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onCancel} variant="outlined">
                    Cancelar
                </Button>
                <Button onClick={onConfirm} variant="contained" color="error">
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}