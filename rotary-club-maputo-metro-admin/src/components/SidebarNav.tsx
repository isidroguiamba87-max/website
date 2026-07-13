"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/motion";
import {
  IconHome,
  IconBriefcase,
  IconCalendar,
  IconFileText,
  IconImage,
  IconSend,
  IconUsers,
} from "@/components/icons";

const NAV_ICON: Record<string, (props: { className?: string }) => JSX.Element> = {
  "/": IconHome,
  "/projetos": IconBriefcase,
  "/eventos": IconCalendar,
  "/noticias": IconFileText,
  "/galeria": IconImage,
  "/submissoes": IconSend,
  "/utilizadores": IconUsers,
};

export default function SidebarNav({
  items,
  unreadCount,
}: {
  items: { href: string; label: string }[];
  unreadCount: number;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = NAV_ICON[item.href];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active ? "text-rotary-blue" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {active && (
              <motion.span
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-md bg-rotary-blue/10"
                transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE }}
              />
            )}
            {Icon && <Icon className="relative w-[18px] h-[18px] shrink-0" />}
            <span className="relative flex-1">{item.label}</span>
            {item.href === "/submissoes" && unreadCount > 0 && (
              <span className="relative text-[11px] font-semibold bg-rotary-blue text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
