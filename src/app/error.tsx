"use client";

export default function Erro({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-4xl font-bold">Algo deu errado</h1>
      <p className="mt-3 text-lg">Não conseguimos carregar esta página agora. Tente novamente em instantes.</p>
      <button type="button" onClick={reset} className="btn btn-vermelho mt-6">
        Tentar de novo
      </button>
    </div>
  );
}
