import AnunciosStrip from "@/components/AnunciosStrip";
import CatalogoSecoes from "@/components/CatalogoSecoes";
import ComoFunciona from "@/components/ComoFunciona";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { carregarConfig, listarAnuncios, listarBrinquedos, listarCategorias } from "@/lib/dados";
import { secoesDoCatalogo } from "@/lib/catalogo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [config, brinquedos, categorias, anuncios] = await Promise.all([
    carregarConfig(),
    listarBrinquedos(),
    listarCategorias(),
    listarAnuncios(),
  ]);
  const secoes = secoesDoCatalogo(brinquedos, categorias);

  return (
    <>
      <Hero
        titulo={config.heroTitulo}
        subtitulo={config.heroSubtitulo}
        whatsapp={config.whatsapp}
        mensagemCombo={config.mensagemCombo}
      />

      <div className="-mt-6">
        <AnunciosStrip anuncios={anuncios} />
      </div>

      <section id="catalogo" className="mx-auto max-w-6xl px-4 pt-14">
        <Reveal>
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Nosso catálogo</h2>
          <p className="mx-auto mt-2 mb-8 max-w-xl text-center text-lg text-bf-azul-escuro/80">
            Toque em um item para ver os detalhes e as datas disponíveis.
          </p>
        </Reveal>

        {secoes.length > 0 ? (
          <CatalogoSecoes secoes={secoes} />
        ) : (
          <div className="mx-auto max-w-lg rounded-3xl border-2 border-dashed border-bf-azul-escuro/25 bg-white/70 p-10 text-center">
            <p className="font-display text-2xl font-semibold">Estamos preparando as novidades</p>
            <p className="mt-2 text-lg text-bf-azul-escuro/80">Volte em breve ou fale com a gente para saber o que temos disponível.</p>
            <div className="mt-5">
              <WhatsAppButton numero={config.whatsapp} mensagem={config.mensagemGeral} />
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <Reveal>
          <div className="flex flex-col items-center gap-4 rounded-[2rem] border-2 border-bf-azul-escuro/10 bg-white p-8 text-center shadow-[0_6px_0_0_rgb(8_40_114/0.10)] sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="font-display text-2xl font-bold sm:text-3xl">Quer um combo sob medida?</h3>
              <p className="mt-1 max-w-xl text-lg text-bf-azul-escuro/80">
                Monte a sua festa do seu jeito. Fale com a gente e preparamos uma cotação personalizada pra você.
              </p>
            </div>
            <WhatsAppButton numero={config.whatsapp} mensagem={config.mensagemCombo} className="btn btn-vermelho shrink-0">
              Cotação personalizada
            </WhatsAppButton>
          </div>
        </Reveal>
      </section>

      <ComoFunciona />

      <section className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="hero-fundo relative overflow-hidden rounded-[2rem] px-6 py-12 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold sm:text-4xl">Pronto para a festa ficar inesquecível?</h2>
            <p className="mx-auto mt-2 max-w-xl text-lg text-white/90">Escolha o que quiser, confira as datas e peça sua cotação agora.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="#catalogo" className="btn btn-amarelo">Ver catálogo</a>
              <WhatsAppButton numero={config.whatsapp} mensagem={config.mensagemCombo} className="btn btn-contorno">
                Cotação personalizada
              </WhatsAppButton>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
