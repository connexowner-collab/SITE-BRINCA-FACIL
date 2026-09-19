/** Troca {chaves} do modelo pelos valores. Chaves desconhecidas ficam como estão. */
export function preencherModelo(modelo: string, valores: Record<string, string>): string {
  return modelo.replace(/\{(\w+)\}/g, (trecho, chave: string) => valores[chave] ?? trecho);
}

export function linkWhatsApp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
