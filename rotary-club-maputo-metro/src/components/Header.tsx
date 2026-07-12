"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang, Bi } from "@/lib/i18n";

/**
 * Cabeçalho do site — fiel ao protótipo:
 * sublinhado dourado no link ativo (e no hover), CTA azul "Envolver-se",
 * menu burger no telemóvel, sombra subtil ao fazer scroll,
 * e alternador PT/EN.
 *
 * NOTA: o círculo "RCM" é temporário — será substituído pelo lockup
 * oficial da marca quando o asset for fornecido (Fase 6).
 */

const navItems: { href: string; label: Bi }[] = [
  { href: "/", label: { pt: "Início", en: "Home" } },
  { href: "/about-us", label: { pt: "Sobre Nós", en: "About Us" } },
  { href: "/projects", label: { pt: "Projetos", en: "Projects" } },
  { href: "/events", label: { pt: "Eventos", en: "Events" } },
  { href: "/news", label: { pt: "Notícias", en: "News" } },
  { href: "/contact", label: { pt: "Contactos", en: "Contact" } },
];

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fecha o menu mobile ao navegar
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`site ${scrolled ? "scrolled" : ""}`}>
      <Link href="/" className="logo-lockup">
        <div className="logo-mark">RCM</div>
        <div className="logo-text">
          <div className="club">Rotary Club of Maputo Metro</div>
          <div className="tag">
            {t({ pt: "Distrito 9400 · Pessoas de Ação", en: "District 9400 · People of Action" })}
          </div>
        </div>
      </Link>

      <nav className={`main ${menuOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
          >
            {t(item.label)}
          </Link>
        ))}
        <Link
          href="/get-involved"
          className={`nav-cta ${pathname === "/get-involved" ? "active" : ""}`}
        >
          {t({ pt: "Envolver-se", en: "Get Involved" })}
        </Link>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="lang-toggle" role="group" aria-label="Idioma / Language">
          <button
            className={lang === "pt" ? "active" : ""}
            onClick={() => setLang("pt")}
          >
            PT
          </button>
          <button
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>
        <button
          className={`burger ${menuOpen ? "open" : ""}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
