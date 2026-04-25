Chatbot Bác sĩ Gia Đình

Trợ lý y tế thông minh hỗ trợ chăm sóc sức khỏe gia đình 24/7.

Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Vanilla CSS |
| Backend | FastAPI (Python 3.11) |
| LLM | Google Gemini 2.0 Flash |
| Database | SQLite |
| Frontend Hosting | GitHub Pages |
| Backend Hosting | Hugging Face Spaces |
| Local Dev | Docker Compose |

---



Project Structure

```
chatbot-bac-si/
├── .env.example                 # Copy to .env and fill in keys
├── .gitignore
├── docker-compose.yml           # Local full-stack dev
├── .github/workflows/deploy.yml # Auto-deploy frontend to GitHub Pages
│
├── backend/
│   ├── Dockerfile               # For HF Spaces
│   ├── requirements.txt
│   ├── main.py                  # FastAPI app
│   ├── database.py              # SQLite models
│   ├── models.py                # Pydantic schemas
│   ├── routers/
│   │   ├── chat.py              # POST /api/chat
│   │   └── health.py            # GET /api/health
│   └── services/
│       ├── gemini_service.py    # Gemini API + urgency parser
│       └── prompt_builder.py    # System prompts per persona
│
└── frontend/
    ├── Dockerfile               # For local full-stack Docker
    ├── nginx.conf               # Reverse proxy /api → backend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── hooks/useChat.js     # API calls + session management
        ├── components/
        │   ├── ChatWindow.jsx   # Main chat UI + input
        │   ├── MessageBubble.jsx
        │   └── PersonaSelector.jsx
        └── styles/index.css
```

---

API Reference

### `POST /api/chat`
```json
// Request
{
  "message": "Con tôi bị sốt 38.5 độ",
  "session_id": "uuid-string",
  "persona": "mother"
}

// Response
{
  "reply": "Bé bao nhiêu tuổi và nặng bao nhiêu kg?...",
  "urgency_level": "monitor",
  "urgency_label": "Theo dõi tại nhà",
  "urgency_color": "green",
  "disclaimer": "⚕️ Đây là tư vấn sơ bộ, không thay thế việc thăm khám bác sĩ trực tiếp.",
  "session_id": "uuid-string"
}
```

### `GET /api/sessions/{session_id}/history`
Returns full conversation history for a session.

### `DELETE /api/sessions/{session_id}`
Clears a session and all its messages.

### `GET /api/health`
Health check endpoint.

---

Mapping to Sprint Backlog

| User Story | Feature | Implementation |
|---|---|---|
| US-01 | Vietnamese NLP input | Groq handles Vietnamese natively |
| US-02 | 3-level urgency classification | `[URGENCY:...]` tag parsed from Gemini |
| US-03 | Basic info gathering flow | System prompt instructs follow-up Qs |
| US-04 | Elderly UI (large text) | Elderly mode toggle in header |
| US-05 | Disclaimer in every response | Returned in every `/api/chat` response |
| US-06 | Children flow | `persona: "mother"` system prompt |
| US-07 | Chat history in session | SQLite `messages` table |
| US-08 | QA test cases | See `/api/docs` Swagger for manual testing |


Install guide
Backend : HuggingFace for Gemini/Groq API call
Frontend: Deploy on Github Actions
