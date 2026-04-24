import { useEffect, useRef, useState } from 'react'
import { MessageBubble } from './MessageBubble'

const SUGGESTIONS = {
  general: ['Tôi bị sốt 38.5 độ', 'Đau đầu liên tục 2 ngày', 'Tư vấn về huyết áp'],
  mother:  ['Con tôi 3 tuổi bị sốt', 'Tính liều paracetamol cho bé 15kg', 'Con ho nhiều về đêm'],
  elderly: ['Tôi chưa uống thuốc huyết áp hôm nay', 'Chỉ số đường huyết 7.2 có sao không?', 'Nhắc lịch uống thuốc'],
  doctor:  ['Bệnh nhân 65T, tiểu đường type 2, sốt 38.8', 'Tổng hợp triệu chứng trước khám', 'Câu hỏi khai thác bệnh sử'],
}

export function ChatWindow({ messages, isLoading, persona, onSendMessage }) {
  const bottomRef = useRef(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    onSendMessage(text)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <>
      {/* Messages */}
      <div className="chat-window" id="chat-messages">
        {isEmpty ? (
          <div className="welcome">
            <div className="welcome-icon">🏥</div>
            <h2>Chatbot Bác sĩ Gia Đình</h2>
            <p>Tôi có thể giúp bạn phân tích triệu chứng, nhắc thuốc, và hướng dẫn chăm sóc sức khỏe.</p>
            <div className="suggestion-chips">
              {(SUGGESTIONS[persona] || SUGGESTIONS.general).map((s, i) => (
                <button key={i} className="chip" onClick={() => onSendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="message-row">
            <div className="avatar bot">🏥</div>
            <div className="bubble bot typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="input-area">
        <div className="input-row">
          <textarea
            id="chat-input"
            className="chat-input"
            placeholder="Mô tả triệu chứng hoặc đặt câu hỏi..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            aria-label="Nhập tin nhắn"
          />
          <button
            id="send-btn"
            className="send-btn"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Gửi tin nhắn"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  )
}
