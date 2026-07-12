"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Reveal } from "@/components/Motion";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import type { NewsArticle, GalleryItem, GallerySettingsData } from "@/lib/data";

export default function NewsArticleView({
  article,
  galleryItems,
  gallerySettings,
}: {
  article: NewsArticle;
  galleryItems: GalleryItem[];
  gallerySettings: GallerySettingsData;
}) {
  const { t } = useLang();

  return (
    <div className="page-in">
      <div className="section tight">
        <div className="eyebrow">{t({ pt: "Notícias", en: "News" })}</div>
        <h1 style={{ fontSize: 28 }}>{t(article.title)}</h1>
        <p className="lead" style={{ marginTop: 10, fontSize: 13 }}>
          {article.publishedAt}
          {article.author && ` · ${article.author}`}
        </p>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <Reveal>
          <div
            className="lead rich-text"
            style={{ maxWidth: 780 }}
            dangerouslySetInnerHTML={{ __html: t(article.body) }}
          />
          <GalleryGrid
            items={galleryItems}
            style={gallerySettings.style}
            fullscreen={gallerySettings.fullscreen}
          />
          <div style={{ marginTop: 22 }}>
            <Link href="/news" className="btn btn-outline">
              {t({ pt: "Ver todas as notícias", en: "See all news" })}
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
