import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente com privilégios de service_role — ignora RLS.
 * Usar apenas em código de servidor (Route Handlers, Server Actions),
 * nunca importar em Client Components.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
