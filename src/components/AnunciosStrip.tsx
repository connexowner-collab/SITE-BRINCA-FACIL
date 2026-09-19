import Image from "next/image";
import Link from "next/link";
import { urlImagem } from "@/lib/formatar";
import type { Anuncio } from "@/lib/tipos";
import Reveal from "./Reveal";

function Cartao({ a }: { a: Anuncio }) {
  const img = urlImagem(a.imagem_caminho);
  const conteudo = (
    <div className="group relative flex h-full min-h-40 overflow-hidden rounded-3xl bg-bf-amarelo text-bf-azul-escuro shadow-[0_6px_0_0_#c99a08] transition hover:-translate-y-1">
      {img && (
        <Image src={img} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover opacity-40 transition duration-500 group-hover:scale-105" />
      )}
      <div className="relative p-5">
        <h3 className="text-2xl font-bold leading-tight">{a.titulo}</h3>
        {a.texto && <p className="mt-1 font-semibold">{a.texto}</p>}
      </div>
    </div>
  );
  if (!a.link_url) return conteudo;
  const externo = /^https?:\/\//i.test(a.link_url);
  return externo ? (
    <a href={a.link_url} target="_blank" rel="noopener noreferrer" className="block">{conteudo}</a>
  ) : (
    <Link href={a.link_url} className="block">{conteudo}</Link>
  );
}

export default function AnunciosStrip({ anuncios }: { anuncios: Anuncio[] }) {
  if (anuncios.length === 0) return null;
  return (
    <section aria-label="Novidades e promoções" className="mx-auto max-w-6xl px-4 pt-2">
      <Reveal className="grid gap-4 md:grid-cols-3">
        {anuncios.slice(0, 3).map((a) => (
          <Cartao key={a.id} a={a} />
        ))}
      </Reveal>
    </section>
  );
}
