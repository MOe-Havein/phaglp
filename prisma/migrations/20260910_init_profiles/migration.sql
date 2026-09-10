create table "public"."profiles" (
    "id" uuid not null references auth.users on delete cascade primary key,
    "email" text not null unique,
    "display_name" text,
    "updated_at" timestamptz not null default now()
);

-- Trigger function to automatically update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
   new.updated_at = now();
   return new;
end;
$$ language 'plpgsql';

-- Attach the trigger to the profiles table
create trigger handle_updated_at before update on public.profiles
for each row execute procedure public.handle_updated_at();

-- Enable Row Level Security (RLS) on the profiles table
alter table public.profiles enable row level security;

-- Policy 1: Allow public read access (SELECT) to all profiles
create policy "Public profiles are viewable by everyone"
on public.profiles for select
using (true);

-- Policy 2: Allow authenticated users to update only their own row
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);