"use client";

import Image from "next/image";
import { useState } from "react";

export default function Galeria({ imagens, nome }: { imagens: string[]; nome: string }) {
  const [ativa, setAtiva] = useState(0);

  if (imagens.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-gradient-to-br from-bf-ciano/40 via-bf-azul/20 to-bf-amarelo/40">
        <Image src="/mascote.png" alt="" width={200} height={200} className="h-40 w-40 opacity-70" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-2 border-bf-azul-escuro/10 bg-white shadow-[0_6px_0_0_rgb(8_40_114/0.12)]">
        <Image
          key={imagens[ativa]}
          src={imagens[ativa]}
          alt={`${nome}, foto ${ativa + 1} de ${imagens.length}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-entra object-cover"
          loading={ativa === 0 ? "eager" : "lazy"}
        />
      </div>
      {imagens.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Fotos do brinquedo">
          {imagens.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setAtiva(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === ativa}
                className={`relative block h-16 w-20 overflow-hidden rounded-xl border-4 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bf-ciano/70 ${
                  i === ativa ? "border-bf-vermelho" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
