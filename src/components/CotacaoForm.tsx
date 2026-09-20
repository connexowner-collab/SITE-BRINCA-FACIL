"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import Calendario from "./Calendario";
import Confetti from "./Confetti";
import { Conversa, Estrela } from "./Icones";
import { HORAS, dataBR, formatarDataLonga, paraISO, somarMinutos } from "@/lib/datas";
import { formatarTelefone, soDigitos } from "@/lib/formatar";
import { linkWhatsApp, preencherModelo } from "@/lib/whatsapp";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opcoes: Record<string, unknown>) => string;
      remove: (id?: string) => void;
    };
  }
}

type Props = {
  brinquedo: { id: string; nome: string; duracaoMin: number };
  /** Só dígitos com DDI+DDD. Vazio = WhatsApp ainda não configurado. */
  whatsapp: string;
  modeloMensagem: string;
  turnstileSiteKey?: string;
};

type Resultado = { protocolo: string; token: string; dia: string; inicio: string; fim: string };

function Passo({ n, titulo }: { n: number; titulo: string }) {
  return (
    <h3 className="mb-3 flex items-center gap-3 text-2xl font-bold">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bf-vermelho font-display text-lg text-white">{n}</span>
      {titulo}
    </h3>
  );
}

export default function CotacaoForm({ brinquedo, whatsapp, modeloMensagem, turnstileSiteKey }: Props) {
  const [dia, setDia] = useState<string | null>(null);
  const [inicio, setInicio] = useState("10:00");
  const [fim, setFim] = useState(() => somarMinutos("10:00", brinquedo.duracaoMin));
  const [fimManual, setFimManual] = useState(false);
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [complemento, setComplemento] = useState("");
  const [semCep, setSemCep] = useState(false);
  const [enderecoManual, setEnderecoManual] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepErro, setCepErro] = useState<string | null>(null);
  const [obs, setObs] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // isca para robôs: precisa ficar vazio
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [tsToken, setTsToken] = useState("");

  const blocoForm = useRef<HTMLDivElement>(null);
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | null>(null);
  const mostrarCampos = Boolean(dia) && !resultado;

  // No celular, leva a pessoa até os campos quando ela escolhe o dia
  useEffect(() => {
    if (dia && typeof window !== "undefined" && window.innerWidth < 1024) {
      blocoForm.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [dia]);

  // Captcha Turnstile (opcional)
  useEffect(() => {
    if (!turnstileSiteKey || !mostrarCampos) return;
    const montar = () => {
      if (tsId.current || !tsRef.current || !window.turnstile) return;
      tsId.current = window.turnstile.render(tsRef.current, {
        sitekey: turnstileSiteKey,
        language: "pt-br",
        callback: (t: string) => setTsToken(t),
        "expired-callback": () => setTsToken(""),
        "error-callback": () => setTsToken(""),
      });
    };
    montar();
    const intervalo = setInterval(() => {
      montar();
      if (tsId.current) clearInterval(intervalo);
    }, 300);
    return () => {
      clearInterval(intervalo);
      if (tsId.current) {
        window.turnstile?.remove(tsId.current);
        tsId.current = null;
      }
    };
  }, [turnstileSiteKey, mostrarCampos]);

  function mudarInicio(valor: string) {
    setInicio(valor);
    if (!fimManual) setFim(somarMinutos(valor, brinquedo.duracaoMin));
  }

  function formatarCep(valor: string) {
    const d = soDigitos(valor).slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  }

  async function buscarCep(valor: string) {
    const d = soDigitos(valor).slice(0, 8);
    if (d.length !== 8) return;
    setBuscandoCep(true);
    setCepErro(null);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const j = (await r.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (j.erro) {
        setCepErro("CEP não encontrado. Confira ou preencha o endereço manualmente.");
      } else {
        setLogradouro(j.logradouro ?? "");
        setBairro(j.bairro ?? "");
        setCidade(j.localidade ?? "");
        setUf(j.uf ?? "");
      }
    } catch {
      setCepErro("Não foi possível buscar o CEP agora. Preencha o endereço manualmente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  function mudarCep(valor: string) {
    setCep(formatarCep(valor));
    setCepErro(null);
    if (soDigitos(valor).length === 8) buscarCep(valor);
  }

  function montarLocal(): string {
    if (semCep) return enderecoManual.trim().slice(0, 200);
    const rua = logradouro.trim() + (numero.trim() ? `, ${numero.trim()}` : "");
    const cidUf = cidade.trim() && uf ? `${cidade.trim()}/${uf}` : cidade.trim();
    return [rua, complemento.trim(), bairro.trim(), cidUf, cep.trim() ? `CEP ${formatarCep(cep)}` : ""]
      .filter(Boolean)
      .join(" - ")
      .slice(0, 200);
  }

  function validar(): string | null {
    if (!dia) return "Escolha o dia no calendário.";
    if (fim <= inicio) return "O horário de término precisa ser depois do início.";
    if (nome.trim().length < 2) return "Informe seu nome.";
    if (soDigitos(tel).length < 10) return "Informe seu WhatsApp com DDD.";
    if (semCep) {
      if (enderecoManual.trim().length < 8) return "Informe o endereço do evento.";
    } else {
      if (soDigitos(cep).length !== 8) return "Informe o CEP do local do evento.";
      if (!logradouro.trim() || !cidade.trim()) return "Confira o endereço: rua e cidade são necessários.";
      if (!numero.trim()) return "Informe o número do local do evento.";
    }
    if (!consent) return "Marque a caixa de consentimento para enviar o pedido.";
    if (turnstileSiteKey && !tsToken) return "Confirme que você não é um robô.";
    return null;
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    const problema = validar();
    if (problema || !dia) {
      setErro(problema);
      return;
    }
    const digitos = soDigitos(tel);
    setEnviando(true);
    try {
      const resp = await fetch("/api/cotacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brinquedoId: brinquedo.id,
          inicio: paraISO(dia, inicio),
          fim: paraISO(dia, fim),
          nome: nome.trim(),
          whatsapp: digitos.length <= 11 ? `55${digitos}` : digitos,
          local: montarLocal(),
          obs: obs.trim(),
          consentimento: consent,
          website,
          turnstileToken: tsToken,
        }),
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setErro(json.erro ?? "Não foi possível enviar agora. Tente de novo ou fale com a gente pelo WhatsApp.");
        return;
      }
      setResultado({ protocolo: json.protocolo, token: json.token, dia, inicio, fim });
    } catch {
      setErro("Sem conexão. Verifique a internet e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  function novoPedido() {
    setResultado(null);
    setDia(null);
    setErro(null);
  }

  /* ---------------- tela de sucesso ---------------- */
  if (resultado) {
    const mensagem = preencherModelo(modeloMensagem, {
      produto: brinquedo.nome,
      data: dataBR(resultado.dia),
      hora_inicio: resultado.inicio,
      hora_fim: resultado.fim,
      protocolo: resultado.protocolo,
    });

    return (
      <div className="relative overflow-hidden rounded-3xl border-2 border-bf-azul-escuro/10 bg-white p-6 text-center shadow-[0_6px_0_0_rgb(8_40_114/0.12)] sm:p-10">
        <Confetti />
        <div className="relative">
          <Estrela className="mx-auto h-12 w-12 animate-pulsa text-bf-amarelo" />
          <h3 className="mt-2 text-3xl font-bold sm:text-4xl">Pedido enviado!</h3>
          <p className="mt-2 text-lg">
            {brinquedo.nome} em <strong>{formatarDataLonga(resultado.dia)}</strong>, das {resultado.inicio} às {resultado.fim}.
          </p>

          <div className="mx-auto mt-5 inline-block rounded-2xl bg-bf-azul-escuro px-6 py-3 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-bf-amarelo">Seu protocolo</p>
            <p className="font-display text-3xl font-bold tracking-wider">{resultado.protocolo}</p>
          </div>

          <p className="mx-auto mt-5 max-w-md rounded-2xl bg-bf-amarelo/30 p-4 font-semibold">
            Sua solicitação está <strong>em análise</strong>. Ainda não é uma reserva: confirmamos a agenda com você e o próximo contato será pelo WhatsApp.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3">
            {whatsapp ? (
              <a href={linkWhatsApp(whatsapp, mensagem)} target="_blank" rel="noopener noreferrer" className="btn btn-verde">
                <Conversa className="h-5 w-5" /> Continuar no WhatsApp
              </a>
            ) : (
              <p className="max-w-md rounded-2xl bg-bf-ciano/20 p-4 font-semibold">
                Recebemos seu pedido! Em breve entramos em contato. Guarde o seu protocolo.
              </p>
            )}
          </div>
          <p className="mt-4 text-sm text-bf-azul-escuro/70">
            Anote o protocolo <strong>{resultado.protocolo}</strong> — é só informá-lo no WhatsApp para agilizar o atendimento.
          </p>
          <button type="button" onClick={novoPedido} className="mt-2 text-sm font-bold underline underline-offset-4">
            Fazer outro pedido
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- formulário ---------------- */
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      {turnstileSiteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />}

      <div>
        <Passo n={1} titulo="Escolha o dia" />
        <Calendario brinquedoId={brinquedo.id} selecionado={dia} onSelecionar={setDia} />
      </div>

      <div ref={blocoForm} className="scroll-mt-24">
        {!dia ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-bf-azul-escuro/25 bg-white/60 p-8 text-center">
            <Estrela className="h-10 w-10 animate-pulsa text-bf-amarelo" />
            <p className="mt-3 font-display text-2xl font-semibold">Escolha uma data para continuar</p>
            <p className="mt-1 text-bf-azul-escuro/70">Depois é só escolher o horário e preencher seus dados.</p>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate className="animate-entra space-y-5 rounded-3xl border-2 border-bf-azul-escuro/10 bg-white p-5 shadow-[0_6px_0_0_rgb(8_40_114/0.12)] sm:p-6">
            <div>
              <Passo n={2} titulo="Escolha o horário" />
              <p className="mb-3 rounded-xl bg-bf-ciano/20 px-4 py-2 font-bold capitalize">{formatarDataLonga(dia)}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="inicio" className="rotulo">Início</label>
                  <select id="inicio" className="campo" value={inicio} onChange={(e) => mudarInicio(e.target.value)}>
                    {HORAS.slice(0, -1).map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="fim" className="rotulo">Término</label>
                  <select
                    id="fim"
                    className="campo"
                    value={fim}
                    onChange={(e) => {
                      setFim(e.target.value);
                      setFimManual(true);
                    }}
                  >
                    {HORAS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Passo n={3} titulo="Seus dados" />
              <div className="space-y-3">
                <div>
                  <label htmlFor="nome" className="rotulo">Seu nome</label>
                  <input id="nome" className="campo" autoComplete="name" maxLength={100} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como podemos te chamar?" />
                </div>
                <div>
                  <label htmlFor="tel" className="rotulo">WhatsApp</label>
                  <input id="tel" className="campo" inputMode="tel" autoComplete="tel-national" value={formatarTelefone(tel)} onChange={(e) => setTel(soDigitos(e.target.value).slice(0, 11))} placeholder="(12) 99999-8888" />
                </div>
                <div className="rounded-2xl bg-bf-creme/60 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rotulo !mb-0">Local do evento</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSemCep((v) => !v);
                        setCepErro(null);
                      }}
                      className="text-sm font-bold text-bf-azul underline underline-offset-2"
                    >
                      {semCep ? "Tenho o CEP" : "Não sei o CEP"}
                    </button>
                  </div>

                  {semCep ? (
                    <textarea
                      id="enderecoManual"
                      className="campo min-h-20"
                      maxLength={200}
                      value={enderecoManual}
                      onChange={(e) => setEnderecoManual(e.target.value)}
                      placeholder="Rua, número, bairro, cidade/UF"
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-[1fr_auto] items-end gap-2">
                        <div>
                          <label htmlFor="cep" className="rotulo">CEP</label>
                          <input
                            id="cep"
                            className="campo"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            value={cep}
                            onChange={(e) => mudarCep(e.target.value)}
                            onBlur={(e) => buscarCep(e.target.value)}
                            placeholder="00000-000"
                          />
                        </div>
                        <span className="pb-3 text-sm font-semibold text-bf-azul-escuro/70">
                          {buscandoCep ? "Buscando…" : ""}
                        </span>
                      </div>
                      {cepErro && <p className="text-sm font-bold text-bf-vermelho-escuro">{cepErro}</p>}
                      <div className="grid grid-cols-[1fr_5rem] gap-2">
                        <div>
                          <label htmlFor="logradouro" className="rotulo">Rua / logradouro</label>
                          <input id="logradouro" className="campo" maxLength={120} value={logradouro} onChange={(e) => setLogradouro(e.target.value)} placeholder="Rua..." />
                        </div>
                        <div>
                          <label htmlFor="numero" className="rotulo">Número</label>
                          <input id="numero" className="campo" inputMode="numeric" maxLength={10} value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="123" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="bairro" className="rotulo">Bairro</label>
                          <input id="bairro" className="campo" maxLength={80} value={bairro} onChange={(e) => setBairro(e.target.value)} />
                        </div>
                        <div>
                          <label htmlFor="complemento" className="rotulo">Complemento <span className="font-semibold text-bf-azul-escuro/60">(opcional)</span></label>
                          <input id="complemento" className="campo" maxLength={60} value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder="Bloco, salão..." />
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_4.5rem] gap-2">
                        <div>
                          <label htmlFor="cidade" className="rotulo">Cidade</label>
                          <input id="cidade" className="campo" maxLength={80} value={cidade} onChange={(e) => setCidade(e.target.value)} />
                        </div>
                        <div>
                          <label htmlFor="uf" className="rotulo">UF</label>
                          <input id="uf" className="campo uppercase" maxLength={2} value={uf} onChange={(e) => setUf(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="obs" className="rotulo">Observações <span className="font-semibold text-bf-azul-escuro/60">(opcional)</span></label>
                  <textarea id="obs" className="campo min-h-20" maxLength={500} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Idade das crianças, tipo de festa, dúvidas..." />
                </div>

                {/* isca para robôs: invisível para pessoas */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Não preencha este campo
                    <input tabIndex={-1} autoComplete="off" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </label>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-bf-creme p-3 text-sm font-semibold">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-bf-azul" />
                  <span>
                    Concordo em compartilhar meu nome, WhatsApp e local do evento para receber esta cotação, conforme a{" "}
                    <a href="/privacidade" target="_blank" rel="noopener" className="font-extrabold underline underline-offset-2">Política de Privacidade</a>.
                  </span>
                </label>

                {turnstileSiteKey && <div ref={tsRef} />}
              </div>
            </div>

            {erro && (
              <p role="alert" className="rounded-2xl bg-bf-vermelho/10 p-3 font-bold text-bf-vermelho-escuro">
                {erro}
              </p>
            )}

            <button type="submit" disabled={enviando} className="btn btn-vermelho w-full">
              {enviando ? "Enviando..." : "Solicitar cotação"}
            </button>
            <p className="text-center text-sm font-semibold text-bf-azul-escuro/70">
              Isso não é uma reserva. Seu pedido fica em análise e confirmamos com você pelo WhatsApp.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
