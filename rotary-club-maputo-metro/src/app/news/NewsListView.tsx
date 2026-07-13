"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Motion";
import type { NewsArticle } from "@/lib/data";

export default function NewsListView({ articles }: { articles: NewsArticle[] }) {
  const { t } = useLang();

  return (
    <div className="page-in">
      <div className="section tight">
        <div className="eyebrow">{t({ pt: "Notícias", en: "News" })}</div>
        <h1 style={{ fontSize: 28 }}>
          {t({ pt: "O que se passa no clube", en: "What's happening at the club" })}
        </h1>
        <p className="lead" style={{ marginTop: 10 }}>
          {t({
            pt: "Novidades, histórias de impacto e atualizações do Rotary Club of Maputo Metro.",
            en: "Updates, impact stories and news from the Rotary Club of Maputo Metro.",
          })}
        </p>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <Reveal>
          <h2 className="sr-only">
            {t({ pt: "Lista de notícias", en: "News list" })}
          </h2>
          <div className="card-grid four">
            {articles.map((a) => (
              <Link key={a.id} href={`/news/${a.id}`} className="proj-card">
                <div className="photo-frame">
                  {a.coverImage ? (
                    <Image
                      src={a.coverImage.url}
                      alt={t(a.title)}
                      fill
                      sizes="(max-width: 900px) 50vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "var(--soft, #f6f5f3)",
                      }}
                    />
                  )}
                </div>
                <div className="body">
                  <span className="tagchip">{a.publishedAt}</span>
                  <h3>{t(a.title)}</h3>
                  <p>{t(a.excerpt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
        {articles.length === 0 && (
          <p className="empty-state">
            {t({
              pt: "Ainda não há notícias publicadas.",
              en: "No news published yet.",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
