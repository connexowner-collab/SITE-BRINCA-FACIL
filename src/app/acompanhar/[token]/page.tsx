import type { Metadata } from "next";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import { carregarConfig, consultarCotacao } from "@/lib/dados";
import { formatarDataLonga, partesSP } from "@/lib/datas";
import { brl } from "@/lib/formatar";
import type { StatusLocacao } from "@/lib/tipos";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Acompanhar pedido", robots: { index: false, follow: false } };

const STATUS: Record<StatusLocacao, { titulo: string; texto: string; cor: string; etapa: number }> = {
  em_analise: {
    titulo: "Em análise",
    texto: "Recebemos seu pedido. Estamos conferindo a agenda e o próximo contato será feito pelo WhatsApp.",
    cor: "bg-bf-amarelo text-bf-azul-escuro",
    etapa: 2,
  },
  confirmada: {
    titulo: "Agenda confirmada",
    texto: "Tudo certo! Sua data está reservada. Vamos combinar os detalhes da entrega pelo WhatsApp.",
    cor: "bg-[#128c4a] text-white",
    etapa: 3,
  },
  concluida: {
    titulo: "Locação concluída",
    texto: "Obrigado por brincar com a gente! Esperamos você na próxima festa.",
    cor: "bg-bf-azul text-white",
    etapa: 3,
  },
  cancelada: {
    titulo: "Cancelada",
    texto: "Este pedido foi cancelado. Se foi um engano, fale com a gente pelo WhatsApp.",
    cor: "bg-slate-300 text-bf-azul-escuro",
    etapa: 0,
  },
  recusada: {
    titulo: "Não foi possível atender",
    texto: "Não conseguimos atender essa data. Fale com a gente pelo WhatsApp para ver outras opções.",
    cor: "bg-bf-vermelho text-white",
    etapa: 0,
  },
};

const ETAPAS = ["Pedido recebido", "Em análise", "Confirmada"];

export default async function Acompanhar({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [cotacao, config] = await Promise.all([consultarCotacao(token), carregarConfig()]);

  if (!cotacao) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-4xl font-bold">Pedido não encontrado</h1>
        <p className="mt-3 text-lg">Confira se o link está completo. Se precisar, fale com a gente pelo WhatsApp.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-amarelo">Voltar ao início</Link>
          <WhatsAppButton numero={config.whatsapp} mensagem={config.mensagemGeral} />
        </div>
      </div>
    );
  }

  const st = STATUS[cotacao.status];
  const ini = partesSP(cotacao.inicio);
  const fim = partesSP(cotacao.fim);
  const valor = brl(cotacao.valor_total);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-center font-bold text-bf-azul">Olá, {cotacao.primeiro_nome}!</p>
      <h1 className="mt-1 text-center text-4xl font-bold">Acompanhe seu pedido</h1>

      <div className="mt-8 rounded-3xl border-2 border-bf-azul-escuro/10 bg-white p-6 shadow-[0_6px_0_0_rgb(8_40_114/0.12)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-bf-azul-escuro/60">Protocolo</p>
            <p className="font-display text-3xl font-bold tracking-wider">{cotacao.protocolo}</p>
          </div>
          <span className={`rounded-full px-5 py-2 font-display text-lg font-bold ${st.cor}`}>{st.titulo}</span>
        </div>

        {st.etapa > 0 && (
          <ol className="mt-6 grid grid-cols-3 gap-2" aria-label="Andamento do pedido">
            {ETAPAS.map((nome, i) => {
              const feita = i + 1 <= st.etapa;
              return (
                <li key={nome} className="text-center">
                  <div className={`mx-auto h-3 rounded-full ${feita ? "bg-bf-vermelho" : "bg-slate-200"}`} />
                  <p className={`mt-1.5 text-xs font-bold sm:text-sm ${feita ? "" : "text-bf-azul-escuro/50"}`}>{nome}</p>
                </li>
              );
            })}
          </ol>
        )}

        <p className="mt-6 rounded-2xl bg-bf-creme p-4 text-lg font-semibold">{st.texto}</p>

        <dl className="mt-6 space-y-3 text-lg">
          <div className="flex justify-between gap-4 border-b border-bf-azul-escuro/10 pb-2">
            <dt className="font-bold">Brinquedo</dt>
            <dd className="text-right">{cotacao.produto}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-bf-azul-escuro/10 pb-2">
            <dt className="font-bold">Data</dt>
            <dd className="text-right capitalize">{formatarDataLonga(ini.data)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-bf-azul-escuro/10 pb-2">
            <dt className="font-bold">Horário</dt>
            <dd className="text-right">{ini.hora} às {fim.hora}</dd>
          </div>
          {valor && (
            <div className="flex justify-between gap-4">
              <dt className="font-bold">Valor</dt>
              <dd className="text-right font-display text-2xl font-bold text-bf-vermelho">{valor}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <WhatsAppButton numero={config.whatsapp} mensagem={`Olá! Meu protocolo é ${cotacao.protocolo}. Gostaria de falar sobre o meu pedido.`}>
          Falar sobre este pedido
        </WhatsAppButton>
        <Link href="/" className="btn border-2 border-bf-azul-escuro text-bf-azul-escuro hover:bg-bf-azul-escuro hover:text-white">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
