# Rotary Club of Maputo Metro — Painel de Administração

Painel de administração do site do Rotary Club of Maputo Metro. Projeto Next.js separado do site público (`../rotary-club-maputo-metro`), ligado à mesma base de dados Supabase — o site público nunca carrega código deste painel.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Auth + Postgres + Storage).

## Como correr localmente

```bash
npm install
npm run dev
```

Abrir http://localhost:3001 (o site público corre em 3000; portas diferentes para os correr em simultâneo).

## Configuração

`.env.local` (não commitado) com:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — mesmos valores do site público (mesmo projeto Supabase).
- `SUPABASE_SERVICE_ROLE_KEY` — usado só pelo script `create-admin-user`, nunca pela aplicação em runtime.

## Criar uma conta de administrador

```bash
npm run create-admin-user -- email@exemplo.com
```

Gera uma password temporária (mostrada uma única vez no terminal). Login em `/login` com email + password.

## Autenticação

Supabase Auth (email + password). `middleware.ts` (dentro de `src/`, exigência do Next.js quando se usa pasta `src/`) protege todas as rotas exceto `/login`. Sem ecrã de recuperação de password nesta fase — usar o dashboard do Supabase (Authentication → Users) se necessário.

## Módulos

- **Projetos** (`/projetos`) — criar/editar/apagar, categorias dinâmicas (+ nova categoria), rascunho/publicado, destaque na home.
- **Eventos** (`/eventos`) — criar/editar/apagar, data/hora/local reais; "Próximo"/"Anterior" no site é automático a partir da data, sem campo manual.
- **Galeria** (`/galeria`) — upload de fotos e vídeos (drag-and-drop ou escolher ficheiros), associação a projeto/evento/geral, reordenar por arrastar, rodar/recortar fotos, definir capa, aprovação de consentimento (Pendente/Aprovada/Recusada — só aprovadas aparecem no site, mesmo por link direto ao ficheiro).
- **Estilo da Galeria** (`/galeria/definicoes`) — escolher entre Grid, Masonry, Justificada, Carrossel ou Slideshow (com modo ecrã inteiro), pré-visualizar com fotos reais antes de guardar. Aplica-se a todas as galerias do site (Lightbox universal para navegar foto a foto).

Notícias, Submissões e Utilizadores ainda não estão implementados (próximas fases).

## Publicar

Projeto Vercel próprio (separado do site público), idealmente num subdomínio (ex.: `admin.rotaryclubmaputometro.org` quando o domínio principal estiver tratado). Sem acesso público de navegação — só alcançável por quem tiver o URL e login válido.
