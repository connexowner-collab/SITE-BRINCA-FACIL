import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";

export default function Header({ whatsapp, mensagem }: { whatsapp: string; mensagem: string }) {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-bf-amarelo bg-bf-azul-escuro/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bf-ciano/70" aria-label="BrincaFácil, página inicial">
          <Image src="/icon-192.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full" />
          <span className="font-display text-2xl font-bold leading-none tracking-tight">
            Brinca<span className="text-bf-amarelo">Fácil</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-6 font-display text-lg font-medium sm:flex">
          <Link href="/#catalogo" className="hover:text-bf-amarelo">Brinquedos</Link>
          <Link href="/#como-funciona" className="hover:text-bf-amarelo">Como funciona</Link>
        </nav>

        {whatsapp ? (
          <WhatsAppButton numero={whatsapp} mensagem={mensagem} className="btn btn-verde !px-4 !py-2 !text-base">
            WhatsApp
          </WhatsAppButton>
        ) : (
          <Link href="/#catalogo" className="btn btn-amarelo !px-4 !py-2 !text-base">
            Ver brinquedos
          </Link>
        )}
      </div>
    </header>
  );
}
