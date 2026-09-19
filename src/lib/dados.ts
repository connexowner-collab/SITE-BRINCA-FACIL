import "server-only";
import { cache } from "react";
import { criarClienteServidor, supabaseConfigurado } from "./supabase";
import { soDigitos } from "./formatar";
import type { Anuncio, Brinquedo, ConfigSite, CotacaoConsultada } from "./tipos";

const CAMPOS_BRINQUEDO =
  "id, categoria_id, nome, slug, descricao, inclui, preco, preco_referencia, duracao_padrao_min, " +
  "faixa_etaria_min, faixa_etaria_max, destaque, ordem, " +
  "categorias(nome, slug), brinquedo_imagens(id, caminho, ordem, principal)";

function normalizar(b: Brinquedo): Brinquedo {
  const imagens = [...(b.brinquedo_imagens ?? [])].sort(
    (x, y) => Number(y.principal) - Number(x.principal) || x.ordem - y.ordem,
  );
  return { ...b, inclui: b.inclui ?? [], brinquedo_imagens: imagens };
}

export async function listarBrinquedos(): Promise<Brinquedo[]> {
  if (!supabaseConfigurado()) return [];
  const { data, error } = await criarClienteServidor()
    .from("brinquedos")
    .select(CAMPOS_BRINQUEDO)
    .eq("publicado", true)
    .order("destaque", { ascending: false })
    .order("ordem")
    .order("nome");
  if (error) {
    console.error("[listarBrinquedos]", error.message);
    return [];
  }
  return ((data ?? []) as unknown as Brinquedo[]).map(normalizar);
}

export async function buscarBrinquedo(slug: string): Promise<Brinquedo | null> {
  if (!supabaseConfigurado()) return null;
  const { data, error } = await criarClienteServidor()
    .from("brinquedos")
    .select(CAMPOS_BRINQUEDO)
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();
  if (error) {
    console.error("[buscarBrinquedo]", error.message);
    return null;
  }
  return data ? normalizar(data as unknown as Brinquedo) : null;
}

export async function listarAnuncios(): Promise<Anuncio[]> {
  if (!supabaseConfigurado()) return [];
  const { data, error } = await criarClienteServidor()
    .from("anuncios")
    .select("id, titulo, texto, imagem_caminho, link_url, ordem")
    .eq("ativo", true)
    .order("ordem");
  if (error) {
    console.error("[listarAnuncios]", error.message);
    return [];
  }
  return (data ?? []) as Anuncio[];
}

const CONFIG_PADRAO: ConfigSite = {
  nomeEmpresa: "BrincaFácil",
  whatsapp: "",
  modeloCotacao:
    "Olá! Gostaria de uma cotação do {produto} para {data}, das {hora_inicio} às {hora_fim}. Protocolo: {protocolo}.",
  mensagemGeral: "Olá! Vim pelo site da BrincaFácil e gostaria de mais informações.",
  heroTitulo: "A festa mais divertida começa aqui",
  heroSubtitulo: "Escolha o brinquedo, veja as datas livres e peça sua cotação em um minuto.",
};

/** cache() evita consultar a configuração duas vezes na mesma visita (layout + página). */
export const carregarConfig = cache(async (): Promise<ConfigSite> => {
  if (!supabaseConfigurado()) return CONFIG_PADRAO;
  const { data, error } = await criarClienteServidor().from("configuracoes").select("chave, valor");
  if (error || !data) {
    if (error) console.error("[carregarConfig]", error.message);
    return CONFIG_PADRAO;
  }
  const mapa = new Map<string, unknown>(data.map((l: { chave: string; valor: unknown }) => [l.chave, l.valor]));
  const texto = (chave: string, padrao: string) => {
    const v = mapa.get(chave);
    return typeof v === "string" && v.trim() ? v : padrao;
  };
  const numero = soDigitos(String(mapa.get("whatsapp_numero") ?? ""));
  return {
    nomeEmpresa: texto("nome_empresa", CONFIG_PADRAO.nomeEmpresa),
    whatsapp: numero.length >= 12 ? numero : "",
    modeloCotacao: texto("modelo_mensagem_cotacao", CONFIG_PADRAO.modeloCotacao),
    mensagemGeral: texto("mensagem_whatsapp_geral", CONFIG_PADRAO.mensagemGeral),
    heroTitulo: texto("hero_titulo", CONFIG_PADRAO.heroTitulo),
    heroSubtitulo: texto("hero_subtitulo", CONFIG_PADRAO.heroSubtitulo),
  };
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function consultarCotacao(token: string): Promise<CotacaoConsultada | null> {
  if (!supabaseConfigurado() || !UUID.test(token)) return null;
  const { data, error } = await criarClienteServidor().rpc("consultar_cotacao", { p_token: token });
  if (error) {
    console.error("[consultarCotacao]", error.message);
    return null;
  }
  const linha = Array.isArray(data) ? data[0] : data;
  return linha ? (linha as CotacaoConsultada) : null;
}
