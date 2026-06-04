-- Job applications (candidates apply to published jobs)

create type public.application_status as enum ('pending', 'accepted', 'rejected');

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  candidate_id uuid not null references public.profiles (id) on delete cascade,
  status public.application_status not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint job_applications_unique_candidate unique (job_id, candidate_id)
);

create index job_applications_job_idx on public.job_applications (job_id);
create index job_applications_candidate_idx on public.job_applications (candidate_id);
create index job_applications_status_idx on public.job_applications (status);
create index job_applications_created_idx on public.job_applications (created_at desc);

create trigger job_applications_updated_at
  before update on public.job_applications
  for each row
  execute function public.set_updated_at();

alter table public.job_applications enable row level security;

-- Candidates: apply and view own applications
create policy "job_applications_select_own_candidate"
  on public.job_applications for select to authenticated
  using (candidate_id = auth.uid());

create policy "job_applications_insert_candidate"
  on public.job_applications for insert to authenticated
  with check (
    candidate_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'candidate'
    )
    and exists (
      select 1
      from public.jobs j
      where j.id = job_id
        and j.status = 'published'
    )
  );

-- Employers: view and update applications for their jobs
create policy "job_applications_select_employer_jobs"
  on public.job_applications for select to authenticated
  using (
    exists (
      select 1
      from public.jobs j
      where j.id = job_id
        and j.employer_id = auth.uid()
    )
  );

create policy "job_applications_update_employer"
  on public.job_applications for update to authenticated
  using (
    exists (
      select 1
      from public.jobs j
      where j.id = job_id
        and j.employer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.jobs j
      where j.id = job_id
        and j.employer_id = auth.uid()
    )
  );

grant select, insert, update on public.job_applications to authenticated;
