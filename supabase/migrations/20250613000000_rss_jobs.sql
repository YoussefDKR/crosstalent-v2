-- Curated remote jobs imported from public RSS feeds (not employer-posted)

alter table public.jobs
  add column if not exists source_type text not null default 'platform'
    check (source_type in ('platform', 'rss')),
  add column if not exists external_url text,
  add column if not exists external_source text,
  add column if not exists external_guid text,
  add column if not exists rss_company_name text;

alter table public.jobs
  alter column employer_id drop not null;

alter table public.jobs
  add constraint jobs_platform_requires_employer
  check (source_type = 'rss' or employer_id is not null);

create unique index if not exists jobs_rss_dedup_idx
  on public.jobs (external_source, external_guid)
  where source_type = 'rss' and external_guid is not null;

create index if not exists jobs_source_type_idx on public.jobs (source_type);

comment on column public.jobs.source_type is 'platform = employer post; rss = curated import';
comment on column public.jobs.external_url is 'Original apply URL for RSS listings';

create or replace function public.assert_job_employer_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.source_type = 'rss' then
    return new;
  end if;
  if not public.is_employer() then
    raise exception 'Only employers can manage jobs';
  end if;
  if auth.uid() is distinct from new.employer_id then
    raise exception 'Cannot manage jobs for another employer';
  end if;
  return new;
end;
$$;
