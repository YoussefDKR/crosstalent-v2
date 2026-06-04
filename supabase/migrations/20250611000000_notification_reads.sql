-- Track when users last viewed conversations and applications (for notifications)

create table public.conversation_reads (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create index conversation_reads_user_idx on public.conversation_reads (user_id);

alter table public.conversation_reads enable row level security;

create policy "conversation_reads_select_own"
  on public.conversation_reads for select to authenticated
  using (user_id = auth.uid());

create policy "conversation_reads_upsert_own"
  on public.conversation_reads for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.employer_id = auth.uid() or c.candidate_id = auth.uid())
    )
  );

create policy "conversation_reads_update_own"
  on public.conversation_reads for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update on public.conversation_reads to authenticated;

create table public.application_views (
  application_id uuid not null references public.job_applications (id) on delete cascade,
  employer_id uuid not null references public.profiles (id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (application_id, employer_id)
);

create index application_views_employer_idx on public.application_views (employer_id);

alter table public.application_views enable row level security;

create policy "application_views_select_own"
  on public.application_views for select to authenticated
  using (employer_id = auth.uid());

create policy "application_views_upsert_own"
  on public.application_views for insert to authenticated
  with check (
    employer_id = auth.uid()
    and exists (
      select 1
      from public.job_applications a
      join public.jobs j on j.id = a.job_id
      where a.id = application_id
        and j.employer_id = auth.uid()
    )
  );

create policy "application_views_update_own"
  on public.application_views for update to authenticated
  using (employer_id = auth.uid())
  with check (employer_id = auth.uid());

grant select, insert, update on public.application_views to authenticated;
