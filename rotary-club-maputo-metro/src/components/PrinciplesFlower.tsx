"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang, Bi } from "@/lib/i18n";
import type { AboutValue } from "@/lib/data";

type Petal = {
  angle: number;
  photo: string;
  photoAlt: Bi;
  gradientFrom: string;
  gradientTo: string;
  shadow: string;
  label: Bi;
  iconLeft: number;
  iconTop: number;
  labelTop: number;
  icon: React.ReactNode;
};

const PETALS: Petal[] = [
  {
    angle: 0,
    photo: "/images/events/doacao-ajudas-tecnicas/04.jpg",
    photoAlt: { pt: "Doação de ajudas de mobilidade", en: "Mobility aid donation" },
    gradientFrom: "#93B5DE",
    gradientTo: "#5C82AE",
    shadow: "76,110,143",
    label: { pt: "SERVIÇO", en: "SERVICE" },
    iconLeft: 325,
    iconTop: 100,
    labelTop: 162,
    icon: (
      <path
        d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5 18 5 19.6 8.6 22 11.7 19.5 16.3 12 21 12 21z"
        fill="#fff"
        opacity="0.95"
      />
    ),
  },
  {
    angle: 72,
    photo: "/images/events/dia-da-crianca/05.jpg",
    photoAlt: { pt: "Dia da Criança", en: "Children's Day" },
    gradientFrom: "#BEA0CE",
    gradientTo: "#8B6A9E",
    shadow: "139,106,158",
    label: { pt: "DIVERSIDADE", en: "DIVERSITY" },
    iconLeft: 510,
    iconTop: 235,
    labelTop: 297,
    icon: (
      <g fill="#fff">
        <circle cx="8" cy="9" r="4" opacity="0.95" />
        <circle cx="16" cy="9" r="4" opacity="0.7" />
        <circle cx="12" cy="16" r="4" opacity="0.85" />
      </g>
    ),
  },
  {
    angle: 144,
    photo: "/images/events/seeds-of-change/07.jpg",
    photoAlt: { pt: "Seeds of Change", en: "Seeds of Change" },
    gradientFrom: "#ECC09E",
    gradientTo: "#D08F66",
    shadow: "208,143,102",
    label: { pt: "COMPANHEIRISMO", en: "FELLOWSHIP" },
    iconLeft: 440,
    iconTop: 453,
    labelTop: 515,
    icon: (
      <g fill="none" stroke="#fff" strokeWidth="2">
        <circle cx="8" cy="7" r="3" fill="#fff" stroke="none" opacity="0.95" />
        <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" opacity="0.95" />
        <circle cx="17" cy="8" r="2.6" fill="#fff" stroke="none" opacity="0.8" />
        <path d="M12.5 20c0-2.9 2-5.3 4.5-5.3s4.5 2.4 4.5 5.3" opacity="0.8" />
      </g>
    ),
  },
  {
    angle: 216,
    photo: "/images/events/end-polio-now/02.jpg",
    photoAlt: { pt: "Campanha End Polio Now", en: "End Polio Now Campaign" },
    gradientFrom: "#ECD59A",
    gradientTo: "#C9A34E",
    shadow: "201,163,78",
    label: { pt: "LIDERANÇA", en: "LEADERSHIP" },
    iconLeft: 210,
    iconTop: 453,
    labelTop: 515,
    icon: (
      <g>
        <line x1="6" y1="21" x2="6" y2="3" stroke="#fff" strokeWidth="2" opacity="0.95" />
        <path d="M6 4l11 4-11 4V4z" fill="#fff" opacity="0.95" />
      </g>
    ),
  },
  {
    angle: 288,
    photo: "/images/gallery/photo-35.jpg",
    photoAlt: { pt: "Membros do clube", en: "Club members" },
    gradientFrom: "#A3CABF",
    gradientTo: "#6E9E90",
    shadow: "110,158,144",
    label: { pt: "INTEGRIDADE", en: "INTEGRITY" },
    iconLeft: 140,
    iconTop: 235,
    labelTop: 297,
    icon: (
      <g fill="none" stroke="#fff" strokeWidth="1.7">
        <line x1="12" y1="3" x2="12" y2="19" opacity="0.95" />
        <line x1="4" y1="7" x2="20" y2="7" opacity="0.95" />
        <path d="M4 7l-3 6a3.2 3.2 0 0 0 6 0L4 7z" strokeWidth="1.5" opacity="0.9" />
        <path d="M20 7l-3 6a3.2 3.2 0 0 0 6 0L20 7z" strokeWidth="1.5" opacity="0.9" />
        <line x1="7" y1="20" x2="17" y2="20" opacity="0.95" />
      </g>
    ),
  },
];

const CANVAS = 650;
const PUSH_MULT = 1.7;

const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .trim();
}

function matchValue(petal: Petal, values: AboutValue[]) {
  return values.find(
    (v) =>
      normalize(v.title.pt) === normalize(petal.label.pt) ||
      normalize(v.title.en) === normalize(petal.label.en)
  );
}

export default function PrinciplesFlower({
  centerTitle,
  centerSubtitle,
  values,
}: {
  centerTitle: string;
  centerSubtitle?: string;
  values: AboutValue[];
}) {
  const { t } = useLang();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scale, setScale] = useState(1);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeIndex = lockedIndex ?? hoverIndex;

  const clearHoverTimeout = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const previewHover = (i: number) => {
    if (!canHover) return;
    clearHoverTimeout();
    setHoverIndex(i);
  };

  const scheduleHoverClose = () => {
    if (!canHover || lockedIndex !== null) return;
    clearHoverTimeout();
    hoverTimeout.current = setTimeout(() => setHoverIndex(null), 140);
  };

  const closePopup = () => {
    clearHoverTimeout();
    setLockedIndex(null);
    setHoverIndex(null);
  };

  const togglePetal = (i: number) => {
    clearHoverTimeout();
    setHoverIndex(null);
    setLockedIndex((prev) => (prev === i ? null : i));
  };

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / CANVAS);
    });
    observer.observe(el);
    setScale(el.getBoundingClientRect().width / CANVAS);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => () => clearHoverTimeout(), []);

  useEffect(() => {
    if (activeIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePopup();
    }
    function handlePointerDown(e: PointerEvent) {
      const wrap = wrapperRef.current;
      if (wrap && !wrap.contains(e.target as Node)) closePopup();
    }
    window.addEventListener("keydown", handleKey);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [activeIndex]);

  const active = useMemo(() => {
    if (activeIndex === null) return null;
    const petal = PETALS[activeIndex];
    const value = matchValue(petal, values);
    const ax0 = (petal.iconLeft / CANVAS) * 100;
    const ay0 = (petal.iconTop / CANVAS) * 100;
    const dirX = ax0 - 50;
    const dirY = ay0 - 50;
    const ax = Math.max(-15, Math.min(115, 50 + dirX * PUSH_MULT));
    const ay = Math.max(-15, Math.min(115, 50 + dirY * PUSH_MULT));
    const len = Math.hypot(dirX, dirY) || 1;
    return {
      petal,
      title: value?.title ?? petal.label,
      text: value?.text,
      ax,
      ay,
      dirX: dirX / len,
      dirY: dirY / len,
    };
  }, [activeIndex, values]);

  return (
    <div ref={wrapperRef} className="principles-flower-wrap">
      <div
        className="principles-flower-canvas"
        style={{ transform: `scale(${scale})` }}
      >
        {PETALS.map((p, i) => {
          const value = matchValue(p, values);
          const isOpen = activeIndex === i;
          return (
            <div
              key={p.angle}
              className={`principle-petal-group${isOpen ? " active" : ""}`}
              style={
                {
                  "--angle": `${p.angle}deg`,
                  "--shadow": p.shadow,
                } as React.CSSProperties
              }
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={t(value?.title ?? p.label)}
              onMouseEnter={() => previewHover(i)}
              onMouseLeave={scheduleHoverClose}
              onFocus={() => previewHover(i)}
              onBlur={() => scheduleHoverClose()}
              onClick={() => togglePetal(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePetal(i);
                }
              }}
            >
              <div className="principle-petal-shape">
                <Image src={p.photo} alt={t(p.photoAlt)} fill sizes="250px" />
                <div
                  className="principle-petal-tint"
                  style={{
                    background: `linear-gradient(160deg, ${p.gradientFrom} 0%, ${p.gradientTo} 100%)`,
                  }}
                />
              </div>

              <div
                className="principle-petal-icon"
                style={{ left: p.iconLeft, top: p.iconTop }}
              >
                <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
                  {p.icon}
                </svg>
              </div>
              <div
                className="principle-petal-label"
                style={{ left: p.iconLeft, top: p.labelTop }}
              >
                <span>{t(p.label)}</span>
              </div>
            </div>
          );
        })}

        <div className="principle-center">
          <span className="title">{centerTitle}</span>
          {centerSubtitle && <span className="subtitle">{centerSubtitle}</span>}
          <span className="caption">
            {t({ pt: "5 PRINCÍPIOS ORIENTADORES", en: "5 GUIDING PRINCIPLES" })}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="principle-popup-backdrop"
            className="principle-popup-backdrop"
            onClick={closePopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div
            className="principle-popup-anchor"
            style={{ left: `${active.ax}%`, top: `${active.ay}%` }}
            onMouseEnter={() => previewHover(activeIndex as number)}
            onMouseLeave={scheduleHoverClose}
          >
            <motion.div
              key={active.petal.angle}
              className="principle-popup-card"
              role="dialog"
              aria-label={t(active.title)}
              style={
                {
                  "--dot-from": active.petal.gradientFrom,
                  "--dot-to": active.petal.gradientTo,
                } as React.CSSProperties
              }
              initial={{
                opacity: 0,
                scale: reducedMotion ? 1 : 0.85,
                x: reducedMotion ? 0 : active.dirX * 26,
                y: reducedMotion ? 0 : active.dirY * 26,
              }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{
                opacity: 0,
                scale: reducedMotion ? 1 : 0.92,
                x: reducedMotion ? 0 : active.dirX * 14,
                y: reducedMotion ? 0 : active.dirY * 14,
              }}
              transition={
                reducedMotion
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 320, damping: 28 }
              }
            >
              <button
                type="button"
                className="principle-popup-close"
                onClick={closePopup}
                aria-label={t({ pt: "Fechar", en: "Close" })}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <div className="principle-popup-dot">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  {active.petal.icon}
                </svg>
              </div>
              <h3>{t(active.title)}</h3>
              {active.text && <p>{t(active.text)}</p>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
