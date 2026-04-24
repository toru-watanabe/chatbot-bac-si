import { useState, useCallback, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

// Persist session ID across page reloads
function getSessionId() {
  let id = sessionStorage.getItem('chat_session_id')
  if (!id) {
    id = uuidv4()
    sessionStorage.setItem('chat_session_id', id)
  }
  return id
}

export function useChat(persona) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const sessionId = useRef(getSessionId())

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = { role: 'user', content: text, id: uuidv4() }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: sessionId.current,
          persona,
        }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      const data = await res.json()

      const botMessage = {
        role: 'assistant',
        content: data.reply,
        urgency_level: data.urgency_level,
        urgency_label: data.urgency_label,
        urgency_color: data.urgency_color,
        disclaimer: data.disclaimer,
        id: uuidv4(),
      }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: '⚠️ Xin lỗi, đã có lỗi kết nối. Vui lòng thử lại sau.',
        urgency_level: 'none',
        urgency_color: 'none',
        id: uuidv4(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [persona, isLoading])

  const clearChat = useCallback(() => {
    sessionStorage.removeItem('chat_session_id')
    sessionId.current = getSessionId()
    setMessages([])
  }, [])

  return { messages, isLoading, sendMessage, clearChat }
}
