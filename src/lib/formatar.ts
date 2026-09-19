import type { Brinquedo } from "./tipos";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const brl = (v: number | null | undefined): string | null => (v == null ? null : moeda.format(v));

export function faixaEtaria(min: number | null, max: number | null): string | null {
  if (min != null && max != null) return `${min} a ${max} anos`;
  if (min != null) return `a partir de ${min} anos`;
  if (max != null) return `até ${max} anos`;
  return null;
}

/** Monta a URL pública de uma imagem do bucket "publico" do Supabase Storage. */
export function urlImagem(caminho: string | null | undefined): string | null {
  if (!caminho) return null;
  if (/^https?:\/\//i.test(caminho)) return caminho;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const limpo = caminho.split("/").map(encodeURIComponent).join("/");
  return `${base.replace(/\/+$/, "")}/storage/v1/object/public/publico/${limpo}`;
}

export function imagensDoBrinquedo(b: Brinquedo): string[] {
  return b.brinquedo_imagens
    .map((i) => urlImagem(i.caminho))
    .filter((u): u is string => Boolean(u));
}

export const soDigitos = (s: string) => s.replace(/\D/g, "");

/** (12) 99999-8888 enquanto a pessoa digita. Recebe só dígitos, no máximo 11. */
export function formatarTelefone(digitos: string): string {
  const d = digitos.slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
