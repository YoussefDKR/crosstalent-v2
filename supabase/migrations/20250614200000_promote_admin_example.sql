-- One-time: promote your account to admin (run in Supabase SQL Editor)
-- Replace the email with the one you use to sign in on CrossTalent.

alter table public.profiles disable trigger profiles_role_immutable;

update public.profiles
set role = 'admin'
where email = 'you@example.com';

alter table public.profiles enable trigger profiles_role_immutable;
