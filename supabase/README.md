# Supabase setup

## 1. Create a project

Create a project at [supabase.com](https://supabase.com) and copy the **Project URL** and **anon key** into `.env.local`.

## 2. Run migrations (in order)

Open **SQL Editor** in your Supabase project and run each file **in this order**:

1. `migrations/20250601000000_profiles_and_rls.sql` — **required for login/signup**
2. `migrations/20250602000000_candidate_profile.sql` — candidate profile, CV, skills
3. `migrations/20250603000000_backfill_profiles.sql` — fixes existing accounts missing a profile
4. `migrations/20250604000000_fix_rls_recursion.sql` — **run if saves fail with "infinite recursion"**
5. `migrations/20250605000000_company_profile.sql` — employer company profiles (Phase 4)
6. `migrations/20250606000000_jobs.sql` — job posts and public job board (Phase 5)
7. `migrations/20250606100000_jobs_publish_on_insert.sql` — optional; fixes `published_at` on first publish (app also sets this)
8. `migrations/20250607000000_messaging.sql` — conversations, messages, realtime (Phase 7)

After step 8, enable **Realtime** for the `messages` table in Supabase Dashboard if inserts do not stream live (Database → Publications → `supabase_realtime`).

9. `migrations/20250608000000_employer_subscriptions.sql` — employer billing / Stripe (Phase 8)

Stripe setup (when ready): see [`docs/STRIPE.md`](../docs/STRIPE.md) and in-app `/docs/stripe`.

10. `migrations/20250609000000_profile_images.sql` — profile photos & company logos (Storage, WebP)
11. `migrations/20250609100000_fix_profile_images_rls.sql` — **run if upload fails with RLS error**
12. `migrations/20250609200000_messaging_profile_access.sql` — messaging shows correct names (not "User")
13. `migrations/20250610000000_job_applications.sql` — candidates apply to jobs; employer inbox on home
14. `migrations/20250611000000_notification_reads.sql` — notification read state
15. `migrations/20250612000000_google_oauth.sql` — Google OAuth signup role intents
16. `migrations/20250613000000_rss_jobs.sql` — curated remote jobs from RSS feeds
17. `migrations/20250614000000_admin_role_enum.sql` — add `admin` to `user_role` (**run alone first**)
18. `migrations/20250614100000_admin_role_functions.sql` — admin helpers + triggers (**run second**)
19. `migrations/20250615000000_employer_trial.sql` — 30-day employer trial + candidate/job gating
20. `migrations/20250616000000_signup_country.sql` — signup country on profiles
21. `migrations/20250616100000_site_visits.sql` — admin analytics (daily visits, top pages)
22. `migrations/20250617000000_saved_jobs_and_alerts.sql` — candidate saved jobs & job alerts
23. `migrations/20250617100000_profile_moderation.sql` — admin suspend/ban flag on profiles
24. `migrations/20250617200000_candidate_email_log.sql` — throttle profile nudge & job digest emails
25. `migrations/20250619000000_email_log_recipient.sql` — store recipient email on send log
26. `migrations/20250620000000_application_email_log_types.sql` — log application transactional emails in admin

> **Supabase SQL Editor:** PostgreSQL cannot use a new enum value in the same transaction that adds it. Run step 17, wait for success, then run step 18 in a **new** query tab.

After step 16, set `CRON_SECRET` and `RESEND_API_KEY` in Vercel, then run a one-time job sync:

```bash
curl -X POST "https://www.crosstalent.io/api/jobs/sync-rss" -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Candidate emails** (profile reminders + weekly job digest) run automatically **Mondays at 09:00 UTC** via `/api/cron/candidate-emails` (same `CRON_SECRET`). Manual test:

```bash
curl -X POST "https://www.crosstalent.io/api/cron/candidate-emails" -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Sources: Jobicy, We Work Remotely, Remotive, RemoteOK (see `src/lib/jobs/job-sources.ts`).

### Promote an admin (after steps 17–18)

Admins cannot self-signup. In Supabase **SQL Editor**, run (replace the email):

```sql
alter table public.profiles disable trigger profiles_role_immutable;

update public.profiles
set role = 'admin'
where email = 'you@example.com';

alter table public.profiles enable trigger profiles_role_immutable;
```

The trigger normally blocks role changes; disabling it briefly is safe for this one-time promotion.

Sign out and sign in again — you will land on `/admin/dashboard`.

If you already signed up before step 1, run step 3 (or all three) and sign in again.

Or with the Supabase CLI:

```bash
supabase link --project-ref YOUR_REF
supabase db push
```

## 3. Auth settings

In **Authentication → URL configuration**, set:

- **Site URL:** `http://localhost:3001` (matches `NEXT_PUBLIC_APP_URL` in `.env.local`)
- **Redirect URLs:** `http://localhost:3001/auth/callback`

Production (canonical host is **www**):

- **Site URL:** `https://www.crosstalent.io`
- **Redirect URLs:** `https://www.crosstalent.io/auth/callback` (keep apex callback too if users land on bare domain before redirect)

For local development without email confirmation, disable **Confirm email** under **Authentication → Providers → Email** (optional).

### Google sign-in

1. Run migration `migrations/20250612000000_google_oauth.sql` (OAuth signup role intents).
2. In [Google Cloud Console](https://console.cloud.google.com/), create an OAuth client (Web application).
   - **Authorized JavaScript origins:** `http://localhost:3001`, `https://www.crosstalent.io`, `https://crosstalent.io`
   - **Authorized redirect URI:** your Supabase callback, e.g. `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
3. In Supabase → **Authentication → Providers → Google**, enable Google and paste the **Client ID** and **Client secret**.
4. Confirm **Redirect URLs** (step 3 above) include every domain users sign in from.

Users can **Sign in with Google** on `/login` or **Sign up with Google** on `/signup` (after choosing candidate or employer).

## 4. What the migration creates

- `profiles` table linked to `auth.users`
- `user_role` enum: `candidate` | `employer`
- Trigger to create a profile on signup (role from `raw_user_meta_data`)
- Trigger to **block role changes** after registration
- **RLS policies:**
  - Users read/update their own profile
  - Employers can read **candidate** profiles only (not other employers)
  - Candidates cannot read other users' profiles
