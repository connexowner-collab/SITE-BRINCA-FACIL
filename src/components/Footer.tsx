import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";

export default function Footer({ whatsapp, mensagem }: { whatsapp: string; mensagem: string }) {
  const ano = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-bf-noite text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/icon-192.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full" />
            <span className="font-display text-2xl font-bold">
              Brinca<span className="text-bf-amarelo">Fácil</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-white/80">
            Locação de brinquedos para festas e eventos. Escolha, veja as datas livres e peça sua cotação.
          </p>
        </div>

        <nav aria-label="Rodapé" className="space-y-2 font-semibold">
          <p className="font-display text-lg text-bf-amarelo">Navegue</p>
          <Link href="/#catalogo" className="block hover:text-bf-amarelo">Brinquedos</Link>
          <Link href="/#como-funciona" className="block hover:text-bf-amarelo">Como funciona</Link>
          <Link href="/privacidade" className="block hover:text-bf-amarelo">Política de privacidade</Link>
        </nav>

        <div>
          <p className="font-display text-lg text-bf-amarelo">Fale com a gente</p>
          <div className="mt-3">
            <WhatsAppButton numero={whatsapp} mensagem={mensagem} className="btn btn-verde !px-5 !py-2.5 !text-base" />
            {!whatsapp && <p className="text-white/70">Em breve, nosso WhatsApp por aqui.</p>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">
        © {ano} BrincaFácil. Todos os direitos reservados.
      </div>
    </footer>
  );
}
