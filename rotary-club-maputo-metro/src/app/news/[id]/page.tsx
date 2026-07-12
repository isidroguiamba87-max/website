import { notFound } from "next/navigation";
import {
  getNewsArticle,
  getGalleryItems,
  getGallerySettings,
} from "@/lib/supabase/queries";
import NewsArticleView from "./NewsArticleView";

export default async function NewsArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getNewsArticle(params.id);
  if (!article) notFound();

  const [galleryItems, gallerySettings] = await Promise.all([
    getGalleryItems({ newsId: article.id }),
    getGallerySettings(),
  ]);

  return (
    <NewsArticleView
      article={article}
      galleryItems={galleryItems}
      gallerySettings={gallerySettings}
    />
  );
}
