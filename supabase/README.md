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

For local development without email confirmation, disable **Confirm email** under **Authentication → Providers → Email** (optional).

## 4. What the migration creates

- `profiles` table linked to `auth.users`
- `user_role` enum: `candidate` | `employer`
- Trigger to create a profile on signup (role from `raw_user_meta_data`)
- Trigger to **block role changes** after registration
- **RLS policies:**
  - Users read/update their own profile
  - Employers can read **candidate** profiles only (not other employers)
  - Candidates cannot read other users' profiles
