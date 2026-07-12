-- Rotary Club Maputo Metro — Fase 3: base para o painel de administração
-- (categorias dinâmicas, rascunho/publicado, vídeo, datas reais de eventos)
-- Correr no SQL Editor do Supabase (dashboard → SQL Editor → New query).

-- ---------- project_categories ----------

create table if not exists project_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label_pt text not null,
  label_en text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table project_categories enable row level security;

create policy "project_categories are publicly readable"
  on project_categories for select
  to anon, authenticated
  using (true);

create policy "authenticated users manage project_categories"
  on project_categories for all
  to authenticated
  using (true)
  with check (true);

create trigger project_categories_set_updated_at
  before update on project_categories
  for each row execute function set_updated_at();

insert into project_categories (slug, label_pt, label_en, sort_order) values
  ('wash', 'Água, Saneamento e Higiene', 'Water, Sanitation & Hygiene', 0),
  ('health', 'Saúde', 'Health', 1),
  ('education', 'Educação', 'Education', 2),
  ('youth', 'Juventude', 'Youth', 3)
on conflict (slug) do nothing;

-- ---------- projects: categorias dinâmicas + rascunho/publicado + vídeo ----------

alter table projects drop constraint if exists projects_category_check;
alter table projects drop column if exists category_label_pt;
alter table projects drop column if exists category_label_en;

alter table projects
  add constraint projects_category_fkey
  foreign key (category) references project_categories (slug);

alter table projects add column if not exists published boolean not null default false;
alter table projects add column if not exists video_url text;

update projects set published = true;

-- ---------- events: data real (deriva próximo/anterior) + local + vídeo ----------

alter table events drop column if exists day;
alter table events drop column if exists month_pt;
alter table events drop column if exists month_en;
alter table events drop column if exists year;
alter table events drop column if exists status;

alter table events add column if not exists event_date date;
alter table events add column if not exists start_time time;
alter table events add column if not exists end_time time;
alter table events add column if not exists location_name text;
alter table events add column if not exists location_address text;
alter table events add column if not exists video_url text;
alter table events add column if not exists published boolean not null default false;

update events set published = true;

-- ---------- RLS: leitura pública só do publicado; admin (authenticated) vê tudo e escreve ----------

drop policy if exists "projects are publicly readable" on projects;
create policy "projects public read (published only)"
  on projects for select
  to anon
  using (published = true);
create policy "authenticated users manage projects"
  on projects for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "events are publicly readable" on events;
create policy "events public read (published only)"
  on events for select
  to anon
  using (published = true);
create policy "authenticated users manage events"
  on events for all
  to authenticated
  using (true)
  with check (true);
