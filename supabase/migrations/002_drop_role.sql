-- Remove the role column from profiles (no longer needed)
alter table public.profiles drop column if exists role;

-- Update the trigger to not set role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- If your profile row is missing (caused the RLS error), run this to create it manually:
-- Replace the values with your actual user id and email from the Auth > Users dashboard.
--
-- insert into public.profiles (id, email, display_name)
-- values ('your-user-uuid-here', 'your@email.com', 'Your Name')
-- on conflict (id) do nothing;
