import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";

type Categoria = { nome: string; slug: string };

export default function Header({
  whatsapp,
  mensagem,
  categorias = [],
}: {
  whatsapp: string;
  mensagem: string;
  categorias?: Categoria[];
}) {
  const menu = categorias.slice(0, 5);
  return (
    <header className="sticky top-0 z-40 border-b-4 border-bf-amarelo bg-bf-azul-escuro/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bf-ciano/70" aria-label="BrincaFácil, página inicial">
          <Image src="/mascote.png" alt="" width={48} height={48} className="h-11 w-11 object-contain drop-shadow" />
          <span className="font-display text-2xl font-bold leading-none tracking-tight">
            Brinca<span className="text-bf-amarelo">Fácil</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-5 font-display text-lg font-medium lg:flex">
          {menu.length > 0 ? (
            menu.map((c) => (
              <Link key={c.slug} href={`/#cat-${c.slug}`} className="hover:text-bf-amarelo">
                {c.nome}
              </Link>
            ))
          ) : (
            <Link href="/#catalogo" className="hover:text-bf-amarelo">Catálogo</Link>
          )}
          <Link href="/#como-funciona" className="hover:text-bf-amarelo">Como funciona</Link>
        </nav>

        {whatsapp ? (
          <WhatsAppButton numero={whatsapp} mensagem={mensagem} className="btn btn-verde !px-4 !py-2 !text-base">
            WhatsApp
          </WhatsAppButton>
        ) : (
          <Link href="/#catalogo" className="btn btn-amarelo !px-4 !py-2 !text-base">
            Ver catálogo
          </Link>
        )}
      </div>
    </header>
  );
}
