-- Phase 4: Employer company profiles

create table public.company_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  company_name text,
  tagline text,
  description text,
  website text,
  logo_url text,
  industry text,
  company_size text check (
    company_size in ('1-10', '11-50', '51-200', '201-500', '500+')
  ),
  headquarters_city text,
  headquarters_country text,
  hiring_in_regions text,
  linkedin_url text,
  contact_email text,
  contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger company_profiles_updated_at
  before update on public.company_profiles
  for each row
  execute function public.set_updated_at();

create or replace function public.assert_employer_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_employer() then
    raise exception 'Only employers can modify company profile data';
  end if;
  if auth.uid() is distinct from new.user_id then
    raise exception 'Cannot modify another company profile';
  end if;
  return new;
end;
$$;

create trigger company_profiles_owner
  before insert or update on public.company_profiles
  for each row
  execute function public.assert_employer_owner();

alter table public.company_profiles enable row level security;

create policy "company_profiles_select_own"
  on public.company_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "company_profiles_insert_own"
  on public.company_profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id and public.is_employer());

create policy "company_profiles_update_own"
  on public.company_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Candidates may view company info when browsing jobs (Phase 5 foundation)
create policy "company_profiles_select_candidates"
  on public.company_profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'candidate'
    )
  );

grant select, insert, update on public.company_profiles to authenticated;
