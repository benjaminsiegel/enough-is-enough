-- Run this once in Supabase Dashboard → SQL Editor.
-- Visitors can add signatures but cannot read email addresses or private messages.

create table public.signatures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  zip text not null check (zip ~ '^[0-9]{5}$'),
  email text not null check (char_length(email) <= 254),
  roles text,
  message text check (char_length(message) <= 400),
  consent_public boolean not null default false,
  consent_contact boolean not null default false,
  approved boolean not null default true
);

create unique index signatures_email_unique on public.signatures (lower(email));

alter table public.signatures enable row level security;

create policy "anonymous visitors can sign"
  on public.signatures
  for insert
  to anon
  with check (
    char_length(trim(name)) between 2 and 100
    and zip ~ '^[0-9]{5}$'
    and char_length(trim(email)) between 3 and 254
    and consent_public = true
  );

-- Project-level automatic exposure is disabled, so grant only the one action
-- anonymous visitors need. There is deliberately no SELECT grant here.
grant insert on public.signatures to anon;

-- This is the only public read surface. It deliberately excludes email,
-- messages, roles, consent choices, and internal moderation fields.
create view public.public_signatures
  with (security_invoker = off, security_barrier = true)
  as
  select name, zip, created_at
  from public.signatures
  where approved = true and consent_public = true;

grant select on public.public_signatures to anon;
