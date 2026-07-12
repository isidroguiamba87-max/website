import { getSiteContent, getLeaders } from "@/lib/supabase/queries";
import AboutView from "./AboutView";

export default async function AboutPage() {
  const [content, leaders] = await Promise.all([
    getSiteContent(),
    getLeaders(),
  ]);
  return <AboutView content={content} leaders={leaders} />;
}
