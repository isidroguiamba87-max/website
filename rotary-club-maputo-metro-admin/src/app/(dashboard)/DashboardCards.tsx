"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import {
  IconBriefcase,
  IconFileText,
  IconCalendarCheck,
  IconCalendar,
  IconSend,
} from "@/components/icons";

const ICONS = {
  briefcase: IconBriefcase,
  draft: IconFileText,
  "calendar-check": IconCalendarCheck,
  calendar: IconCalendar,
  send: IconSend,
} as const;

const COLORS = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
} as const;

export type DashboardCard = {
  label: string;
  value: number;
  href: string;
  linkLabel: string;
  icon: keyof typeof ICONS;
  color: keyof typeof COLORS;
};

export default function DashboardCards({ cards }: { cards: DashboardCard[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {cards.map((c, i) => {
        const Icon = ICONS[c.icon];
        const color = COLORS[c.color];
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0 : 0.2,
              delay: reduced ? 0 : i * 0.03,
              ease: EASE,
            }}
          >
            <Link
              href={c.href}
              className="block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-rotary-blue"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color.bg} ${color.text}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-semibold text-neutral-900 mt-3">
                {c.value}
              </div>
              <div className="text-sm text-neutral-500 mt-0.5">{c.label}</div>
              <span className={`inline-block mt-2 text-xs font-medium ${color.text}`}>
                {c.linkLabel} →
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
