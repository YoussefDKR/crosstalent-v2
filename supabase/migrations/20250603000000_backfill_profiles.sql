-- Backfill profiles for users created before migrations / trigger existed.
-- Safe to run multiple times (ON CONFLICT DO NOTHING).

insert into public.profiles (id, role, full_name, email)
select
  u.id,
  case
    when coalesce(u.raw_user_meta_data ->> 'role', 'candidate') in ('candidate', 'employer')
    then (u.raw_user_meta_data ->> 'role')::public.user_role
    else 'candidate'::public.user_role
  end,
  nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
  lower(u.email)
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
)
on conflict (id) do nothing;

-- Create profile on demand when trigger missed (e.g. signup before migration)
create or replace function public.ensure_user_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  u record;
  selected_role public.user_role;
  meta_role text;
  result public.profiles;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into result from public.profiles where id = uid;
  if found then
    return result;
  end if;

  select id, email, raw_user_meta_data into u from auth.users where id = uid;
  if not found then
    raise exception 'User not found';
  end if;

  meta_role := coalesce(u.raw_user_meta_data ->> 'role', 'candidate');
  if meta_role not in ('candidate', 'employer') then
    selected_role := 'candidate';
  else
    selected_role := meta_role::public.user_role;
  end if;

  insert into public.profiles (id, role, full_name, email)
  values (
    uid,
    selected_role,
    nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
    lower(u.email)
  )
  on conflict (id) do nothing
  returning * into result;

  if result.id is null then
    select * into result from public.profiles where id = uid;
  end if;

  return result;
end;
$$;

grant execute on function public.ensure_user_profile() to authenticated;
