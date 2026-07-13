"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal, CountUp } from "@/components/Motion";
import { ProjectCard, EventRow } from "@/components/Cards";
import HeroCarousel from "@/components/HeroCarousel";
import type { Project, ClubEvent, GalleryItem } from "@/lib/data";
import type { SiteContent } from "@/lib/supabase/queries";

type EventWithGallery = ClubEvent & { galleryItems: GalleryItem[] };

const HERO_IMAGES = [
  "/images/gallery/photo-43.jpg",
  "/images/gallery/photo-45.jpg",
  "/images/gallery/photo-47.jpg",
];

export default function HomeView({
  projects,
  events,
  content,
}: {
  projects: Project[];
  events: EventWithGallery[];
  content: SiteContent;
}) {
  const { t } = useLang();
  const { club, home } = content;
  const featured = projects.filter((p) => p.featured);
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 2);
  const recent = events.filter((e) => e.status === "past").slice(0, 2);

  return (
    <div className="page-in">
      {/* ---------- Hero ---------- */}
      <div className="hero">
        <div>
          <h1>{t(home.headline)}</h1>
          <p className="lead">{t(home.lead)}</p>
          <div className="hero-ctas">
            <Link href="/get-involved" className="btn btn-primary">
              {t({ pt: "Quero Envolver-me", en: "Get Involved" })}
            </Link>
            <Link href="/projects" className="btn btn-outline">
              {t({ pt: "Conhecer Projetos", en: "View Projects" })}
            </Link>
          </div>
        </div>
        <div className="photo-frame">
          <HeroCarousel
            images={HERO_IMAGES}
            alt={t({
              pt: "Membros do Rotary Club of Maputo Metro em ação comunitária",
              en: "Rotary Club of Maputo Metro members in community service",
            })}
          />
        </div>
      </div>

      {/* ---------- Números de impacto ---------- */}
      {/* Proposta [A VALIDAR pelo clube] — ver Plano de Conteúdo, secção 2 */}
      <Reveal>
        <div className="stat-row">
          <div className="stat-card">
            <CountUp target={1.2} decimals={1} suffix="M+" />
            <div className="label">
              {t({
                pt: "membros no mundo, uma rede global",
                en: "members worldwide, one global network",
              })}
            </div>
          </div>
          <div className="stat-card">
            <CountUp target={club.founded} />
            <div className="label">
              {t({
                pt: "ano de fundação do clube em Maputo",
                en: "year our club was chartered in Maputo",
              })}
            </div>
          </div>
          <div className="stat-card">
            <CountUp target={6} suffix="+" />
            <div className="label">
              {t({
                pt: "eventos comunitários realizados",
                en: "community events delivered",
              })}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------- Projetos em destaque ---------- */}
      <div className="section alt">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              {t({ pt: "Em Destaque", en: "Featured" })}
            </div>
            <h2>
              {t({
                pt: "Projetos que fazem a diferença",
                en: "Projects making a difference",
              })}
            </h2>
          </div>
          <Link href="/projects" className="btn btn-outline">
            {t({ pt: "Ver todos os projetos", en: "See all projects" })}
          </Link>
        </div>
        <Reveal>
          <div className="card-grid">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Reveal>
      </div>

      {/* ---------- Convite (frases 3–4 do texto de apoio) ---------- */}
      <div className="section">
        <Reveal>
          <div className="global-box">
            <div>
              <h3>
                {t({ pt: "Junte-se a nós", en: "Join us" })}
              </h3>
              <p>{t(home.invite)}</p>
            </div>
            <Link href="/get-involved" className="btn btn-primary">
              {t({ pt: "Quero Envolver-me", en: "Get Involved" })}
            </Link>
          </div>
        </Reveal>
      </div>

      {/* ---------- Eventos ---------- */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <div className="eyebrow">
              {upcoming.length > 0
                ? t({ pt: "A Caminho", en: "Coming Up" })
                : t({ pt: "Atividade Recente", en: "Recent Activity" })}
            </div>
            <h2>
              {upcoming.length > 0
                ? t({ pt: "Próximos eventos", en: "Upcoming events" })
                : t({ pt: "Últimos eventos do clube", en: "Our latest events" })}
            </h2>
          </div>
          <Link href="/events" className="btn btn-outline">
            {t({ pt: "Ver todos os eventos", en: "See all events" })}
          </Link>
        </div>
        {(upcoming.length > 0 ? upcoming : recent).map((e, i) => (
          <EventRow key={e.id} event={e} galleryItems={e.galleryItems} index={i} />
        ))}
      </div>
    </div>
  );
}
