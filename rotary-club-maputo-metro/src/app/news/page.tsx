import { getNewsList } from "@/lib/supabase/queries";
import NewsListView from "./NewsListView";

export default async function NewsPage() {
  const articles = await getNewsList();
  return <NewsListView articles={articles} />;
}
