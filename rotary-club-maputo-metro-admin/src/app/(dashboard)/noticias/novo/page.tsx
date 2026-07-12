import { createNews } from "../actions";
import NewsForm from "../NewsForm";

export default function NovoArtigoPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Novo Artigo</h1>
      <div className="mt-6">
        <NewsForm action={createNews} />
      </div>
    </div>
  );
}
