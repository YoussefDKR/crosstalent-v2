-- Allow application transactional emails in the send log

alter table public.candidate_email_log
  drop constraint if exists candidate_email_log_type_check;

alter table public.candidate_email_log
  add constraint candidate_email_log_type_check check (
    email_type in (
      'profile_nudge',
      'job_digest',
      'application_new',
      'application_accepted',
      'application_rejected'
    )
  );

comment on table public.candidate_email_log is
  'Outbound email sends for throttling and admin audit (profile reminders, job digests, application notifications).';
