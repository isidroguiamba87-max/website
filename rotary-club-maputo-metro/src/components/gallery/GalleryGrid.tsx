"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { GalleryItem, GalleryStyle } from "@/lib/data";
import { computeJustifiedRows } from "@/lib/justify";
import Lightbox from "./Lightbox";

function Thumb({ item }: { item: GalleryItem }) {
  const { t } = useLang();
  if (item.mediaType === "video") {
    return (
      <div className="gallery-thumb video">
        <video src={item.url} muted />
        <span className="gallery-play">▶</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="gallery-thumb" src={item.url} alt={t(item.caption)} loading="lazy" />;
}

function GridLayout({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (i: number) => void;
}) {
  return (
    <div className="gallery-grid-layout">
      {items.map((item, i) => (
        <button key={item.id} className="gallery-tile" onClick={() => onOpen(i)}>
          <Thumb item={item} />
        </button>
      ))}
    </div>
  );
}

function MasonryLayout({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (i: number) => void;
}) {
  return (
    <div className="gallery-masonry-layout">
      {items.map((item, i) => (
        <button
          key={item.id}
          className="gallery-masonry-tile"
          onClick={() => onOpen(i)}
        >
          <Thumb item={item} />
        </button>
      ))}
    </div>
  );
}

function JustifiedLayout({
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
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(
    () => computeJustifiedRows(items, width, 200, 8),
    [items, width]
  );

  let flatIndex = 0;

  return (
    <div ref={containerRef} className="gallery-justified-layout">
      {rows.map((row, ri) => (
        <div key={ri} className="gallery-justified-row">
          {row.map((box) => {
            const i = flatIndex++;
            return (
              <button
                key={box.item.id}
                className="gallery-justified-tile"
                style={{ width: box.width, height: box.height }}
                onClick={() => onOpen(i)}
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

function CarouselLayout({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (i: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="gallery-carousel-layout">
      <button
        className="gallery-carousel-arrow prev"
        onClick={() => scrollBy(-320)}
        aria-label="Anterior"
      >
        ‹
      </button>
      <div ref={scrollerRef} className="gallery-carousel-track">
        {items.map((item, i) => (
          <button
            key={item.id}
            className="gallery-carousel-tile"
            onClick={() => onOpen(i)}
          >
            <Thumb item={item} />
          </button>
        ))}
      </div>
      <button
        className="gallery-carousel-arrow next"
        onClick={() => scrollBy(320)}
        aria-label="Seguinte"
      >
        ›
      </button>
    </div>
  );
}

function SlideshowLayout({
  items,
  fullscreen,
  onOpen,
}: {
  items: GalleryItem[];
  fullscreen: boolean;
  onOpen: (i: number) => void;
}) {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);
  const item = items[current];

  return (
    <div className={`gallery-slideshow-layout ${fullscreen ? "fullscreen" : ""}`}>
      <div className="gallery-slideshow-main" onClick={() => onOpen(current)}>
        {item.mediaType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={t(item.caption)} />
        ) : (
          <video src={item.url} muted />
        )}
        {items.length > 1 && (
          <>
            <button
              className="gallery-slideshow-arrow prev"
              onClick={(e) => {
                e.stopPropagation();
                setCurrent((current - 1 + items.length) % items.length);
              }}
            >
              ‹
            </button>
            <button
              className="gallery-slideshow-arrow next"
              onClick={(e) => {
                e.stopPropagation();
                setCurrent((current + 1) % items.length);
              }}
            >
              ›
            </button>
          </>
        )}
      </div>
      {items.length > 1 && (
        <div className="gallery-slideshow-thumbs">
          {items.map((it, i) => (
            <button
              key={it.id}
              className={`gallery-slideshow-thumb ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            >
              <Thumb item={it} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GalleryGrid({
  items,
  style,
  fullscreen = false,
}: {
  items: GalleryItem[];
  style: GalleryStyle;
  fullscreen?: boolean;
}) {
  const { t } = useLang();
  const tags = useMemo(
    () => Array.from(new Set(items.map((i) => i.tag).filter(Boolean))) as string[],
    [items]
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = activeTag ? items.filter((i) => i.tag === activeTag) : items;

  if (items.length === 0) return null;

  return (
    <div className="gallery-wrap">
      {tags.length > 0 && (
        <div className="gallery-filter-row">
          <button
            className={`gallery-filter-chip ${!activeTag ? "active" : ""}`}
            onClick={() => setActiveTag(null)}
          >
            {t({ pt: "Todas", en: "All" })}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={`gallery-filter-chip ${activeTag === tag ? "active" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {style === "grid" && <GridLayout items={visible} onOpen={setLightboxIndex} />}
      {style === "masonry" && (
        <MasonryLayout items={visible} onOpen={setLightboxIndex} />
      )}
      {style === "justified" && (
        <JustifiedLayout items={visible} onOpen={setLightboxIndex} />
      )}
      {style === "carousel" && (
        <CarouselLayout items={visible} onOpen={setLightboxIndex} />
      )}
      {style === "slideshow" && (
        <SlideshowLayout
          items={visible}
          fullscreen={fullscreen}
          onOpen={setLightboxIndex}
        />
      )}

      {lightboxIndex !== null && (
        <Lightbox
          items={visible}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
