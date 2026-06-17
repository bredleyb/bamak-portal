# Requisitos consolidados

Este documento registra os requisitos consolidados para o **Portal Web Institucional-Comercial para a Bamak** no PAC VII.

Os requisitos servem como rastreabilidade entre diagnóstico, escopo, telas, arquitetura e continuidade. Eles não representam implementação pronta.

## 1. Legenda de status

| Status | Significado |
|---|---|
| Definido | Decisão consolidada no PAC VII. |
| Lo-fi | Representado nos wireframes de baixa fidelidade. |
| PAC 8 | Previsto para detalhamento ou implementação no semestre seguinte. |
| Excluído | Fora do escopo atual. |

## 2. Requisitos funcionais da área pública

| ID | Requisito | Decisão específica | Status |
|---|---|---|---|
| RF-PUB-01 | Exibir Home com visão geral da Bamak e atalhos principais. | A Home deve funcionar como entrada para A Bamak, Segmentos, Soluções, Catálogo, FAQ e Contato. | Lo-fi |
| RF-PUB-02 | Exibir página institucional da Bamak. | A apresentação da empresa deve ficar separada do catálogo e do contato. | Lo-fi |
| RF-PUB-03 | Exibir segmentos atendidos. | Segmentos ajudam o visitante a reconhecer se a Bamak atua no seu contexto. | Lo-fi |
| RF-PUB-04 | Exibir soluções. | Soluções organizam frentes de atuação e evitam que a oferta vire apenas lista de produtos. | Lo-fi |
| RF-PUB-05 | Exibir catálogo de produtos. | O catálogo deve apoiar consulta antes do contato, sem comportamento de loja. | Lo-fi |
| RF-PUB-06 | Permitir organização visual do catálogo por filtros ou categorias. | A consulta precisa reduzir esforço para localizar produtos. | Lo-fi |
| RF-PUB-07 | Exibir FAQ antes do contato. | A FAQ deve responder dúvidas sobre pedidos, orçamento e canais comerciais. | Lo-fi |
| RF-PUB-08 | Exibir página de contato. | Deve centralizar formulário e canais comerciais da Bamak. | Lo-fi |
| RF-PUB-09 | Exibir notícias. | Notícias funcionam como atualização institucional pública. | Lo-fi |
| RF-PUB-10 | Exibir agenda. | Agenda registra eventos, feiras e acontecimentos relevantes. | Lo-fi |
| RF-PUB-11 | Prever detalhe de segmento. | Deve explicar um segmento e relacioná-lo com soluções/produtos. | PAC 8 |
| RF-PUB-12 | Prever detalhe de solução. | Deve apresentar contexto, aplicação e relação com oferta. | PAC 8 |
| RF-PUB-13 | Prever detalhe de produto. | Deve exibir descrição, categoria, aplicação e chamada para contato. | PAC 8 |
| RF-PUB-14 | Prever detalhe de notícia. | Deve permitir leitura completa de publicação. | PAC 8 |
| RF-PUB-15 | Prever detalhe de evento. | Deve exibir data, local, descrição e contexto. | PAC 8 |

## 3. Requisitos funcionais do módulo administrativo

| ID | Requisito | Decisão específica | Status |
|---|---|---|---|
| RF-ADM-01 | Exigir login administrativo. | A manutenção de conteúdo deve ser restrita à Bamak. | Definido |
| RF-ADM-02 | Exibir painel inicial. | Deve reunir atalhos para conteúdos administráveis. | PAC 8 |
| RF-ADM-03 | Gerenciar notícias. | Notícias precisam ser criadas, editadas, publicadas ou ocultadas. | PAC 8 |
| RF-ADM-04 | Gerenciar agenda. | Eventos e feiras precisam de manutenção pela empresa. | PAC 8 |
| RF-ADM-05 | Gerenciar FAQ. | Perguntas e respostas devem ser atualizáveis. | PAC 8 |
| RF-ADM-06 | Gerenciar catálogo. | Produtos e descrições devem ser mantidos sem alterar código. | PAC 8 |
| RF-ADM-07 | Gerenciar segmentos. | Segmentos podem precisar de ajuste conforme conteúdo real. | PAC 8 |
| RF-ADM-08 | Gerenciar soluções. | Soluções devem acompanhar a organização comercial definida. | PAC 8 |
| RF-ADM-09 | Gerenciar conteúdos institucionais. | Textos da empresa podem precisar de edição recorrente. | PAC 8 |
| RF-ADM-10 | Consultar mensagens de contato. | Mensagens do formulário devem ficar registradas para acompanhamento inicial. | PAC 8 |

## 4. Requisitos não funcionais

| ID | Requisito | Aplicação no projeto | Status |
|---|---|---|---|
| RNF-01 | Separar frontend, backend e banco. | Mantém apresentação, regras e persistência em camadas distintas. | Definido |
| RNF-02 | Usar TypeScript no frontend e backend. | Reduz ambiguidade nos contratos da aplicação. | Definido |
| RNF-03 | Usar componentes reutilizáveis na interface. | Facilita evolução dos wireframes lo-fi para telas refinadas. | Definido |
| RNF-04 | Usar banco relacional. | Produtos, categorias, FAQ, notícias, eventos e mensagens têm estrutura persistente. | Definido |
| RNF-05 | Proteger operações administrativas. | Criação, edição e ocultação de conteúdo exigem autenticação. | Definido |
| RNF-06 | Permitir padronização de ambiente. | Docker foi definido para continuidade, não como entrega do PAC VII. | Definido |
| RNF-07 | Manter navegação orientada ao B2B. | O fluxo público deve preparar contato comercial, não compra online. | Definido |
| RNF-08 | Prever conteúdo administrável. | FAQ, catálogo, notícias, agenda e conteúdo institucional não devem ficar estáticos. | Definido |

## 5. Regras de escopo

| ID | Regra | Implicação |
|---|---|
| RN-01 | Catálogo é consultivo. | Não há carrinho, checkout ou compra. |
| RN-02 | FAQ atua antes do orçamento. | Não substitui atendimento comercial. |
| RN-03 | Contato é o destino comercial do fluxo público. | O portal conduz para a conversa, não fecha negócio. |
| RN-04 | Painel administrativo é editorial/comercial. | Não inclui CRM, ERP ou gestão interna. |
| RN-05 | Conteúdo real deve ser validado com a Bamak no PAC 8. | Evita telas finais com textos e produtos genéricos. |
| RN-06 | Testes devem acompanhar a continuidade. | Navegação pública e manutenção administrativa precisam ser validadas cedo. |

## 6. Itens excluídos

| ID | Item | Status |
|---|---|---|
| FE-01 | E-commerce | Excluído |
| FE-02 | Carrinho de compras | Excluído |
| FE-03 | Checkout | Excluído |
| FE-04 | Pagamento online | Excluído |
| FE-05 | Orçamento automatizado | Excluído |
| FE-06 | CRM | Excluído |
| FE-07 | Área de cliente | Excluído |
| FE-08 | ERP | Excluído |
| FE-09 | Métricas de impacto comercial no PAC VII | Excluído |

## 7. Rastreabilidade por problema

| Problema diagnosticado | Requisitos relacionados |
|---|---|
| Apresentação institucional fraca | RF-PUB-02, RNF-07 |
| Segmentos e soluções pouco claros | RF-PUB-03, RF-PUB-04, RF-PUB-11, RF-PUB-12 |
| Produtos sem percurso comercial claro | RF-PUB-05, RF-PUB-06, RF-PUB-13, RN-01 |
| Dúvidas antes do orçamento | RF-PUB-07, RN-02 |
| Contato pouco contextualizado | RF-PUB-08, RN-03 |
| Conteúdo dependente de alteração técnica | RF-ADM-03 a RF-ADM-10, RNF-08 |
| Necessidade de base Web Apps | RNF-01 a RNF-06 |

## 8. Prioridade para o PAC 8

A continuidade deve priorizar requisitos que comprovem o valor central do projeto:

1. visitante entende a Bamak;
2. visitante encontra segmentos, soluções e catálogo;
3. visitante usa FAQ e chega ao contato;
4. Bamak mantém conteúdo sem editar código;
5. arquitetura permanece dentro do recorte Web Apps.
