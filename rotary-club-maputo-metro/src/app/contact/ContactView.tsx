"use client";

import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Motion";
import { useMessageModal } from "@/components/MessageModal";
import MeetingMap from "@/components/MeetingMap";
import type { ClubContactsData } from "@/lib/data";

export default function ContactView({
  clubContacts,
}: {
  clubContacts: ClubContactsData;
}) {
  const { t } = useLang();
  const { openMessageModal } = useMessageModal();

  return (
    <div className="page-in">
      <div className="section">
        <div className="eyebrow">{t({ pt: "Contactos", en: "Contact" })}</div>
        <h1 style={{ fontSize: 28, marginBottom: 30 }}>
          {t({ pt: "Fale com o clube", en: "Talk to the club" })}
        </h1>
        <Reveal>
          <h2 className="sr-only">
            {t({ pt: "Informação de contacto", en: "Contact information" })}
          </h2>
          <div className="contact-grid">
            <div>
              <div className="contact-item">
                <div className="ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>
                <div>
                  <h3>Email</h3>
                  <p>
                    {clubContacts.email ? (
                      <a href={`mailto:${clubContacts.email}`}>
                        {clubContacts.email}
                      </a>
                    ) : (
                      t({ pt: "Em breve", en: "Coming soon" })
                    )}
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.5.4-1 1-1H7.4c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
                  </svg>
                </div>
                <div>
                  <h3>{t({ pt: "Telefone", en: "Phone" })}</h3>
                  <p>
                    {clubContacts.phone ||
                      t({ pt: "Em breve", en: "Coming soon" })}
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
                    <circle cx="12" cy="9.5" r="2.3" />
                  </svg>
                </div>
                <div>
                  <h3>{t({ pt: "Reuniões", en: "Meetings" })}</h3>
                  <p>{t(clubContacts.meetings)}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ic">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 15 15 9" />
                    <path d="M10.5 6.5 12 5a3.5 3.5 0 1 1 5 5l-1.5 1.5" />
                    <path d="M13.5 17.5 12 19a3.5 3.5 0 1 1-5-5l1.5-1.5" />
                  </svg>
                </div>
                <div>
                  <h3>{t({ pt: "Siga-nos", en: "Follow us" })}</h3>
                  <div className="social-row">
                    <a href={clubContacts.social.facebook} aria-label="Facebook">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.5 21v-7.8h2.6l.4-3H13.5V8.2c0-.87.24-1.46 1.5-1.46h1.6V4.14C16.3 4.1 15.36 4 14.27 4 12 4 10.44 5.4 10.44 7.96v2.24H7.8v3h2.64V21h3.06Z" />
                      </svg>
                    </a>
                    <a href={clubContacts.social.linkedin} aria-label="LinkedIn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.94 8.5a1.94 1.94 0 1 0 0-3.88 1.94 1.94 0 0 0 0 3.88ZM5.2 10.2h3.5V19H5.2v-8.8ZM11.2 10.2h3.35v1.2h.05c.47-.87 1.6-1.78 3.3-1.78 3.53 0 4.18 2.32 4.18 5.33V19h-3.5v-3.98c0-.95-.02-2.17-1.32-2.17-1.33 0-1.53 1.03-1.53 2.1V19h-3.5v-8.8Z" />
                      </svg>
                    </a>
                    <a href={clubContacts.social.instagram} aria-label="Instagram">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="4" y="4" width="16" height="16" rx="4.5" />
                        <circle cx="12" cy="12" r="3.6" />
                        <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={openMessageModal}
                style={{ marginTop: 8 }}
              >
                {t({ pt: "Enviar Mensagem", en: "Send Message" })}
              </button>
            </div>

            <MeetingMap />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
