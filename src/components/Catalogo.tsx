"use client";

import { useMemo, useState } from "react";
import type { Brinquedo } from "@/lib/tipos";
import ProductCard from "./ProductCard";

export default function Catalogo({ brinquedos }: { brinquedos: Brinquedo[] }) {
  const [filtro, setFiltro] = useState<string>("todos");

  const categorias = useMemo(() => {
    const mapa = new Map<string, string>();
    brinquedos.forEach((b) => b.categorias && mapa.set(b.categorias.slug, b.categorias.nome));
    return [...mapa.entries()].map(([slug, nome]) => ({ slug, nome }));
  }, [brinquedos]);

  const lista = filtro === "todos" ? brinquedos : brinquedos.filter((b) => b.categorias?.slug === filtro);

  return (
    <div>
      {categorias.length > 1 && (
        <div role="group" aria-label="Filtrar por categoria" className="mb-8 flex flex-wrap justify-center gap-2">
          {[{ slug: "todos", nome: "Todos" }, ...categorias].map((c) => {
            const ativo = filtro === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                aria-pressed={ativo}
                onClick={() => setFiltro(c.slug)}
                className={`rounded-full border-2 px-5 py-2 font-display text-base font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bf-ciano/70 ${
                  ativo
                    ? "border-bf-azul-escuro bg-bf-azul-escuro text-white"
                    : "border-bf-azul-escuro/20 bg-white hover:border-bf-azul hover:text-bf-azul"
                }`}
              >
                {c.nome}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((b) => (
          <ProductCard key={b.id} b={b} />
        ))}
      </div>
    </div>
  );
}
