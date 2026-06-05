-- Free 30-day employer trial: candidate search + 1 published job

alter table public.employer_subscriptions
  add column if not exists trial_ends_at timestamptz;

comment on column public.employer_subscriptions.trial_ends_at is
  'Platform trial end (30 days from signup). Null when on paid Stripe subscription.';

create or replace function public.expire_employer_trial_if_needed(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.employer_subscriptions
  set status = 'inactive'
  where user_id = p_user_id
    and status = 'trialing'
    and stripe_subscription_id is null
    and trial_ends_at is not null
    and trial_ends_at < now();
end;
$$;

create or replace function public.ensure_employer_subscription()
returns public.employer_subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  sub public.employer_subscriptions;
  uid uuid := auth.uid();
begin
  if uid is null or not public.is_employer() then
    return null;
  end if;

  perform public.expire_employer_trial_if_needed(uid);

  select * into sub
  from public.employer_subscriptions
  where user_id = uid;

  if not found then
    insert into public.employer_subscriptions (
      user_id,
      plan_id,
      status,
      trial_ends_at
    )
    values (uid, 'starter', 'trialing', now() + interval '30 days')
    returning * into sub;
  end if;

  return sub;
end;
$$;

grant execute on function public.ensure_employer_subscription() to authenticated;

create or replace function public.start_employer_trial_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'employer' then
    insert into public.employer_subscriptions (
      user_id,
      plan_id,
      status,
      trial_ends_at
    )
    values (new.id, 'starter', 'trialing', now() + interval '30 days')
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_start_employer_trial on public.profiles;
create trigger profiles_start_employer_trial
  after insert on public.profiles
  for each row
  execute function public.start_employer_trial_on_signup();

-- Existing employers without a billing row get a trial
insert into public.employer_subscriptions (user_id, plan_id, status, trial_ends_at)
select p.id, 'starter', 'trialing', now() + interval '30 days'
from public.profiles p
where p.role = 'employer'
  and not exists (
    select 1
    from public.employer_subscriptions s
    where s.user_id = p.id
  );
