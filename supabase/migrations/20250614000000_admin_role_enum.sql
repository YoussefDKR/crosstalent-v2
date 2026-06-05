-- Step 1 of 2: add admin to enum (must run alone — PostgreSQL commits this separately)

alter type public.user_role add value if not exists 'admin';
