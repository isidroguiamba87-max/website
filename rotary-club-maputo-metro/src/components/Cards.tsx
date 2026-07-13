"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, ReactNode, KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang, Bi } from "@/lib/i18n";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { EASE } from "@/components/Motion";
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
        <h3>{t(project.title)}</h3>
        <p>{t(project.summary)}</p>
      </div>
    </Link>
  );
}

/* ---------- Cartão de evento ---------- */

export function EventRow({
  event,
  galleryItems = [],
  index = 0,
}: {
  event: ClubEvent;
  galleryItems?: GalleryItem[];
  index?: number;
}) {
  const { t } = useLang();
  const [showGallery, setShowGallery] = useState(false);
  const reduced = useReducedMotion();
  const cover = galleryItems.find((g) => g.mediaType === "image");
  const youtubeEmbedUrl = event.videoUrl ? getYouTubeEmbedUrl(event.videoUrl) : null;
  const hasVideo = Boolean(event.videoUrl);
  const hasDirectVideo = hasVideo && !youtubeEmbedUrl;

  return (
    <motion.div
      className="event-card"
      layout="position"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: reduced ? 0 : 0.5,
        delay: reduced ? 0 : Math.min(index, 5) * 0.07,
        ease: EASE,
      }}
    >
      <div className="event-card-media">
        {cover ? (
          // Fotos vêm de URLs assinadas do Supabase Storage — <img> simples,
          // tal como no StackSlider, evita problemas de cache do next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="event-card-img"
            src={cover.url}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="event-card-media-fallback" aria-hidden>
            <Image src="/images/logo2.png" alt="" width={56} height={56} />
          </div>
        )}
        <div className="event-date">
          <span className="d">{event.day}</span>
          <span className="m">{t(event.month)}</span>
          <span className="y">{event.year}</span>
        </div>
        {hasVideo && (
          <div className="event-card-play" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      <div className="event-main">
        <h3>{t(event.title)}</h3>
        <p>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="event-main-pin"
            aria-hidden
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {t(event.info)}
        </p>

        <div className="event-card-actions">
          {event.mapQuery && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                event.mapQuery
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ padding: "6px 12px", fontSize: "11.5px" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t({ pt: "Ver local no mapa", en: "View location on map" })}
            </a>
          )}
          {galleryItems.length > 0 && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "6px 12px", fontSize: "11.5px" }}
              onClick={() => setShowGallery((v) => !v)}
              aria-expanded={showGallery}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {showGallery
                ? t({ pt: "Ocultar fotos", en: "Hide photos" })
                : t({
                    pt: `Ver fotos (${galleryItems.length})`,
                    en: `View photos (${galleryItems.length})`,
                  })}
            </button>
          )}
          {event.status === "upcoming" && (
            <Link href="/get-involved" className="btn btn-primary">
              {t({ pt: "Participar", en: "Attend" })}
            </Link>
          )}
        </div>

        <AnimatePresence initial={false}>
          {showGallery && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              <StackSlider items={galleryItems} />
            </motion.div>
          )}
        </AnimatePresence>

        {hasVideo && (
          <motion.div
            className="event-video"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
          >
            <div className="event-video-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
              {t({ pt: "Vídeo do evento", en: "Event video" })}
            </div>
            <div className="video-frame">
              {youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={t(event.title)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : hasDirectVideo ? (
                <video
                  src={encodeURI(event.videoUrl!)}
                  controls
                  preload="metadata"
                  poster={cover?.url}
                />
              ) : null}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
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
  const reduced = useReducedMotion();
  return (
    <div className="filter-row">
      {options.map((o) => (
        <button
          key={o.value}
          className={`filter-chip ${active === o.value ? "active" : ""}`}
          onClick={() => onChange(o.value)}
          aria-pressed={active === o.value}
        >
          {active === o.value && (
            <motion.span
              layoutId="filter-chip-bg"
              className="filter-chip-bg"
              transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
            />
          )}
          <span className="filter-chip-label">{t(o.label)}</span>
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
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 520px)");
    const update = () => setCanExpand(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const toggle = () => {
    if (!canExpand) return;
    setExpanded((v) => !v);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!canExpand) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className={`${variant === "gi" ? "gi-trust-card" : "trust-card"} ${
        expanded ? "expanded" : ""
      }`}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role={canExpand ? "button" : undefined}
      tabIndex={canExpand ? 0 : undefined}
      aria-expanded={canExpand ? expanded : undefined}
    >
      {icon && <div className={`icon ${iconClass}`}>{icon}</div>}
      <h3>{t(title)}</h3>
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
