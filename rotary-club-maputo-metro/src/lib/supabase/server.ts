import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // "setAll" foi chamado a partir de um Server Component (só leitura).
            // Sem problema aqui: o site público não tem sessão de utilizador
            // para persistir — as rotas de API (/api/message, /api/get-involved)
            // continuam a poder escrever cookies normalmente.
          }
        },
      },
    }
  )
}
