# TODO — Make Ascension OS Ready for Daily Use

## Phase 0: Verification Blockers (must fix before daily use)
- [x] Ran `npm run lint` and captured blockers (hard errors currently prevent daily use).
- [x] Fix hard TypeScript/ESLint errors so `npm run lint` passes.
- [x] Ensure `npm run build` completes successfully.
- [x] Ensure `npx prisma db push` succeeds with current schema.


## Phase 1: Runtime / UX Correctness
- [x] Confirm Mentor chat streaming works end-to-end and UI renders assistant output correctly.
- [x] Confirm MorningBriefing widget loads without React warnings and does not crash.
- [x] Confirm Sidebar user display is dynamic (remove hardcoded Tafhim/Rank).

## Phase 2: Delivery Readiness
- [x] Add missing empty/loading states where required.
- [x] Add daily-use checklist to README (env vars, Ollama, seed steps).
- [x] Re-run verification steps: build, lint, prisma push, quick navigation smoke test.

## Completed
- [x] Fix 63 lint errors across pages, components, lib, and config
- [x] Replace all explicit `any` with proper Prisma types or interfaces
- [x] Fix `SidebarContent` component-defined-in-render → extracted to module-scope
- [x] Fix `setState` in `useEffect` in morning-briefing and ai-insight widgets
- [x] Fix `/login` `useSearchParams` wrapped in `<Suspense>` boundary
- [x] Fix unescaped quotes in JSX → HTML entities
- [x] Fix `tailwind.config.ts` `require()` → ESM import
- [x] Fix Supabase cookie types in `server.ts` and `proxy.ts`
- [x] Configure Vercel: `output: standalone`, AI routes 60s maxDuration, `iad1`
- [x] TypeScript strict pass (`tsc --noEmit` exit 0)
- [x] Next.js build succeed (all 22 routes generated)
- [x] Prisma schema pushed to SQLite dev DB
- [x] Push commit `bc83c84` to `origin/main`
