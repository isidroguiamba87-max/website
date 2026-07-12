-- Rotary Club Maputo Metro — Fase 3: módulo Galeria
-- Correr no SQL Editor do Supabase (dashboard → SQL Editor → New query).

-- ---------- Storage bucket (privado — RLS decide o que é servido) ----------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  false,
  104857600, -- 100MB
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do nothing;

-- ---------- gallery_items ----------

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  storage_path text unique not null,
  media_type text not null check (media_type in ('image', 'video')),
  project_id text references projects (id) on delete set null,
  event_id text references events (id) on delete set null,
  caption_pt text,
  caption_en text,
  tag text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_cover boolean not null default false,
  sort_order int not null default 0,
  width int,
  height int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table gallery_items enable row level security;

create policy "gallery_items public read (approved only)"
  on gallery_items for select
  to anon
  using (status = 'approved');

create policy "authenticated users manage gallery_items"
  on gallery_items for all
  to authenticated
  using (true)
  with check (true);

create trigger gallery_items_set_updated_at
  before update on gallery_items
  for each row execute function set_updated_at();

-- ---------- gallery_settings (linha única, id fixo = 1) ----------

create table if not exists gallery_settings (
  id int primary key default 1 check (id = 1),
  style text not null default 'grid' check (style in ('grid', 'masonry', 'justified', 'carousel', 'slideshow')),
  fullscreen boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table gallery_settings enable row level security;

create policy "gallery_settings is publicly readable"
  on gallery_settings for select
  to anon, authenticated
  using (true);

create policy "authenticated users manage gallery_settings"
  on gallery_settings for all
  to authenticated
  using (true)
  with check (true);

create trigger gallery_settings_set_updated_at
  before update on gallery_settings
  for each row execute function set_updated_at();

insert into gallery_settings (id) values (1)
on conflict (id) do nothing;

-- ---------- RLS de storage.objects: só serve ficheiros de itens aprovados ----------

create policy "public can view approved gallery objects"
  on storage.objects for select
  to anon
  using (
    bucket_id = 'gallery'
    and exists (
      select 1 from public.gallery_items gi
      where gi.storage_path = storage.objects.name
      and gi.status = 'approved'
    )
  );

create policy "authenticated can view all gallery objects"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'gallery');

create policy "authenticated can manage gallery objects"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'gallery')
  with check (bucket_id = 'gallery');
