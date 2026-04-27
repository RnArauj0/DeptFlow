import { Box, Typography, Avatar } from '@mui/material'
import SmartToyIcon  from '@mui/icons-material/SmartToy'
import PersonIcon    from '@mui/icons-material/Person'

export default function ChatMessage({ message }) {
    const isBot = message.sender === 'BOT'

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: isBot ? 'row' : 'row-reverse',
            gap: 1,
            mb: 1.5,
            alignItems: 'flex-end'
        }}>
            <Avatar sx={{
                width: 28, height: 28,
                bgcolor: isBot ? 'primary.main' : 'secondary.main',
                flexShrink: 0
            }}>
                {isBot
                    ? <SmartToyIcon sx={{ fontSize: 16 }} />
                    : <PersonIcon   sx={{ fontSize: 16 }} />
                }
            </Avatar>

            <Box sx={{
                maxWidth: '75%',
                bgcolor: isBot ? 'primary.main' : 'grey.100',
                color: isBot ? 'white' : 'text.primary',
                borderRadius: isBot ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                px: 1.5,
                py: 1,
            }}>
                <Typography
                    variant="body2"
                    sx={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}
                >
                    {message.text}
                </Typography>
            </Box>
        </Box>
    )
}