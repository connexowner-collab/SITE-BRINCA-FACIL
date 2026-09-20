import type { Brinquedo, Categoria } from "./tipos";

export type SecaoCatalogo = { id: string; nome: string; slug: string; itens: Brinquedo[] };

export const SLUG_OUTROS = "outros";

/**
 * Agrupa os itens publicados em seções por categoria, na ordem das categorias.
 * Itens sem categoria (ou de categoria removida) caem numa seção final.
 */
export function secoesDoCatalogo(
  brinquedos: Brinquedo[],
  categorias: Categoria[],
): SecaoCatalogo[] {
  const porCategoria = new Map<string, Brinquedo[]>();
  const semCategoria: Brinquedo[] = [];

  for (const b of brinquedos) {
    const cat = b.categoria_id && categorias.find((c) => c.id === b.categoria_id);
    if (cat) {
      const lista = porCategoria.get(cat.id) ?? [];
      lista.push(b);
      porCategoria.set(cat.id, lista);
    } else {
      semCategoria.push(b);
    }
  }

  const secoes: SecaoCatalogo[] = [];
  for (const c of categorias) {
    const itens = porCategoria.get(c.id);
    if (itens && itens.length) {
      secoes.push({ id: `cat-${c.slug}`, nome: c.nome, slug: c.slug, itens });
    }
  }
  if (semCategoria.length) {
    secoes.push({
      id: `cat-${SLUG_OUTROS}`,
      nome: secoes.length ? "Mais opções" : "Nosso catálogo",
      slug: SLUG_OUTROS,
      itens: semCategoria,
    });
  }
  return secoes;
}
