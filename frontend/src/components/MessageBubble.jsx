import ReactMarkdown from 'react-markdown'

const URGENCY_ICONS = {
  green: '🟢',
  yellow: '🟡',
  red: '🚨',
  none: '',
}

export function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-row ${isUser ? 'user' : ''}`}>
      <div className={`avatar ${isUser ? 'user' : 'bot'}`}>
        {isUser ? '👤' : '🏥'}
      </div>

      <div className="bubble-wrap">
        <div className={`bubble ${isUser ? 'user' : 'bot'}`}>
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>

        {/* Urgency banner — only on bot messages with a level */}
        {!isUser && message.urgency_color && message.urgency_color !== 'none' && (
          <div className={`urgency-banner ${message.urgency_color}`}>
            <span>{URGENCY_ICONS[message.urgency_color]}</span>
            <span>{message.urgency_label}</span>
          </div>
        )}

        {/* Disclaimer — only on bot messages */}
        {!isUser && message.disclaimer && (
          <div className="disclaimer">{message.disclaimer}</div>
        )}
      </div>
    </div>
  )
}
