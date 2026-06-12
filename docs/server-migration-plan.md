# Plan: Add Backend Server for Play Store Publishing

## Context
The app (d.ai.ly) currently stores all data in AsyncStorage (device-local) with hardcoded API keys in `src/services/keys.js`. For Play Store publishing, the user wants: user accounts so data syncs across devices/reinstalls, server-side storage for all app data, and API keys kept off the app bundle. On-device AI (ExecutorTorch RAG/embeddings in `src/services/ai/`) stays unchanged. Python + FastAPI chosen for the server (good AI/ML foundation for future expansion).

---

## Checklist

### Phase 1 — Server Setup
- [x] Create `server/` directory in repo root
- [x] Create `server/requirements.txt` with all dependencies
- [x] Create `server/app/main.py` (FastAPI app, CORS, router registration)
- [x] Create `server/app/database.py` (SQLModel engine + session dependency)
- [x] Create `server/app/models.py` (all SQLModel table models)
- [x] Create `server/app/schemas.py` (Pydantic request/response schemas)
- [x] Create `server/app/auth.py` (Supabase JWT verification dependency)
- [x] Create `server/app/routers/expenses.py`
- [x] Create `server/app/routers/income.py`
- [x] Create `server/app/routers/budgets.py`
- [x] Create `server/app/routers/todos.py`
- [x] Create `server/app/routers/reminders.py`
- [x] Create `server/app/routers/meetings.py`
- [x] Create `server/app/routers/notes.py`
- [x] Create `server/app/routers/pomodoro.py`
- [x] Create `server/app/routers/user.py`
- [x] Create `server/app/routers/finance.py` (proxy for Alpha Vantage / CoinGecko / Yahoo Finance)
- [x] Set up Alembic (`alembic init`, `alembic.ini`, `alembic/env.py`)
- [x] Create initial Alembic migration for all models
- [x] Create `server/.env.example` with all required env var keys
- [ ] Verify server runs locally: `uvicorn app.main:app --reload` + Swagger UI at `/docs`

### Phase 2 — App: Auth
- [x] Install `@supabase/supabase-js` in the app
- [x] Create `src/context/AuthContext.js` (sign-in, sign-out, session state)
- [x] Create `src/services/supabaseClient.js` (Supabase client with SecureStore adapter, flowType: 'pkce')
- [x] Create `src/services/apiClient.js` (fetch wrapper with JWT from SecureStore)
- [x] Create dedicated `app/sign-in.js` screen (logo + Google button only, no tabs)
- [x] Create `app/auth/callback.js` (handles PKCE code exchange on deep link return)
- [x] Update `app/_layout.js` — auth gate redirects to `/sign-in`, allows `/auth` during callback
- [x] Update `app/(tabs)/profile.js` — account management only (email, display name, sign out)
- [x] Set up Google OAuth in Google Cloud Console — Web application client, redirect URI: `https://saqpypvijslluvnpkvkq.supabase.co/auth/v1/callback`
- [x] Enable Google provider in Supabase dashboard (Authentication → Providers → Google)
- [x] Configure Supabase URL settings — Site URL: `daily://`, Redirect URLs: `daily://**`, `exp://**`
- [x] Deep-link scheme is `daily` (from `app.json`) — redirect URI is `daily://auth/callback`
- [x] Test full Google OAuth flow end-to-end — sign in → callback → app loads ✅

### Phase 2 — App: Data Migration
- [x] Update `src/services/storageService.js` → replace AsyncStorage calls with apiClient
- [x] Update `src/context/ExpenseContext.js` → use apiClient
- [x] Update `src/context/IncomeContext.js` → use apiClient
- [x] Update `src/context/BudgetContext.js` → use apiClient
- [x] Update `src/context/TodoContext.js` → use apiClient
- [x] Update `src/context/RemindersContext.js` → use apiClient
- [x] Update `src/context/MeetingsContext.js` → use apiClient
- [x] Update `src/context/QuickNotesContext.js` → sync text via apiClient (keep local embeddings)
- [x] Update `src/context/PomodoroContext.js` → use apiClient
- [x] Update `src/context/UserContext.js` → fetch profile from `/api/user/profile`
- [x] Update `src/services/api.js` → route finance calls through own server (`/api/finance/...`)
- [x] Remove API keys from `src/services/keys.js` (Alpha Vantage, FMP)
- [x] Create `app/.env.example` with `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_API_URL`

### Phase 2 — Supabase Setup (completed)
- [x] Created Supabase project (`saqpypvijslluvnpkvkq`)
- [x] Ran `alembic upgrade head` — all 9 tables created in Supabase Postgres
- [x] Updated `server/.env` with DATABASE_URL, SUPABASE_URL, anon key, service role key
- [x] Updated `app/.env` with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
- [x] Updated `server/app/auth.py` to use JWKS-based JWT verification (ES256/RS256/HS256) — Supabase now uses ECC P-256 keys, not shared secret HS256

### Phase 3 — Deploy
- [ ] Create Render Web Service (Python), connect GitHub repo, set root to `server/`
- [ ] Set Render start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Add all env vars to Render dashboard
- [ ] Set `EXPO_PUBLIC_API_URL` in app `.env` to Render URL
- [ ] Smoke test deployed server (Swagger UI, CRUD round-trip, finance proxy)
- [ ] Test app against production server end-to-end
- [ ] Build release APK: `eas build --platform android`

---

## Architecture

### Free Hosting Stack
- **Server**: Python + FastAPI → hosted on **Render** (free tier)
- **Database**: PostgreSQL → hosted on **Supabase** (free tier: 500MB, no expiry)
- **Auth**: **Supabase Auth** (email/password + JWT, built-in, free) — avoids building auth from scratch
- **ORM**: **SQLModel** (combines SQLAlchemy + Pydantic, made by FastAPI's author — type-safe, clean)
- **Migrations**: **Alembic**

### What moves to server
- All CRUD data: expenses, income, budgets, todos, reminders, meetings, quick notes, pomodoro sessions, user profile
- External API calls with secret keys: Alpha Vantage, FMP — server proxies these so keys are never in the app bundle
- Public APIs (CoinGecko, Yahoo Finance) proxied too for consistency

### What stays local (unchanged)
- On-device ML: `src/services/ai/` (embeddings, vectorStore, ragAnswer, tools) — no changes
- Calculator, theme preference
- Google/Outlook Calendar OAuth — stays client-side (user's own OAuth credentials)

---

## Server File Structure

```
server/
├── app/
│   ├── main.py               # FastAPI app, CORS, router registration
│   ├── database.py           # SQLModel engine + session dependency
│   ├── models.py             # SQLModel table models (DB schema)
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── auth.py               # Verify Supabase JWT, extract user_id
│   └── routers/
│       ├── expenses.py
│       ├── income.py
│       ├── budgets.py
│       ├── todos.py
│       ├── reminders.py
│       ├── meetings.py
│       ├── notes.py
│       ├── pomodoro.py
│       ├── user.py
│       └── finance.py        # Proxy: Alpha Vantage, CoinGecko, Yahoo Finance
├── alembic/
│   ├── env.py
│   └── versions/
├── alembic.ini
├── requirements.txt
└── .env                      # DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY, ALPHA_VANTAGE_API_KEY
```

### Repo Layout (monorepo)
```
ai-tools-app/
├── (current app files)       ← Expo React Native app
├── server/                   ← new Python FastAPI backend
└── docs/                     ← documentation
```

---

## SQLModel Data Models
Each model has `user_id: str`, `id: uuid`, `created_at: datetime`.

| Model | Fields |
|-------|--------|
| `Expense` | amount, category, description, date, method, notes |
| `Income` | amount, date, description |
| `Budget` | category, limit, period, color |
| `Todo` | title, description, completed, priority, category, due_date, completed_at |
| `Reminder` | title, description, completed, due_date, priority |
| `Meeting` | title, start, end, organizer, description |
| `Note` | text |
| `PomodoroSession` | start, end, type (work/break/longBreak), completed |
| `UserProfile` | name (1-to-1 with auth user) |

---

## Google OAuth Setup (three moving parts)

**1. Google Cloud Console**
- Create OAuth 2.0 credentials (Web + Android)
- For Android (Play Store): add SHA-1 fingerprint from `eas credentials` or `keytool`
- Authorized redirect URI: `https://<supabase-project-ref>.supabase.co/auth/v1/callback`

**2. Supabase dashboard**
- Authentication → Providers → Google → enable, paste Client ID + Client Secret
- Supabase handles the OAuth callback and issues its own JWT — server code is unchanged

**3. App (Expo)**
- `expo-auth-session` and `expo-web-browser` are already dependencies
- Flow: tap "Sign in with Google" → `supabase.auth.signInWithOAuth({ provider: 'google', ... })` → browser → Supabase callback → deep-link back to app with session
- Deep link scheme: `com.daily.ai://` (already set in `app.json`)
- Session stored in SecureStore via `supabase.auth.onAuthStateChange`

---

## Verification
1. **Server locally**: `cd server && uvicorn app.main:app --reload` → Swagger UI at `http://localhost:8000/docs`
2. **Auth flow**: Sign in with Google in app → get Supabase JWT → hit protected endpoint → 200
3. **CRUD round-trip**: Create expense via app → verify row in Supabase dashboard
4. **Finance proxy**: GET `/api/finance/indices` → stock data returns (no API key in app)
5. **App vs. real server**: Sign in, add data, restart app, data still there
6. **On-device AI unchanged**: Quick notes RAG search still works

---

## Notes
- Render free tier sleeps after 15 min inactivity (30s cold start). Fine for a side project.
- FastAPI auto-generates `/docs` (Swagger) and `/redoc` — useful during development.
- `@supabase/supabase-js` needed in app for auth; server uses `supabase` Python package for admin ops.
- On-device AI (`react-native-executorch`, vector store) is entirely unaffected by this migration.
- Python FastAPI is a solid foundation if server-side ML is added later (Hugging Face, LangChain, etc.).

---

## Google OAuth Implementation Notes (React Native specific)

These details are non-obvious and were worked out through iteration. Keep for reference.

### What works
- `flowType: 'pkce'` in `createClient` — Supabase v2 default, required for mobile
- `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true } })` — `skipBrowserRedirect: true` is mandatory; without it, nothing opens on Android
- `WebBrowser.openAuthSessionAsync(data.url, redirectTo)` from `expo-web-browser` — opens Chrome Custom Tab
- `makeRedirectUri({ scheme: 'daily', path: 'auth/callback' })` from `expo-auth-session` — generates `daily://auth/callback`
- `WebBrowser.maybeCompleteAuthSession()` called at module level in `AuthContext.js`
- `app/auth/callback.js` route — handles the case where Android routes the deep link through Expo Router instead of `openAuthSessionAsync` catching it
- `supabase.auth.exchangeCodeForSession(code)` — takes just the raw code string extracted from `useLocalSearchParams()`, NOT the full URL
- `flowType: 'pkce'` set on client + `WebCrypto not available` warning is expected on React Native — falls back to plain challenge, which Supabase accepts

### Supabase dashboard settings required
- Authentication → URL Configuration → Site URL: `daily://`
- Authentication → URL Configuration → Redirect URLs: add `daily://**` and `exp://**`
- Authentication → Providers → Google: Client ID and Client Secret from Google Cloud Console

### Google Cloud Console settings required
- Credential type: **Web application** (NOT Android — Supabase handles OAuth server-side)
- Authorized redirect URI: `https://saqpypvijslluvnpkvkq.supabase.co/auth/v1/callback`

### Auth flow (end-to-end)
1. User taps "Continue with Google" on `app/sign-in.js`
2. `signInWithGoogle()` in `AuthContext.js` calls `signInWithOAuth` → gets Supabase auth URL
3. `WebBrowser.openAuthSessionAsync` opens Chrome Custom Tab with that URL
4. User selects Google account → Google redirects to Supabase callback URL
5. Supabase processes OAuth → redirects to `daily://auth/callback?code=<pkce_code>`
6. Android routes deep link → Expo Router renders `app/auth/callback.js`
7. Callback screen calls `supabase.auth.exchangeCodeForSession(code)`
8. Session is set → `onAuthStateChange` fires → `AuthGate` in `_layout.js` redirects to `/(tabs)/`

### File changes summary
| File | What changed |
|------|-------------|
| `src/context/AuthContext.js` | Replaced web-only `signInWithOAuth` with `expo-web-browser` + PKCE flow |
| `src/services/supabaseClient.js` | Added `flowType: 'pkce'` |
| `app/sign-in.js` | New dedicated sign-in screen (logo + button) |
| `app/auth/callback.js` | New route handling PKCE code exchange |
| `app/_layout.js` | Auth gate updated: redirects to `/sign-in`, exempts `/auth` route |
| `app/(tabs)/profile.js` | Removed auth UI — account management only |
