import { useState, useEffect, useRef } from 'react'
import {
    Box, TextField, IconButton, Typography,
    CircularProgress, Divider, Paper
} from '@mui/material'
import SendIcon     from '@mui/icons-material/Send'
import CloseIcon    from '@mui/icons-material/Close'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ChatMessage  from './ChatMessage'
import useChatbot   from '../../hooks/useChatbot'

export default function ChatbotWindow({ onClose }) {
    const { messages, loading, sendMessage } = useChatbot()
    const [input, setInput]   = useState('')
    const bottomRef           = useRef(null)

    // Auto-scroll al último mensaje
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const handleSend = async () => {
        const text = input.trim()
        if (!text || loading) return
        setInput('')
        await sendMessage(text)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <Paper
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: 90,
                right: 24,
                width: 360,
                height: 500,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 1300
            }}
        >
            {/* Header */}
            <Box sx={{
                bgcolor: 'primary.main',
                color: 'white',
                px: 2, py: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToyIcon fontSize="small" />
                    <Box>
                        <Typography variant="body2" fontWeight={600}>
                            DebtFlow Assistant
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.85 }}>
                            En línea
                        </Typography>
                    </Box>
                </Box>
                <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Divider />

            {/* Mensajes */}
            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} />
                ))}

                {/* Typing indicator */}
                {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <CircularProgress size={14} />
                        <Typography variant="caption" color="text.secondary">
                            Escribiendo...
                        </Typography>
                    </Box>
                )}

                <div ref={bottomRef} />
            </Box>

            <Divider />

            {/* Input */}
            <Box sx={{
                px: 1.5, py: 1,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                bgcolor: 'background.paper'
            }}>
                <TextField
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe un mensaje..."
                    multiline
                    maxRows={3}
                    size="small"
                    fullWidth
                    disabled={loading}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3
                        }
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&:disabled': { bgcolor: 'action.disabled', color: 'white' },
                        mb: 0.5
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Box>
        </Paper>
    )
}