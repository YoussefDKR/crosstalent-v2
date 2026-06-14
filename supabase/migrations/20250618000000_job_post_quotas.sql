-- Job post duration, one-time credits, and 10-day free tier

alter table public.jobs
  add column if not exists expires_at timestamptz;

comment on column public.jobs.expires_at is
  'When a published employer job should leave the board (plan-based duration).';

create index if not exists jobs_expires_at_idx
  on public.jobs (expires_at)
  where status = 'published' and expires_at is not null;

alter table public.employer_subscriptions
  add column if not exists post_credits integer not null default 0;

comment on column public.employer_subscriptions.post_credits is
  'One-time job post credits (e.g. €79 single post purchase).';

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
    values (uid, 'starter', 'trialing', now() + interval '10 days')
    returning * into sub;
  end if;

  return sub;
end;
$$;

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
    values (new.id, 'starter', 'trialing', now() + interval '10 days')
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;
