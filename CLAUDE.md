# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npx prisma generate  # Regenerate Prisma client after schema changes
./sync-schema.sh     # Sync schema from ../genzjobs and regenerate client
```

## Architecture

JobScroll is a **read-only** job browsing app that shares a PostgreSQL database with genz-jobs. It displays jobs in an infinite-scroll feed with a calm, low-pressure design.

### Database Constraint
- **Never run migrations from this repo** — schema source of truth is genz-jobs at `../genzjobs`
- The Prisma schema maps to the `job_listings` table via `@@map("job_listings")`
- Uses Prisma 7 with `@prisma/adapter-pg` for database connections
- Connection configured in `prisma/prisma.config.ts`, which loads `.env.local` via dotenv
- `DATABASE_URL` is the only required env var

### Data Flow
1. `src/app/page.tsx` — Root server component. Wraps a nested `JobList` server component in `<Suspense>` for streaming; this is why filters can be applied server-side while showing a skeleton.
2. `src/lib/queries/jobs.ts` — Single query function `getJobScrollJobs(filters, cursor, limit)` with cursor-based pagination (take N+1, slice, return nextCursor).
3. `src/app/api/jobs/route.ts` — Thin GET handler; reads URL params, calls `getJobScrollJobs`, returns JSON.
4. `src/components/job-feed.tsx` — Client component; owns job list state, resets when `initialJobs` prop changes (filter change), triggers `loadMore` via IntersectionObserver.

### Filter URL Params
Filters are stored in the URL so they are shareable and drive SSR. The param names used by both `filters-bar.tsx` and `route.ts`:

| Param | Type | Example |
|---|---|---|
| `search` | string | `search=engineer` |
| `location` | string | `location=NYC` |
| `remote` | `"true"` | `remote=true` |
| `salaryMin` | number string | `salaryMin=100000` |
| `verified` | `"true"` | `verified=true` |
| `levels` | comma-separated | `levels=MID,SENIOR` |

`salaryMin` filters by `salaryMax >= salaryMin` (not `salaryMin >= value`) — i.e., the job's ceiling salary must meet the minimum. The `levels` filter supports `MID`, `SENIOR`, `EXECUTIVE`; `ENTRY` is not exposed in the UI.

### Key Patterns
- `src/lib/types.ts` exports the `Job` interface — a manually maintained subset of the Prisma model used for passing data from server to client. If the schema changes, update this type too.
- `filters-bar.tsx` debounces text inputs (search, location) by 300ms; toggles and selects update the URL immediately.
- The Prisma client singleton in `src/lib/db.ts` uses `globalThis` to survive Next.js HMR in dev.

### Design Guidelines
- Calm, age-neutral aesthetic — no gamification or pressure tactics
- Teal accent color (`teal-600`), warm off-white background (`stone-50`)
- RJRP-verified jobs display a trust badge (`isRjrpVerified`)
