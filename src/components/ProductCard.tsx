import Image from "next/image";
import Link from "next/link";
import { brl, faixaEtaria, urlImagem } from "@/lib/formatar";
import type { Brinquedo } from "@/lib/tipos";
import { Estrela, Seta } from "./Icones";

export default function ProductCard({ b }: { b: Brinquedo }) {
  const foto = urlImagem(b.brinquedo_imagens[0]?.caminho);
  const preco = brl(b.preco);
  const idade = faixaEtaria(b.faixa_etaria_min, b.faixa_etaria_max);

  return (
    <Link
      href={`/brinquedos/${b.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-bf-azul-escuro/10 bg-white shadow-[0_6px_0_0_rgb(8_40_114/0.12)] transition duration-200 hover:-translate-y-1.5 hover:rotate-[-0.6deg] hover:shadow-[0_12px_0_0_rgb(8_40_114/0.16)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bf-ciano/70"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-bf-ciano/40 via-bf-azul/20 to-bf-amarelo/40">
        {foto ? (
          <Image src={foto} alt={b.nome} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <Image src="/mascote.png" alt="" width={160} height={160} className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 opacity-70" />
        )}
        {b.destaque && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bf-amarelo px-3 py-1 text-sm font-bold text-bf-azul-escuro shadow">
            <Estrela className="h-4 w-4" /> Destaque
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {b.categorias && <p className="text-xs font-extrabold uppercase tracking-wider text-bf-azul">{b.categorias.nome}</p>}
        <h3 className="mt-1 text-2xl font-bold leading-tight">{b.nome}</h3>
        {idade && <p className="mt-1 text-sm font-semibold text-bf-azul-escuro/70">Para {idade}</p>}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            {preco ? (
              <>
                <p className="text-xs font-bold text-bf-azul-escuro/70">a partir de</p>
                <p className="font-display text-3xl font-bold leading-none text-bf-vermelho">{preco}</p>
                {b.preco_referencia && <p className="mt-1 text-xs font-semibold text-bf-azul-escuro/70">{b.preco_referencia}</p>}
              </>
            ) : (
              <p className="font-display text-lg font-semibold">Consulte o valor</p>
            )}
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-bf-azul-escuro px-4 py-2 font-display text-base font-semibold text-white transition group-hover:bg-bf-azul">
            Ver datas <Seta className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
