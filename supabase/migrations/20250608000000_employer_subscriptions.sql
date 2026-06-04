-- Phase 8: Employer billing / Stripe subscriptions

create table public.employer_subscriptions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id text not null default 'starter',
  status text not null default 'inactive',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employer_subscriptions_status_check check (
    status in (
      'inactive',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid'
    )
  )
);

create index employer_subscriptions_stripe_customer_idx
  on public.employer_subscriptions (stripe_customer_id);

create index employer_subscriptions_status_idx
  on public.employer_subscriptions (status);

create trigger employer_subscriptions_updated_at
  before update on public.employer_subscriptions
  for each row
  execute function public.set_updated_at();

alter table public.employer_subscriptions enable row level security;

-- Employers read their own billing row only (writes via Stripe webhook / service role)
create policy "employer_subscriptions_select_own"
  on public.employer_subscriptions for select to authenticated
  using (user_id = auth.uid() and public.is_employer());

grant select on public.employer_subscriptions to authenticated;
