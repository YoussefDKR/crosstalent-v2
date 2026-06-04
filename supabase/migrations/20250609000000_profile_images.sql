-- Profile photos & company logos (compressed WebP in Storage)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-images',
  'profile-images',
  true,
  2097152,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- candidates/{user_id}/avatar.webp  |  companies/{user_id}/logo.webp
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

create policy "profile_images_select_own"
  on storage.objects for select to authenticated
  using (bucket_id = 'profile-images');

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
