import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente com a service-role key — só para operações de administração de
 * utilizadores (supabase.auth.admin.*). Nunca importar num componente
 * cliente; a chave não tem o prefixo NEXT_PUBLIC_ por isso o Next.js já
 * impede que seja incluída no bundle do browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Falta NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY em .env.local"
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
