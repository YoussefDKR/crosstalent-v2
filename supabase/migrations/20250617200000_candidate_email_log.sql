-- Throttle candidate lifecycle emails (profile nudge, job digest)

create table public.candidate_email_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  email_type text not null,
  sent_at timestamptz not null default now(),
  constraint candidate_email_log_type_check check (
    email_type in ('profile_nudge', 'job_digest')
  )
);

create index candidate_email_log_user_type_idx
  on public.candidate_email_log (user_id, email_type, sent_at desc);

comment on table public.candidate_email_log is
  'Outbound candidate email sends for throttling (profile reminders, job digests).';

-- Service role only (cron uses admin client)
alter table public.candidate_email_log enable row level security;
