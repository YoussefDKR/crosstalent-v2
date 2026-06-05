-- Step 2 of 2: admin helpers and triggers (run after 20250614000000_admin_role_enum.sql)

create or replace function public.is_admin()
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
      and role = 'admin'
  );
$$;

-- Service role, SQL Editor (postgres), and dashboard may promote users
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' then
    return new;
  end if;
  if session_user in ('postgres', 'supabase_admin', 'supabase_storage_admin') then
    return new;
  end if;
  if old.role is distinct from new.role then
    raise exception 'Role cannot be changed after registration';
  end if;
  return new;
end;
$$;

-- Never auto-assign admin at signup
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

-- Admins and service role may manage any platform job
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
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' then
    return new;
  end if;
  if public.is_admin() then
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

comment on function public.is_admin() is 'True when the current user has role admin.';
