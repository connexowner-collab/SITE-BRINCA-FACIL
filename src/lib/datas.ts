export type YMD = { ano: number; mes: number; dia: number };

export const NOMES_MES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export const pad = (n: number) => String(n).padStart(2, "0");

/** Data de hoje no fuso de São Paulo (independe do fuso do aparelho). */
export function hojeSP(agora: Date = new Date()): YMD {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(agora);
  const pega = (t: string) => Number(partes.find((p) => p.type === t)?.value);
  return { ano: pega("year"), mes: pega("month"), dia: pega("day") };
}

export const ymdParaStr = (d: YMD) => `${d.ano}-${pad(d.mes)}-${pad(d.dia)}`;

export function strParaYmd(s: string): YMD {
  const [ano, mes, dia] = s.split("-").map(Number);
  return { ano, mes, dia };
}

export function somarDias(d: YMD, n: number): YMD {
  const dt = new Date(Date.UTC(d.ano, d.mes - 1, d.dia + n));
  return { ano: dt.getUTCFullYear(), mes: dt.getUTCMonth() + 1, dia: dt.getUTCDate() };
}

export const diasNoMes = (ano: number, mes: number) => new Date(Date.UTC(ano, mes, 0)).getUTCDate();

/** 0 = domingo ... 6 = sábado */
export const diaDaSemana = (ano: number, mes: number, dia: number) =>
  new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();

/** "segunda-feira, 12 de outubro de 2026" */
export function formatarDataLonga(s: string): string {
  const { ano, mes, dia } = strParaYmd(s);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(ano, mes - 1, dia)));
}

/** "12/10/2026" */
export function dataBR(s: string): string {
  const { ano, mes, dia } = strParaYmd(s);
  return `${pad(dia)}/${pad(mes)}/${ano}`;
}

/** Converte um instante ISO em data e hora de São Paulo. */
export function partesSP(iso: string): { data: string; hora: string } {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "00";
  return { data: `${g("year")}-${g("month")}-${g("day")}`, hora: `${g("hour")}:${g("minute")}` };
}

/** Horários oferecidos no formulário: 07:00 até 23:30, de 30 em 30 minutos. */
export const HORAS: string[] = (() => {
  const lista: string[] = [];
  for (let m = 7 * 60; m <= 23 * 60 + 30; m += 30) lista.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  return lista;
})();

/** Soma minutos a "HH:MM", limitando em 23:30 (o formulário só monta eventos no mesmo dia). */
export function somarMinutos(hora: string, minutos: number): string {
  const [h, m] = hora.split(":").map(Number);
  const total = Math.min(h * 60 + m + minutos, 23 * 60 + 30);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** Monta o instante ISO no fuso de Brasília (UTC-03:00, sem horário de verão desde 2019). */
export const paraISO = (data: string, hora: string) => `${data}T${hora}:00-03:00`;
