# d.ai.ly — AI-Powered Daily Productivity App

> **Your daily AI productivity companion** — personal finance, task management, focus tools, and on-device AI, all in one React Native app.

[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)](https://reactnative.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase)](https://supabase.com)
[![Deployed on Render](https://img.shields.io/badge/API-Render-46E3B7)](https://render.com)

---

## Overview

d.ai.ly is a full-stack mobile application built with **React Native (Expo)** on the frontend and a **FastAPI + PostgreSQL** backend deployed on Render. It combines everyday productivity tools — expense tracking, budgeting, to-dos, reminders, meetings, and a Pomodoro timer — with a live market dashboard and a fully **on-device RAG (Retrieval-Augmented Generation) AI** pipeline that lets users semantically search and query their notes without sending any data to external AI APIs.

The app is published to the **Google Play Store** and uses **Supabase** for authentication (Google OAuth via PKCE) and cloud database sync.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Native App                          │
│                     (Expo 54 / RN 0.81.5)                        │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────────────┐  │
│  │  Screens │  │ Contexts │  │        Services Layer          │  │
│  │ (Expo    │  │ (React   │  │                               │  │
│  │  Router) │  │ Context  │  │  ┌──────────┐  ┌───────────┐ │  │
│  └──────────┘  │  API)    │  │  │ apiClient│  │supabase   │ │  │
│                └──────────┘  │  │ (JWT auth│  │Client.js  │ │  │
│                              │  │  fetch)  │  │(chunked   │ │  │
│                              │  └────┬─────┘  │SecureStore│ │  │
│                              │       │        └─────┬─────┘ │  │
│                              │  ┌────▼──────────────▼────┐  │  │
│                              │  │      On-Device AI       │  │  │
│                              │  │  ┌─────────────────┐   │  │  │
│                              │  │  │  all-MiniLM-L6  │   │  │  │
│                              │  │  │  (384-dim embed) │   │  │  │
│                              │  │  └────────┬────────┘   │  │  │
│                              │  │  ┌────────▼────────┐   │  │  │
│                              │  │  │  OPSQLite       │   │  │  │
│                              │  │  │  Vector Store   │   │  │  │
│                              │  │  └────────┬────────┘   │  │  │
│                              │  │  ┌────────▼────────┐   │  │  │
│                              │  │  │ SmolLM2-135M-q  │   │  │  │
│                              │  │  │ (ExecuTorch LLM)│   │  │  │
│                              │  │  └─────────────────┘   │  │  │
│                              │  └────────────────────────┘  │  │
│                              └───────────────────────────────┘  │
└──────────────────┬──────────────────────────┬───────────────────┘
                   │ REST/HTTPS               │ Supabase JS SDK
                   ▼                          ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│   FastAPI Backend         │   │   Supabase               │
│   (Render Cloud)          │   │                          │
│                           │   │  • Google OAuth (PKCE)   │
│  ┌─────────────────────┐  │   │  • JWKS JWT verification │
│  │   JWT Auth (JWKS)   │  │   │  • Auth state sync       │
│  └─────────────────────┘  │   └──────────────────────────┘
│  ┌─────────────────────┐  │
│  │   10 REST Routers   │  │
│  │  expenses / income  │  │
│  │  budgets / todos    │  │
│  │  reminders / notes  │  │
│  │  meetings / pomodoro│  │
│  │  user / finance     │  │
│  └─────────────────────┘  │
│  ┌─────────────────────┐  │
│  │  PostgreSQL (SQLModel│  │
│  │  + Alembic)          │  │
│  └─────────────────────┘  │
│  ┌─────────────────────┐  │
│  │  Finance APIs        │  │
│  │  Alpha Vantage       │  │
│  │  Yahoo Finance       │  │
│  │  CoinGecko           │  │
│  └─────────────────────┘  │
└──────────────────────────┘
```

---

## Features

### Productivity Tools

| Feature | Description |
|---|---|
| **Expense Tracker** | Log expenses by category, amount, date, payment method, and notes. CSV import supported. |
| **Income Tracker** | Record income entries with descriptions and dates. |
| **Budget Planner** | Create category budgets with spend limits and periods. Auto-suggests categories from past expenses. |
| **Todo List** | Tasks with priority levels, categories, due dates, and completion tracking. |
| **Reminders** | Timestamped reminders with priority levels and push notifications. |
| **Meetings Scheduler** | Schedule and track meetings with Google Calendar integration. |
| **Pomodoro Timer** | Focus sessions (work/break intervals) with session history and stats. |
| **Quick Notes + AI** | Freeform notes with semantic search and on-device AI question answering. |
| **Calculator** | Utility calculator accessible from the tools bottom sheet. |

### Hub Dashboard

| Widget | Data Source |
|---|---|
| S&P 500 (SPY) live price | Alpha Vantage → Yahoo Finance fallback |
| NASDAQ (QQQ) live price | Alpha Vantage → Yahoo Finance fallback |
| Top gainers / losers | Alpha Vantage |
| Top 3 cryptocurrencies | CoinGecko (by market cap) |

### On-Device RAG AI

The Quick Notes screen includes a fully on-device AI pipeline — **no data leaves the device**:

| Stage | Component | Details |
|---|---|---|
| **Embedding** | `all-MiniLM-L6-v2` via ExecuTorch | 384-dimensional sentence vectors |
| **Vector Store** | OPSQLite (`notes_vectors.db`) | Cosine similarity search, upsert/delete/prune |
| **LLM** | `SmolLM2-135M` (quantized) via ExecuTorch | Streamed token generation, max 60 tokens |
| **Hallucination filter** | Custom post-processing | Clips at first sentence break + repeat-sentence detection |
| **Relevance gate** | Score threshold (≥ 0.13) | Skips LLM if no note passes the similarity threshold |

```
User question
     │
     ▼
[Embed question] ──► 384-dim vector
     │
     ▼
[Vector search] ──► Top-5 notes by cosine similarity
     │
     ▼
[Relevance gate] ── score < 0.13? → "no relevant notes" fallback
     │
     ▼
[Build prompt] ──► system + user message with top-3 note excerpts
     │
     ▼
[SmolLM2 generate] ──► streamed tokens (max 60)
     │
     ▼
[Hallucination trim] ──► first sentence only, repeat-loop cut
     │
     ▼
Answer + source chips (clickable back to note)
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.81.5 | Mobile UI framework |
| Expo | ~54.0.23 | Build toolchain, OTA updates, EAS |
| Expo Router | ~6.0.14 | File-based navigation |
| React | 19.1.0 | UI library (new architecture enabled) |
| Supabase JS | ^2.108.1 | Auth + API client |
| expo-auth-session | ^7.0.8 | OAuth PKCE flow |
| expo-secure-store | ^15.0.7 | Encrypted JWT storage |
| react-native-executorch | ^0.9.0 | On-device ML inference (ExecuTorch) |
| @react-native-rag/executorch | ^0.9.0 | Embeddings + LLM wrappers |
| @react-native-rag/op-sqlite | ^0.9.0 | SQLite vector store |
| @op-engineering/op-sqlite | ^15.2.14 | Native SQLite with libSQL |
| @gorhom/bottom-sheet | ^5.2.6 | Tools bottom sheet |
| react-native-reanimated | ~4.1.1 | Animations |
| react-native-gesture-handler | ~2.28.0 | Swipe-up gesture for tools |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11.9 | Runtime (pinned for Render) |
| FastAPI | 0.115.5 | REST API framework |
| SQLModel | 0.0.22 | ORM (built on SQLAlchemy + Pydantic) |
| Alembic | 1.14.0 | Database migrations |
| PostgreSQL | — | Production database |
| python-jose | 3.3.0 | JWT verification (ES256/RS256/HS256) |
| httpx | 0.27.2 | Async HTTP client for finance APIs |
| Supabase Python SDK | 2.10.0 | Server-side Supabase access |
| uvicorn | 0.32.1 | ASGI server |

### Infrastructure

| Service | Purpose |
|---|---|
| Supabase | Authentication (Google OAuth), JWKS endpoint |
| Render | FastAPI backend hosting (auto-deploy from `render.yaml`) |
| EAS Build | Android APK/AAB cloud builds |
| Google Play Store | App distribution |

---

## Project Structure

```
ai-tools-app/
├── app/                        # Expo Router screens (file-based routing)
│   ├── (tabs)/                 # Tab navigator group
│   │   ├── _layout.js          # Tab bar + floating tools button + swipe gesture
│   │   ├── index.js            # Home screen
│   │   ├── hub.js              # Market dashboard
│   │   ├── quick-notes.js      # Notes + RAG AI interface
│   │   ├── expense-tracker.js
│   │   ├── income-tracker.js
│   │   ├── budget-planner.js
│   │   ├── todo-list.js
│   │   ├── reminders.js
│   │   ├── meetings-scheduler.js
│   │   ├── pomodoro-timer.js
│   │   ├── calculator.js
│   │   ├── profile.js
│   │   ├── settings.js
│   │   └── recent-activity.js
│   ├── auth/callback.js        # OAuth deep-link handler
│   ├── sign-in.js              # Google sign-in screen
│   └── _layout.js              # Root layout (AuthProvider, context providers)
│
├── src/
│   ├── context/                # React Context state management
│   │   ├── AuthContext.js      # Supabase session, Google OAuth flow
│   │   ├── ExpenseContext.js
│   │   ├── IncomeContext.js
│   │   ├── BudgetContext.js    # Budget + category auto-suggest
│   │   ├── TodoContext.js
│   │   ├── RemindersContext.js
│   │   ├── MeetingsContext.js
│   │   ├── QuickNotesContext.js
│   │   ├── PomodoroContext.js
│   │   ├── ThemeContext.js
│   │   └── UserContext.js
│   ├── services/
│   │   ├── supabaseClient.js   # Supabase client + ChunkedSecureStore adapter
│   │   ├── apiClient.js        # Authenticated fetch wrapper (attaches JWT)
│   │   ├── api.js              # Domain API methods
│   │   ├── notificationService.js
│   │   ├── calendarAuth.js     # Google Calendar OAuth
│   │   └── ai/
│   │       ├── embeddings.js   # all-MiniLM-L6-v2 singleton (ExecuTorch)
│   │       ├── vectorStore.js  # OPSQLite CRUD + backfill + orphan prune
│   │       ├── ragAnswer.js    # Full RAG pipeline (retrieve → augment → generate)
│   │       └── tools.js        # Tool router (keyword intent → tool dispatch)
│   ├── components/             # Shared UI components
│   ├── constants/              # Colors, spacing, theme tokens
│   ├── hooks/                  # Custom hooks (CSV parser, Pomodoro stats)
│   └── types/
│
├── server/                     # FastAPI backend
│   └── app/
│       ├── main.py             # FastAPI app + CORS + router registration
│       ├── auth.py             # JWKS-based JWT verification (get_current_user)
│       ├── database.py         # SQLModel engine + session dependency
│       ├── models.py           # SQLModel table definitions (9 models)
│       ├── schemas.py          # Pydantic request/response schemas
│       └── routers/            # One router per resource
│           ├── expenses.py
│           ├── income.py
│           ├── budgets.py
│           ├── todos.py
│           ├── reminders.py
│           ├── meetings.py
│           ├── notes.py
│           ├── pomodoro.py
│           ├── user.py
│           └── finance.py      # Market data (Alpha Vantage / Yahoo / CoinGecko)
│
├── render.yaml                 # Render deployment config
├── eas.json                    # EAS Build profiles (development/preview/production)
├── app.json                    # Expo config (bundle IDs, permissions, plugins)
├── playstore-deploy.sh         # Automated Play Store deployment script
└── docs/                       # Development guides and checklists
```

---

## Database Models

| Model | Key Fields |
|---|---|
| `Expense` | `user_id`, `amount`, `category`, `description`, `date`, `method`, `notes` |
| `Income` | `user_id`, `amount`, `date`, `description` |
| `Budget` | `user_id`, `category`, `limit`, `period`, `color` |
| `Todo` | `user_id`, `title`, `description`, `completed`, `priority`, `category`, `due_date` |
| `Reminder` | `user_id`, `title`, `description`, `completed`, `due_date`, `priority` |
| `Meeting` | `user_id`, `title`, `start`, `end`, `organizer`, `description` |
| `Note` | `user_id`, `text` |
| `PomodoroSession` | `user_id`, `start`, `end`, `type`, `completed` |
| `UserProfile` | `user_id` (unique), `name` |

All models use UUID primary keys. Every record is scoped to `user_id` — the backend extracts this from the Supabase JWT, never from the request body.

---

## API Endpoints

### Authentication
All endpoints (except `/health`) require a `Bearer <supabase_jwt>` header. The backend fetches JWKS from Supabase's well-known endpoint and verifies the token locally.

### Resources

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET/POST` | `/api/expenses` | List / create expenses |
| `PUT/DELETE` | `/api/expenses/{id}` | Update / delete expense |
| `GET/POST` | `/api/income` | List / create income |
| `PUT/DELETE` | `/api/income/{id}` | Update / delete income |
| `GET/POST` | `/api/budgets` | List / create budgets |
| `PUT/DELETE` | `/api/budgets/{id}` | Update / delete budget |
| `GET/POST` | `/api/todos` | List / create todos |
| `PUT/DELETE` | `/api/todos/{id}` | Update / delete todo |
| `GET/POST` | `/api/reminders` | List / create reminders |
| `PUT/DELETE` | `/api/reminders/{id}` | Update / delete reminder |
| `GET/POST` | `/api/meetings` | List / create meetings |
| `PUT/DELETE` | `/api/meetings/{id}` | Update / delete meeting |
| `GET/POST` | `/api/notes` | List / create notes |
| `PUT/DELETE` | `/api/notes/{note_id}` | Update / delete note |
| `GET/POST` | `/api/pomodoro` | List / create sessions |
| `GET/PUT` | `/api/user/profile` | Get / upsert user profile |
| `GET` | `/api/finance/indices` | US market indices (SPY, QQQ) |
| `GET` | `/api/finance/stocks` | Top gainers / losers |
| `GET` | `/api/finance/crypto` | Top 3 cryptos by market cap |

---

## Authentication Flow

```
User taps "Continue with Google"
         │
         ▼
supabase.auth.signInWithOAuth({ provider: 'google', ... })
         │
         ▼
Supabase returns OAuth URL
         │
         ▼
expo-web-browser opens auth session (in-app browser tab)
         │
         ▼
Google authenticates → redirects to daily://auth/callback?code=...
         │
         ▼
supabase.auth.exchangeCodeForSession(code)
         │
         ▼
JWT stored in ChunkedSecureStore (handles tokens > 2048 bytes)
         │
         ▼
AuthContext.session updated → app navigates to home screen
         │
         ▼
All API requests include: Authorization: Bearer <jwt>
         │
         ▼
FastAPI verifies JWT via Supabase JWKS (cached in memory)
```

### ChunkedSecureStore

`expo-secure-store` has a 2048-byte limit per key. Supabase JWTs exceed this limit. The custom `ChunkedSecureStore` adapter transparently splits values into 1900-byte chunks, storing them as `key__0`, `key__1`, ... with a `key__count` meta-key. Reads reassemble chunks in order.

---

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.11.9
- Android Studio (for emulator) or a physical Android device
- Supabase project with Google OAuth configured

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
EXPO_PUBLIC_API_URL=http://<your-local-ip>:8000
```

> When using an Android emulator, use your Mac's LAN IP (e.g. `10.0.0.17`) rather than `localhost` — the emulator cannot reach the host machine via `localhost`.

### 3. Set up the backend

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `server/.env`:

```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
ALPHA_VANTAGE_API_KEY=<your-key>
FMP_API_KEY=<your-key>
```

Run database migrations:

```bash
cd server
alembic upgrade head
```

Start the server:

```bash
npm run server
# or directly:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start the Expo app

```bash
npx expo start
# Press 'a' for Android emulator
```

---

## Deployment

### Backend (Render)

The `render.yaml` at the repo root configures automatic deploys:

```yaml
services:
  - type: web
    name: daily-api
    runtime: python
    rootDir: server
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /health
```

Push to the main branch → Render auto-builds and deploys. Environment variables are set in the Render dashboard.

### Android (EAS Build + Play Store)

```bash
# Production build
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

Or use the automated deploy script:

```bash
./playstore-deploy.sh
```

---

## Key Technical Decisions

### On-device AI instead of cloud APIs

The RAG pipeline runs entirely on-device using [ExecuTorch](https://pytorch.org/executorch/) — no user notes are ever sent to an external AI service. This means:
- Works offline
- Zero inference cost
- Complete data privacy

The trade-off is model capability: SmolLM2-135M is a 135M-parameter quantized model. The hallucination filter (sentence-level trimming + repeat-sentence detection) compensates for the small model's tendency to loop or go off-topic.

### Supabase PKCE OAuth on mobile

Standard OAuth implicit flow is blocked on mobile due to the lack of a real browser. The app uses the PKCE (Proof Key for Code Exchange) flow: the authorization code is returned to the `daily://auth/callback` deep link and exchanged for a session token via `supabase.auth.exchangeCodeForSession()`.

### JWT verification via JWKS (not SDK)

The FastAPI backend does not use the Supabase Python SDK for auth. Instead, it fetches the JWKS (JSON Web Key Set) from Supabase's `.well-known` endpoint and verifies tokens locally using `python-jose`. The JWKS is cached in memory to avoid a network call on every request.

### Context-per-feature state management

Each feature has its own React Context (e.g., `ExpenseContext`, `TodoContext`) rather than a single global store. This keeps state isolated, makes each context independently loadable, and avoids re-rendering unrelated UI on unrelated data changes.

---

## Security Notes

- Every backend endpoint is protected by `Depends(get_current_user)` — no endpoint is accidentally public.
- `user_id` is always extracted from the verified JWT, never from the request body — clients cannot spoof data ownership.
- The Supabase anon key and service role key are only in server-side environment variables; the frontend only holds the anon key (which is safe to expose).
- JWT tokens are stored in `expo-secure-store` (iOS Keychain / Android Keystore), not AsyncStorage.

---

## Version History

| Version | Highlights |
|---|---|
| 1.3.2 | Current release |
| 1.3.1 | Bug fixes |
| 1.3.0 | RAG pipeline, on-device AI for Quick Notes |
| 1.2.0 | FastAPI backend + PostgreSQL, Google OAuth, finance dashboard |
| 1.1.0 | Budget auto-suggest, income tracker |
| 1.0.x | Initial release: expense tracker, todo, reminders, Pomodoro |
