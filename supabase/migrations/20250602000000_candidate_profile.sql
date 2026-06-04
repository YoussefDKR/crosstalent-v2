-- Phase 3: Candidate profile, skills, languages, experience, CV storage

create table public.candidate_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  headline text,
  bio text,
  location text,
  country_code text,
  phone text,
  cv_path text,
  cv_file_name text,
  cv_uploaded_at timestamptz,
  linkedin_url text,
  portfolio_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidate_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  level text check (level in ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at timestamptz not null default now(),
  constraint candidate_skills_name_unique unique (user_id, name)
);

create table public.candidate_languages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  language text not null,
  proficiency text not null check (
    proficiency in ('basic', 'conversational', 'professional', 'native')
  ),
  created_at timestamptz not null default now(),
  constraint candidate_languages_unique unique (user_id, language)
);

create table public.candidate_experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  company text not null,
  title text not null,
  location text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index candidate_skills_user_idx on public.candidate_skills (user_id);
create index candidate_languages_user_idx on public.candidate_languages (user_id);
create index candidate_experiences_user_idx on public.candidate_experiences (user_id, sort_order);

create trigger candidate_profiles_updated_at
  before update on public.candidate_profiles
  for each row
  execute function public.set_updated_at();

create trigger candidate_experiences_updated_at
  before update on public.candidate_experiences
  for each row
  execute function public.set_updated_at();

-- Only candidates may own candidate_* rows
create or replace function public.is_candidate_profile(target_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = target_id
      and role = 'candidate'
  );
$$;

create or replace function public.assert_candidate_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_candidate_profile(new.user_id) then
    raise exception 'Only candidates can modify candidate profile data';
  end if;
  if auth.uid() is distinct from new.user_id then
    raise exception 'Cannot modify another user''s candidate data';
  end if;
  return new;
end;
$$;

create trigger candidate_profiles_owner
  before insert or update on public.candidate_profiles
  for each row
  execute function public.assert_candidate_owner();

create trigger candidate_skills_owner
  before insert or update on public.candidate_skills
  for each row
  execute function public.assert_candidate_owner();

create trigger candidate_languages_owner
  before insert or update on public.candidate_languages
  for each row
  execute function public.assert_candidate_owner();

create trigger candidate_experiences_owner
  before insert or update on public.candidate_experiences
  for each row
  execute function public.assert_candidate_owner();

alter table public.candidate_profiles enable row level security;
alter table public.candidate_skills enable row level security;
alter table public.candidate_languages enable row level security;
alter table public.candidate_experiences enable row level security;

-- Own data (candidates)
create policy "candidate_profiles_select_own"
  on public.candidate_profiles for select to authenticated
  using (auth.uid() = user_id);

create policy "candidate_profiles_insert_own"
  on public.candidate_profiles for insert to authenticated
  with check (auth.uid() = user_id);

create policy "candidate_profiles_update_own"
  on public.candidate_profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "candidate_skills_all_own"
  on public.candidate_skills for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "candidate_languages_all_own"
  on public.candidate_languages for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "candidate_experiences_all_own"
  on public.candidate_experiences for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Employers read candidate data (search foundation)
create policy "candidate_profiles_select_employers"
  on public.candidate_profiles for select to authenticated
  using (
    public.is_employer()
    and public.is_candidate_profile(user_id)
  );

create policy "candidate_skills_select_employers"
  on public.candidate_skills for select to authenticated
  using (public.is_employer());

create policy "candidate_languages_select_employers"
  on public.candidate_languages for select to authenticated
  using (public.is_employer());

create policy "candidate_experiences_select_employers"
  on public.candidate_experiences for select to authenticated
  using (public.is_employer());

grant select, insert, update, delete on public.candidate_profiles to authenticated;
grant select, insert, update, delete on public.candidate_skills to authenticated;
grant select, insert, update, delete on public.candidate_languages to authenticated;
grant select, insert, update, delete on public.candidate_experiences to authenticated;
grant execute on function public.is_candidate_profile(uuid) to authenticated;

-- CV storage bucket (5MB, PDF/DOC/DOCX)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'candidate-cvs',
  'candidate-cvs',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

create policy "candidate_cvs_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'candidate-cvs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "candidate_cvs_select_own"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'candidate-cvs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "candidate_cvs_delete_own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'candidate-cvs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "candidate_cvs_select_employers"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'candidate-cvs'
    and public.is_employer()
    and public.is_candidate_profile(((storage.foldername(name))[1])::uuid)
  );
