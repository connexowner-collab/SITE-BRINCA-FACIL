import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Privacidade" };

// ATENÇÃO: campos [PREENCHER] precisam ser completados e o texto revisado por um profissional
// jurídico antes de o site ir ao ar. Este é um modelo de partida, não aconselhamento jurídico.
export default function Privacidade() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-lg leading-relaxed">
      <h1 className="text-4xl font-bold">Política de Privacidade</h1>
      <p className="text-sm font-bold text-bf-azul-escuro/60">Última atualização: [PREENCHER: data]</p>

      <section>
        <h2 className="text-2xl font-bold">Quem somos</h2>
        <p>
          A BrincaFácil, operada por [PREENCHER: razão social e CNPJ], é responsável pelo tratamento dos seus dados
          pessoais neste site. Contato para assuntos de privacidade: [PREENCHER: e-mail].
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Quais dados coletamos</h2>
        <p>
          Ao pedir uma cotação, coletamos seu nome, número de WhatsApp, o local do evento e as observações que você
          escrever, além da data e do horário desejados. Não coletamos dados de pagamento neste site.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Para que usamos</h2>
        <p>
          Usamos esses dados apenas para analisar seu pedido, confirmar a disponibilidade, entrar em contato pelo
          WhatsApp e, se a locação for fechada, executar o serviço. O acompanhamento do pedido é feito pelo
          WhatsApp, informando o seu número de protocolo.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Base legal</h2>
        <p>
          Tratamos seus dados com base no seu consentimento, dado ao marcar a caixa no formulário, e para adotar
          providências preliminares à contratação que você solicitou.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Com quem compartilhamos</h2>
        <p>
          Seus dados ficam armazenados em provedores de infraestrutura que hospedam o site e o banco de dados
          (Vercel e Supabase). Não vendemos seus dados. O contato pelo WhatsApp segue os termos do próprio WhatsApp.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Por quanto tempo guardamos</h2>
        <p>[PREENCHER: prazo de retenção, por exemplo, enquanto durar a relação e pelo prazo legal aplicável].</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Seus direitos</h2>
        <p>
          Você pode pedir acesso, correção, exclusão dos seus dados, revogar o consentimento e obter informações
          sobre o tratamento, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Escreva para
          [PREENCHER: e-mail] ou fale com a gente pelo WhatsApp.
        </p>
      </section>
    </article>
  );
}
