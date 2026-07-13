import { notFound } from "next/navigation";
import { getNewsArticle, getGalleryItems } from "@/lib/queries";
import { updateNews } from "../actions";
import NewsForm from "../NewsForm";

export default async function EditarArtigoPage({
  params,
}: {
  params: { id: string };
}) {
  const [news, allGalleryItems] = await Promise.all([
    getNewsArticle(params.id),
    getGalleryItems(),
  ]);
  if (!news) notFound();

  const galleryItems = allGalleryItems.filter((i) => i.newsId === news.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Editar Artigo</h1>
      <div className="mt-6">
        <NewsForm
          action={updateNews.bind(null, news.id)}
          news={news}
          galleryItems={galleryItems}
        />
      </div>
    </div>
  );
}
