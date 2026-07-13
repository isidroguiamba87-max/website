-- Rotary Club Maputo Metro — Fase 4: submissões dos formulários (Contacto, Envolver-se)
-- Correr este ficheiro completo no SQL Editor do Supabase (dashboard → SQL Editor → New query).

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('contact', 'get-involved')),
  name text not null,
  email text not null,
  message text not null,
  meta jsonb,
  status text not null default 'unread' check (status in ('unread', 'read', 'replied')),
  reply_body text,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

alter table submissions enable row level security;

-- Qualquer visitante (anon) pode criar uma submissão, mas nunca ler as dos outros.
create policy "anon can submit"
  on submissions for insert
  to anon
  with check (true);

-- Só utilizadores autenticados (painel de administração) veem e gerem as submissões.
create policy "authenticated users manage submissions"
  on submissions for all
  to authenticated
  using (true)
  with check (true);

create index if not exists submissions_status_idx on submissions (status);
create index if not exists submissions_created_at_idx on submissions (created_at desc);
