"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION } from "@/lib/motion";

/**
 * Crossfade curto entre páginas — só para tirar o "salto" seco da navegação,
 * não é uma coreografia de entrada (o painel é uma ferramenta, não uma
 * página de marca).
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : DURATION.base }}
    >
      {children}
    </motion.div>
  );
}
