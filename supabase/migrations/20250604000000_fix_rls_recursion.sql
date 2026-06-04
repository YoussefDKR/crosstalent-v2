-- Fix infinite recursion in RLS policies that subquery public.profiles
-- Run this in Supabase SQL Editor if saves fail with "infinite recursion detected in policy for relation profiles"

create or replace function public.is_employer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'employer'
  );
$$;

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

-- profiles: employer browsing candidates
drop policy if exists "profiles_select_candidates_for_employers" on public.profiles;

create policy "profiles_select_candidates_for_employers"
  on public.profiles
  for select
  to authenticated
  using (
    role = 'candidate'
    and public.is_employer()
  );

-- candidate_* tables: employer read access
drop policy if exists "candidate_profiles_select_employers" on public.candidate_profiles;
drop policy if exists "candidate_skills_select_employers" on public.candidate_skills;
drop policy if exists "candidate_languages_select_employers" on public.candidate_languages;
drop policy if exists "candidate_experiences_select_employers" on public.candidate_experiences;

create policy "candidate_profiles_select_employers"
  on public.candidate_profiles
  for select
  to authenticated
  using (
    public.is_employer()
    and public.is_candidate_profile(user_id)
  );

create policy "candidate_skills_select_employers"
  on public.candidate_skills
  for select
  to authenticated
  using (public.is_employer());

create policy "candidate_languages_select_employers"
  on public.candidate_languages
  for select
  to authenticated
  using (public.is_employer());

create policy "candidate_experiences_select_employers"
  on public.candidate_experiences
  for select
  to authenticated
  using (public.is_employer());

-- CV storage: employer read access
drop policy if exists "candidate_cvs_select_employers" on storage.objects;

create policy "candidate_cvs_select_employers"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'candidate-cvs'
    and public.is_employer()
    and public.is_candidate_profile(((storage.foldername(name))[1])::uuid)
  );

grant execute on function public.is_employer() to authenticated;
grant execute on function public.is_candidate_profile(uuid) to authenticated;
