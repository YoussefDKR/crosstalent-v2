-- Set published_at when a job is created or updated as published

create or replace function public.jobs_set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' then
    new.published_at := coalesce(new.published_at, now());
  elsif new.status = 'draft' then
    new.published_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists jobs_publish_timestamp on public.jobs;

create trigger jobs_publish_timestamp
  before insert or update on public.jobs
  for each row
  execute function public.jobs_set_published_at();
