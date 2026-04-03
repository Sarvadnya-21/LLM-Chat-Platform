# Tark AI

Full-stack AI chat application with user auth, chat history, and Ollama-based AI inference.

## 🧩 Project structure

- `backend/`: Express API service
  - `src/app.js`: app setup (CORS, middleware, routes)
  - `src/server.js`: server bootstrap
  - `src/config/env.js`: environment configuration
  - `src/db/`: Postgres + Redis logic
  - `src/routes/`: API routes (`/auth`, `/chats`, `/chat`)
  - `src/controllers/`: route handlers
  - `src/models/`: data model helpers
  - `src/services/`: AI + business services
  - `src/middleware/`: auth, errors, rate limiting

- `frontend/`: React + Vite client
  - `src/components/`: UI components
  - `src/pages/ChatPage.jsx`: main chat UI
  - `src/store/`: Zustand state
  - `src/lib/api.js`: API calls

## ⚙️ Requirements

- Node.js 18+ (or latest LTS)
- PostgreSQL (optional for auth + persistent storage)
- Redis (optional for guest request limit)
- Ollama API (or mocked mode)

## 🔧 Backend setup

1. `cd backend`
2. `npm install`

3. Create `.env` with values (example):

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://user:pass@localhost:5432/tark_ai
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_random_secret
JWT_COOKIE_NAME=token
JWT_EXPIRES_IN=7d
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_TIMEOUT_MS=60000
USE_MOCK_RESPONSE=false
GUEST_LIMIT_ENABLED=true
GUEST_LIMIT_TTL_SECONDS=86400
```

4. Start backend:

- development: `npm run dev`
- production: `npm start`

5. Health check:

- `GET /health` → `{ ok: true }`

### 🔌 API routes

- `POST /auth/signup`
  - body: `{ username, password }`
- `POST /auth/login`
  - body: `{ username, password }`
- `POST /auth/logout` (clears cookie)
- `GET /auth/me` (optional auth, returns user if logged in)

- `POST /chat` (guest limit + optional auth)
  - body: `{ text, chatId? }`
  - returns AI assistant message + chatId

- `GET /chats` (auth required)
  - list user chats
- `GET /chats/:id` (auth required)
  - messages for chat

### 🔒 Middleware behavior

- `authOptional`: allows logged-in or guest flows
- `requireAuth`: denies unauthenticated requests
- `guestLimit`: tracks anonymous call limits in Redis
- `errorHandler`: JSON error formatting

### 🗄️ DB initialization

On startup, if `DATABASE_URL` and `JWT_SECRET` are set, the app creates tables:
- `users`
- `chats`
- `messages`

## 🌐 Frontend setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open browser `http://localhost:5173`

### Scripts

- `npm run dev` → start dev server
- `npm run build` → production bundle
- `npm run preview` → preview built app
- `npm run lint` → ESLint check

## 🧪 Optional: Ollama local LLM

- Start Ollama on default `http://localhost:11434`
- Ensure model name in `OLLAMA_MODEL` matches installed model (e.g. `mistral`)

If you don’t have Ollama, set `USE_MOCK_RESPONSE=true` and the backend will reply with mocked text.

## 📌 Notes

- Cookie-based JWT auth; `credentials: true` in CORS.
- Guest chat limit uses `GUEST_LIMIT_TTL_SECONDS` for per-ip key scope.
- `FRONTEND_ORIGIN='*'` allows all origins (dev only).

## 🛠️ Deployment checklist

- set environment variables in production
- enable HTTPS for client + API
- configure persistent Redis + PostgreSQL
- secure `JWT_SECRET`
- disable `USE_MOCK_RESPONSE`

---

