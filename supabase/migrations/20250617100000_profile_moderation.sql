-- Admin moderation: suspend / ban accounts

alter table public.profiles
  add column if not exists is_banned boolean not null default false,
  add column if not exists ban_reason text,
  add column if not exists banned_at timestamptz;

create index profiles_is_banned_idx on public.profiles (is_banned)
  where is_banned = true;

comment on column public.profiles.is_banned is
  'When true, user is blocked from app access (admin action).';
