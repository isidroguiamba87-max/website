-- Rotary Club Maputo Metro — fotos de capa (carregar ficheiro ou colar URL)
-- Correr no SQL Editor do Supabase (dashboard → SQL Editor → New query).

-- ---------- Storage bucket público para fotos de capa ----------
-- Ao contrário de `gallery`, as capas são escolhidas pela equipa e não
-- passam por aprovação de consentimento, por isso o bucket é público e o
-- URL fica guardado diretamente na coluna da entidade.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'covers',
  'covers',
  true,
  10485760, -- 10MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "authenticated can manage cover objects"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'covers')
  with check (bucket_id = 'covers');

-- ---------- Colunas de capa em eventos e notícias ----------
-- (projetos já têm `image`)

alter table events add column if not exists cover_image text;
alter table news add column if not exists cover_image text;
