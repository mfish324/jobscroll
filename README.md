# JobScroll

A calm, infinite-scroll job board for professionals who want to stay aware of opportunities without the pressure of active job searching.

## Setup

1. Copy `.env.example` to `.env.local` and add your database URL:
   ```bash
   cp .env.example .env.local
   ```

2. Sync Prisma schema from genz-jobs:
   ```bash
   ./sync-schema.sh
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Important: Schema Sync

This app shares a database with genz-jobs. **Never run migrations from this repo.**

The schema source of truth is in the genz-jobs repository. After any schema changes there:

```bash
./sync-schema.sh
```

This will:
1. Copy the schema from genz-jobs
2. Regenerate the Prisma client

## Stack

- **Framework:** Next.js 14 + React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **ORM:** Prisma (shared DB with genz-jobs)
- **Database:** Neon PostgreSQL

## Project Structure

```
jobscroll/
├── prisma/
│   └── schema.prisma        # Synced from genz-jobs
├── src/
│   ├── app/
│   │   ├── api/jobs/        # Jobs API route
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── job-card.tsx
│   │   ├── job-card-skeleton.tsx
│   │   ├── job-feed.tsx
│   │   ├── filters-bar.tsx
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── lib/
│       ├── db.ts
│       ├── types.ts
│       ├── utils.ts
│       └── queries/
│           └── jobs.ts
├── .env.example
├── sync-schema.sh
└── README.md
```

## Design Principles

- **Calm:** No gamification, no streaks, no guilt
- **Age-neutral:** Not Gen-Z focused, not corporate sterile
- **Passive:** Like reading the morning paper
- **Trustworthy:** RJRP-verified jobs get a trust badge
- **Low-friction:** No account required to browse
