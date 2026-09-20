import type { SecaoCatalogo } from "@/lib/catalogo";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function CatalogoSecoes({ secoes }: { secoes: SecaoCatalogo[] }) {
  return (
    <div className="space-y-14">
      {secoes.map((secao) => (
        <section key={secao.id} id={secao.id} className="scroll-mt-24">
          <Reveal>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h3 className="font-display text-2xl font-bold sm:text-3xl">{secao.nome}</h3>
              <span className="whitespace-nowrap rounded-full bg-bf-azul-escuro/5 px-3 py-1 text-sm font-bold text-bf-azul-escuro/70">
                {secao.itens.length} {secao.itens.length === 1 ? "opção" : "opções"}
              </span>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {secao.itens.map((b) => (
              <ProductCard key={b.id} b={b} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
