"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryItem, GallerySettings } from "@/lib/types";
import { computeJustifiedRows } from "@/lib/justify";

function Thumb({ item }: { item: GalleryItem }) {
  if (item.mediaType === "video") {
    return (
      <div className="preview-thumb video">
        <video src={item.url} muted />
        <span className="preview-play">▶</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="preview-thumb" src={item.url} alt={item.captionPt} />;
}

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const item = items[index];
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 text-white"
      >
        ✕
      </button>
      {items.length > 1 && (
        <>
          <button
            onClick={() => onNavigate((index - 1 + items.length) % items.length)}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white text-xl"
          >
            ‹
          </button>
          <button
            onClick={() => onNavigate((index + 1) % items.length)}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white text-xl"
          >
            ›
          </button>
        </>
      )}
      {item.mediaType === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.url} alt={item.captionPt} className="max-w-[90vw] max-h-[80vh] object-contain" />
      ) : (
        <video src={item.url} controls autoPlay className="max-w-[90vw] max-h-[80vh]" />
      )}
    </div>
  );
}

export default function PreviewGallery({
  items,
  settings,
}: {
  items: GalleryItem[];
  settings: GallerySettings;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <p className="text-sm text-neutral-400">
        Este grupo ainda não tem fotos aprovadas para pré-visualizar.
      </p>
    );
  }

  return (
    <div>
      {settings.style === "grid" && (
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setLightboxIndex(i)}
              className="h-40 rounded-lg overflow-hidden"
            >
              <Thumb item={item} />
            </button>
          ))}
        </div>
      )}

      {settings.style === "masonry" && (
        <div className="columns-3 gap-3 [&>*]:mb-3">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setLightboxIndex(i)}
              className="block w-full rounded-lg overflow-hidden break-inside-avoid"
            >
              <Thumb item={item} />
            </button>
          ))}
        </div>
      )}

      {settings.style === "justified" && (
        <JustifiedPreview items={items} onOpen={setLightboxIndex} />
      )}

      {settings.style === "carousel" && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setLightboxIndex(i)}
              className="shrink-0 w-52 h-36 rounded-lg overflow-hidden"
            >
              <Thumb item={item} />
            </button>
          ))}
        </div>
      )}

      {settings.style === "slideshow" && (
        <SlideshowPreview
          items={items}
          fullscreen={settings.fullscreen}
          onOpen={setLightboxIndex}
        />
      )}

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

function JustifiedPreview({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (i: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(() => computeJustifiedRows(items, width, 160, 8), [items, width]);
  let flatIndex = 0;

  return (
    <div ref={containerRef}>
      {rows.map((row, ri) => (
        <div key={ri} className="flex gap-2 mb-2">
          {row.map((box) => {
            const i = flatIndex++;
            return (
              <button
                key={box.item.id}
                style={{ width: box.width, height: box.height }}
                onClick={() => onOpen(i)}
                className="rounded-lg overflow-hidden shrink-0"
              >
                <Thumb item={box.item} />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function SlideshowPreview({
  items,
  fullscreen,
  onOpen,
}: {
  items: GalleryItem[];
  fullscreen: boolean;
  onOpen: (i: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const item = items[current];

  return (
    <div>
      <div
        onClick={() => onOpen(current)}
        className={`relative rounded-lg overflow-hidden bg-black cursor-pointer ${
          fullscreen ? "h-[70vh]" : "h-72"
        }`}
      >
        {item.mediaType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={item.captionPt} className="w-full h-full object-contain" />
        ) : (
          <video src={item.url} muted className="w-full h-full object-contain" />
        )}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrent((current - 1 + items.length) % items.length);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrent((current + 1) % items.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white"
            >
              ›
            </button>
          </>
        )}
      </div>
      {items.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {items.map((it, i) => (
            <button
              key={it.id}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-16 h-12 rounded overflow-hidden ${
                i === current ? "ring-2 ring-rotary-blue" : "opacity-60"
              }`}
            >
              <Thumb item={it} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
