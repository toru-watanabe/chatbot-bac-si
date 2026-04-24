import { useState } from 'react'
import './styles/index.css'
import { useChat } from './hooks/useChat'
import { PersonaSelector } from './components/PersonaSelector'
import { ChatWindow } from './components/ChatWindow'

export default function App() {
  const [persona, setPersona] = useState('general')
  const [elderlyMode, setElderlyMode] = useState(false)
  const { messages, isLoading, sendMessage, clearChat } = useChat(persona)

  const handlePersonaChange = (newPersona) => {
    setPersona(newPersona)
    // Optionally auto-enable elderly mode
    if (newPersona === 'elderly') setElderlyMode(true)
    else setElderlyMode(false)
  }

  return (
    <div className={`app-shell ${elderlyMode ? 'elderly-mode' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-icon">🏥</div>
          <div>
            <div className="header-title">Chatbot Bác sĩ Gia Đình</div>
            <div className="header-subtitle">Trợ lý y tế thông minh 24/7</div>
          </div>
        </div>

        <div className="header-actions">
          {/* Elderly mode toggle (US-04) */}
          <button
            id="elderly-toggle"
            className={`icon-btn ${elderlyMode ? 'active' : ''}`}
            onClick={() => setElderlyMode(m => !m)}
            title={elderlyMode ? 'Tắt chế độ chữ to' : 'Bật chế độ chữ to'}
            aria-pressed={elderlyMode}
          >
            🔡
          </button>

          {/* Clear chat */}
          <button
            id="clear-chat-btn"
            className="icon-btn"
            onClick={clearChat}
            title="Xóa cuộc trò chuyện"
            aria-label="Xóa cuộc trò chuyện"
          >
            🗑️
          </button>
        </div>
      </header>

      {/* Persona tabs */}
      <PersonaSelector
        persona={persona}
        onChange={handlePersonaChange}
        disabled={isLoading}
      />

      {/* Chat area + input */}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        persona={persona}
        onSendMessage={sendMessage}
      />
    </div>
  )
}
