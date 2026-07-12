"use client";

import { useLang } from "@/lib/i18n";

/**
 * Aviso de Privacidade — PÁGINA PROVISÓRIA.
 * O texto jurídico final será fornecido pelo cliente na Fase 6.
 */
export default function PrivacyPage() {
  const { t } = useLang();
  return (
    <div className="page-in">
      <div className="section" style={{ maxWidth: 760 }}>
        <div className="eyebrow">Legal</div>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>
          {t({ pt: "Aviso de Privacidade", en: "Privacy Notice" })}
        </h1>
        <p className="lead">
          {t({
            pt: "Esta página receberá o aviso de privacidade oficial do Rotary Club of Maputo Metro, incluindo a política de tratamento de dados dos formulários e o consentimento de imagem da galeria. (Conteúdo em preparação.)",
            en: "This page will hold the official privacy notice of Rotary Club of Maputo Metro, including the data-processing policy for the forms and the image consent policy for the gallery. (Content in preparation.)",
          })}
        </p>
      </div>
    </div>
  );
}
