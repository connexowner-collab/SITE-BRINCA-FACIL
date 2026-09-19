-- =====================================================================
-- DADOS DE EXEMPLO — só para testar o site antes de o painel administrativo existir.
-- Rode no SQL Editor do Supabase (como dono do projeto). APAGUE antes de divulgar o site
-- (bloco de limpeza no final).
-- =====================================================================

with c as (
  insert into public.categorias (nome, slug, ordem)
  values ('Infláveis', 'inflaveis', 1)
  on conflict (slug) do update set nome = excluded.nome
  returning id
),
b as (
  insert into public.brinquedos
    (categoria_id, nome, slug, descricao, inclui, preco, preco_referencia,
     duracao_padrao_min, faixa_etaria_min, faixa_etaria_max, destaque, publicado, ordem)
  select c.id, 'Pula-pula Exemplo', 'pula-pula-exemplo',
         'Brinquedo de exemplo para testar o site. Apague antes de publicar.',
         array['Montagem e desmontagem', 'Monitor durante o evento'],
         300, 'por evento de até 4 horas', 240, 3, 10, true, true, 1
  from c
  on conflict (slug) do nothing
  returning id
)
insert into public.unidades (brinquedo_id, apelido)
select b.id, u.apelido
from b cross join (values ('Unidade 1'), ('Unidade 2')) as u(apelido);

-- Foto de exemplo (opcional): suba uma imagem no Storage, bucket "publico", com o caminho
-- brinquedos/pula-pula-exemplo-1.jpg e depois rode:
--
-- insert into public.brinquedo_imagens (brinquedo_id, caminho, ordem, principal)
-- select id, 'brinquedos/pula-pula-exemplo-1.jpg', 0, true
-- from public.brinquedos where slug = 'pula-pula-exemplo';

-- ---------------------------------------------------------------------
-- LIMPEZA (rode quando terminar os testes; não funciona se já houver locações desse brinquedo)
-- ---------------------------------------------------------------------
-- delete from public.brinquedos where slug = 'pula-pula-exemplo';
-- delete from public.categorias where slug = 'inflaveis'
--   and not exists (select 1 from public.brinquedos where categoria_id = categorias.id);
