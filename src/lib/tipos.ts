export type Categoria = { id: string; nome: string; slug: string; ordem: number };

export type Imagem = { id: string; caminho: string; ordem: number; principal: boolean };

export type Brinquedo = {
  id: string;
  categoria_id: string | null;
  nome: string;
  slug: string;
  descricao: string | null;
  inclui: string[];
  preco: number | null;
  preco_referencia: string | null;
  duracao_padrao_min: number;
  faixa_etaria_min: number | null;
  faixa_etaria_max: number | null;
  destaque: boolean;
  ordem: number;
  categorias: { nome: string; slug: string } | null;
  brinquedo_imagens: Imagem[];
};

export type Anuncio = {
  id: string;
  titulo: string;
  texto: string | null;
  imagem_caminho: string | null;
  link_url: string | null;
  ordem: number;
};

export type ConfigSite = {
  nomeEmpresa: string;
  /** Só dígitos, com DDI+DDD (ex.: 5512999998888). Vazio = WhatsApp ainda não configurado. */
  whatsapp: string;
  modeloCotacao: string;
  mensagemGeral: string;
  heroTitulo: string;
  heroSubtitulo: string;
};

export type StatusLocacao = "em_analise" | "confirmada" | "concluida" | "cancelada" | "recusada";

export type CotacaoConsultada = {
  protocolo: string;
  produto: string;
  inicio: string;
  fim: string;
  status: StatusLocacao;
  primeiro_nome: string;
  valor_total: number | null;
};

export type DiaDisponibilidade = { dia: string; livres: number; total: number };
