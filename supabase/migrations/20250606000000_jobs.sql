-- Phase 5: Job postings and job board

create type public.job_status as enum ('draft', 'published', 'closed');
create type public.employment_type as enum (
  'full_time',
  'part_time',
  'contract',
  'internship'
);
create type public.remote_type as enum ('onsite', 'hybrid', 'remote');
create type public.experience_level as enum ('junior', 'mid', 'senior', 'lead');

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  requirements text,
  employment_type public.employment_type not null default 'full_time',
  experience_level public.experience_level not null default 'mid',
  remote_type public.remote_type not null default 'hybrid',
  location_city text,
  location_country text,
  salary_min integer,
  salary_max integer,
  salary_currency text default 'EUR',
  skills text[] not null default '{}',
  languages text[] not null default '{}',
  status public.job_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_salary_range check (
    salary_min is null
    or salary_max is null
    or salary_min <= salary_max
  )
);

create index jobs_employer_idx on public.jobs (employer_id);
create index jobs_status_idx on public.jobs (status);
create index jobs_published_idx on public.jobs (published_at desc nulls last);
create index jobs_country_idx on public.jobs (location_country);
create index jobs_skills_idx on public.jobs using gin (skills);

create trigger jobs_updated_at
  before update on public.jobs
  for each row
  execute function public.set_updated_at();

create or replace function public.jobs_set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and old.status is distinct from 'published' then
    new.published_at := coalesce(new.published_at, now());
  end if;
  if new.status = 'draft' then
    new.published_at := null;
  end if;
  return new;
end;
$$;

create trigger jobs_publish_timestamp
  before update on public.jobs
  for each row
  execute function public.jobs_set_published_at();

create or replace function public.assert_job_employer_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_employer() then
    raise exception 'Only employers can manage jobs';
  end if;
  if auth.uid() is distinct from new.employer_id then
    raise exception 'Cannot manage jobs for another employer';
  end if;
  return new;
end;
$$;

create trigger jobs_employer_owner
  before insert or update on public.jobs
  for each row
  execute function public.assert_job_employer_owner();

alter table public.jobs enable row level security;

-- Employers: full access to own jobs
create policy "jobs_select_own"
  on public.jobs for select to authenticated
  using (employer_id = auth.uid());

create policy "jobs_insert_own"
  on public.jobs for insert to authenticated
  with check (employer_id = auth.uid() and public.is_employer());

create policy "jobs_update_own"
  on public.jobs for update to authenticated
  using (employer_id = auth.uid())
  with check (employer_id = auth.uid());

create policy "jobs_delete_own"
  on public.jobs for delete to authenticated
  using (employer_id = auth.uid());

-- Everyone (incl. anon): read published jobs
create policy "jobs_select_published"
  on public.jobs for select
  using (status = 'published');

grant select on public.jobs to anon, authenticated;
grant insert, update, delete on public.jobs to authenticated;
