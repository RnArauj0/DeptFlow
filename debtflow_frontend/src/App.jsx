import { Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import DebtsPage from './pages/DebtsPage'
import NotFoundPage from './pages/NotFoundPage'
import ChatbotBubble from './components/chatbot/ChatbotBubble'
import { ChatbotProvider } from './context/ChatbotContext.jsx'

function App() {
  return (
      <ChatbotProvider>
        <Layout>
          <Routes>
            <Route path="/"        element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/debts"   element={<DebtsPage />} />
            <Route path="*"        element={<NotFoundPage />} />
          </Routes>
        </Layout>
        <ChatbotBubble />
      </ChatbotProvider>
  )
}

export default App