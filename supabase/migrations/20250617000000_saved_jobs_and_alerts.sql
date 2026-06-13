-- Saved jobs and job alerts (candidates)

create table public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint saved_jobs_unique unique (user_id, job_id)
);

create index saved_jobs_user_idx on public.saved_jobs (user_id, created_at desc);

alter table public.saved_jobs enable row level security;

create policy "saved_jobs_select_own"
  on public.saved_jobs for select to authenticated
  using (user_id = auth.uid());

create policy "saved_jobs_insert_own"
  on public.saved_jobs for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'candidate'
    )
  );

create policy "saved_jobs_delete_own"
  on public.saved_jobs for delete to authenticated
  using (user_id = auth.uid());

grant select, insert, delete on public.saved_jobs to authenticated;

-- Job alert criteria (in-app; email digest can be added later)
create table public.job_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null default 'My alert',
  q text,
  country text,
  employment_type text,
  remote_type text,
  experience_level text,
  skill text,
  salary_min integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index job_alerts_user_idx on public.job_alerts (user_id, created_at desc);

create trigger job_alerts_updated_at
  before update on public.job_alerts
  for each row
  execute function public.set_updated_at();

alter table public.job_alerts enable row level security;

create policy "job_alerts_select_own"
  on public.job_alerts for select to authenticated
  using (user_id = auth.uid());

create policy "job_alerts_insert_own"
  on public.job_alerts for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'candidate'
    )
  );

create policy "job_alerts_update_own"
  on public.job_alerts for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "job_alerts_delete_own"
  on public.job_alerts for delete to authenticated
  using (user_id = auth.uid());

grant select, insert, update, delete on public.job_alerts to authenticated;
