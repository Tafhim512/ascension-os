# Ascension OS - Production Deployment

## Supabase + Vercel Deployment

### 1. Prerequisites

- [Vercel](https://vercel.com) account
- [Supabase](https://supabase.com) project with PostgreSQL
- Ollama running for AI features (optional, local only)

### 2. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to Project Settings > API to get your keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run the Prisma migration against Supabase:
   ```bash
   DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres" npx prisma db push
   ```
4. Seed initial achievements:
   ```bash
   npx tsx prisma/seed.ts
   ```

### 3. Vercel Deployment

#### Option A: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add these environment variables in Vercel Settings > Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
   OLLAMA_BASE_URL=https://your-ollama-server.com
   OLLAMA_MODEL=llama3.1
   OLLAMA_EMBED_MODEL=nomic-embed-text
   NEXT_PUBLIC_APP_NAME="Ascension OS"
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate-a-random-secret
   ```
4. Deploy

#### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
```

### 4. Post-Deployment Checklist

1. Update `DATABASE_URL` in Vercel with your Supabase connection string
2. Run Prisma migration on production DB:
   ```bash
   DATABASE_URL="postgresql://..." npx prisma db push
   ```
3. Sign up at `/signup` and create your profile
4. Verify all pages load:
   - `/` - Command Center
   - `/quests` - Quests
   - `/bosses` - Bosses
   - `/mentor` - AI Mentor
   - `/future-self` - Future Self Engine
   - `/brain` - Second Brain
   - `/journal` - Journal
   - `/analytics` - Analytics
   - `/world` - World Map
   - `/legacy` - Legacy

### 5. Secure Auth Rules (Supabase)

Run these SQL statements in Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute ENABLE ROW LEVEL SECURITY;
ALTER TABLE journalentry ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledgeitem ENABLE ROW LEVEL SECURITY;
ALTER TABLE project ENABLE ROW LEVEL SECURITY;
ALTER TABLE book ENABLE ROW LEVEL SECURITY;
ALTER TABLE course ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit ENABLE ROW LEVEL SECURITY;
ALTER TABLE futureself ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement ENABLE ROW LEVEL SECURITY;
ALTER TABLE title ENABLE ROW LEVEL SECURITY;
ALTER TABLE useridentity ENABLE ROW LEVEL SECURITY;
ALTER TABLE xpevent ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
ALTER TABLE userreward ENABLE ROW LEVEL SECURITY;

-- User can only access their own profile
CREATE POLICY "Users can view own profile" ON profile
  FOR SELECT USING (auth.uid() = userId);
CREATE POLICY "Users can update own profile" ON profile
  FOR UPDATE USING (auth.uid() = userId);

-- User can only access their own quests
CREATE POLICY "Users can manage own quests" ON quest
  FOR ALL USING (
    (SELECT userId FROM profile WHERE id = quest.profileId) = auth.uid()
  );

-- User can only access their own bosses
CREATE POLICY "Users can manage own bosses" ON boss
  FOR ALL USING (
    (SELECT userId FROM profile WHERE id = boss.profileId) = auth.uid()
  );

-- User can only access their own attributes
CREATE POLICY "Users can manage own attributes" ON attribute
  FOR ALL USING (
    (SELECT userId FROM profile WHERE id = attribute.profileId) = auth.uid()
  );

-- User can only access their own journals
CREATE POLICY "Users can manage own journals" ON journalentry
  FOR ALL USING (
    (SELECT userId FROM profile WHERE id = journalentry.profileId) = auth.uid()
  );

-- User can only access their own knowledge
CREATE POLICY "Users can manage own knowledge" ON knowledgeitem
  FOR ALL USING (
    (SELECT userId FROM profile WHERE id = knowledgeitem.profileId) = auth.uid()
  );

-- User can only access their own projects
CREATE POLICY "Users can manage own projects" ON project
  FOR ALL USING (
    (SELECT userId FROM profile WHERE id = project.profileId) = auth.uid()
  );

-- User can only access their own habits
CREATE POLICY "Users can manage own habits" ON habit
  FOR ALL USING (
    (SELECT userId FROM profile WHERE id = habit.profileId) = auth.uid()
  );

-- User can only access their own future selves
CREATE POLICY "Users can manage own future selves" ON futureself
  FOR ALL USING (
    (SELECT userId FROM profile WHERE id = futureself.profileId) = auth.uid()
  );
```

### 6. Common Issues

- **Ollama not reachable**: Deploy Ollama separately on a VPS or use a cloud provider. Set `OLLAMA_BASE_URL` to your server.
- **Database connection errors**: Use Supabase connection pooler (port 6543) for serverless/Vercel:
  `postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:6543/postgres`
- **Auth not working**: Ensure `NEXTAUTH_SECRET` is set and matches across deployments.

### 7. Multi-User Deployment Notes

- Each user gets their own profile via `auth.uid()`
- All data is scoped to the logged-in user through RLS policies
- The seed script only creates data for the first user; subsequent users start fresh
- The AI Mentor uses per-user embeddings for RAG context