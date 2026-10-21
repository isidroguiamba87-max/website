// URLs colados no painel podem vir de qualquer domínio; o next/image só
// otimiza os domínios listados em next.config.mjs (Supabase), por isso os
// restantes são servidos tal como estão.
export function isExternalImage(src: string): boolean {
  return /^https?:\/\//.test(src) && !/\.supabase\.co\/storage\//.test(src);
}
