# Ascension OS

Turn your life into an RPG. Ascension OS is a production-ready life-operating system that tracks quests, attributes, habits, journals, and projects — gamified with XP, ranks, power scores, and an AI Mentor powered by Ollama.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** Prisma ORM — SQLite (dev) / Supabase Postgres (prod)
- **Auth:** Supabase SSR (`@supabase/ssr`) with email/password
- **AI:** Ollama (`llama3.1` + `nomic-embed-text`) for mentor chat, insights, quest generation, and semantic memory RAG
- **Charts:** Recharts
- **UI:** Tailwind CSS v4, shadcn/ui, Framer Motion, Lucide icons
- **Deploy:** Vercel (`output: standalone`)

## Prerequisites

- Node.js >= 18
- npm or pnpm
- A Supabase project (for production auth + database)
- Ollama (optional, for AI features)

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (prod) | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (prod) | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (prod) | Supabase service role key |
| `DATABASE_URL` | Yes | SQLite dev: `file:./dev.db`. Prod: Supabase Postgres connection string |
| `DATABASE_PROVIDER` | No | `sqlite` (default) or `postgresql` |
| `OLLAMA_BASE_URL` | No | Ollama server URL (default: `http://localhost:11434`) |
| `OLLAMA_MODEL` | No | Chat model (default: `llama3.1`) |
| `OLLAMA_EMBED_MODEL` | No | Embedding model (default: `nomic-embed-text`) |
| `NEXT_PUBLIC_APP_NAME` | No | App name (default: `Ascension OS`) |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL |
| `NEXTAUTH_URL` | No | Auth callback URL |
| `NEXTAUTH_SECRET` | No | Random secret for auth |

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
- For **local dev without Supabase**, the app falls back to a local SQLite dev profile automatically.
- For **local dev with Supabase**, fill in your Supabase project credentials.

### 3. Initialize database

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Start Ollama (optional, for AI features)

```bash
ollama serve
ollama pull llama3.1
ollama pull nomic-embed-text
```

### 5. Run dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Daily-Use Checklist

After cloning or pulling updates:

```bash
# 1. Install deps (if package.json changed)
npm install

# 2. Apply schema changes
npx prisma db push

# 3. Seed default data (if first time or schema changed)
npx tsx prisma/seed.ts

# 4. Start dev server
npm run dev
```

## Production Deployment (Vercel + Supabase)

See `DEPLOYMENT.md` for the full step-by-step guide with:
- Supabase project setup
- Running migrations against Supabase Postgres
- Vercel environment variables
- RLS (Row Level Security) SQL policies for multi-user isolation

### Quick Deploy

1. Push code to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel Settings
4. Run against production DB:
   ```bash
   DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:6543/postgres" npx prisma db push
   npx tsx prisma/seed.ts
   ```
5. Execute RLS SQL from `DEPLOYMENT.md` in Supabase SQL Editor

## Verification

```bash
# Lint
npm run lint        # must pass (exit 0)

# Type check
npx tsc --noEmit    # must pass (exit 0)

# Build
npm run build       # must succeed, all 22 routes generate

# Database
npx prisma db push  # schema in sync
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Command Center - Dashboard with stats, quests, bosses, attributes |
| `/login` | Login page |
| `/signup` | Sign up page |
| `/quests` | Active and completed quests |
| `/bosses` | Boss hunts with subtasks |
| `/attributes` | Skill tree with XP bars |
| `/future-self` | Future Self Engine with vision editor and gap analysis |
| `/brain` | Second Brain - semantic knowledge graph |
| `/journal` | Journal entries with AI reflections |
| `/legacy` | Completed projects and knowledge base |
| `/mentor` | AI Mentor chat interface |
| `/world` | World map with integrations |
| `/analytics` | XP charts and skill radar |
| `/settings` | App settings |

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    api/                  # API routes (AI, brain, profile)
    actions/              # Server actions
  components/
    analytics/            # Charts
    brain/                # Knowledge graph, list, search
    dashboard/            # Morning briefing, habits widget
    future-self/          # Vision editor, gap analysis
    journal/              # Journal modal
    mentor/               # AI chat, insight widget
    quests/               # Quest modals, focus mode, complete button
    shared/               # Sidebar, mobile nav, layout, progression UI
    ui/                   # shadcn/ui components
  hooks/                  # Custom React hooks (auth, profile)
  lib/
    ai/                   # Ollama client, conversation streaming, memory RAG
    engine/               # XP, levels, streaks, momentum, ranks, achievements
    supabase/             # SSR-safe Supabase client factories
  proxy.ts                # Next.js middleware for auth
```
