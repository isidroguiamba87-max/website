"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, Bi } from "@/lib/i18n";

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

export default function PrinciplesFlower({
  centerTitle,
  centerSubtitle,
}: {
  centerTitle: string;
  centerSubtitle?: string;
}) {
  const { t } = useLang();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

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

  return (
    <div ref={wrapperRef} className="principles-flower-wrap">
      <div
        className="principles-flower-canvas"
        style={{ transform: `scale(${scale})` }}
      >
        {PETALS.map((p) => (
          <div
            key={p.angle}
            className="principle-petal-group"
            style={
              {
                "--angle": `${p.angle}deg`,
                "--shadow": p.shadow,
              } as React.CSSProperties
            }
          >
            <div className="principle-petal-shape">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photo} alt={t(p.photoAlt)} />
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
        ))}

        <div className="principle-center">
          <span className="title">{centerTitle}</span>
          {centerSubtitle && <span className="subtitle">{centerSubtitle}</span>}
          <span className="caption">
            {t({ pt: "5 PRINCÍPIOS ORIENTADORES", en: "5 GUIDING PRINCIPLES" })}
          </span>
        </div>
      </div>
    </div>
  );
}
