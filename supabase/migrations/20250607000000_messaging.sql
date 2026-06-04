-- Phase 7: Real-time messaging between employers and candidates

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles (id) on delete cascade,
  candidate_id uuid not null references public.profiles (id) on delete cascade,
  job_id uuid references public.jobs (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_distinct_participants check (employer_id <> candidate_id),
  constraint conversations_unique_pair unique (employer_id, candidate_id)
);

create index conversations_employer_idx on public.conversations (employer_id);
create index conversations_candidate_idx on public.conversations (candidate_id);
create index conversations_updated_idx on public.conversations (updated_at desc);

create trigger conversations_updated_at
  before update on public.conversations
  for each row
  execute function public.set_updated_at();

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint messages_body_not_empty check (char_length(trim(body)) > 0),
  constraint messages_body_max check (char_length(body) <= 4000)
);

create index messages_conversation_idx on public.messages (conversation_id, created_at);

-- Bump conversation.updated_at when a message is sent
create or replace function public.conversations_touch_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger messages_touch_conversation
  after insert on public.messages
  for each row
  execute function public.conversations_touch_on_message();

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Conversations: participants only
create policy "conversations_select_participant"
  on public.conversations for select to authenticated
  using (employer_id = auth.uid() or candidate_id = auth.uid());

create policy "conversations_insert_employer"
  on public.conversations for insert to authenticated
  with check (
    employer_id = auth.uid()
    and public.is_employer()
    and public.is_candidate_profile(candidate_id)
  );

-- Messages: participants read; sender must be participant
create policy "messages_select_participant"
  on public.messages for select to authenticated
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and (c.employer_id = auth.uid() or c.candidate_id = auth.uid())
    )
  );

create policy "messages_insert_participant"
  on public.messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and (c.employer_id = auth.uid() or c.candidate_id = auth.uid())
    )
  );

grant select, insert on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;

-- Realtime: new messages stream to open threads
alter table public.messages replica identity full;

do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
exception
  when duplicate_object then null;
end $$;
