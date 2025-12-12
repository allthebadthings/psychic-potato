create table if not exists integrations (
  id uuid default gen_random_uuid() primary key,
  service text not null unique,
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Secure the table (only accessible via service role key which backend uses, or specific policies if we add user access later)
alter table integrations enable row level security;

-- Policy for service role (backend) - implicitly full access, but good to be explicit if we add RLS policies for others
create policy "Enable all access for service role" on integrations
  as permissive
  for all
  to service_role
  using (true)
  with check (true);
