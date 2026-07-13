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
 * O envio grava a mensagem na tabela `submissions` (via /api/message);
 * o clube responde a partir do painel de administração.
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const openMessageModal = () => {
    setOpen(true);
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    setOpen(false);
    document.body.style.overflow = "";
    setTimeout(() => {
      setSent(false);
      setError(false);
    }, 250);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setSent(true);
      form.reset();
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
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
                  <label htmlFor="mm-name">
                    <span>{t({ pt: "O seu nome", en: "Your name" })}</span>{" "}
                    <span className="req">*</span>
                  </label>
                  <input
                    id="mm-name"
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
                  <label htmlFor="mm-email">
                    <span>{t({ pt: "O seu email", en: "Your email" })}</span>{" "}
                    <span className="req">*</span>
                  </label>
                  <input
                    id="mm-email"
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
                  <label htmlFor="mm-message">
                    <span>{t({ pt: "Mensagem", en: "Message" })}</span>{" "}
                    <span className="req">*</span>
                  </label>
                  <textarea
                    id="mm-message"
                    rows={4}
                    name="message"
                    placeholder={t({
                      pt: "Como podemos ajudar?",
                      en: "How can we help?",
                    })}
                    required
                  />
                </div>
                {error && (
                  <p className="form-error">
                    {t({
                      pt: "Não foi possível enviar a mensagem. Tente novamente.",
                      en: "Couldn't send the message. Please try again.",
                    })}
                  </p>
                )}
                <div className="submit-row">
                  <button type="submit" className="btn btn-primary" disabled={sending}>
                    {sending
                      ? t({ pt: "A enviar…", en: "Sending…" })
                      : t({ pt: "Enviar Mensagem", en: "Send Message" })}
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
