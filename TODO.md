# TODO — Make Ascension OS Ready for Daily Use

## Phase 0: Verification Blockers (must fix before daily use)
- [x] Ran `npm run lint` and captured blockers (hard errors currently prevent daily use).
- [ ] Fix hard TypeScript/ESLint errors so `npm run lint` passes (current failing areas: `src/app/actions.ts` parse error, unescaped quotes, explicit `any`, `setState` in effect, Tailwind config `require()` import rule).

- [ ] Ensure `npm run build` completes successfully.
- [ ] Ensure `npx prisma db push` succeeds with current schema.


## Phase 1: Runtime / UX Correctness
- [ ] Confirm Mentor chat streaming works end-to-end and UI renders assistant output correctly.
- [ ] Confirm MorningBriefing widget loads without React warnings and does not crash.
- [ ] Confirm Sidebar user display is dynamic (remove hardcoded Tafhim/Rank).

## Phase 2: Delivery Readiness
- [ ] Add missing empty/loading states where required.
- [ ] Add daily-use checklist to README (env vars, Ollama, seed steps).
- [ ] Re-run verification steps: build, lint, prisma push, quick navigation smoke test.

