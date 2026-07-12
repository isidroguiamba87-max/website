import { getClubContacts } from "@/lib/supabase/queries";
import ContactView from "./ContactView";

export default async function ContactPage() {
  const clubContacts = await getClubContacts();
  return <ContactView clubContacts={clubContacts} />;
}
