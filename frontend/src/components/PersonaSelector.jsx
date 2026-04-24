const PERSONAS = [
  { id: 'general',  label: 'Tổng hợp', icon: '💬' },
  { id: 'mother',   label: 'Mẹ & Con nhỏ', icon: '👶' },
  { id: 'elderly',  label: 'Người cao tuổi', icon: '👴' },
  { id: 'doctor',   label: 'Bác sĩ', icon: '🩺' },
]

export function PersonaSelector({ persona, onChange, disabled }) {
  return (
    <div className="persona-bar" role="tablist" aria-label="Chọn persona">
      {PERSONAS.map(p => (
        <button
          key={p.id}
          role="tab"
          aria-selected={persona === p.id}
          className={`persona-btn ${persona === p.id ? 'active' : ''}`}
          onClick={() => !disabled && onChange(p.id)}
          disabled={disabled}
          title={p.label}
        >
          <span>{p.icon}</span>
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  )
}
