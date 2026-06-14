-- Store recipient address on send for admin audit trail

alter table public.candidate_email_log
  add column if not exists recipient_email text;

comment on column public.candidate_email_log.recipient_email is
  'Email address at time of send (for admin send history).';
