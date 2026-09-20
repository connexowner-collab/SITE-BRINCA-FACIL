import Reveal from "./Reveal";

const PASSOS = [
  {
    n: "1",
    titulo: "Escolha o brinquedo",
    texto: "Veja as fotos, o que está incluso e o valor de cada opção.",
    cor: "bg-bf-vermelho text-white",
  },
  {
    n: "2",
    titulo: "Confira as datas livres",
    texto: "O calendário mostra na hora os dias disponíveis, sem precisar perguntar.",
    cor: "bg-bf-amarelo text-bf-azul-escuro",
  },
  {
    n: "3",
    titulo: "Peça a cotação",
    texto: "Escolha dia e horário, envie o pedido e continue a conversa pelo WhatsApp.",
    cor: "bg-bf-azul text-white",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16">
      <Reveal>
        <h2 className="text-center text-3xl font-bold sm:text-4xl">Como funciona</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-lg text-bf-azul-escuro/80">Três passos e sua festa está encaminhada.</p>
      </Reveal>
      <ol className="mt-10 grid gap-6 md:grid-cols-3">
        {PASSOS.map((p, i) => (
          <li key={p.n}>
            <Reveal atraso={i * 120} className="h-full">
              <div className="group h-full cursor-default rounded-3xl border-2 border-bf-azul-escuro/10 bg-white p-6 shadow-[0_6px_0_0_rgb(8_40_114/0.12)] transition duration-200 hover:-translate-y-2 hover:rotate-[-0.6deg] hover:border-bf-azul/40 hover:shadow-[0_14px_0_0_rgb(8_40_114/0.16)]">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-3xl font-bold shadow-sm transition duration-200 group-hover:-rotate-12 group-hover:scale-110 ${p.cor}`}>{p.n}</span>
                <h3 className="mt-4 text-2xl font-bold transition-colors duration-200 group-hover:text-bf-azul">{p.titulo}</h3>
                <p className="mt-1 text-lg text-bf-azul-escuro/80">{p.texto}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
