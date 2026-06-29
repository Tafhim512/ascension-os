# Ascension OS — Evolution Roadmap
## From Productivity App to the World's Most Advanced AI Life Operating System

---

## V1 Audit — Current State Assessment

### Architecture Overview

| Component | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.2.9 (App Router, Turbopack) | Solid foundation |
| Database | SQLite via Prisma | Fast local dev, single-user ready |
| AI Backend | Ollama (llama3.1 + nomic-embed-text) | Local, private, no API costs |
| RAG System | Custom cosine-similarity over JSON embeddings | Functional for <10K entries |
| State | Server Components + Server Actions | Good pattern, minimal client state |
| UI | TailwindCSS + shadcn/ui + Framer Motion | Premium dark theme |
| Auth | Mock (hardcoded dev profile) | Must evolve |

### Module Scores (1-10)

| Module | Score | Strengths | Weaknesses |
|---|---|---|---|
| **Command Center** | 7/10 | Clean dashboard, live stats, boss/quest widgets | No customizable widgets, no morning briefing, no drag-and-drop |
| **Quests** | 8/10 | Create/complete flow, AI generation, difficulty tiers, attribute rewards | No recurring quests, no quest chains, no templates, no subtasks |
| **Attributes** | 6/10 | XP bars, levels, consistency scores | No skill trees rendered, no sub-skill tracking UI, no custom progression paths |
| **Bosses** | 8/10 | Subtask damage system, HP bars, phase structure in schema | Phase transitions not implemented in UI, no custom artwork, no AI boss coaching |
| **Journal** | 6/10 | Entries display, mood/energy, AI reflection | No rich text, no tagging UI, no search, no AI conversation, no entry editing |
| **Legacy** | 5/10 | Project list, books column | Knowledge section is "coming soon" placeholder, no PDF export, no timeline, no yearbook |
| **World Map** | 6/10 | Beautiful alternating timeline, world unlocking | Purely decorative, integrations are placeholder buttons, no actual visual world evolution |
| **Analytics** | 5/10 | XP chart, attribute radar, power score breakdown | Only 2 charts, no custom time ranges, no AI insights, no custom KPIs |
| **Settings** | 3/10 | Minimal — shows DB status and theme lock | No customization, no profile editing, no notification prefs, no data export |
| **Second Brain** | 7/10 | Knowledge nodes with AI auto-tagging, semantic search placeholder | No actual graph visualization, no cross-linking, no search bar |
| **AI Mentor** | 7/10 | RAG-enhanced insights, memory-grounded, evidence-based prompting | Single-shot insight only, no conversation, no proactive coaching, no morning/evening briefing |
| **RPG Engine** | 8/10 | XP curves, momentum decay, streak tiers, rank thresholds, achievements | Achievements not triggered automatically, power score not recalculated on events |
| **Habits** | 6/10 | Basic create/complete, streak tracking | No analytics, no identity alignment visualization, no reminders |

### Overall V1 Score: **6.3/10**

---

## Gap Analysis — What's Missing

### Missing Systems

| System | Priority | Dependency |
|---|---|---|
| **AI Chat Interface** (talk to The System) | 🔴 Critical | AI Client exists |
| **Future Self Engine** (define/track/compare) | 🔴 Critical | Profile schema partial |
| **Learning OS** (courses, books, flashcards) | 🟡 High | Course/Book schema exists |
| **Project Workspace** (milestones, risks, docs) | 🟡 High | Project schema exists |
| **Startup OS** (validation, revenue, launches) | 🟡 High | Project type exists |
| **Knowledge Graph Visualization** | 🟡 High | Embeddings exist |
| **Living World Engine** (visual evolution) | 🟢 Medium | World Map exists |
| **Legacy/Yearbook Engine** (PDF reports) | 🟢 Medium | Legacy page exists |
| **Life Intelligence Engine** (pattern detection) | 🟢 Medium | Analytics page exists |
| **Integration Layer** (GitHub, Calendar, Health) | 🟢 Medium | Placeholder UI exists |
| **Plugin/Module System** | 🔵 Future | Architecture needed |
| **Notification Engine** | 🔵 Future | Schema exists |
| **Authentication** (real users) | 🔵 Future | Mock auth exists |

### Missing AI Capabilities

- ❌ Conversational AI interface (chat with The System)
- ❌ Proactive coaching (morning briefing, evening review)
- ❌ Pattern detection across time (behavioral analytics)
- ❌ AI-driven quest chains (multi-day plan generation)
- ❌ AI journal reflections generated in real-time (currently static)
- ❌ AI project coaching (next steps, risk analysis)
- ❌ Strength/weakness detection from attribute data
- ❌ Future Self gap analysis with AI recommendations
- ❌ Natural language search across all data

### Missing UX Capabilities

- ❌ Onboarding flow (first-time user experience)
- ❌ Keyboard shortcuts beyond Cmd+K
- ❌ Drag-and-drop on any page
- ❌ Inline editing (quests, journal entries, projects)
- ❌ Toast notifications for completions/level-ups
- ❌ Celebration animations (confetti, level-up modals)
- ❌ Sound effects / ambient mode
- ❌ Responsive mobile navigation improvements
- ❌ Loading states and skeleton screens
- ❌ Empty state improvements with guided actions

### Architecture Weaknesses

- ⚠️ **Monolithic actions.ts** — 522 lines, all server actions in one file
- ⚠️ **No input validation** — Server actions trust client data
- ⚠️ **No error boundaries** — App crashes propagate to white screens
- ⚠️ **Achievement engine disconnected** — Defined but never auto-triggered
- ⚠️ **Power score not recalculated** — Static after initial seed
- ⚠️ **No optimistic UI** — Every action requires full page refresh
- ⚠️ **Sidebar hardcodes user data** — Shows "Tafhim" and "Rank B • Lvl 10" statically

---

## Evolution Roadmap

### Guiding Principles

1. **Never break working systems** — All V1 features continue functioning
2. **AI at the center** — Every new feature should leverage the AI
3. **Modular architecture** — New systems in `src/lib/modules/`, not monolithic files
4. **Progressive enhancement** — Each version builds on the last
5. **Evidence over hype** — AI insights grounded in user data, never fake

---

## V2 — THE INTELLIGENCE CORE
> *"The System awakens."*

**Goal**: Transform the AI Mentor from a single-shot insight widget into the intelligent brain of Ascension OS. Build the conversational AI interface, proactive coaching, and Future Self Engine.

**Estimated Scope**: ~25 files modified/created

---

### 2.1 — AI Chat Interface ("Talk to The System")

A full conversational AI interface where users can talk to The System about their goals, struggles, projects, and get evidence-based coaching grounded in their own data via RAG.

#### [NEW] `src/app/mentor/page.tsx`
Full-page AI chat interface with message history, conversation display, and input box. Styled as a premium terminal/chat hybrid.

#### [NEW] `src/components/mentor/chat-interface.tsx`
Client component: message list, markdown rendering, typing indicator, auto-scroll, local message state.

#### [NEW] `src/components/mentor/chat-input.tsx`
Client component: text area with send button, Shift+Enter for newlines, loading state.

#### [NEW] `src/app/api/ai/chat/route.ts`
Streaming API endpoint. Accepts user message + conversation history. Calls `searchMemories()` for RAG context, constructs system prompt with user profile + memories, streams response from Ollama.

#### [NEW] `src/lib/ai/conversation.ts`
Conversation management: format history for prompt, trim to token limits, inject RAG context, maintain system persona consistency.

#### [MODIFY] `src/components/shared/sidebar.tsx`
Add "Mentor" nav item between "Second Brain" and "Bosses".

---

### 2.2 — Proactive AI Coaching

#### [NEW] `src/lib/ai/briefing.ts`
- `generateMorningBriefing(profile)` — Reviews yesterday's data, today's active quests, boss status, habit streaks. Generates a concise "Here's your day" briefing.
- `generateEveningReview(profile)` — Reviews completed quests, journal entries, momentum change. Generates a "Here's what happened" reflection.

#### [NEW] `src/components/dashboard/morning-briefing.tsx`
Dashboard widget that appears at top of Command Center. Shows the AI briefing, time-aware (morning vs evening mode). Cacheable for 6 hours.

#### [MODIFY] `src/app/page.tsx`
Insert `<MorningBriefing />` widget at the top of the dashboard.

---

### 2.3 — Future Self Engine

Transform the existing schema (FutureSelf model exists but is barely used) into a full comparison engine.

#### [NEW] `src/app/future-self/page.tsx`
Full page to define, view, and evolve Future Self profiles. Shows current vs future self comparison, alignment score with animated gauge, gap analysis cards, and AI-generated recommendations.

#### [NEW] `src/components/future-self/vision-editor.tsx`
Modal/form to create or edit Future Self vision with target attributes, target level, target skills, and timeline.

#### [NEW] `src/components/future-self/alignment-gauge.tsx`
Animated circular gauge showing alignment score (0-100%) with breakdown by category.

#### [NEW] `src/components/future-self/gap-analysis.tsx`
Cards showing gap between current and target for each dimension (attributes, habits, projects, knowledge).

#### [NEW] `src/lib/ai/future-self.ts`
- `calculateAlignmentScore(profile, futureSelf)` — Computes alignment from attribute levels, habit consistency, project progress, etc.
- `generateGapAnalysis(profile, futureSelf)` — AI-generated actionable recommendations to close gaps.

#### [MODIFY] `prisma/schema.prisma`
Extend FutureSelf model: remove `@unique` on profileId to allow multiple profiles, add `targetAttributes` JSON, `targetLevel`, `isActive`, `archetype` fields.

#### [MODIFY] `src/components/shared/sidebar.tsx`
Add "Future Self" nav item.

---

### 2.4 — Architecture Hardening

#### [MODIFY] `src/app/actions.ts` → Split into:
- `src/app/actions/quest-actions.ts`
- `src/app/actions/boss-actions.ts`
- `src/app/actions/journal-actions.ts`
- `src/app/actions/project-actions.ts`
- `src/app/actions/knowledge-actions.ts`
- `src/app/actions/habit-actions.ts`
- `src/app/actions/profile-actions.ts`

#### [NEW] `src/lib/validation/schemas.ts`
Zod schemas for all server action inputs.

#### [NEW] `src/components/shared/error-boundary.tsx`
React error boundary wrapping all pages.

#### [NEW] `src/components/shared/toast-provider.tsx`
Toast notification system for XP gains, level-ups, achievement unlocks, boss defeats.

#### [MODIFY] `src/components/shared/sidebar.tsx`
Make user info dynamic (read from profile, not hardcoded).

#### [NEW] `src/lib/engine/achievement-checker.ts`
Auto-trigger achievement checks after quest completion, boss defeat, and level-up events.

#### [NEW] `src/lib/engine/power-score-calculator.ts`
Recalculate power score dynamically on every relevant event.

---

## V3 — THE SECOND BRAIN
> *"Knowledge becomes power."*

**Goal**: Transform the Brain page from a list of notes into a genuine Second Brain with semantic search, knowledge graph visualization, cross-linking, and AI-powered organization.

---

### 3.1 — Semantic Search Interface

#### [NEW] `src/components/brain/search-bar.tsx`
Natural language search bar with real-time results. Uses embeddings for semantic matching.

#### [NEW] `src/app/api/brain/search/route.ts`
API endpoint that calls `searchMemories()` across all types, returns ranked results.

---

### 3.2 — Knowledge Graph Visualization

#### [NEW] `src/components/brain/knowledge-graph.tsx`
Interactive 2D graph using a lightweight canvas library (e.g., `@react-sigma/core` or custom Canvas2D). Nodes = knowledge items, journals, projects. Edges = semantic similarity > threshold. Color-coded by category.

#### [NEW] `src/lib/ai/graph-builder.ts`
Builds adjacency list from embedding similarities. Computes clusters. Identifies central "hub" concepts.

---

### 3.3 — Enhanced Knowledge Items

#### [MODIFY] `src/app/brain/page.tsx`
Add search bar, graph toggle, improved filtering by category/tags.

#### [NEW] `src/components/brain/knowledge-detail.tsx`
Expandable detail view showing full content, connections, related items, AI reflection.

#### [MODIFY] `src/app/actions/knowledge-actions.ts`
Add auto-linking: when a new item is created, find top 3 similar items and store connections.

---

## V4 — THE WORKSPACE ENGINE
> *"Every project deserves its own world."*

**Goal**: Transform Projects from simple progress bars into full workspaces with milestones, tasks, documentation, and AI coaching. Add startup-specific tools.

---

### 4.1 — Project Workspaces

#### [MODIFY] `src/app/projects/[id]/page.tsx`
Complete rewrite into a workspace dashboard: overview, milestones timeline, task board, documentation, lessons learned, AI project coach widget.

#### [NEW] `src/components/projects/milestone-timeline.tsx`
Visual timeline of project milestones with status indicators.

#### [NEW] `src/components/projects/task-board.tsx`
Kanban-style task board (To Do → In Progress → Done) for project tasks.

#### [NEW] `src/components/projects/project-ai-coach.tsx`
AI widget that analyzes project progress and suggests next actions, identifies risks, recommends retrospective questions.

#### [MODIFY] `prisma/schema.prisma`
Add `ProjectMilestone`, `ProjectTask`, `ProjectDecision`, `ProjectRetrospective` models.

---

### 4.2 — Startup Tools

#### [NEW] `src/components/projects/startup-dashboard.tsx`
Startup-specific project view with: validation checklist, customer interviews log, revenue tracker, growth metrics, launch checklist.

#### [MODIFY] `prisma/schema.prisma`
Add `StartupMetric`, `CustomerInterview` models.

---

## V5 — THE LEARNING ENGINE
> *"Become a knowledge machine."*

**Goal**: Build a complete learning management system integrated with the RPG engine. Books, courses, learning paths, skill mastery tracking.

---

### 5.1 — Enhanced Book Tracker

#### [NEW] `src/app/library/page.tsx`
Full library page: reading list, currently reading, completed, book notes, AI summaries.

#### [NEW] `src/components/library/book-detail.tsx`
Book detail with highlights, key ideas, action items, related knowledge items, reading progress.

---

### 5.2 — Learning Paths

#### [NEW] `src/app/learning/page.tsx`
Custom learning paths: user-defined curriculums linking books, courses, and knowledge items into structured paths with mastery tracking.

#### [NEW] `prisma/schema.prisma` additions
`LearningPath`, `LearningPathItem`, `SkillMastery` models.

---

## V6 — THE LIVING WORLD
> *"Your reality transforms the digital world."*

**Goal**: Make the World Map dynamically evolve based on real achievements. Buildings appear, landscapes change, the avatar evolves.

---

### 6.1 — Visual World Evolution

#### [MODIFY] `src/app/world/page.tsx`
Replace static world list with an interactive visual map. Buildings unlock based on achievements (Library = 5 books read, Laboratory = 3 projects completed, etc.).

#### [NEW] `src/components/world/world-canvas.tsx`
Canvas/SVG-based interactive world with animated buildings, particles, and unlock animations.

#### [NEW] `src/lib/engine/world-evolution.ts`
Rules engine: maps achievement/stat thresholds to world elements.

---

### 6.2 — Integration Layer

#### [NEW] `src/lib/integrations/github.ts`
GitHub integration: map commits to XP, PRs to quests, repos to projects.

#### [NEW] `src/lib/integrations/calendar.ts`
Google Calendar integration: sync events, auto-create quests from calendar items.

#### [NEW] `src/app/settings/integrations/page.tsx`
Integration management page with connect/disconnect flows.

---

## V7 — THE LEGACY ENGINE
> *"Your story, beautifully told."*

**Goal**: Generate beautiful life reviews, timelines, and exportable portfolio/yearbook documents.

---

### 7.1 — Life Reviews

#### [MODIFY] `src/app/legacy/page.tsx`
Complete evolution: timeline view, achievement museum, story chapters, portfolio mode.

#### [NEW] `src/lib/ai/life-review.ts`
AI-generated monthly/quarterly/annual life reviews from aggregated data.

#### [NEW] `src/components/legacy/timeline.tsx`
Interactive timeline visualization of user's journey.

---

### 7.2 — Life Intelligence Engine

#### [MODIFY] `src/app/analytics/page.tsx`
Transform from basic charts into an AI-driven intelligence dashboard with NLP insights.

#### [NEW] `src/lib/ai/intelligence.ts`
Pattern detection engine: analyzes time-series data from XP events, journal entries, habit completions to generate insights like "You complete 40% more quests on days you journal in the morning."

---

## User Review Required

> [!IMPORTANT]
> **Version Prioritization**: The roadmap is ordered V2→V7 by dependency and user value. V2 (Intelligence Core) must come first because every subsequent version depends on the enhanced AI. Do you agree with this ordering, or would you like to reprioritize?

> [!IMPORTANT]
> **Scope Per Session**: Each version (V2-V7) is a substantial body of work. I recommend implementing **one version at a time**, getting your approval at each stage. Should I begin with V2?

> [!WARNING]
> **Authentication**: The current system uses a hardcoded dev profile. Real authentication (NextAuth, Supabase Auth, etc.) is not included in V2-V7 because the vision describes a single-user "Personal OS." If you need multi-user support, we should discuss this before V2.

> [!IMPORTANT]
> **AI Backend**: All AI features depend on Ollama running locally. If you want cloud AI (OpenAI, Anthropic, Gemini) as a fallback, this should be decided before V2 implementation.

---

## Open Questions

1. **Implementation Start**: Shall I begin implementing V2 (The Intelligence Core) now?
2. **AI Backend**: Stay local-only with Ollama, or add cloud AI provider support?
3. **Database**: Stay with SQLite for now, or migrate to PostgreSQL before V2?
4. **Authentication**: Keep single-user dev mode, or implement real auth in V2?
5. **Sound/Music**: Should ambient sound effects be included in V2 or deferred?

---

## Verification Plan

### Per-Version Verification

For each version, I will:

1. **Build Check** — Run `npm run build` to ensure zero compilation errors
2. **Runtime Check** — Run `npm run dev` and navigate every page via browser
3. **Feature Test** — Interact with every new feature via browser subagent
4. **Regression Test** — Verify all V1 features still function correctly
5. **Schema Validation** — Run `npx prisma db push` to verify migrations

### Manual Verification
- You will review the live app after each version
- Critical UI changes will be captured as browser recordings
