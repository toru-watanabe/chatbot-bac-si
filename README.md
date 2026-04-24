# Chatbot Bác sĩ Gia Đình 🏥

Trợ lý y tế thông minh hỗ trợ chăm sóc sức khỏe gia đình 24/7.

## Tech Stack

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

## 🚀 Quick Start — Run Locally with Docker

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A [Gemini API key](https://aistudio.google.com/apikey) (free)

### 2. Configure environment
```bash
# In the project root (chatbot-bac-si/)
copy .env.example .env
```
Open `.env` and paste your Gemini API key:
```
GEMINI_API_KEY=AIza...your_key_here
```

### 3. Build and run
```bash
docker-compose up --build
```

### 4. Open in browser
```
http://localhost
```

The app will be live at `http://localhost`. API docs at `http://localhost/api/docs`.

---

## 🌐 Production Deployment

### Backend → Hugging Face Spaces

1. Create a new Space at https://huggingface.co/new-space
   - Space type: **Docker**
   - Visibility: **Public**

2. Push the `backend/` folder as a separate HF repo:
```bash
git init
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/chatbot-bac-si
git add .
git commit -m "Initial deploy"
git push origin main
```

3. Add your Gemini API key in HF Spaces:
   - Go to your Space → **Settings** → **Repository secrets**
   - Add `GEMINI_API_KEY = AIza...`
   - Add `DATABASE_URL = sqlite:////data/chatbot.db`

4. Your backend will be live at:
   ```
   https://YOUR_USERNAME-chatbot-bac-si.hf.space
   ```

### Frontend → GitHub Pages

1. Push the full repo to GitHub:
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/chatbot-bac-si
git add .
git commit -m "Initial commit"
git push origin main
```

2. Add the backend URL as a GitHub Secret:
   - Go to repo → **Settings** → **Secrets and variables** → **Actions**
   - Add: `VITE_API_URL = https://YOUR_USERNAME-chatbot-bac-si.hf.space/api`

3. Enable GitHub Pages:
   - Go to repo → **Settings** → **Pages**
   - Source: **GitHub Actions**

4. Push any change to `main` to trigger auto-deploy. Your frontend will be live at:
   ```
   https://YOUR_USERNAME.github.io/chatbot-bac-si/
   ```

5. Update `frontend/vite.config.js` base path to match your repo name:
```js
base: '/chatbot-bac-si/',  // ← must match your GitHub repo name
```

---

## 📁 Project Structure

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

## 🔌 API Reference

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

## 📋 Mapping to Sprint Backlog

| User Story | Feature | Implementation |
|---|---|---|
| US-01 | Vietnamese NLP input | Gemini handles Vietnamese natively |
| US-02 | 3-level urgency classification | `[URGENCY:...]` tag parsed from Gemini |
| US-03 | Basic info gathering flow | System prompt instructs follow-up Qs |
| US-04 | Elderly UI (large text) | Elderly mode toggle in header |
| US-05 | Disclaimer in every response | Returned in every `/api/chat` response |
| US-06 | Children flow | `persona: "mother"` system prompt |
| US-07 | Chat history in session | SQLite `messages` table |
| US-08 | QA test cases | See `/api/docs` Swagger for manual testing |
