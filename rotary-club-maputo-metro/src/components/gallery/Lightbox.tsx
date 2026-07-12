"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import type { GalleryItem } from "@/lib/data";

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const { t } = useLang();
  const item = items[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;

  return (
    <div
      className="lightbox-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label={t({ pt: "Fechar", en: "Close" })}
      >
        ✕
      </button>

      {items.length > 1 && (
        <>
          <button
            className="lightbox-nav prev"
            onClick={() => onNavigate((index - 1 + items.length) % items.length)}
            aria-label={t({ pt: "Anterior", en: "Previous" })}
          >
            ‹
          </button>
          <button
            className="lightbox-nav next"
            onClick={() => onNavigate((index + 1) % items.length)}
            aria-label={t({ pt: "Seguinte", en: "Next" })}
          >
            ›
          </button>
        </>
      )}

      <div className="lightbox-content">
        {item.mediaType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={t(item.caption)} />
        ) : (
          <video src={item.url} controls autoPlay />
        )}
        {(item.caption.pt || item.caption.en) && (
          <p className="lightbox-caption">{t(item.caption)}</p>
        )}
      </div>
    </div>
  );
}
