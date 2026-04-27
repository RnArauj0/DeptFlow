import { Box, Typography, Button } from '@mui/material'

export default function PageHeader({ title, subtitle, action }) {
    return (
        <Box sx={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', mb: 3
        }}>
            <Box>
                <Typography variant="h5" fontWeight={700}>{title}</Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {action && (
                <Button
                    variant="contained"
                    startIcon={action.icon}
                    onClick={action.onClick}
                >
                    {action.label}
                </Button>
            )}
        </Box>
    )
}