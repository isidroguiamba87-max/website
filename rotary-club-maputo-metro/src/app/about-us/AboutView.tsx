"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Motion";
import type { Leader } from "@/lib/data";
import type { SiteContent } from "@/lib/supabase/queries";

const LEADER_COLORS = ["var(--blue)", "var(--blue-dark)", "var(--gold)"];
const LEADER_TILTS = [-6, 4, -5, 5, -4, 6, -5, 4];

export default function AboutView({
  content,
  leaders,
}: {
  content: SiteContent;
  leaders: Leader[];
}) {
  const { t } = useLang();
  const { club, about, missionImage } = content;

  return (
    <div className="page-in">
      {/* ---------- Hero ---------- */}
      <div className="section about-hero">
        <div className="eyebrow">{t({ pt: "Sobre Nós", en: "About Us" })}</div>
        <h1 style={{ fontSize: 30 }}>
          {t({
            pt: "Raízes locais, alcance global",
            en: "Local roots, global reach",
          })}
        </h1>
        <p className="lead" style={{ marginTop: 12 }}>
          {t({
            pt: `O Rotary Club of Maputo Metro (${t(club.district)}) foi fundado em ${club.founded} e é um clube filiado à Rotary International — uma rede global de 1,2 milhões de vizinhos, amigos e líderes que agem para criar mudanças duradouras.`,
            en: `Rotary Club of Maputo Metro (${t(club.district)}) was chartered in ${club.founded} and is a club of Rotary International — a global network of 1.2 million neighbours, friends, and leaders who take action to create lasting change.`,
          })}
        </p>
        <div className="hero-ctas" style={{ marginTop: 20 }}>
          <Link href="/get-involved" className="btn btn-primary">
            {t({ pt: "Juntar-me ao Rotary", en: "Join Rotary" })}
          </Link>
          <Link href="/contact" className="btn btn-outline">
            {t({ pt: "Reuniões", en: "Meetings" })}
          </Link>
        </div>
      </div>

      {/* ---------- Missão do clube ---------- */}
      <div className="section split">
        <div className="photo-frame" style={{ height: 300 }}>
          <Image
            src={missionImage}
            alt={t({
              pt: "Membros do Rotary Club of Maputo Metro",
              en: "Rotary Club of Maputo Metro members",
            })}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>
            {t({ pt: "A nossa missão", en: "Our mission" })}
          </h2>
          <p className="lead">{t(about.mission)}</p>
        </div>
      </div>

      {/* ---------- Visão, missão e valores da Rotary International ---------- */}
      <div className="section alt">
        <div className="section-head">
          <div>
            <div className="eyebrow">Rotary International</div>
            <h2 style={{ fontSize: 22 }}>
              {t({
                pt: "A visão e os valores que seguimos",
                en: "The vision and values we follow",
              })}
            </h2>
          </div>
        </div>
        <Reveal>
          <div className="split" style={{ alignItems: "start", marginBottom: 28 }}>
            <div>
              <h3 style={{ fontSize: 17, marginBottom: 8 }}>
                {t({ pt: "Visão", en: "Vision" })}
              </h3>
              <p className="lead" style={{ fontSize: 14 }}>
                {t(about.riVision)}
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 17, marginBottom: 8 }}>
                {t({ pt: "Missão", en: "Mission" })}
              </h3>
              <p className="lead" style={{ fontSize: 14 }}>
                {t(about.riMission)}
              </p>
            </div>
          </div>
          <div className="trust-row values-grid">
            {about.values.map((v, i) => (
              <div className="trust-card" key={i}>
                <h4>{t(v.title)}</h4>
                <p>{t(v.text)}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ---------- Direção 2026–2027 ---------- */}
      <div className="section institutional">
        <div className="section-head">
          <div>
            <h2 style={{ fontSize: 22 }}>
              {t({
                pt: "Direção do clube — 2026–2027",
                en: "Club leadership — 2026–2027",
              })}
            </h2>
          </div>
        </div>
        <Reveal>
          <div className="leader-grid">
            {/* Fotos oficiais individuais PENDENTES — a Eleutéria vai enviar */}
            {leaders.map((l, i) => (
              <div
                className="leader-card"
                key={l.name}
                style={
                  {
                    "--leader-color": LEADER_COLORS[i % LEADER_COLORS.length],
                    "--leader-tilt": `${LEADER_TILTS[i % LEADER_TILTS.length]}deg`,
                    zIndex: i,
                  } as React.CSSProperties
                }
              >
                <div className="ph">
                  {l.name
                    .split(" ")
                    .filter((_, i, a) => i === 0 || i === a.length - 1)
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div className="leader-card-info">
                  <h4>{l.name}</h4>
                  <p>{t(l.role)}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ---------- Rotary International ---------- */}
      <div className="section">
        <Reveal>
          <div className="global-box">
            <div>
              <h3>
                {t({ pt: "Parte de algo maior", en: "Part of something bigger" })}
              </h3>
              <p>
                {t({
                  pt: "O Rotary Club of Maputo Metro é filiado à Rotary International. Conheça o movimento global de serviço.",
                  en: "Rotary Club of Maputo Metro is proudly affiliated with Rotary International. Learn about the global movement of service.",
                })}
              </p>
            </div>
            <a
              href="https://www.rotary.org/en"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              {t({ pt: "Visitar Rotary.org ↗", en: "Visit Rotary.org ↗" })}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
