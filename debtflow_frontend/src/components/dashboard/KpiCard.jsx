import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material'

export default function KpiCard({ title, value, subtitle, icon, color = 'primary.main', loading }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        {loading ? (
                            <Skeleton width={120} height={40} />
                        ) : (
                            <Typography variant="h5" fontWeight={700} color={color}>
                                {value}
                            </Typography>
                        )}
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{
                        bgcolor: `${color}15`,
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Box sx={{ color, '& svg': { fontSize: 28 } }}>
                            {icon}
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}