# FilmyAF 🎬

Turn ordinary situations into absurd Bollywood-level drama.

FilmyAF takes a boring real-world situation ("fight between two founders over putting sugar in coffee") and transforms it into a full Bollywood-style script — title, tagline, characters, and dramatic scenes with dialogue — using a multi-agent LLM pipeline.

---

## Tech Stack (Strict MERN)

- **Frontend:** React 18 + Vite + JavaScript + Tailwind CSS + Redux Toolkit + React Router v6 + Axios
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT + bcryptjs + express-validator
- **LLM:** OpenRouter (`openai/gpt-oss-120b:free` primary, `google/gemma-4-31b-it:free` fallback)

---

## Features

### Mandatory
- Situation input → multi-scene script output (title, tagline, scenes, dialogues, descriptions, indices)
- Multi-agent LLM pipeline (Director → Casting → Screenwriter)
- Proper error handling (themed, retryable)
- Fully responsive UI
- History stored locally (and synced to server account when logged in)

### Bonus
- Character cards (name, role, description, signature style, emoji)
- Mood selector (Romantic, Action, Comedy, Thriller, Tragic, Masala, Mythological, 90s Throwback)
- Regenerate specific sections (scene, title, characters)
- Public shareable links with Open Graph previews (`/script/:slug`)
- Drama Card PNG export
- Community feed: Trending / Recent / Most Cloned (top 6 each)
- Trending score = `likeCount + viewCount / 10`
- Like, comment, clone & remix (clone supports a custom prompt + mood that re-runs the whole pipeline)
- Owner edit & delete — edit re-runs the LLM pipeline and stamps `lastEditedAt`
- IST timestamps: "Generated on …" + "Last updated on …" shown at the top of every script
- Email/password auth with JWT

---

## Project Structure

```
filmyaf/
├── package.json              # Root scripts (concurrently)
├── README.md
├── .gitignore
├── client/                   # React + Vite frontend
└── server/                   # Express + MongoDB backend
```

See `client/` and `server/` for full structure.

---

## Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB (local install or [Atlas](https://www.mongodb.com/cloud/atlas) free cluster)
- OpenRouter API key — grab one free at <https://openrouter.ai>

### 2. Clone & install
```bash
git clone https://github.com/<your-username>/filmyaf.git
cd filmyaf
npm run install:all
```

### 3. Environment variables

**`server/.env`** (copy `server/.env.example`):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/filmyaf
JWT_SECRET=replace-with-a-long-random-string-at-least-32-chars
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
OPENROUTER_MODEL=openai/gpt-oss-120b:free
OPENROUTER_FALLBACK_MODEL=google/gemma-4-31b-it:free
CLIENT_URL=http://localhost:5173
```

**`client/.env`** (copy `client/.env.example`):
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:5173
```

### 4. Run locally
```bash
npm run dev
```

This starts the Express server on port `5000` and the Vite client on port `5173`.

Open <http://localhost:5173>.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET  | `/api/auth/me` | Get current user (protected) |
| POST | `/api/generate/script` | Run multi-agent generation |
| POST | `/api/generate/regenerate-scene` | Regenerate a single scene (owner-only) |
| POST | `/api/generate/regenerate-title` | Regenerate title + tagline (owner-only) |
| POST | `/api/generate/regenerate-characters` | Regenerate characters (owner-only) |
| POST | `/api/generate/edit-script` | Edit prompt/mood + re-run full pipeline (owner-only) |
| GET  | `/api/scripts/share/:slug` | Public read (increments view) |
| GET  | `/api/scripts/:id` | Get script by id (owner or public) |
| POST | `/api/scripts` | Save generated script to account |
| PATCH | `/api/scripts/:id` | Update script (owner-only) |
| DELETE | `/api/scripts/:id` | Delete script (owner-only) |
| POST | `/api/scripts/:id/clone` | Clone (optional `{situation, mood}` body triggers a remix) |
| GET  | `/api/scripts/user/:username` | Public scripts by user |
| GET  | `/api/scripts/my/history` | Own script history (protected) |
| POST | `/api/scripts/:id/like` | Toggle like |
| GET  | `/api/scripts/:id/likes` | Like count + hasLiked |
| GET  | `/api/scripts/:id/comments` | List comments |
| POST | `/api/scripts/:id/comments` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment (owner-only) |
| GET  | `/api/feed/popular` | Top by trending score (top 6) |
| GET  | `/api/feed/recent` | Most recent scripts (top 6) |
| GET  | `/api/feed/most-cloned` | Most cloned scripts (top 6) |

---

## Multi-Agent Pipeline

Three sequential LLM agents, each with its own system prompt and temperature:

1. **Director Agent** — picks a title, tagline, tone, number of scenes (3–5), and character count (2–4). _Temp 0.4_.
2. **Casting Agent** — names dramatic characters with roles, descriptions, and signature styles. _Temp 0.9_.
3. **Screenwriter Agent** — writes the scenes with dialogue, scene headings, and locations. _Temp 0.95_.

Each agent uses OpenRouter's JSON mode + an explicit schema in the prompt. Outputs are validated manually; on validation/parse failure the call is retried once with the error appended, then falls back to a friendlier secondary model.

Why three agents and not one big prompt?
- Cleaner context per call (no token bloat)
- Easier to regenerate one section (title only, scene only, characters only)
- Better structured outputs (smaller schemas validate more reliably)

---

## AI Tools Used in Development

This project was built with assistance from Claude (Anthropic). Specifically:
- **Architecture & scaffolding:** Planned the file structure, dependency choices, and API surface in conversation.
- **Boilerplate generation:** Express middleware, Mongoose models, Redux slices, Tailwind components.
- **Prompt engineering:** The three-agent system prompts and JSON schemas were iterated with Claude.
- **Debugging:** Used Claude for tracing through validation errors and retry logic.

---

## Deployment Notes

- **Frontend:** Vercel — point at `client/`, set `VITE_API_URL` to your backend URL.
- **Backend:** Render — point at `server/`, set all env vars in dashboard.
- **DB:** MongoDB Atlas free tier — paste connection string into `MONGODB_URI`.

---

## License

MIT.
