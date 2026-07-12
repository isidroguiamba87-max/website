-- Rotary Club Maputo Metro — Fase 3: leaders, about_values, site_content, club_contacts
-- Correr no SQL Editor do Supabase (dashboard → SQL Editor → New query).

-- ---------- leaders ----------

create table if not exists leaders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_pt text not null,
  role_en text not null,
  photo text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table leaders enable row level security;

create policy "leaders are publicly readable"
  on leaders for select
  to anon, authenticated
  using (true);

create trigger leaders_set_updated_at
  before update on leaders
  for each row execute function set_updated_at();

-- ---------- about_values ----------

create table if not exists about_values (
  id uuid primary key default gen_random_uuid(),
  title_pt text not null,
  title_en text not null,
  text_pt text not null,
  text_en text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table about_values enable row level security;

create policy "about_values are publicly readable"
  on about_values for select
  to anon, authenticated
  using (true);

create trigger about_values_set_updated_at
  before update on about_values
  for each row execute function set_updated_at();

-- ---------- site_content (linha única, id fixo = 1) ----------

create table if not exists site_content (
  id int primary key default 1 check (id = 1),
  club_name text not null,
  club_district_pt text not null,
  club_district_en text not null,
  club_acronym text not null,
  club_founded int not null,
  hero_image text not null,
  mission_image text not null,
  home_headline_pt text not null,
  home_headline_en text not null,
  home_lead_pt text not null,
  home_lead_en text not null,
  home_invite_pt text not null,
  home_invite_en text not null,
  about_mission_pt text not null,
  about_mission_en text not null,
  about_ri_vision_pt text not null,
  about_ri_vision_en text not null,
  about_ri_mission_pt text not null,
  about_ri_mission_en text not null,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "site_content is publicly readable"
  on site_content for select
  to anon, authenticated
  using (true);

create trigger site_content_set_updated_at
  before update on site_content
  for each row execute function set_updated_at();

-- ---------- club_contacts (linha única, id fixo = 1) ----------

create table if not exists club_contacts (
  id int primary key default 1 check (id = 1),
  email text not null default '',
  phone text not null default '',
  meetings_pt text not null,
  meetings_en text not null,
  facebook text not null default '#',
  linkedin text not null default '#',
  instagram text not null default '',
  updated_at timestamptz not null default now()
);

alter table club_contacts enable row level security;

create policy "club_contacts is publicly readable"
  on club_contacts for select
  to anon, authenticated
  using (true);

create trigger club_contacts_set_updated_at
  before update on club_contacts
  for each row execute function set_updated_at();
