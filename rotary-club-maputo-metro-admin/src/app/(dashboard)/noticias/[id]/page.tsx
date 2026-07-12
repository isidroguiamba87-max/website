import { notFound } from "next/navigation";
import { getNewsArticle } from "@/lib/queries";
import { updateNews } from "../actions";
import NewsForm from "../NewsForm";

export default async function EditarArtigoPage({
  params,
}: {
  params: { id: string };
}) {
  const news = await getNewsArticle(params.id);
  if (!news) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Editar Artigo</h1>
      <div className="mt-6">
        <NewsForm action={updateNews.bind(null, news.id)} news={news} />
      </div>
    </div>
  );
}
