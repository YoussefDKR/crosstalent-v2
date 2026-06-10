-- Anonymous site visit tracking for admin analytics.

create table public.site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  country_code text,
  path text not null default '/',
  created_at timestamptz not null default now()
);

create index site_visits_created_at_idx on public.site_visits (created_at desc);
create index site_visits_visitor_id_idx on public.site_visits (visitor_id);
create index site_visits_country_code_idx on public.site_visits (country_code);

comment on table public.site_visits is
  'One row per browser session visit (privacy-friendly anonymous id).';

alter table public.site_visits enable row level security;
