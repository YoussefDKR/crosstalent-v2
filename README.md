# CrossTalent

**Great talent. Better opportunities. Beyond borders.**

Premium recruitment SaaS connecting North African professionals with European companies.

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (Auth, PostgreSQL, Storage, Realtime) — upcoming phases
- Lucide React + Framer Motion

## Getting Started

```bash
npm install
cp .env.example .env.local
```

Add your Supabase URL and anon key to `.env.local`, then run the SQL migration in [`supabase/README.md`](supabase/README.md).

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (`npm run dev` uses port **3001** by default).

### Auth routes

| Route | Purpose |
|-------|---------|
| `/signup?role=candidate` | Candidate registration (free) |
| `/signup?role=employer` | Employer registration |
| `/login` | Sign in |
| `/candidate/dashboard` | Candidate home (protected) |
| `/employer/dashboard` | Employer home (protected) |
| `/jobs` | Public job board with filters |
| `/jobs/[id]` | Job detail |
| `/employer/jobs` | Manage job posts (employer) |
| `/employer/candidates` | Search candidates (employer) |
| `/employer/candidates/[id]` | Candidate profile (employer) |
| `/employer/messages` | Employer inbox |
| `/candidate/messages` | Candidate inbox |
| `/pricing` | Employer plans (public) |
| `/employer/billing` | Subscription & checkout |
| `/docs/stripe` | Stripe setup guide |

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Public landing & marketing pages
│   ├── (auth)/          # Login, signup
│   ├── candidate/       # Candidate area (protected)
│   ├── employer/        # Employer area (protected)
│   └── auth/            # Callback, signout
│   └── layout.tsx
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── layout/          # Header, footer
│   ├── landing/         # Landing page sections
│   └── shared/
├── config/              # Site config & static content
├── lib/                 # Utilities, Supabase clients (later)
└── types/
```

## Build Phases

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Landing page | ✅ |
| 2 | Authentication | ✅ |
| 3 | Candidate dashboard + profile | ✅ |
| 4 | Employer dashboard + company profile | ✅ |
| 5 | Job board | ✅ |
| 6 | Candidate search | ✅ |
| 7 | Real-time messaging | ✅ |
| 8 | Subscriptions (Stripe) | ✅ (configure keys when ready) |

## Design Tokens

- Primary: `#0F172A`
- Accent: `#2563EB`
- Success: `#10B981`
