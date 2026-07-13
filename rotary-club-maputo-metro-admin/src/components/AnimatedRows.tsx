"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * Linhas de tabela com entrada suave e escalonada — usar dentro de <tbody>.
 * O componente pai (Server Component) já faz o mapeamento dos dados para
 * JSX e passa o resultado aqui; isto só anima a apresentação (não pode
 * receber funções como props através da fronteira servidor/cliente).
 */
export default function AnimatedRows({
  rows,
  className = "border-t border-neutral-100 hover:bg-neutral-50 transition-colors",
}: {
  rows: { key: string; content: React.ReactNode }[];
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <>
      {rows.map((row, i) => (
        <motion.tr
          key={row.key}
          className={className}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0 : 0.22,
            delay: reduced ? 0 : Math.min(i, 12) * 0.025,
            ease: EASE,
          }}
        >
          {row.content}
        </motion.tr>
      ))}
    </>
  );
}
