"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import type { GalleryItem } from "@/lib/data";
import Lightbox from "./Lightbox";

export default function ProjectPhotoReel({ items }: { items: GalleryItem[] }) {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (items.length === 0) return null;

  const hasMultiple = items.length > 1;
  const prevIndex = (active - 1 + items.length) % items.length;
  const nextIndex = (active + 1) % items.length;

  return (
    <div className="project-reel">
      <div className="project-reel-stack">
        {hasMultiple && (
          <button
            type="button"
            className="project-reel-card peek above"
            onClick={() => setActive(prevIndex)}
            aria-label={t({ pt: "Foto anterior", en: "Previous photo" })}
          >
            {items[prevIndex].mediaType === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={items[prevIndex].url} alt="" />
            ) : (
              <video src={items[prevIndex].url} muted />
            )}
          </button>
        )}

        <button
          type="button"
          className="project-reel-card active"
          onClick={() => setLightboxOpen(true)}
        >
          {items[active].mediaType === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={items[active].url} alt={t(items[active].caption)} />
          ) : (
            <video src={items[active].url} muted controls />
          )}
        </button>

        {hasMultiple && (
          <button
            type="button"
            className="project-reel-card peek below"
            onClick={() => setActive(nextIndex)}
            aria-label={t({ pt: "Foto seguinte", en: "Next photo" })}
          >
            {items[nextIndex].mediaType === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={items[nextIndex].url} alt="" />
            ) : (
              <video src={items[nextIndex].url} muted />
            )}
          </button>
        )}

        {hasMultiple && (
          <div className="project-reel-nav">
            <button
              type="button"
              onClick={() => setActive(prevIndex)}
              aria-label={t({ pt: "Anterior", en: "Previous" })}
            >
              ⌃
            </button>
            <button
              type="button"
              onClick={() => setActive(nextIndex)}
              aria-label={t({ pt: "Seguinte", en: "Next" })}
            >
              ⌄
            </button>
          </div>
        )}
      </div>

      {hasMultiple && (
        <div className="project-reel-dots">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={i === active ? "dot active" : "dot"}
              onClick={() => setActive(i)}
              aria-label={t({ pt: `Foto ${i + 1}`, en: `Photo ${i + 1}` })}
            />
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          items={items}
          index={active}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setActive}
        />
      )}
    </div>
  );
}
