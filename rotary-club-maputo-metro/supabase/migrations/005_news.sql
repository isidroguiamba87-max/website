-- Rotary Club Maputo Metro — Fase 3: módulo Notícias
-- Correr no SQL Editor do Supabase (dashboard → SQL Editor → New query).

create table if not exists news (
  id text primary key,
  title_pt text not null,
  title_en text not null,
  excerpt_pt text not null,
  excerpt_en text not null,
  body_pt text not null,
  body_en text not null,
  author text,
  published_at date not null default current_date,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table news enable row level security;

create policy "news public read (published only)"
  on news for select
  to anon
  using (published = true);

create policy "authenticated users manage news"
  on news for all
  to authenticated
  using (true)
  with check (true);

create trigger news_set_updated_at
  before update on news
  for each row execute function set_updated_at();

-- ---------- Notícias passam a poder ter fotos na Galeria ----------

alter table gallery_items add column if not exists news_id text references news (id) on delete set null;
