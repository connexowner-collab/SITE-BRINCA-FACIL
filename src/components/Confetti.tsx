const CORES = ["#e91c23", "#f8c01b", "#0867d6", "#3dd0f6", "#ffffff"];

/** Confete de comemoração (só CSS). Posições determinísticas, sem aleatoriedade. */
export default function Confetti() {
  const pecas = Array.from({ length: 48 }, (_, i) => ({
    esquerda: (i * 37) % 100,
    atraso: (i % 12) * 0.11,
    duracao: 2.2 + (i % 5) * 0.35,
    cor: CORES[i % CORES.length],
    giro: (i * 47) % 360,
    largura: 6 + (i % 4) * 3,
  }));
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {pecas.map((p, i) => (
        <span
          key={i}
          className="confete"
          style={{
            left: `${p.esquerda}%`,
            width: p.largura,
            height: p.largura * 1.6,
            background: p.cor,
            transform: `rotate(${p.giro}deg)`,
            animationDelay: `${p.atraso}s`,
            animationDuration: `${p.duracao}s`,
          }}
        />
      ))}
    </div>
  );
}
