"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clienteNavegador } from "@/lib/supabase";
import { NOMES_MES, diaDaSemana, diasNoMes, hojeSP, pad, somarDias, ymdParaStr } from "@/lib/datas";
import type { DiaDisponibilidade } from "@/lib/tipos";

type Estado = "livre" | "parcial" | "fechado" | "sem-info";

function estadoDoDia(info?: DiaDisponibilidade): Estado {
  if (!info || info.total === 0) return "sem-info";
  if (info.livres <= 0) return "fechado";
  if (info.livres < info.total) return "parcial";
  return "livre";
}

const SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const NOMES_SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

type Props = {
  brinquedoId: string;
  selecionado: string | null;
  onSelecionar: (dia: string) => void;
  /** Quantos dias de antecedência mínima (1 = só a partir de amanhã). */
  antecedenciaDias?: number;
  mesesAFrente?: number;
};

export default function Calendario({ brinquedoId, selecionado, onSelecionar, antecedenciaDias = 1, mesesAFrente = 12 }: Props) {
  const hoje = useMemo(() => hojeSP(), []);
  const primeiroDia = useMemo(() => somarDias(hoje, antecedenciaDias), [hoje, antecedenciaDias]);
  const primeiroDiaStr = ymdParaStr(primeiroDia);

  const [mes, setMes] = useState({ ano: primeiroDia.ano, mes: primeiroDia.mes });
  const [dados, setDados] = useState<DiaDisponibilidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const cache = useRef<Record<string, DiaDisponibilidade[]>>({});

  const indice = (m: { ano: number; mes: number }) => m.ano * 12 + (m.mes - 1);
  const podeVoltar = indice(mes) > indice(primeiroDia);
  const podeAvancar = indice(mes) < indice(hoje) + mesesAFrente;

  function mover(delta: number) {
    const i = indice(mes) + delta;
    setMes({ ano: Math.floor(i / 12), mes: (i % 12) + 1 });
  }

  useEffect(() => {
    const chave = `${mes.ano}-${pad(mes.mes)}`;
    if (cache.current[chave]) {
      setDados(cache.current[chave]);
      setCarregando(false);
      setErro(null);
      return;
    }
    let cancelado = false;
    setCarregando(true);
    setErro(null);
    clienteNavegador()
      .rpc("calendario_disponibilidade", { p_brinquedo: brinquedoId, p_mes: `${chave}-01` })
      .then(({ data, error }) => {
        if (cancelado) return;
        if (error) {
          setErro("Não foi possível carregar as datas agora. Tente novamente em instantes.");
          setDados([]);
        } else {
          const lista = (data ?? []) as DiaDisponibilidade[];
          cache.current[chave] = lista;
          setDados(lista);
        }
        setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [mes, brinquedoId]);

  const mapa = useMemo(() => new Map(dados.map((d) => [d.dia, d])), [dados]);
  const semUnidades = !carregando && !erro && dados.length > 0 && dados.every((d) => d.total === 0);

  const total = diasNoMes(mes.ano, mes.mes);
  const deslocamento = diaDaSemana(mes.ano, mes.mes, 1);
  const celulas: (number | null)[] = [...Array(deslocamento).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  return (
    <div className="rounded-3xl border-2 border-bf-azul-escuro/10 bg-white p-4 shadow-[0_6px_0_0_rgb(8_40_114/0.12)] sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => mover(-1)}
          disabled={!podeVoltar}
          aria-label="Mês anterior"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-bf-azul-escuro font-display text-2xl text-white transition hover:bg-bf-azul focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bf-ciano/70 disabled:opacity-30"
        >
          ‹
        </button>
        <p className="font-display text-xl font-bold capitalize" aria-live="polite">
          {NOMES_MES[mes.mes - 1]} de {mes.ano}
        </p>
        <button
          type="button"
          onClick={() => mover(1)}
          disabled={!podeAvancar}
          aria-label="Próximo mês"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-bf-azul-escuro font-display text-2xl text-white transition hover:bg-bf-azul focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bf-ciano/70 disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-extrabold text-bf-azul-escuro/60" aria-hidden="true">
        {SEMANA.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>

      <div className={`mt-1.5 grid grid-cols-7 gap-1.5 ${carregando ? "animate-pulsa" : ""}`}>
        {celulas.map((d, i) => {
          if (d === null) return <span key={`v${i}`} />;
          const str = `${mes.ano}-${pad(mes.mes)}-${pad(d)}`;
          const estado = estadoDoDia(mapa.get(str));
          const passado = str < primeiroDiaStr;
          const bloqueado = passado || carregando || estado === "fechado" || estado === "sem-info";
          const ativo = selecionado === str;
          const semana = NOMES_SEMANA[(deslocamento + d - 1) % 7];
          const rotulo = `${semana}, ${d} de ${NOMES_MES[mes.mes - 1]}: ${
            passado ? "data passada" : estado === "livre" ? "disponível" : estado === "parcial" ? "últimas unidades" : "indisponível"
          }`;

          let visual = "border-bf-azul/20 bg-white hover:border-bf-azul hover:bg-bf-ciano/25";
          if (estado === "parcial") visual = "border-bf-amarelo bg-bf-amarelo/35 hover:bg-bf-amarelo/60";
          if (bloqueado) visual = "border-transparent bg-slate-100 text-slate-400 line-through";
          if (ativo) visual = "border-bf-azul-escuro bg-bf-azul-escuro text-white ring-4 ring-bf-ciano/50";

          return (
            <button
              key={str}
              type="button"
              disabled={bloqueado}
              aria-label={rotulo}
              aria-pressed={ativo}
              onClick={() => onSelecionar(str)}
              className={`aspect-square rounded-xl border-2 font-display text-lg font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bf-ciano/70 ${visual}`}
            >
              {d}
            </button>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-bf-azul-escuro/80">
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-bf-azul/40 bg-white" /> Disponível</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-bf-amarelo bg-bf-amarelo/50" /> Últimas unidades</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-200" /> Indisponível</li>
      </ul>

      {erro && <p role="alert" className="mt-3 rounded-xl bg-bf-vermelho/10 p-3 text-sm font-bold text-bf-vermelho-escuro">{erro}</p>}
      {semUnidades && (
        <p className="mt-3 rounded-xl bg-bf-amarelo/25 p-3 text-sm font-bold">
          As datas deste brinquedo ainda não estão abertas para agendamento. Fale com a gente para combinar.
        </p>
      )}
    </div>
  );
}
