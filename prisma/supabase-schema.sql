-- Ascension OS - Supabase Postgres Schema
-- Run this entire script in Supabase Dashboard -> SQL Editor -> New query
-- Click "Run" to execute. This creates all tables.

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILE
-- ============================================
CREATE TABLE IF NOT EXISTS "Profile" (
  id                TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  userId            TEXT NOT NULL UNIQUE,
  playerName        TEXT NOT NULL DEFAULT 'Player 1',
  avatarUrl         TEXT,
  level             INTEGER NOT NULL DEFAULT 1,
  currentXp         INTEGER NOT NULL DEFAULT 0,
  lifetimeXp        INTEGER NOT NULL DEFAULT 0,
  hunterRank        TEXT NOT NULL DEFAULT 'F',
  powerScore        INTEGER NOT NULL DEFAULT 0,
  currentTitle      TEXT NOT NULL DEFAULT 'The Beginner',
  currentWorld      TEXT NOT NULL DEFAULT 'THE_WEAK',
  currentChapter    INTEGER NOT NULL DEFAULT 1,
  chapterTitle      TEXT NOT NULL DEFAULT 'The Awakening',
  currentStreak     INTEGER NOT NULL DEFAULT 0,
  longestStreak     INTEGER NOT NULL DEFAULT 0,
  lastActiveDate    TIMESTAMPTZ,
  gold              INTEGER NOT NULL DEFAULT 0,
  reputation        INTEGER NOT NULL DEFAULT 0,
  legacyScore       INTEGER NOT NULL DEFAULT 0,
  knowledgePoints  INTEGER NOT NULL DEFAULT 0,
  builderPoints    INTEGER NOT NULL DEFAULT 0,
  momentum          DOUBLE PRECISION NOT NULL DEFAULT 0,
  energy            DOUBLE PRECISION NOT NULL DEFAULT 100,
  focusScore        DOUBLE PRECISION NOT NULL DEFAULT 0,
  healthScore       DOUBLE PRECISION NOT NULL DEFAULT 0,
  currentMood       TEXT,
  lifetimeQuests    INTEGER NOT NULL DEFAULT 0,
  lifetimeBosses    INTEGER NOT NULL DEFAULT 0,
  lifetimeBooks     INTEGER NOT NULL DEFAULT 0,
  lifetimeWorkouts  INTEGER NOT NULL DEFAULT 0,
  lifetimeCodingHrs DOUBLE PRECISION NOT NULL DEFAULT 0,
  lifetimeDeepWork  DOUBLE PRECISION NOT NULL DEFAULT 0,
  lifetimeJournals  INTEGER NOT NULL DEFAULT 0,
  lifetimeLearning  DOUBLE PRECISION NOT NULL DEFAULT 0,
  lifetimeProjects  INTEGER NOT NULL DEFAULT 0,
  profileFrame      TEXT,
  backgroundTheme   TEXT,
  particleEffect    TEXT,
  soundTheme        TEXT,
  settings          TEXT NOT NULL DEFAULT '{}',
  createdAt         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Profile_userId_idx" ON "Profile" ("userId");

-- ============================================
-- ATTRIBUTE
-- ============================================
CREATE TABLE IF NOT EXISTS "Attribute" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  attributeId     TEXT NOT NULL,
  level           INTEGER NOT NULL DEFAULT 1,
  currentXp       INTEGER NOT NULL DEFAULT 0,
  lifetimeXp      INTEGER NOT NULL DEFAULT 0,
  consistencyScore DOUBLE PRECISION NOT NULL DEFAULT 0,
  weeklyProgress  DOUBLE PRECISION NOT NULL DEFAULT 0,
  monthlyProgress DOUBLE PRECISION NOT NULL DEFAULT 0,
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "Attribute_profileId_attributeId_idx" ON "Attribute" ("profileId", "attributeId");
CREATE INDEX IF NOT EXISTS "Attribute_profileId_idx" ON "Attribute" ("profileId");

-- ============================================
-- QUEST
-- ============================================
CREATE TABLE IF NOT EXISTS "Quest" (
  id                TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId         TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  type              TEXT NOT NULL DEFAULT 'DAILY',
  difficulty        TEXT NOT NULL DEFAULT 'COMMON',
  xpReward          INTEGER NOT NULL DEFAULT 0,
  goldReward        INTEGER NOT NULL DEFAULT 0,
  reputationReward  INTEGER NOT NULL DEFAULT 0,
  attributeRewards  TEXT DEFAULT '[]',
  scheduledDate     TIMESTAMPTZ,
  deadline          TIMESTAMPTZ,
  estimatedMinutes  INTEGER,
  isCompleted       BOOLEAN NOT NULL DEFAULT false,
  isActive          BOOLEAN NOT NULL DEFAULT true,
  completedAt       TIMESTAMPTZ,
  identityTag       TEXT,
  isAiGenerated     BOOLEAN NOT NULL DEFAULT false,
  aiContext         TEXT,
  createdAt         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Quest_profileId_idx" ON "Quest" ("profileId");

-- ============================================
-- BOSS
-- ============================================
CREATE TABLE IF NOT EXISTS "Boss" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  difficulty      TEXT NOT NULL DEFAULT 'COMMON',
  maxHp           INTEGER NOT NULL DEFAULT 100,
  currentHp       INTEGER NOT NULL DEFAULT 100,
  totalPhases     INTEGER NOT NULL DEFAULT 1,
  currentPhase    INTEGER NOT NULL DEFAULT 1,
  phases          TEXT DEFAULT '[]',
  deadline        TIMESTAMPTZ,
  weaknesses      TEXT DEFAULT '[]',
  requiredSkills  TEXT DEFAULT '[]',
  xpReward        INTEGER NOT NULL DEFAULT 0,
  goldReward      INTEGER NOT NULL DEFAULT 0,
  titleReward     TEXT,
  achievementId   TEXT,
  isDefeated      BOOLEAN NOT NULL DEFAULT false,
  isWorldBoss     BOOLEAN NOT NULL DEFAULT false,
  defeatedAt      TIMESTAMPTZ,
  imageUrl        TEXT,
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Boss_profileId_idx" ON "Boss" ("profileId");

-- ============================================
-- BOSS SUBTASK
-- ============================================
CREATE TABLE IF NOT EXISTS "BossSubtask" (
  id          TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  bossId      TEXT NOT NULL REFERENCES "Boss"(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  damage      INTEGER NOT NULL DEFAULT 0,
  isCompleted BOOLEAN NOT NULL DEFAULT false,
  completedAt TIMESTAMPTZ,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "BossSubtask_bossId_idx" ON "BossSubtask" ("bossId");

-- ============================================
-- ENEMY PROGRESS
-- ============================================
CREATE TABLE IF NOT EXISTS "EnemyProgress" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  enemyName       TEXT NOT NULL,
  maxHp           INTEGER NOT NULL DEFAULT 100,
  currentHp       INTEGER NOT NULL DEFAULT 100,
  weakness        TEXT DEFAULT '[]',
  currentInfluence DOUBLE PRECISION NOT NULL DEFAULT 100,
  lastDamageDate  TIMESTAMPTZ,
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "EnemyProgress_profileId_enemyName_idx" ON "EnemyProgress" ("profileId", "enemyName");

-- ============================================
-- PROJECT
-- ============================================
CREATE TABLE IF NOT EXISTS "Project" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  type            TEXT DEFAULT 'SOFTWARE',
  status          TEXT DEFAULT 'active',
  startDate       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completionDate  TIMESTAMPTZ,
  progress        DOUBLE PRECISION NOT NULL DEFAULT 0,
  technologies    TEXT DEFAULT '[]',
  repositoryUrl   TEXT,
  lessonsLearned  TEXT DEFAULT '[]',
  screenshots     TEXT DEFAULT '[]',
  aiSummary       TEXT,
  embedding       TEXT,
  metrics         TEXT DEFAULT '{}',
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Project_profileId_idx" ON "Project" ("profileId");

-- ============================================
-- BOOK
-- ============================================
CREATE TABLE IF NOT EXISTS "Book" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  author          TEXT,
  coverUrl        TEXT,
  category        TEXT,
  totalPages      INTEGER,
  currentPage     INTEGER NOT NULL DEFAULT 0,
  progress        DOUBLE PRECISION NOT NULL DEFAULT 0,
  rating          INTEGER,
  status          TEXT DEFAULT 'reading',
  notes           TEXT,
  highlights      TEXT DEFAULT '[]',
  keyIdeas        TEXT DEFAULT '[]',
  actionItems     TEXT DEFAULT '[]',
  aiSummary       TEXT,
  startDate       TIMESTAMPTZ,
  completionDate  TIMESTAMPTZ,
  relatedSkills   TEXT DEFAULT '[]',
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Book_profileId_idx" ON "Book" ("profileId");

-- ============================================
-- COURSE
-- ============================================
CREATE TABLE IF NOT EXISTS "Course" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  instructor      TEXT,
  provider        TEXT,
  progress        DOUBLE PRECISION NOT NULL DEFAULT 0,
  isCompleted     BOOLEAN NOT NULL DEFAULT false,
  certificateUrl  TEXT,
  notes           TEXT,
  relatedSkills   TEXT DEFAULT '[]',
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Course_profileId_idx" ON "Course" ("profileId");

-- ============================================
-- JOURNAL ENTRY
-- ============================================
CREATE TABLE IF NOT EXISTS "JournalEntry" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  mood            TEXT,
  energyLevel     DOUBLE PRECISION,
  tags            TEXT DEFAULT '[]',
  aiReflection    TEXT,
  embedding       TEXT,
  date            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "JournalEntry_profileId_idx" ON "JournalEntry" ("profileId");

-- ============================================
-- KNOWLEDGE ITEM
-- ============================================
CREATE TABLE IF NOT EXISTS "KnowledgeItem" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  source          TEXT,
  category        TEXT,
  tags            TEXT DEFAULT '[]',
  keyIdeas        TEXT DEFAULT '[]',
  connections     TEXT DEFAULT '[]',
  relatedSkills   TEXT DEFAULT '[]',
  aiReflection    TEXT,
  embedding       TEXT,
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "KnowledgeItem_profileId_idx" ON "KnowledgeItem" ("profileId");

-- ============================================
-- ACHIEVEMENT (global definitions)
-- ============================================
CREATE TABLE IF NOT EXISTS "Achievement" (
  id          TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category    TEXT NOT NULL,
  rarity      TEXT NOT NULL,
  requirement TEXT NOT NULL,
  iconUrl     TEXT,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- USER ACHIEVEMENT (profile -> achievement)
-- ============================================
CREATE TABLE IF NOT EXISTS "UserAchievement" (
  id            TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId     TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  achievementId TEXT NOT NULL REFERENCES "Achievement"(id) ON DELETE CASCADE,
  unlockedAt    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reflection    TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserAchievement_profileId_achievementId_idx" ON "UserAchievement" ("profileId", "achievementId");
CREATE INDEX IF NOT EXISTS "UserAchievement_profileId_idx" ON "UserAchievement" ("profileId");

-- ============================================
-- TITLE (global definitions)
-- ============================================
CREATE TABLE IF NOT EXISTS "Title" (
  id          TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  requirement TEXT NOT NULL,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- USER TITLE (profile -> title)
-- ============================================
CREATE TABLE IF NOT EXISTS "UserTitle" (
  id        TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  titleId   TEXT NOT NULL REFERENCES "Title"(id) ON DELETE CASCADE,
  unlockedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserTitle_profileId_titleId_idx" ON "UserTitle" ("profileId", "titleId");
CREATE INDEX IF NOT EXISTS "UserTitle_profileId_idx" ON "UserTitle" ("profileId");

-- ============================================
-- USER IDENTITY
-- ============================================
CREATE TABLE IF NOT EXISTS "UserIdentity" (
  id            TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId      TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  tier           INTEGER NOT NULL DEFAULT 1,
  progress       DOUBLE PRECISION NOT NULL DEFAULT 0,
  isUnlocked     BOOLEAN NOT NULL DEFAULT false,
  unlockedAt     TIMESTAMPTZ,
  requirement    TEXT,
  evolutionPath  TEXT DEFAULT '[]',
  createdAt      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserIdentity_profileId_name_idx" ON "UserIdentity" ("profileId", "name");
CREATE INDEX IF NOT EXISTS "UserIdentity_profileId_idx" ON "UserIdentity" ("profileId");

-- ============================================
-- FUTURE SELF
-- ============================================
CREATE TABLE IF NOT EXISTS "FutureSelf" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  archetype       TEXT NOT NULL DEFAULT 'Visionary',
  vision          TEXT NOT NULL,
  targets         TEXT DEFAULT '[]',
  targetAttributes TEXT DEFAULT '{}',
  targetLevel     INTEGER NOT NULL DEFAULT 100,
  alignmentScore  DOUBLE PRECISION NOT NULL DEFAULT 0,
  isActive        BOOLEAN NOT NULL DEFAULT true,
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "FutureSelf_profileId_idx" ON "FutureSelf" ("profileId");

-- ============================================
-- XP EVENT
-- ============================================
CREATE TABLE IF NOT EXISTS "XpEvent" (
  id            TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId     TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  amount        INTEGER NOT NULL,
  source        TEXT NOT NULL,
  sourceId      TEXT,
  description   TEXT,
  levelBefore   INTEGER NOT NULL,
  levelAfter    INTEGER NOT NULL,
  createdAt     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "XpEvent_profileId_idx" ON "XpEvent" ("profileId");

-- ============================================
-- STREAK RECORD
-- ============================================
CREATE TABLE IF NOT EXISTS "StreakRecord" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  category        TEXT NOT NULL,
  currentStreak   INTEGER NOT NULL DEFAULT 0,
  longestStreak   INTEGER NOT NULL DEFAULT 0,
  lastActiveDate  TIMESTAMPTZ,
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "StreakRecord_profileId_category_idx" ON "StreakRecord" ("profileId", "category");

-- ============================================
-- USER REWARD
-- ============================================
CREATE TABLE IF NOT EXISTS "UserReward" (
  id          TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId   TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  goldCost    INTEGER NOT NULL DEFAULT 0,
  isRedeemed  BOOLEAN NOT NULL DEFAULT false,
  redeemedAt  TIMESTAMPTZ,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "UserReward_profileId_idx" ON "UserReward" ("profileId");

-- ============================================
-- NOTIFICATION
-- ============================================
CREATE TABLE IF NOT EXISTS "Notification" (
  id          TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId   TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  isRead      BOOLEAN NOT NULL DEFAULT false,
  data        TEXT,
  createdAt   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Notification_profileId_idx" ON "Notification" ("profileId");

-- ============================================
-- HABIT
-- ============================================
CREATE TABLE IF NOT EXISTS "Habit" (
  id              TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  profileId       TEXT NOT NULL REFERENCES "Profile"(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  identityTag     TEXT,
  frequency       TEXT NOT NULL DEFAULT 'DAILY',
  currentStreak   INTEGER NOT NULL DEFAULT 0,
  longestStreak   INTEGER NOT NULL DEFAULT 0,
  totalCompletions INTEGER NOT NULL DEFAULT 0,
  lastCompletedAt TIMESTAMPTZ,
  createdAt       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedAt       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Habit_profileId_idx" ON "Habit" ("profileId");
