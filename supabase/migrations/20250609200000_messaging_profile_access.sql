-- Let conversation participants read each other's basic profile (for messaging names)

create policy "profiles_select_conversation_partner"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.conversations c
      where
        (c.employer_id = auth.uid() and c.candidate_id = profiles.id)
        or (c.candidate_id = auth.uid() and c.employer_id = profiles.id)
    )
  );
