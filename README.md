# Chatbot Bác sĩ Gia Đình

Trợ lý y tế thông minh hỗ trợ chăm sóc sức khỏe gia đình 24/7.

## Công nghệ sử dụng

| Tầng | Công nghệ |
|---|---|
| Frontend | React (Vite) + Vanilla CSS |
| Backend | FastAPI (Python 3.11) |
| LLM | Google Gemini 2.0 Flash / Groq |
| Cơ sở dữ liệu | SQLite |
| Hosting Frontend | GitHub Pages |
| Hosting Backend | Hugging Face Spaces |
| Môi trường phát triển cục bộ | Docker Compose |

---

## Hướng dẫn cài đặt và chạy cục bộ với Docker

### 1. Yêu cầu hệ thống
- Cài đặt và khởi chạy Docker Desktop
- Lấy khóa API Gemini / Groq

### 2. Cấu hình môi trường
Trong thư mục gốc của dự án (chatbot-bac-si/):
Sao chép tập tin .env.example thành .env

Mở tập tin .env và dán khóa API của bạn vào:
```
GEMINI_API_KEY=AIza...khoa_api_cua_ban
```

### 3. Khởi tạo và chạy ứng dụng
```bash
docker-compose up --build
```

### 4. Mở trên trình duyệt
Truy cập địa chỉ:
```
http://localhost
```

Ứng dụng sẽ chạy tại địa chỉ http://localhost. Tài liệu API có sẵn tại http://localhost/api/docs.

---

## Triển khai thực tế

### Backend trên Hugging Face Spaces

1. Tạo một Space mới trên trang Hugging Face
   - Loại Space: Docker
   - Quyền truy cập: Public (Công khai)

2. Đẩy thư mục backend/ lên kho lưu trữ của Hugging Face:
```bash
git init
git remote add origin https://huggingface.co/spaces/TEN_DANG_NHAP_CUA_BAN/chatbot-bac-si
git add .
git commit -m "Triển khai lần đầu"
git push origin main
```

3. Thêm khóa API trên Hugging Face Spaces:
   - Truy cập vào Space của bạn -> Cài đặt (Settings) -> Bí mật của kho lưu trữ (Repository secrets)
   - Thêm GEMINI_API_KEY = AIza...
   - Thêm DATABASE_URL = sqlite:////data/chatbot.db

4. Backend của bạn sẽ hoạt động tại:
   ```
   https://TEN_DANG_NHAP_CUA_BAN-chatbot-bac-si.hf.space
   ```

### Frontend trên GitHub Pages (sử dụng GitHub Actions)

1. Đẩy toàn bộ mã nguồn lên GitHub:
```bash
git init
git remote add origin https://github.com/TEN_DANG_NHAP_CUA_BAN/chatbot-bac-si
git add .
git commit -m "Commit lần đầu"
git push origin main
```

2. Thêm URL của Backend vào GitHub Secrets:
   - Truy cập kho lưu trữ -> Cài đặt (Settings) -> Bí mật và biến số (Secrets and variables) -> Hành động (Actions)
   - Thêm: VITE_API_URL = https://TEN_DANG_NHAP_CUA_BAN-chatbot-bac-si.hf.space/api

3. Bật GitHub Pages:
   - Truy cập kho lưu trữ -> Cài đặt (Settings) -> Pages
   - Nguồn (Source): GitHub Actions

4. Đẩy bất kỳ thay đổi nào lên nhánh main để tự động triển khai. Frontend của bạn sẽ hoạt động tại:
   ```
   https://TEN_DANG_NHAP_CUA_BAN.github.io/chatbot-bac-si/
   ```

5. Cập nhật đường dẫn cơ sở trong tập tin frontend/vite.config.js để khớp với tên kho lưu trữ của bạn:
```js
base: '/chatbot-bac-si/',  // Phải khớp với tên kho lưu trữ GitHub của bạn
```

---

## Cấu trúc dự án

```
chatbot-bac-si/
├── .env.example                 # Sao chép thành .env và điền các khóa API
├── .gitignore
├── docker-compose.yml           # Môi trường phát triển toàn diện cục bộ
├── .github/workflows/deploy.yml # Tự động triển khai frontend lên GitHub Pages
│
├── backend/
│   ├── Dockerfile               # Cho Hugging Face Spaces
│   ├── requirements.txt
│   ├── main.py                  # Ứng dụng FastAPI
│   ├── database.py              # Mô hình SQLite
│   ├── models.py                # Lược đồ Pydantic
│   ├── routers/
│   │   ├── chat.py              # POST /api/chat
│   │   └── health.py            # GET /api/health
│   └── services/
│       ├── gemini_service.py    # API LLM và phân tích mức độ khẩn cấp
│       └── prompt_builder.py    # Các prompt hệ thống theo từng đối tượng
│
└── frontend/
    ├── Dockerfile               # Cho môi trường Docker cục bộ
    ├── nginx.conf               # Proxy ngược /api tới backend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── hooks/useChat.js     # Gọi API và quản lý phiên trò chuyện
        ├── components/
        │   ├── ChatWindow.jsx   # Giao diện trò chuyện chính và nhập liệu
        │   ├── MessageBubble.jsx
        │   └── PersonaSelector.jsx
        └── styles/index.css
```

---

## Tài liệu tham khảo API

### POST /api/chat
```json
// Yêu cầu
{
  "message": "Con tôi bị sốt 38.5 độ",
  "session_id": "chuoi-uuid",
  "persona": "mother"
}

// Phản hồi
{
  "reply": "Bé bao nhiêu tuổi và nặng bao nhiêu kg?...",
  "urgency_level": "monitor",
  "urgency_label": "Theo dõi tại nhà",
  "urgency_color": "green",
  "disclaimer": "Đây là tư vấn sơ bộ, không thay thế việc thăm khám bác sĩ trực tiếp.",
  "session_id": "chuoi-uuid"
}
```

### GET /api/sessions/{session_id}/history
Trả về toàn bộ lịch sử trò chuyện của một phiên.

### DELETE /api/sessions/{session_id}
Xóa một phiên trò chuyện và tất cả các tin nhắn trong đó.

### GET /api/health
Kiểm tra trạng thái hoạt động của hệ thống.

---

## Kiểm thử API chi tiết

Phần này cung cấp các kịch bản kiểm thử toàn diện cho mọi điểm cuối (endpoint) của hệ thống để đảm bảo tính chính xác và độ tin cậy.

### 1. Kiểm thử thủ công với Swagger UI
FastAPI cung cấp giao diện Swagger UI tự động tạo tại `http://localhost:8000/docs` (nếu chạy trực tiếp) hoặc `http://localhost/api/docs` (nếu chạy qua Docker). Tại đây, bạn có thể xem chi tiết từng điểm cuối, điền tham số và gửi yêu cầu thử nghiệm trực tiếp từ trình duyệt mà không cần công cụ bên thứ ba.

### 2. Các kịch bản kiểm thử (Test Cases) qua cURL

#### 2.1. API Kiểm tra trạng thái hệ thống (`GET /api/health`)
Đảm bảo backend đang hoạt động ổn định.
**Yêu cầu:**
```bash
curl -X GET http://localhost/api/health
```
**Phản hồi mong đợi:**
```json
{
  "status": "ok",
  "message": "Service is running"
}
```

#### 2.2. API Trò chuyện (`POST /api/chat`)
API này là cốt lõi của hệ thống, xử lý tin nhắn và phân loại mức độ khẩn cấp. Bạn có thể kiểm thử các đối tượng (persona) khác nhau.

**Kịch bản 1: Hỏi đáp chung (persona: `general`)**
```bash
curl -X POST http://localhost/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tôi bị đau đầu và chóng mặt từ sáng nay.",
    "session_id": "test-session-001",
    "persona": "general"
  }'
```
*Phản hồi mong đợi:* Hệ thống trả về câu hỏi khai thác thêm triệu chứng, kèm theo `urgency_level` (ví dụ: `monitor`), màu sắc `urgency_color`, và dòng cảnh báo y tế `disclaimer`.

**Kịch bản 2: Hỏi đáp về trẻ em (persona: `mother`)**
```bash
curl -X POST http://localhost/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bé nhà tôi 3 tuổi, bị sốt 39 độ và quấy khóc liên tục.",
    "session_id": "test-session-002",
    "persona": "mother"
  }'
```
*Phản hồi mong đợi:* AI đóng vai bác sĩ nhi khoa, hỏi thêm về cân nặng, biểu hiện khác và thường xếp mức độ khẩn cấp là `emergency` hoặc `consult_doctor` do sốt cao ở trẻ nhỏ.

**Kịch bản 3: Tình huống khẩn cấp**
```bash
curl -X POST http://localhost/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bố tôi tự nhiên ôm ngực gục xuống, khó thở.",
    "session_id": "test-session-003",
    "persona": "general"
  }'
```
*Phản hồi mong đợi:* Hệ thống phải nhận diện đây là tình huống nguy hiểm, trả về `urgency_level` là `emergency` và khuyên người dùng gọi cấp cứu ngay lập tức.

#### 2.3. API Lấy lịch sử trò chuyện (`GET /api/sessions/{session_id}/history`)
Lấy lại các tin nhắn đã trao đổi trong một phiên cụ thể.
**Yêu cầu:**
```bash
curl -X GET http://localhost/api/sessions/test-session-001/history
```
**Phản hồi mong đợi:** Một mảng JSON chứa các đối tượng tin nhắn của người dùng và bot.
```json
[
  {"role": "user", "content": "Tôi bị đau đầu và chóng mặt từ sáng nay.", "timestamp": "2026-04-25T10:00:00"},
  {"role": "bot", "content": "Bạn đã uống thuốc gì chưa?...", "timestamp": "2026-04-25T10:00:05"}
]
```

#### 2.4. API Xóa lịch sử phiên (`DELETE /api/sessions/{session_id}`)
Xóa toàn bộ lịch sử để bắt đầu phiên trò chuyện mới.
**Yêu cầu:**
```bash
curl -X DELETE http://localhost/api/sessions/test-session-001
```
**Phản hồi mong đợi:**
```json
{
  "message": "Session deleted successfully"
}
```

### 3. Kiểm thử lỗi (Error Handling)
Kiểm tra xem hệ thống có bắt lỗi và trả về mã lỗi HTTP chính xác khi gửi thiếu tham số.
```bash
curl -X POST http://localhost/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Chào bác sĩ"}' 
```
*Phản hồi mong đợi:* Trả về mã lỗi `HTTP 422 Unprocessable Entity` kèm thông báo JSON chỉ ra các trường còn thiếu (thiếu `session_id` và `persona`).

### 4. Viết kịch bản kiểm thử tự động với Pytest
Bạn có thể sử dụng thư viện `pytest` và `httpx` của Python để tự động hóa toàn bộ các kịch bản kiểm thử API trên:
1. Cài đặt các gói cần thiết: `pip install pytest httpx`
2. Tạo thư mục `tests/` trong `backend/` và viết các file test.
3. Khởi chạy bằng lệnh `pytest backend/tests/` để hệ thống tự động kiểm tra đầu vào, đầu ra, và các tình huống ngoại lệ.

---

## Tương ứng với danh sách công việc (Sprint Backlog)

| Câu chuyện người dùng (User Story) | Tính năng | Triển khai |
|---|---|---|
| US-01 | Nhập liệu bằng tiếng Việt | Groq / Gemini xử lý tiếng Việt nguyên bản |
| US-02 | Phân loại 3 mức độ khẩn cấp | Thẻ `[URGENCY:...]` được phân tích từ Gemini |
| US-03 | Luồng thu thập thông tin cơ bản | Prompt hệ thống hướng dẫn các câu hỏi tiếp theo |
| US-04 | Giao diện cho người cao tuổi | Chuyển đổi chế độ người cao tuổi trên thanh công cụ |
| US-05 | Lời cảnh báo trong mỗi phản hồi | Được trả về trong mỗi phản hồi của `/api/chat` |
| US-06 | Luồng cho trẻ em | Prompt hệ thống sử dụng `persona: "mother"` |
| US-07 | Lịch sử trò chuyện trong phiên | Bảng `messages` trong SQLite |
| US-08 | Các trường hợp kiểm thử QA | Xem Swagger tại `/api/docs` để kiểm thử thủ công |
