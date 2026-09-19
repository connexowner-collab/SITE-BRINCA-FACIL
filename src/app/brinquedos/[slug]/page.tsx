import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CotacaoForm from "@/components/CotacaoForm";
import Galeria from "@/components/Galeria";
import { Check } from "@/components/Icones";
import WhatsAppButton from "@/components/WhatsAppButton";
import { buscarBrinquedo, carregarConfig } from "@/lib/dados";
import { brl, faixaEtaria, imagensDoBrinquedo } from "@/lib/formatar";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = await buscarBrinquedo(slug);
  if (!b) return { title: "Brinquedo não encontrado" };
  const fotos = imagensDoBrinquedo(b);
  const descricao = b.descricao?.slice(0, 160) || `Alugue ${b.nome} para sua festa. Veja as datas disponíveis e peça sua cotação.`;
  return {
    title: b.nome,
    description: descricao,
    alternates: { canonical: `/brinquedos/${b.slug}` },
    openGraph: {
      title: `${b.nome} | BrincaFácil`,
      description: descricao,
      images: fotos[0] ? [{ url: fotos[0] }] : [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function PaginaBrinquedo({ params }: Props) {
  const { slug } = await params;
  const [b, config] = await Promise.all([buscarBrinquedo(slug), carregarConfig()]);
  if (!b) notFound();

  const fotos = imagensDoBrinquedo(b);
  const preco = brl(b.preco);
  const idade = faixaEtaria(b.faixa_etaria_min, b.faixa_etaria_max);
  const horas = b.duracao_padrao_min / 60;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Você está em" className="mb-5 text-sm font-bold text-bf-azul-escuro/70">
        <Link href="/" className="hover:text-bf-azul">Início</Link>
        <span aria-hidden="true"> › </span>
        <Link href="/#catalogo" className="hover:text-bf-azul">Brinquedos</Link>
        <span aria-hidden="true"> › </span>
        <span aria-current="page" className="text-bf-azul-escuro">{b.nome}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <Galeria imagens={fotos} nome={b.nome} />

        <div>
          {b.categorias && <p className="text-sm font-extrabold uppercase tracking-wider text-bf-azul">{b.categorias.nome}</p>}
          <h1 className="mt-1 text-4xl font-bold leading-tight sm:text-5xl">{b.nome}</h1>

          <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
            {idade && <span className="rounded-full bg-bf-ciano/25 px-3 py-1">Para {idade}</span>}
            <span className="rounded-full bg-bf-amarelo/40 px-3 py-1">
              Duração padrão: {Number.isInteger(horas) ? horas : horas.toFixed(1).replace(".", ",")} h
            </span>
          </div>

          <div className="mt-5 rounded-3xl bg-bf-azul-escuro p-5 text-white">
            {preco ? (
              <>
                <p className="text-sm font-bold text-bf-amarelo">a partir de</p>
                <p className="font-display text-5xl font-bold leading-none">{preco}</p>
                {b.preco_referencia && <p className="mt-1 text-white/85">{b.preco_referencia}</p>}
                <p className="mt-2 text-sm text-white/70">O valor final é confirmado na cotação, conforme data, horário e local.</p>
              </>
            ) : (
              <p className="font-display text-2xl font-semibold">Peça a cotação para saber o valor</p>
            )}
          </div>

          {b.descricao && <p className="mt-5 whitespace-pre-line text-lg leading-relaxed">{b.descricao}</p>}

          {b.inclui.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold">O que está incluso</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {b.inclui.map((item) => (
                  <li key={item} className="flex items-start gap-2 rounded-2xl bg-white p-3 font-semibold ring-1 ring-bf-azul-escuro/10">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#128c4a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#cotacao" className="btn btn-vermelho">Ver datas e pedir cotação</a>
            <WhatsAppButton numero={config.whatsapp} mensagem={`Olá! Tenho uma dúvida sobre o ${b.nome}.`}>
              Tirar dúvidas
            </WhatsAppButton>
          </div>
        </div>
      </div>

      <section id="cotacao" className="mt-14 scroll-mt-24">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Peça sua cotação</h2>
        <CotacaoForm
          brinquedo={{ id: b.id, nome: b.nome, duracaoMin: b.duracao_padrao_min }}
          whatsapp={config.whatsapp}
          modeloMensagem={config.modeloCotacao}
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined}
        />
      </section>
    </div>
  );
}
