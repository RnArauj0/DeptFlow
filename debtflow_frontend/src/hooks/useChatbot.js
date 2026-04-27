import { useContext } from 'react'
import { ChatbotContext } from '../context/ChatbotContextDef'

const useChatbot = () => {
    const context = useContext(ChatbotContext)
    if (!context) {
        throw new Error('useChatbot debe usarse dentro de ChatbotProvider')
    }
    return context
}

export default useChatbot