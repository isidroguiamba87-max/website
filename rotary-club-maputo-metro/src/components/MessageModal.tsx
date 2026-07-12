"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  FormEvent,
} from "react";
import { useLang } from "@/lib/i18n";

/**
 * Modal "Enviar Mensagem" — fiel ao protótipo: animação de entrada,
 * fecho por Escape / clique no fundo, e estado de sucesso.
 *
 * FASE 4 (Resend): substituir o corpo de handleSubmit por uma chamada a
 * /api/message que envia o email via Resend. Os campos já estão prontos.
 */

type ModalContextValue = { openMessageModal: () => void };
const ModalContext = createContext<ModalContextValue>({
  openMessageModal: () => {},
});

export function useMessageModal() {
  return useContext(ModalContext);
}

export function MessageModalProvider({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const openMessageModal = () => {
    setOpen(true);
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    setOpen(false);
    document.body.style.overflow = "";
    setTimeout(() => setSent(false), 250);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO Fase 4: enviar via Resend (POST /api/message)
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <ModalContext.Provider value={{ openMessageModal }}>
      {children}
      <div
        className={`modal-overlay ${open ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="modal-box">
          <button
            type="button"
            className="modal-close"
            onClick={close}
            aria-label={t({ pt: "Fechar", en: "Close" })}
          >
            ✕
          </button>

          {!sent ? (
            <div>
              <h3>{t({ pt: "Enviar uma mensagem", en: "Send a message" })}</h3>
              <p className="modal-sub">
                {t({
                  pt: "A sua mensagem será enviada ao clube e respondida assim que possível.",
                  en: "Your message will be sent to the club and answered as soon as possible.",
                })}
              </p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    <span>{t({ pt: "O seu nome", en: "Your name" })}</span>{" "}
                    <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={t({
                      pt: "ex: Ana Machava",
                      en: "e.g. Ana Machava",
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <span>{t({ pt: "O seu email", en: "Your email" })}</span>{" "}
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
                <div className="form-group">
                  <label>
                    <span>{t({ pt: "Mensagem", en: "Message" })}</span>{" "}
                    <span className="req">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder={t({
                      pt: "Como podemos ajudar?",
                      en: "How can we help?",
                    })}
                    required
                  />
                </div>
                <div className="submit-row">
                  <button type="submit" className="btn btn-primary">
                    {t({ pt: "Enviar Mensagem", en: "Send Message" })}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="success-box">
              <div className="check">✓</div>
              <h3>{t({ pt: "Mensagem enviada", en: "Message sent" })}</h3>
              <p>
                {t({
                  pt: "Obrigado pelo contacto — a equipa do Rotary Club of Maputo Metro irá responder ao seu email em breve.",
                  en: "Thank you for reaching out — the Rotary Club of Maputo Metro team will reply to your email soon.",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalContext.Provider>
  );
}
