import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Chave PÚBLICA (publishable/anon). Nunca coloque a secret/service_role neste projeto.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function supabaseConfigurado(): boolean {
  return Boolean(url && chave);
}

const opcoes = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
} as const;

/** Cliente para Server Components e rotas de API (uma instância por chamada). */
export function criarClienteServidor(): SupabaseClient {
  if (!url || !chave) throw new Error("Variáveis NEXT_PUBLIC_SUPABASE_* não configuradas.");
  return createClient(url, chave, opcoes);
}

let clienteBrowser: SupabaseClient | null = null;

/** Cliente para componentes do navegador (singleton). */
export function clienteNavegador(): SupabaseClient {
  if (!url || !chave) throw new Error("Variáveis NEXT_PUBLIC_SUPABASE_* não configuradas.");
  if (!clienteBrowser) clienteBrowser = createClient(url, chave, opcoes);
  return clienteBrowser;
}
