# Rotary Club of Maputo Metro — Website

Site institucional do Rotary Club of Maputo Metro (Distrito 9400), construído a partir do protótipo aprovado e já com o conteúdo real do clube (Plano de Conteúdo de 08/07/2026).

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · fontes Lora + Inter (Google Fonts via `next/font`).

---

## Como correr localmente

Pré-requisito: Node.js 18.17 ou superior (recomendado: Node 20 LTS).

```bash
npm install
npm run dev
```

Abrir http://localhost:3000 no browser.

Para gerar a versão de produção:

```bash
npm run build
npm start
```

## Publicar na Vercel

1. Criar um repositório no GitHub e enviar este código (`git init`, `git add .`, `git commit`, `git push`).
2. Em vercel.com → "Add New Project" → importar o repositório. A Vercel deteta o Next.js automaticamente — não é preciso configurar nada.
3. Cada `git push` passa a publicar automaticamente.

## Estrutura do projeto

```
src/
  app/
    page.tsx            → Início (Home)
    about-us/           → Sobre Nós
    projects/           → Projetos (com filtros)
    events/             → Eventos (próximos/anteriores)
    get-involved/       → Envolver-se (formulário de interesse)
    contact/            → Contactos (com modal "Enviar Mensagem")
    privacy/            → Aviso de Privacidade (provisório)
    layout.tsx          → Layout raiz (header, footer, idioma, modal)
    globals.css         → Estilos (porte fiel do protótipo)
  components/
    Header.tsx          → Navegação + burger mobile + alternador PT/EN
    Footer.tsx
    Cards.tsx           → ProjectCard, EventRow, FilterChips, TrustCard
    Motion.tsx          → Reveal (scroll) e CountUp (números animados)
    MessageModal.tsx    → Modal "Enviar Mensagem"
  lib/
    i18n.tsx            → Sistema de idioma PT/EN
    data.ts             → Projetos, eventos, contactos e fotos principais
public/images/gallery/  → 1.º lote: 49 fotos gerais (photo-01 … photo-49)
public/images/events/   → 2.º lote: 59 fotos classificadas por evento/projeto
                          (wash-khongolote, doacao-sangue, end-polio-now,
                          seeds-of-change, dia-da-crianca, doacao-alimentos,
                          doacao-ajudas-tecnicas) — ver _mapa-de-origem.txt
```

## Como editar conteúdo (nesta fase)

- **Todo o conteúdo editável** (projetos, eventos, direção, textos institucionais, contactos) já vem do Supabase — editar diretamente nas tabelas (Table Editor no dashboard) ou via SQL. `src/lib/data.ts` continua a servir de referência de tipos e é a fonte usada pelo script de seed.
- **Trocar uma foto:** mudar o nome do ficheiro no campo `image` (ex.: `/images/gallery/photo-12.jpg`). Todas as 49 fotos já estão otimizadas na pasta `public/images/gallery/`.

## Supabase

- Configuração: `.env.local` (não commitado) com `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
- Clientes: `src/lib/supabase/client.ts` (browser), `server.ts` (Server Components), `admin.ts` (service_role, apenas server-side).
- Leitura de dados: `src/lib/supabase/queries.ts` (`getProjects`, `getEvents`, `getLeaders`, `getAboutValues` via `getSiteContent`, `getClubContacts`), consumidos pelas páginas `/`, `/projects`, `/events`, `/about-us` e `/contact` (Server Components que passam os dados a Client Components `*View.tsx`).
- Esquema: `supabase/migrations/*.sql` — correr todos, por ordem numérica, no SQL Editor do Supabase ao configurar um novo ambiente.
  - `001_projects_events.sql`, `002_leaders_about_site_content.sql` — conteúdo base.
  - `003_admin_core.sql` — categorias de projeto dinâmicas, rascunho/publicado, campos de evento (data real, hora, local), políticas de escrita para `authenticated`.
  - `004_gallery.sql` — bucket de Storage `gallery` (privado), tabelas `gallery_items` e `gallery_settings`, políticas de leitura pública restritas a itens aprovados (mesmo por link direto ao ficheiro).
- Tabelas: `projects`, `events`, `leaders`, `about_values`, `gallery_items` (listas); `site_content`, `club_contacts` e `gallery_settings` (linha única com `id = 1`).
- Seed inicial (migra `src/lib/data.ts` para as tabelas): `npm run db:seed`. Migração das ~108 fotos existentes para o Storage: `npm run db:migrate-gallery` (fotos já usadas em projetos/eventos entram Aprovadas; as 49 fotos gerais entram Pendentes, para aprovação no painel).
- RLS: leitura pública ativa só para conteúdo publicado/aprovado; escrita via sessão `authenticated` (painel de administração) ou `service_role` (scripts).
- **Painel de administração**: projeto separado, `../rotary-club-maputo-metro-admin` (Next.js + Supabase Auth), com gestão de Projetos, Eventos e Galeria (upload, aprovação de consentimento, reordenar por arrastar, rodar/recortar, escolha do estilo de exibição com pré-visualização). Ver o README desse projeto para detalhes.

## Idioma

O site é bilingue PT/EN com alternador no cabeçalho. Português é o idioma por omissão; a escolha do visitante fica guardada no browser. Quando for necessário ter URLs por idioma (/pt/…, /en/…), o sistema atual evolui para o i18n de rotas do Next.js sem reescrever os textos.

## Próximas fases (conforme documentação técnica)

- **Fase 3:** Supabase (PostgreSQL) + painel de administração — Projetos, Eventos e Galeria (com aprovação de consentimento) já feitos; Notícias, Submissões e Utilizadores por fazer.
- **Fase 4:** ligação dos formulários ao Resend (os pontos de ligação estão marcados com `TODO Fase 4` em `MessageModal.tsx` e `get-involved/page.tsx`).
- **Fase 5:** domínio (rotaryclubmaputometro.org via TurboHost) + DNS na Vercel.
- **Fase 6:** conteúdo final — logo oficial, nomes e fotos da direção, textos jurídicos, mapa das reuniões, links das redes sociais.

## Notas

- O círculo "RCM" no cabeçalho é um marcador temporário do logo — substituir pelo lockup oficial da marca Rotary quando o asset for fornecido.
- Vídeos: podem ser um link do YouTube (campo `video_url` em Projetos/Eventos, embutido na página) **ou** upload direto de ficheiro na Galeria (Supabase Storage, até 100MB). O upload direto consome armazenamento do Supabase — vale a pena vigiar o uso no dashboard (Storage) à medida que o clube publica mais eventos; para vídeos que não precisam de aprovação de consentimento com a mesma urgência, o YouTube continua a opção mais leve e sem custo.
- A atribuição das fotos às secções é agora feita na Galeria do painel de administração (associação a projeto/evento por foto), não mais em `src/lib/data.ts`.

## Pendências de conteúdo (marcadas com PENDENTE em src/lib/data.ts)

- Email e telefone oficiais do clube (Contactos mostram "Em breve")
- Email de destino do formulário Envolver-se (Fase 4)
- Logo oficial (Rotary Brand Center) — substitui o círculo "RCMM" do cabeçalho
- Fotos individuais da direção (8 membros — por agora iniciais)
- Links diretos do Facebook e LinkedIn
- Foto das colunas "Rotary International" em alta resolução (hero da Home)
- Confirmação do ano do evento do Dia da Criança
- Gráfico dos "5 princípios orientadores" com fotos do clube (peça a produzir)
- Eventos futuros (filtro "Próximos" está vazio de propósito)
