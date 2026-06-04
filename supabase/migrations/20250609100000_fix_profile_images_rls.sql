-- Fix profile-images storage RLS (upload / upsert)

drop policy if exists "profile_images_insert_own" on storage.objects;
drop policy if exists "profile_images_update_own" on storage.objects;
drop policy if exists "profile_images_delete_own" on storage.objects;
drop policy if exists "profile_images_select_own" on storage.objects;

-- Path: candidates/{user_id}/avatar.webp | companies/{user_id}/logo.webp
create policy "profile_images_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'profile-images'
    and (
      (
        (storage.foldername(name))[1] = 'candidates'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
      or (
        (storage.foldername(name))[1] = 'companies'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
    )
  );

create policy "profile_images_update_own"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'profile-images'
    and (
      (
        (storage.foldername(name))[1] = 'candidates'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
      or (
        (storage.foldername(name))[1] = 'companies'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
    )
  )
  with check (
    bucket_id = 'profile-images'
    and (
      (
        (storage.foldername(name))[1] = 'candidates'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
      or (
        (storage.foldername(name))[1] = 'companies'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
    )
  );

create policy "profile_images_delete_own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'profile-images'
    and (
      (
        (storage.foldername(name))[1] = 'candidates'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
      or (
        (storage.foldername(name))[1] = 'companies'
        and (storage.foldername(name))[2] = auth.uid()::text
      )
    )
  );

-- Required for upsert and replace flows
create policy "profile_images_select_own"
  on storage.objects for select to authenticated
  using (bucket_id = 'profile-images');
