import api from './axiosConfig'

export const chatbotApi = {
    createSession: (clientId) =>
        api.post('/chatbot/session', null, {
            params: clientId ? { clientId } : {}
        }),

    sendMessage: (sessionId, message) =>
        api.post('/chatbot/message', {
            sessionId: String(sessionId),
            message
        })
}