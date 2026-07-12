"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import type { GalleryItem } from "@/lib/data";
import Lightbox from "./Lightbox";

const PEEK_COUNT = 3;

export default function StackSlider({ items }: { items: GalleryItem[] }) {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (items.length === 0) return null;

  const activeItem = items[active];
  const next = () => setActive((a) => (a + 1) % items.length);
  const prev = () => setActive((a) => (a - 1 + items.length) % items.length);

  const peekItems = Array.from(
    { length: Math.min(PEEK_COUNT, items.length - 1) },
    (_, i) => {
      const index = (active + i + 1) % items.length;
      return { item: items[index], index, layer: i };
    }
  ).reverse();

  return (
    <div className="event-slider">
      <div className="event-slider-stage">
        {/* fundo desfocado para preencher sem cortar a foto principal */}
        {activeItem.mediaType === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="event-slider-backdrop" src={activeItem.url} alt="" aria-hidden />
        )}

        <div className="event-slider-main" onClick={() => setLightboxOpen(true)}>
          {activeItem.mediaType === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeItem.url} alt={t(activeItem.caption)} />
          ) : (
            <video src={activeItem.url} muted controls />
          )}
          {(activeItem.caption.pt || activeItem.caption.en) && (
            <div className="event-slider-caption">
              <span>{t(activeItem.caption)}</span>
            </div>
          )}
        </div>

        {peekItems.map(({ item, index, layer }) => (
          <button
            key={item.id}
            type="button"
            className="event-slider-peek"
            style={{
              zIndex: 10 - layer,
              transform: `translateY(-50%) translateX(${layer * 22}px) rotate(${(layer + 1) * 3}deg)`,
            }}
            onClick={() => setActive(index)}
            aria-label={t({ pt: "Ver esta foto", en: "View this photo" })}
          >
            {item.mediaType === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt="" />
            ) : (
              <video src={item.url} muted />
            )}
          </button>
        ))}

        {items.length > 1 && (
          <div className="event-slider-controls">
            <button type="button" onClick={prev} aria-label={t({ pt: "Anterior", en: "Previous" })}>
              ‹
            </button>
            <button type="button" onClick={next} aria-label={t({ pt: "Seguinte", en: "Next" })}>
              ›
            </button>
          </div>
        )}
      </div>

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
