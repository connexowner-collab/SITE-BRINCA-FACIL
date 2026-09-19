# Site BrincaFácil (público)

Site de locação de brinquedos: catálogo, calendário de disponibilidade, pedido de cotação e
botão do WhatsApp com mensagem pronta. O painel administrativo fica em outro repositório
(`BRINCA-FACIL`) e usa o mesmo banco Supabase. **O esquema do banco vive só lá.**

**Tecnologia:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase (`@supabase/supabase-js`).

## Rodar no seu computador

```powershell
npm install
copy .env.example .env.local     # depois preencha os valores no .env.local
npm run dev                      # http://localhost:3000
```

## Variáveis de ambiente

| Variável | Obrigatória | Onde pegar / observação |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sim | Mesma tela, chave **publishable** (`sb_publishable_...`). É pública por definição |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | Endereço final do site (links, sitemap, prévia no WhatsApp) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Não | Captcha Cloudflare Turnstile (chave pública do site) |
| `TURNSTILE_SECRET_KEY` | Não | Segredo do Turnstile. Só servidor. Na Vercel, marque **Sensitive** |

**Este projeto nunca usa a chave secret/service_role.** Se alguém pedir para colocá-la aqui, não faça.

## Publicar na Vercel

1. Suba o código para o GitHub (branch `main`). A Vercel publica sozinha a cada push.
2. Em **Project Settings → General**, o *Framework Preset* deve ser **Next.js** (a Vercel costuma detectar).
   Deixe *Build Command*, *Output Directory* e *Install Command* sem override.
3. Em **Project Settings → Environment Variables**, cadastre as variáveis acima (Production, Preview e Development).
4. Faça um novo deploy. Variáveis só valem para deploys criados depois de cadastradas.

## Configurar o WhatsApp da empresa

Sem número, o site funciona: os botões do WhatsApp ficam ocultos e a cotação é gravada normalmente.
Para ativar, rode no SQL Editor do Supabase (só dígitos, com DDI e DDD):

```sql
update public.configuracoes
set valor = '"5512999998888"'
where chave = 'whatsapp_numero';
```

O texto da mensagem pronta (`modelo_mensagem_cotacao`) também fica em `configuracoes` e aceita
`{produto}`, `{data}`, `{hora_inicio}`, `{hora_fim}` e `{protocolo}`.

## Testar antes do painel existir

`docs/dados-de-exemplo.sql` cria um brinquedo de teste com 2 unidades. Apague-o antes de divulgar
(o bloco de limpeza está no fim do arquivo).

## Como o pedido de cotação funciona

1. O cliente escolhe o brinquedo, o dia (calendário) e o horário, e envia nome e WhatsApp.
2. `POST /api/cotacao` valida e chama a função `solicitar_cotacao` do banco, que grava o pedido como **em análise**.
3. O cliente recebe um protocolo (`BF-XXXXXX`), um link privado de acompanhamento e o botão "Continuar no WhatsApp".
4. Pedido em análise **não bloqueia a agenda**. Só a confirmação, feita no painel, fecha o horário.

## Segurança

- O site só usa a chave pública. Quem protege os dados é o RLS do banco: o visitante nunca lê a tabela de locações.
- Datas livres e status do pedido vêm de funções do banco que devolvem só o necessário.
- O banco limita pedidos por telefone (5 por hora) e no total (60 a cada 10 minutos).
- O captcha e o campo-isca da rota são barreiras extras, não a defesa principal.

## Antes de divulgar

- [ ] Preencher os campos `[PREENCHER]` em `src/app/privacidade/page.tsx` e revisar o texto com um profissional jurídico.
- [ ] Cadastrar o número do WhatsApp (seção acima).
- [ ] Apagar os dados de exemplo e cadastrar os brinquedos reais.
- [ ] Definir `NEXT_PUBLIC_SITE_URL` com o domínio final.

## Estrutura

```
src/app/            páginas (início, brinquedo, acompanhar, privacidade), rota da API, sitemap, robots
src/components/     cabeçalho, hero, cards, catálogo, calendário, formulário de cotação
src/lib/            acesso ao Supabase, datas (fuso de São Paulo), formatação, WhatsApp
public/             logo, ícones, imagem de compartilhamento, manifest
docs/               dados de exemplo
```
