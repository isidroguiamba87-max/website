"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal, CountUp } from "@/components/Motion";
import { ProjectCard, EventRow, TrustCard } from "@/components/Cards";
import PrinciplesFlower from "@/components/PrinciplesFlower";
import type { Project, ClubEvent, GalleryItem } from "@/lib/data";
import type { SiteContent } from "@/lib/supabase/queries";

type EventWithGallery = ClubEvent & { galleryItems: GalleryItem[] };

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
  const { club, home, heroImage } = content;
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
          <Image
            src={heroImage}
            alt={t({
              pt: "Membros do Rotary Club of Maputo Metro em ação comunitária",
              en: "Rotary Club of Maputo Metro members in community service",
            })}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 45vw"
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

      {/* ---------- Trust cards ---------- */}
      <Reveal delay={70}>
        <div className="trust-row">
          <TrustCard
            title={{ pt: "Serviço à Comunidade", en: "Community Service" }}
            text={{
              pt: "Projetos locais concretos que respondem a necessidades reais das comunidades de Maputo.",
              en: "Hands-on local projects that respond to real needs in Maputo's communities.",
            }}
            iconClass="i-turquoise"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 14.5 4 10l3-3 4.5 4.5" />
                <path d="M15.5 14.5 20 10l-3-3-4.5 4.5" />
                <path d="M8.5 14.5 11 17l1-1 1 1 2.5-2.5" />
                <path d="M11 17 9.5 18.5a1.5 1.5 0 0 1-2-2.2" />
              </svg>
            }
          />
          <TrustCard
            title={{ pt: "Rede de Profissionais", en: "Professional Network" }}
            text={{
              pt: "Ligue-se a líderes de diversas áreas que partilham um compromisso com o serviço.",
              en: "Connect with leaders across industries who share a commitment to service.",
            }}
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
              </svg>
            }
          />
          <TrustCard
            title={{ pt: "Impacto Sustentável", en: "Sustainable Impact" }}
            text={{
              pt: "Iniciativas de longo prazo desenhadas com, e para, as pessoas que servem.",
              en: "Long-term initiatives designed with, and for, the people they serve.",
            }}
            iconClass="i-violet"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21V10" />
                <path d="M12 10C12 6 9 4 5 4c0 4 2 7 7 7Z" />
                <path d="M12 13c0-3.5 2.5-5.5 6-5.5 0 3.5-2 6-6 6Z" />
              </svg>
            }
          />
        </div>
      </Reveal>

      {/* ---------- 5 Princípios Orientadores do Rotary ---------- */}
      <div className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Rotary International</div>
            <h2>
              {t({
                pt: "Os 5 Princípios Orientadores",
                en: "The 5 Guiding Principles",
              })}
            </h2>
          </div>
        </div>
        <Reveal>
          <PrinciplesFlower
            centerTitle={club.name}
            centerSubtitle={t(club.district)}
          />
        </Reveal>
      </div>

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
            <Link href="/get-involved" className="btn btn-gold">
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
        {(upcoming.length > 0 ? upcoming : recent).map((e) => (
          <EventRow key={e.id} event={e} galleryItems={e.galleryItems} />
        ))}
      </div>
    </div>
  );
}
