"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, ReactNode } from "react";
import { useLang, Bi } from "@/lib/i18n";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import StackSlider from "@/components/gallery/StackSlider";
import type { Project, ClubEvent, GalleryItem } from "@/lib/data";

/* ---------- Cartão de projeto ---------- */

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useLang();
  const chipClass =
    project.status === "completed"
      ? "cat-completed"
      : `cat-${project.category}`;

  return (
    <Link href={`/projects/${project.id}`} className="proj-card">
      <div className="photo-frame">
        <Image
          src={project.image}
          alt={t(project.title)}
          fill
          sizes="(max-width: 900px) 50vw, 25vw"
        />
      </div>
      <div className="body">
        <span className={`tagchip ${chipClass}`}>
          {t(project.categoryLabel)}
        </span>
        <h4>{t(project.title)}</h4>
        <p>{t(project.summary)}</p>
      </div>
    </Link>
  );
}

/* ---------- Linha de evento ---------- */

export function EventRow({
  event,
  galleryItems = [],
}: {
  event: ClubEvent;
  galleryItems?: GalleryItem[];
}) {
  const { t } = useLang();
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="event-row">
      <div className="event-date">
        <span className="d">{event.day}</span>
        <span className="m">{t(event.month)}</span>
        <span className="y">{event.year}</span>
      </div>
      <div className="event-main">
        <h4>{t(event.title)}</h4>
        <p>{t(event.info)}</p>
        {galleryItems.length > 0 && (
          <>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "6px 12px", fontSize: "11.5px", marginTop: 8 }}
              onClick={() => setShowGallery((v) => !v)}
            >
              {showGallery
                ? t({ pt: "Ocultar fotos", en: "Hide photos" })
                : t({
                    pt: `Ver fotos (${galleryItems.length})`,
                    en: `View photos (${galleryItems.length})`,
                  })}
            </button>
            {showGallery && <StackSlider items={galleryItems} />}
          </>
        )}
        {event.videoUrl && getYouTubeEmbedUrl(event.videoUrl) && (
          <div className="video-frame" style={{ marginTop: 14 }}>
            <iframe
              src={getYouTubeEmbedUrl(event.videoUrl)!}
              title={t(event.title)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
            />
          </div>
        )}
      </div>
      {event.status === "upcoming" && (
        <Link href="/get-involved" className="btn btn-primary">
          {t({ pt: "Participar", en: "Attend" })}
        </Link>
      )}
    </div>
  );
}

/* ---------- Chips de filtro ---------- */

export function FilterChips<T extends string>({
  options,
  active,
  onChange,
}: {
  options: { value: T; label: Bi }[];
  active: T;
  onChange: (v: T) => void;
}) {
  const { t } = useLang();
  return (
    <div className="filter-row">
      {options.map((o) => (
        <button
          key={o.value}
          className={`filter-chip ${active === o.value ? "active" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {t(o.label)}
        </button>
      ))}
    </div>
  );
}

/* ---------- Trust card (expansível no telemóvel) ---------- */

export function TrustCard({
  title,
  text,
  icon,
  iconClass = "",
  variant = "trust",
}: {
  title: Bi;
  text: Bi;
  icon?: ReactNode;
  iconClass?: string;
  variant?: "trust" | "gi";
}) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    if (window.innerWidth > 520) return;
    setExpanded((v) => !v);
  };

  return (
    <div
      className={`${variant === "gi" ? "gi-trust-card" : "trust-card"} ${
        expanded ? "expanded" : ""
      }`}
      onClick={toggle}
    >
      {icon && <div className={`icon ${iconClass}`}>{icon}</div>}
      <h4>{t(title)}</h4>
      <p>{t(text)}</p>
      <span className="card-toggle-hint">
        <span>{t({ pt: "Ler mais", en: "Read more" })}</span>
        <svg
          className="chev"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
}
