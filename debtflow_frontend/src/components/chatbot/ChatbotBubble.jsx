import { useEffect } from 'react'
import { Fab, Badge, Zoom } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CloseIcon    from '@mui/icons-material/Close'
import ChatbotWindow from './ChatbotWindow'
import useChatbot   from '../../hooks/useChatbot'

export default function ChatbotBubble() {
    const { open, setOpen, messages, initSession } = useChatbot()

    // Inicia sesión anónima al montar
    useEffect(() => {
        initSession()
    }, [initSession])

    const unread = messages.filter(m => m.sender === 'BOT').length

    return (
        <>
            {/* Ventana del chat */}
            <Zoom in={open} unmountOnExit>
                <div>
                    <ChatbotWindow onClose={() => setOpen(false)} />
                </div>
            </Zoom>

            {/* Burbuja flotante */}
            <Fab
                color="primary"
                onClick={() => setOpen(prev => !prev)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1300,
                    boxShadow: '0 4px 20px rgba(21, 101, 192, 0.4)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                }}
            >
                <Badge
                    badgeContent={!open && unread > 0 ? unread : 0}
                    color="error"
                >
                    {open ? <CloseIcon /> : <SmartToyIcon />}
                </Badge>
            </Fab>
        </>
    )
}