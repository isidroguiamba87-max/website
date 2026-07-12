"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
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
  // Se não houver eventos futuros, abre no separador "Anteriores"
  const hasUpcoming = events.some((e) => e.status === "upcoming");
  const [filter, setFilter] = useState<Filter>(
    hasUpcoming ? "upcoming" : "past"
  );

  const visible = events.filter((e) => e.status === filter);

  return (
    <div className="page-in">
      <div className="section tight">
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
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <FilterChips<Filter>
          active={filter}
          onChange={setFilter}
          options={[
            { value: "upcoming", label: { pt: "Próximos", en: "Upcoming" } },
            { value: "past", label: { pt: "Anteriores", en: "Past" } },
          ]}
        />
        {visible.map((e) => (
          <EventRow key={e.id} event={e} galleryItems={e.galleryItems} />
        ))}
        {visible.length === 0 && (
          <p className="empty-state">
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
        )}
      </div>
    </div>
  );
}
