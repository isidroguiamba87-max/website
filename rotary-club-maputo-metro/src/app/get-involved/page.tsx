"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Motion";
import { TrustCard } from "@/components/Cards";

/**
 * Página Envolver-se — formulário de interesse (Submission).
 *
 * FASE 4 (Resend): substituir o corpo de handleSubmit por uma chamada a
 * /api/get-involved, que envia o email ao clube via Resend e/ou grava a
 * submissão no Supabase (tabela Submission, Fase 3).
 */

const participationOptions = [
  { id: "join", pt: "Juntar-me ao Rotary", en: "Join Rotary" },
  { id: "donate", pt: "Doar", en: "Donate" },
  { id: "volunteer", pt: "Voluntariar", en: "Volunteer" },
  { id: "services", pt: "Prestar serviços", en: "Provide services" },
  { id: "partner", pt: "Apoiar como parceiro", en: "Partner with us" },
  { id: "info", pt: "Pedir mais informação", en: "Request information" },
];

const contributionOptions = [
  { id: "monetary", pt: "Monetário", en: "Monetary" },
  { id: "services", pt: "Serviços", en: "Services" },
  { id: "food", pt: "Alimentos", en: "Food" },
  { id: "clothing", pt: "Roupas", en: "Clothing" },
  { id: "property", pt: "Propriedade/espaço", en: "Property / space" },
  { id: "school", pt: "Material escolar", en: "School supplies" },
  { id: "furniture", pt: "Mobiliário", en: "Furniture" },
  { id: "other", pt: "Outro", en: "Other" },
];

export default function GetInvolvedPage() {
  const { lang, t } = useLang();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO Fase 4: enviar via Resend / gravar no Supabase
    setSent(true);
  };

  // No hero desta página o protótipo mostra as duas línguas em simultâneo,
  // com a língua inativa em itálico mais pequeno — mantemos esse efeito.
  const heroTitle = {
    pt: "Junte-se ao Rotary Club of Maputo Metro e apoie impacto real na comunidade",
    en: "Join Rotary Club of Maputo Metro and support real community impact",
  };
  const heroLead = {
    pt: "Quer tornar-se membro, voluntariar, doar ou apoiar com serviços ou bens — diga-nos como, e a nossa equipa entrará em contacto.",
    en: "Whether you want to become a member, volunteer, donate, or support with services or goods — tell us how, and our team will get in touch.",
  };
  const primary = lang;
  const secondary = lang === "pt" ? "en" : "pt";

  return (
    <div className="page-in">
      {/* ---------- Hero bilingue ---------- */}
      <div className="gi-hero">
        <h1>
          <span className="bi-line">{heroTitle[primary]}</span>
          <span className="bi-line secondary">{heroTitle[secondary]}</span>
        </h1>
        <p className="lead">
          <span className="bi-line">{heroLead[primary]}</span>
          <span className="bi-line secondary">{heroLead[secondary]}</span>
        </p>
      </div>

      {/* ---------- Trust cards ---------- */}
      <Reveal>
        <div className="gi-trust-row">
          <TrustCard
            variant="gi"
            title={{ pt: "Serviço à Comunidade", en: "Community Service" }}
            text={{
              pt: "Projetos locais concretos que respondem a necessidades reais.",
              en: "Hands-on local projects that respond to real needs.",
            }}
          />
          <TrustCard
            variant="gi"
            title={{ pt: "Rede de Profissionais", en: "Professional Network" }}
            text={{
              pt: "Ligue-se a líderes de diversas áreas comprometidos com o serviço.",
              en: "Connect with leaders across industries who share a commitment to service.",
            }}
          />
          <TrustCard
            variant="gi"
            title={{ pt: "Impacto Sustentável", en: "Sustainable Impact" }}
            text={{
              pt: "Iniciativas de longo prazo desenhadas com, e para, as pessoas que servem.",
              en: "Long-term initiatives designed with, and for, the people they serve.",
            }}
          />
        </div>
      </Reveal>

      {/* ---------- Formulário ---------- */}
      <div className="form-wrap">
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <span>{t({ pt: "Nome completo", en: "Full name" })}</span>{" "}
                <span className="req">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder={t({ pt: "ex: Ana Machava", en: "e.g. Ana Machava" })}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <span>{t({ pt: "Endereço de email", en: "Email address" })}</span>{" "}
                <span className="req">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder={t({
                  pt: "ex: ana@exemplo.com",
                  en: "e.g. ana@example.com",
                })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <span>{t({ pt: "País de origem", en: "Country of origin" })}</span>{" "}
                  <span>{t({ pt: "(recomendado)", en: "(recommended)" })}</span>
                </label>
                <select name="origin" defaultValue="MZ">
                  <option value="MZ">{t({ pt: "Moçambique", en: "Mozambique" })}</option>
                  <option value="ZA">{t({ pt: "África do Sul", en: "South Africa" })}</option>
                  <option value="PT">Portugal</option>
                  <option value="other">{t({ pt: "Outro", en: "Other" })}</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <span>
                    {t({ pt: "País de residência", en: "Country of residence" })}
                  </span>{" "}
                  <span className="req">*</span>
                </label>
                <select name="residence" defaultValue="MZ" required>
                  <option value="MZ">{t({ pt: "Moçambique", en: "Mozambique" })}</option>
                  <option value="ZA">{t({ pt: "África do Sul", en: "South Africa" })}</option>
                  <option value="other">{t({ pt: "Outro", en: "Other" })}</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <span>{t({ pt: "Endereço de contacto", en: "Contact address" })}</span>{" "}
                  <span>{t({ pt: "(opcional)", en: "(optional)" })}</span>
                </label>
                <input type="text" name="address" />
              </div>
              <div className="form-group">
                <label>
                  <span>
                    {t({
                      pt: "Profissão / organização",
                      en: "Profession / organisation",
                    })}
                  </span>{" "}
                  <span>{t({ pt: "(opcional)", en: "(optional)" })}</span>
                </label>
                <input type="text" name="profession" />
              </div>
            </div>

            <div className="form-group">
              <label>
                <span>
                  {t({
                    pt: "Como pretende participar?",
                    en: "How would you like to participate?",
                  })}
                </span>{" "}
                <span className="req">*</span>
              </label>
              <div className="check-grid">
                {participationOptions.map((o) => (
                  <label className="check-item" key={o.id}>
                    <input type="checkbox" name="participation" value={o.id} />
                    <span>{t(o)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>
                <span>
                  {t({
                    pt: "Como pretende contribuir/doar?",
                    en: "How would you like to contribute?",
                  })}
                </span>{" "}
                <span className="req">*</span>
              </label>
              <div className="check-grid">
                {contributionOptions.map((o) => (
                  <label className="check-item" key={o.id}>
                    <input type="checkbox" name="contribution" value={o.id} />
                    <span>{t(o)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>
                <span>{t({ pt: "Detalhes adicionais", en: "Additional details" })}</span>{" "}
                <span>{t({ pt: "(opcional)", en: "(optional)" })}</span>
              </label>
              <textarea
                rows={3}
                name="details"
                placeholder={t({
                  pt: "Conte-nos um pouco mais...",
                  en: "Tell us a bit more...",
                })}
              />
            </div>

            <label className="consent-box">
              <input type="checkbox" name="consent" required />
              <span>
                {t({
                  pt: "Confirmo o consentimento para ser contactado(a) pelo Rotary Club of Maputo Metro e para o tratamento dos dados submetidos.",
                  en: "I consent to be contacted by Rotary Club of Maputo Metro and to the processing of the information I've submitted.",
                })}
              </span>
            </label>

            <div className="submit-row">
              <button type="submit" className="btn btn-primary">
                {t({ pt: "Enviar Interesse", en: "Submit Interest" })}
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <Link
                href="/contact"
                style={{
                  fontSize: "12.5px",
                  color: "var(--pewter)",
                  textDecoration: "underline",
                }}
              >
                {t({
                  pt: "Prefere falar diretamente? Falar com o Clube",
                  en: "Prefer to talk instead? Talk to the Club",
                })}
              </Link>
            </div>
          </form>
        ) : (
          <div className="success-box">
            <div className="check">✓</div>
            <h3>
              {t({
                pt: "Obrigado — a sua mensagem foi enviada",
                en: "Thank you — your message is on its way",
              })}
            </h3>
            <p>
              {t({
                pt: "A equipa do Rotary Club of Maputo Metro entrará em contacto após análise do seu pedido.",
                en: "The Rotary Club of Maputo Metro team will get in touch after reviewing your request.",
              })}
            </p>
          </div>
        )}
      </div>
      <div style={{ height: 60 }} />
    </div>
  );
}
