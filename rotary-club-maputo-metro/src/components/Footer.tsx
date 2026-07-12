"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="site">
      <div className="foot-grid">
        <div>
          <div className="foot-logo">
            <div className="logo-mark">RCM</div>
            <div
              className="club"
              style={{
                color: "#fff",
                fontFamily: "var(--font-lora), Lora, serif",
                fontWeight: 700,
                fontSize: "15.5px",
              }}
            >
              Rotary Club of Maputo Metro
            </div>
          </div>
          <p style={{ fontSize: "12.5px", color: "#B9C8E0", lineHeight: 1.6 }}>
            {t({
              pt: "Clube do Distrito 9400 da Rotary International, ao serviço da comunidade de Maputo desde 2023.",
              en: "A Rotary International club (District 9400), serving the Maputo community since 2023.",
            })}
          </p>
        </div>
        <div>
          <h4>{t({ pt: "Explorar", en: "Explore" })}</h4>
          <Link href="/about-us">{t({ pt: "Sobre Nós", en: "About Us" })}</Link>
          <Link href="/projects">{t({ pt: "Projetos", en: "Projects" })}</Link>
          <Link href="/events">{t({ pt: "Eventos", en: "Events" })}</Link>
          <Link href="/news">{t({ pt: "Notícias", en: "News" })}</Link>
        </div>
        <div>
          <h4>{t({ pt: "Participar", en: "Take Action" })}</h4>
          <Link href="/get-involved">
            {t({ pt: "Envolver-se", en: "Get Involved" })}
          </Link>
          <Link href="/contact">{t({ pt: "Contactos", en: "Contact" })}</Link>
          <a
            href="https://www.rotary.org/en"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rotary International ↗
          </a>
        </div>
        <div>
          <h4>Legal</h4>
          {/* Página de privacidade a criar na Fase 6, com o texto jurídico final */}
          <Link href="/privacy">
            {t({ pt: "Aviso de Privacidade", en: "Privacy Notice" })}
          </Link>
          <a
            href="https://brandcenter.rotary.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Brand Center ↗
          </a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>
          © {year} Rotary Club of Maputo Metro.{" "}
          {t({ pt: "Todos os direitos reservados.", en: "All rights reserved." })}
        </span>
        <span>
          {t({
            pt: "Desenvolvido por Smart Business Partner Technology, Lda",
            en: "Developed by Smart Business Partner Technology, Lda",
          })}
        </span>
      </div>
    </footer>
  );
}
