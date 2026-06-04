-- CrossTalent: profiles, role separation, and RLS foundation

create type public.user_role as enum ('candidate', 'employer');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_lowercase check (email is null or email = lower(email))
);

create index profiles_role_idx on public.profiles (role);

comment on table public.profiles is 'App profile per auth user; role is immutable after signup.';

-- Auto-create profile when a user signs up (role from auth metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_role public.user_role;
  meta_role text;
begin
  meta_role := coalesce(new.raw_user_meta_data ->> 'role', 'candidate');

  if meta_role not in ('candidate', 'employer') then
    selected_role := 'candidate';
  else
    selected_role := meta_role::public.user_role;
  end if;

  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    selected_role,
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    lower(new.email)
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Prevent role escalation via direct updates
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
as $$
begin
  if old.role is distinct from new.role then
    raise exception 'Role cannot be changed after registration';
  end if;
  return new;
end;
$$;

create trigger profiles_role_immutable
  before update on public.profiles
  for each row
  execute function public.prevent_role_change();

alter table public.profiles enable row level security;

-- Helpers (security definer avoids RLS recursion when policies check roles)
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

-- Users can read their own profile
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Users can update their own profile (role guarded by trigger)
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Employers may browse candidate profiles (search phase foundation)
create policy "profiles_select_candidates_for_employers"
  on public.profiles
  for select
  to authenticated
  using (
    role = 'candidate'
    and public.is_employer()
  );

-- Candidates cannot read other users' profiles (including employers)
-- Enforced by: only own row OR employer reading candidates — no candidate-to-candidate policy

grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant execute on function public.is_employer() to authenticated;
