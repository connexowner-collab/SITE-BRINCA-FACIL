import AnunciosStrip from "@/components/AnunciosStrip";
import Catalogo from "@/components/Catalogo";
import ComoFunciona from "@/components/ComoFunciona";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { carregarConfig, listarAnuncios, listarBrinquedos } from "@/lib/dados";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [config, brinquedos, anuncios] = await Promise.all([carregarConfig(), listarBrinquedos(), listarAnuncios()]);

  return (
    <>
      <Hero titulo={config.heroTitulo} subtitulo={config.heroSubtitulo} whatsapp={config.whatsapp} mensagem={config.mensagemGeral} />

      <div className="-mt-6">
        <AnunciosStrip anuncios={anuncios} />
      </div>

      <section id="catalogo" className="mx-auto max-w-6xl px-4 pt-14">
        <Reveal>
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Escolha seu brinquedo</h2>
          <p className="mx-auto mt-2 mb-8 max-w-xl text-center text-lg text-bf-azul-escuro/80">
            Toque em um brinquedo para ver os detalhes e as datas disponíveis.
          </p>
        </Reveal>

        {brinquedos.length > 0 ? (
          <Catalogo brinquedos={brinquedos} />
        ) : (
          <div className="mx-auto max-w-lg rounded-3xl border-2 border-dashed border-bf-azul-escuro/25 bg-white/70 p-10 text-center">
            <p className="font-display text-2xl font-semibold">Estamos preparando os brinquedos</p>
            <p className="mt-2 text-lg text-bf-azul-escuro/80">Volte em breve ou fale com a gente para saber o que temos disponível.</p>
            <div className="mt-5">
              <WhatsAppButton numero={config.whatsapp} mensagem={config.mensagemGeral} />
            </div>
          </div>
        )}
      </section>

      <ComoFunciona />

      <section className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="hero-fundo relative overflow-hidden rounded-[2rem] px-6 py-12 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold sm:text-4xl">Pronto para a festa ficar inesquecível?</h2>
            <p className="mx-auto mt-2 max-w-xl text-lg text-white/90">Escolha o brinquedo, confira as datas e peça sua cotação agora.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="#catalogo" className="btn btn-amarelo">Ver brinquedos</a>
              <WhatsAppButton numero={config.whatsapp} mensagem={config.mensagemGeral} className="btn btn-contorno" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
