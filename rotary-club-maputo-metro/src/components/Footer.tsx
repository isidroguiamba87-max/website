"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="site">
      <h2 className="sr-only">{t({ pt: "Rodapé", en: "Footer" })}</h2>
      <div className="foot-grid">
        <div>
          <div className="foot-logo">
            <Image
              src="/images/logo2.png"
              alt="Rotary Club of Maputo Metro"
              className="logo-mark-img"
              width={227}
              height={95}
            />
            <div className="foot-logo-text">
              <div className="brand">Rotary</div>
              <div className="club">Club Maputo Metro</div>
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
          <h3>{t({ pt: "Explorar", en: "Explore" })}</h3>
          <Link href="/about-us">{t({ pt: "Sobre Nós", en: "About Us" })}</Link>
          <Link href="/projects">{t({ pt: "Projetos", en: "Projects" })}</Link>
          <Link href="/events">{t({ pt: "Eventos", en: "Events" })}</Link>
          <Link href="/news">{t({ pt: "Notícias", en: "News" })}</Link>
        </div>
        <div>
          <h3>{t({ pt: "Participar", en: "Take Action" })}</h3>
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
          <h3>Legal</h3>
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
