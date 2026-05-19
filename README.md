# FilmyAF 🎬

Turn ordinary situations into absurd Bollywood-level drama.

FilmyAF takes a boring real-world situation (e.g. *"two founders fighting over putting sugar in coffee"*) and runs it through a multi-agent LLM pipeline (Director → Casting → Screenwriter) to spit out a full Bollywood-style script with a title, tagline, characters, and dramatic scenes you'll want to forward on WhatsApp.

Built as a MERN app: **MongoDB + Express + React (Vite) + Node**, with **Google Gemini** doing the heavy lifting on the LLM side.

---

## Setup

### 1. Prereqs

- **Node.js 18+**
- **MongoDB** — either local install or a free [Atlas](https://www.mongodb.com/cloud/atlas/register) cluster
- A **Google Gemini API key** (free)

### 2. Clone + install packages

```bash
git clone https://github.com/<your-username>/filmyaf.git
cd filmyaf
npm run install:all
```

`npm run install:all` installs three things in one go:

- **Root**: `concurrently` (so `npm run dev` can boot client + server together)
- **Server** (`server/package.json`):
  - `express` — HTTP server
  - `mongoose` — MongoDB ODM
  - `jsonwebtoken` + `bcryptjs` — auth (JWT + password hashing)
  - `express-validator` — input validation
  - `express-rate-limit` — per-route rate limits
  - `helmet`, `cors`, `morgan` — security/CORS/logging
  - `axios` — calling Gemini's REST API
  - `nanoid` — short shareable slugs (`/script/rk7x9p2m`)
  - `dotenv` — env loading
  - `nodemon` (dev) — auto-restart on changes
- **Client** (`client/package.json`):
  - `react`, `react-dom`, `react-router-dom`
  - `@reduxjs/toolkit`, `react-redux` — state
  - `axios` — API calls
  - `react-helmet-async` — Open Graph meta tags for share links
  - `react-hot-toast` — toasts
  - `html-to-image` — Drama Card PNG export
  - `vite`, `@vitejs/plugin-react` (dev) — bundler
  - `tailwindcss`, `postcss`, `autoprefixer` (dev) — styling

### 3. Environment variables

Copy `server/.env.example` → `server/.env` and `client/.env.example` → `client/.env`, then fill them in using the instructions below.

#### `server/.env`

```
PORT=5000
NODE_ENV=development
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
CLIENT_URL=http://localhost:5173
```

| Variable | How to get the value |
|---|---|
| `PORT` | Any free port. On Mac, port 5000 collides with AirPlay Receiver — use `5001` if that's the case. |
| `NODE_ENV` | `development` locally, `production` when deployed. |
| `MONGODB_URI` | **Local Mongo:** `mongodb://localhost:27017/filmyaf` (after `brew install mongodb-community` + `brew services start mongodb-community`). **Atlas:** sign up at <https://www.mongodb.com/cloud/atlas/register> → create a free M0 cluster → Database Access (create a user) → Network Access (Allow Access From Anywhere) → Connect → "Drivers" → copy the connection string, replace `<password>`, and add `/filmyaf` before the `?`. |
| `JWT_SECRET` | Run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` and paste the 96-character hex output. |
| `JWT_EXPIRES_IN` | How long tokens last. `7d` is fine. |
| `BCRYPT_ROUNDS` | `12` is the standard cost factor. |
| `GEMINI_API_KEY` | Go to <https://aistudio.google.com/apikey> → sign in with Google → **Create API key** → "Create API key in new project" → copy the `AIza...` value. Free tier, no credit card. |
| `GEMINI_MODEL` | `gemini-2.5-flash` (default) for speed + quality. Browse free models at <https://aistudio.google.com/app/apikey>. |
| `GEMINI_FALLBACK_MODEL` | `gemini-2.0-flash` — used automatically if the primary 429s or 5xxs. |
| `CLIENT_URL` | The URL where the Vite client runs. Locally: `http://localhost:5173`. When deployed: your Vercel URL. CORS uses this. |

#### `client/.env`

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:5173
```

| Variable | How to get the value |
|---|---|
| `VITE_API_URL` | The Express backend's base URL + `/api`. Locally: `http://localhost:5000/api` (or `5001` if you changed the server's `PORT`). When deployed: your Render/Railway/etc. URL + `/api`. |
| `VITE_APP_URL` | The public URL of the client itself. Used to build shareable links (`/script/<slug>`). Locally: `http://localhost:5173`. When deployed: your Vercel URL. |

### 4. Run

```bash
npm run dev
```

That boots the Express server on `localhost:5000` and the Vite client on `localhost:5173` in parallel. Open <http://localhost:5173>.

---

## License

MIT.
