import Image from "next/image";
import Link from "next/link";
import { Estrela } from "./Icones";
import WhatsAppButton from "./WhatsAppButton";

type Props = { titulo: string; subtitulo: string; whatsapp: string; mensagemCombo: string };

export default function Hero({ titulo, subtitulo, whatsapp, mensagemCombo }: Props) {
  return (
    <section className="hero-fundo relative isolate overflow-hidden text-white">
      <div className="hero-raios pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      {/* estrelas decorativas */}
      <Estrela className="absolute left-[6%] top-[14%] -z-10 h-7 w-7 animate-float-lento text-bf-amarelo" />
      <Estrela className="absolute left-[44%] top-[8%] -z-10 h-5 w-5 animate-pulsa text-bf-amarelo-claro" />
      <Estrela className="absolute bottom-[22%] left-[4%] -z-10 h-9 w-9 animate-float text-bf-ciano" />
      <Estrela className="absolute right-[6%] top-[10%] -z-10 h-8 w-8 animate-pulsa text-bf-amarelo" />

      <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-24 pt-12 md:grid-cols-[1.15fr_1fr] md:pt-16">
        <div className="animate-entra">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold ring-1 ring-white/30">
            <Estrela className="h-4 w-4 text-bf-amarelo" />
            Locação de brinquedos para festas e eventos
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight [text-shadow:0_3px_0_rgb(0_0_0/0.25)] sm:text-5xl lg:text-6xl">
            {titulo}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90 sm:text-xl">{subtitulo}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/#catalogo" className="btn btn-amarelo">
              Ver catálogo
            </Link>
            <WhatsAppButton numero={whatsapp} mensagem={mensagemCombo} className="btn btn-contorno">
              Cotação personalizada
            </WhatsAppButton>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-white/90">
            <li className="flex items-center gap-2"><Estrela className="h-4 w-4 text-bf-amarelo" /> Datas livres na hora</li>
            <li className="flex items-center gap-2"><Estrela className="h-4 w-4 text-bf-amarelo" /> Cotação sem complicação</li>
            <li className="flex items-center gap-2"><Estrela className="h-4 w-4 text-bf-amarelo" /> Atendimento pelo WhatsApp</li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div className="absolute inset-[8%] rounded-full bg-bf-ciano/30 blur-3xl" aria-hidden="true" />
          <Image
            src="/mascote.png"
            alt="Mascote da BrincaFácil: um carrinho vermelho sorridente com asas amarelas"
            width={512}
            height={512}
            loading="eager"
            fetchPriority="high"
            className="relative mx-auto h-auto w-full max-w-md animate-float drop-shadow-[0_18px_30px_rgb(0_0_0/0.35)]"
          />
        </div>
      </div>

      {/* onda de transição */}
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] h-14 w-full text-bf-creme sm:h-20">
        <path fill="currentColor" d="M0,50 C240,100 480,0 720,40 C960,80 1200,10 1440,50 L1440,90 L0,90 Z" />
      </svg>
    </section>
  );
}
