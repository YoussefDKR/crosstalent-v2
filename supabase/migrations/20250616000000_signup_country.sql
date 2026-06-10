-- Track where users signed up from (ISO country code from request geo headers).

alter table public.profiles
  add column if not exists signup_country text;

comment on column public.profiles.signup_country is
  'ISO 3166-1 alpha-2 country detected at signup (e.g. MA, FR). Set once.';

create index if not exists profiles_signup_country_idx
  on public.profiles (signup_country)
  where signup_country is not null;
