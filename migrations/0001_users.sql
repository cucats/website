create table users (
  id uuid primary key default gen_random_uuid(),
  entra_oid text not null unique,
  email text not null,
  name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
