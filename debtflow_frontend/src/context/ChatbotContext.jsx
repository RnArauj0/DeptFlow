import { useState, useCallback } from 'react'
import { chatbotApi } from '../api/chatbotApi'
import { ChatbotContext } from './ChatbotContextDef'

export function ChatbotProvider({ children }) {
    const [open, setOpen]           = useState(false)
    const [sessionId, setSessionId] = useState(null)
    const [messages, setMessages]   = useState([])
    const [loading, setLoading]     = useState(false)

    const initSession = useCallback(async (clientId = null) => {
        if (sessionId) return
        try {
            const res = await chatbotApi.createSession(clientId)
            setSessionId(res.data.sessionId)
            setMessages([{
                sender: 'BOT',
                text: '¡Hola! Soy DebtFlow Assistant 👋 ¿En qué te puedo ayudar hoy?'
            }])
        } catch (err) {
            console.error('Error al iniciar sesión del chatbot:', err)
        }
    }, [sessionId])

    const sendMessage = useCallback(async (text) => {
        if (!sessionId) return

        setMessages(prev => [...prev, { sender: 'USER', text }])
        setLoading(true)

        try {
            const res = await chatbotApi.sendMessage(sessionId, text)
            setMessages(prev => [...prev, { sender: 'BOT', text: res.data.response }])
        } catch {
            setMessages(prev => [...prev, {
                sender: 'BOT',
                text: 'Ocurrió un error. Por favor intenta de nuevo.'
            }])
        } finally {
            setLoading(false)
        }
    }, [sessionId])

    return (
        <ChatbotContext.Provider value={{
            open, setOpen,
            messages, loading,
            initSession, sendMessage
        }}>
            {children}
        </ChatbotContext.Provider>
    )
}