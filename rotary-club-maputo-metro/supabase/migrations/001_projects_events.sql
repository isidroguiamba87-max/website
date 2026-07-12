-- Rotary Club Maputo Metro — Fase 3: tabelas projects e events
-- Correr este ficheiro completo no SQL Editor do Supabase (dashboard → SQL Editor → New query).

create extension if not exists "pgcrypto";

-- ---------- projects ----------

create table if not exists projects (
  id text primary key,
  title_pt text not null,
  title_en text not null,
  summary_pt text not null,
  summary_en text not null,
  detail_pt text not null,
  detail_en text not null,
  category text not null check (category in ('wash', 'health', 'education', 'youth')),
  category_label_pt text not null,
  category_label_en text not null,
  status text not null check (status in ('active', 'completed')),
  image text not null,
  gallery text[] default '{}',
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table projects enable row level security;

create policy "projects are publicly readable"
  on projects for select
  to anon, authenticated
  using (true);

-- ---------- events ----------

create table if not exists events (
  id text primary key,
  day text not null,
  month_pt text not null,
  month_en text not null,
  year text not null,
  title_pt text not null,
  title_en text not null,
  info_pt text not null,
  info_en text not null,
  status text not null check (status in ('upcoming', 'past')),
  gallery text[] default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table events enable row level security;

create policy "events are publicly readable"
  on events for select
  to anon, authenticated
  using (true);

-- ---------- updated_at automático ----------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

create trigger events_set_updated_at
  before update on events
  for each row execute function set_updated_at();
