import { NextResponse } from "next/server";
import { criarClienteServidor, supabaseConfigurado } from "@/lib/supabase";

// Traduz os códigos de erro do banco (funções solicitar_cotacao) para mensagens ao cliente.
const ERROS: Record<string, { status: number; msg: string }> = {
  consentimento_obrigatorio: { status: 400, msg: "Marque a caixa de consentimento para enviar o pedido." },
  produto_indisponivel: { status: 404, msg: "Este brinquedo não está disponível no momento." },
  periodo_invalido: { status: 400, msg: "Data ou horário inválido. Escolha uma data futura e confira os horários." },
  nome_invalido: { status: 400, msg: "Informe seu nome (de 2 a 100 letras)." },
  whatsapp_invalido: { status: 400, msg: "Informe um WhatsApp válido, com DDD." },
  texto_longo: { status: 400, msg: "Os textos estão muito longos. Resuma o local e as observações." },
  muitas_solicitacoes: { status: 429, msg: "Você já fez vários pedidos seguidos. Aguarde um pouco e tente de novo." },
  sistema_ocupado: { status: 429, msg: "Recebemos muitos pedidos ao mesmo tempo. Tente de novo em alguns minutos." },
  horario_indisponivel: { status: 409, msg: "Esse horário acabou de ficar indisponível. Escolha outro horário ou outra data." },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/;

const erro = (status: number, msg: string) => NextResponse.json({ erro: msg }, { status });

async function turnstileValido(token: string, ip: string | null): Promise<boolean> {
  const segredo = process.env.TURNSTILE_SECRET_KEY;
  if (!segredo) return true; // captcha desligado
  if (!token) return false;
  try {
    const corpo = new URLSearchParams({ secret: segredo, response: token });
    if (ip) corpo.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: corpo });
    const j = (await r.json()) as { success?: boolean };
    return j.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!supabaseConfigurado()) return erro(503, "O site está em manutenção. Tente novamente mais tarde.");

  let corpo: Record<string, unknown>;
  try {
    corpo = await request.json();
  } catch {
    return erro(400, "Pedido inválido.");
  }

  const texto = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
  const brinquedoId = texto(corpo.brinquedoId, 60);
  const inicio = texto(corpo.inicio, 40);
  const fim = texto(corpo.fim, 40);

  // Campo-isca: pessoas nunca preenchem
  if (texto(corpo.website, 200)) return erro(400, "Não foi possível enviar o pedido.");
  if (!UUID.test(brinquedoId) || !ISO.test(inicio) || !ISO.test(fim)) return erro(400, "Pedido inválido.");

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if (!(await turnstileValido(texto(corpo.turnstileToken, 4096), ip))) {
    return erro(400, "Não foi possível confirmar que você não é um robô. Recarregue a página e tente de novo.");
  }

  const { data, error } = await criarClienteServidor().rpc("solicitar_cotacao", {
    p_brinquedo: brinquedoId,
    p_inicio: inicio,
    p_fim: fim,
    p_nome: texto(corpo.nome, 200),
    p_whatsapp: texto(corpo.whatsapp, 40),
    p_local: texto(corpo.local, 400) || null,
    p_obs: texto(corpo.obs, 800) || null,
    p_consentimento: corpo.consentimento === true,
  });

  if (error) {
    const codigo = Object.keys(ERROS).find((c) => error.message?.includes(c));
    if (codigo) return erro(ERROS[codigo].status, ERROS[codigo].msg);
    console.error("[api/cotacao]", error.message);
    return erro(500, "Não foi possível enviar agora. Tente de novo ou fale com a gente pelo WhatsApp.");
  }

  const linha = Array.isArray(data) ? data[0] : data;
  if (!linha?.protocolo || !linha?.token) {
    console.error("[api/cotacao] resposta inesperada", data);
    return erro(500, "Não foi possível enviar agora. Tente de novo ou fale com a gente pelo WhatsApp.");
  }
  return NextResponse.json({ protocolo: linha.protocolo, token: linha.token });
}
