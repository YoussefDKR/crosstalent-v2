-- Google OAuth: signup role intent + one-time role apply after OAuth callback

create table public.oauth_signup_intents (
  id uuid primary key default gen_random_uuid(),
  role public.user_role not null,
  created_at timestamptz not null default now()
);

create index oauth_signup_intents_created_at_idx
  on public.oauth_signup_intents (created_at);

comment on table public.oauth_signup_intents is
  'Short-lived role choice before Google signup; consumed in auth callback.';

-- Allow one-time role assignment right after OAuth signup
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
as $$
begin
  if coalesce(current_setting('app.allow_role_set', true), '') = 'true' then
    return new;
  end if;
  if old.role is distinct from new.role then
    raise exception 'Role cannot be changed after registration';
  end if;
  return new;
end;
$$;

create or replace function public.create_oauth_signup_intent(p_role public.user_role)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  intent_id uuid;
begin
  if p_role not in ('candidate', 'employer') then
    raise exception 'Invalid role';
  end if;

  insert into public.oauth_signup_intents (role)
  values (p_role)
  returning id into intent_id;

  return intent_id;
end;
$$;

grant execute on function public.create_oauth_signup_intent(public.user_role) to anon;
grant execute on function public.create_oauth_signup_intent(public.user_role) to authenticated;

create or replace function public.apply_oauth_signup_role(p_intent_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  intended_role public.user_role;
  uid uuid := auth.uid();
begin
  if uid is null or p_intent_id is null then
    return;
  end if;

  select role into intended_role
  from public.oauth_signup_intents
  where id = p_intent_id
    and created_at > now() - interval '30 minutes';

  if not found then
    return;
  end if;

  delete from public.oauth_signup_intents where id = p_intent_id;

  perform set_config('app.allow_role_set', 'true', true);

  update public.profiles
  set role = intended_role
  where id = uid
    and created_at > now() - interval '10 minutes';
end;
$$;

grant execute on function public.apply_oauth_signup_role(uuid) to authenticated;

-- Richer metadata from Google / OAuth providers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_role public.user_role;
  meta_role text;
  meta_name text;
  meta_avatar text;
begin
  meta_role := coalesce(new.raw_user_meta_data ->> 'role', 'candidate');

  if meta_role not in ('candidate', 'employer') then
    selected_role := 'candidate';
  else
    selected_role := meta_role::public.user_role;
  end if;

  meta_name := nullif(trim(coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name'
  )), '');

  meta_avatar := nullif(trim(coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture'
  )), '');

  insert into public.profiles (id, role, full_name, email, avatar_url)
  values (
    new.id,
    selected_role,
    meta_name,
    lower(new.email),
    meta_avatar
  );

  return new;
end;
$$;
