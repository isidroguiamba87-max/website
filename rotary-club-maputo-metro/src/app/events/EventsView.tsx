"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { EASE } from "@/components/Motion";
import { EventRow, FilterChips } from "@/components/Cards";
import type { ClubEvent, GalleryItem } from "@/lib/data";

type Filter = "upcoming" | "past";
type EventWithGallery = ClubEvent & { galleryItems: GalleryItem[] };

export default function EventsView({
  events,
}: {
  events: EventWithGallery[];
}) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  // Se não houver eventos futuros, abre no separador "Anteriores"
  const hasUpcoming = events.some((e) => e.status === "upcoming");
  const [filter, setFilter] = useState<Filter>(
    hasUpcoming ? "upcoming" : "past"
  );

  const visible = events.filter((e) => e.status === filter);

  return (
    <div className="page-in">
      <motion.div
        className="section tight"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
      >
        <div className="eyebrow">{t({ pt: "Eventos", en: "Events" })}</div>
        <h1 style={{ fontSize: 28 }}>
          {t({ pt: "Venha conhecer-nos", en: "Meet us, join us" })}
        </h1>
        <p className="lead" style={{ marginTop: 10 }}>
          {t({
            pt: "Reuniões do clube, angariações de fundos e atividades comunitárias — todos são bem-vindos.",
            en: "Club meetings, fundraisers, and community activities — everyone is welcome.",
          })}
        </p>
        <div className="hero-ctas" style={{ marginTop: 16 }}>
          <Link href="/contact" className="btn btn-outline">
            {t({ pt: "Contactar o Clube", en: "Contact the Club" })}
          </Link>
        </div>
      </motion.div>

      <div className="section" style={{ paddingTop: 0 }}>
        <FilterChips<Filter>
          active={filter}
          onChange={setFilter}
          options={[
            { value: "upcoming", label: { pt: "Próximos", en: "Upcoming" } },
            { value: "past", label: { pt: "Anteriores", en: "Past" } },
          ]}
        />
        <h2 className="sr-only">
          {t({ pt: "Lista de eventos", en: "Event list" })}
        </h2>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
          >
            {visible.map((e, i) => (
              <EventRow key={e.id} event={e} galleryItems={e.galleryItems} index={i} />
            ))}
            {visible.length === 0 && (
              <div className="empty-state">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p>
                  {filter === "upcoming"
                    ? t({
                        pt: "Os próximos eventos do clube serão anunciados aqui em breve.",
                        en: "The club's upcoming events will be announced here soon.",
                      })
                    : t({
                        pt: "Ainda não há eventos nesta vista.",
                        en: "No events in this view yet.",
                      })}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
