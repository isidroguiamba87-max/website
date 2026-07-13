"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

const INTERVAL_MS = 6000;

export default function HeroCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="hero-carousel">
      <AnimatePresence>
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={alt}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: reducedMotion ? 1 : 1.08 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: reducedMotion ? 0.3 : 1.1, ease: "easeInOut" },
            scale: { duration: reducedMotion ? 0 : INTERVAL_MS / 1000, ease: "linear" },
          }}
          className="hero-carousel-img"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <div className="hero-carousel-dots">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={i === index ? "dot active" : "dot"}
              onClick={() => setIndex(i)}
              aria-label={t({ pt: `Ir para imagem ${i + 1}`, en: `Go to image ${i + 1}` })}
              aria-current={i === index ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
