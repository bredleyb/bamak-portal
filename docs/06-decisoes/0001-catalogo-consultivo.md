# 0001 — Catálogo consultivo

## Status

Aceita.

## Decisão

O catálogo do portal da Bamak será uma área de consulta comercial. Sua função é apresentar produtos de forma organizada, permitir refinamento por busca e filtros, abrir caminho para detalhes do produto e encaminhar o visitante para contato comercial.

O catálogo não terá carrinho, checkout, pagamento online, cálculo de frete, fechamento de pedido ou orçamento automático.

## Contexto do projeto

A Bamak atua em contexto B2B, fornecendo materiais, peças e equipamentos para outras empresas, com destaque para aplicações ligadas à agroindústria.

Nesse tipo de venda, o visitante normalmente precisa entender a empresa, conferir se a oferta se conecta à sua operação e depois iniciar contato. O catálogo entra nessa etapa de avaliação. Ele reduz a dependência de uma primeira conversa apenas exploratória e organiza a consulta antes do orçamento.

O problema identificado no PAC VII está na organização da informação: apresentação institucional, segmentos atendidos, soluções, produtos, dúvidas recorrentes e contato aparecem de forma pouco integrada. O catálogo precisa fazer parte desse fluxo, conectando produto, orientação e acionamento comercial.

## Papel do catálogo no fluxo público

O catálogo funciona como etapa intermediária entre a leitura da oferta e o contato.

```txt
Descoberta
→ Entendimento institucional
→ Segmentos e soluções
→ Catálogo
→ Detalhe do produto
→ FAQ
→ Contato comercial
```

O visitante pode chegar ao catálogo pela Home, por Segmentos, por Soluções ou por uma chamada direta de navegação. A saída esperada é a leitura de detalhes e o envio de uma mensagem comercial mais contextualizada.

## Estrutura prevista pelo wireframe

O wireframe `wf-05-catalogo` consolidou o catálogo como uma página de consulta com refinamento e navegação por resultado.

Elementos previstos:

| Elemento | Função |
|---|---|
| Trilha de navegação | Situar o visitante dentro do portal. |
| Texto introdutório | Explicar o objetivo da página antes da listagem. |
| Busca textual | Permitir procura direta por termo, produto ou aplicação. |
| Filtros superiores | Refinar resultados por critérios principais. |
| Ordenação | Alterar a ordem de exibição dos produtos. |
| Botões Aplicar/Limpar | Controlar o uso dos filtros. |
| Contagem de resultados | Informar o volume retornado pela consulta. |
| Visualização grade/lista | Permitir variação de leitura conforme preferência do visitante. |
| Painel lateral de filtros | Manter refinamento mais completo no desktop. |
| Cards de produto | Exibir imagem, categoria, título, SKU e link de detalhe. |
| Link “Ver detalhes” | Abrir página ou tela de detalhe do produto. |
| Paginação | Dividir resultados em páginas. |
| Botão “Expandir” | Apoiar carregamento ou ampliação de resultados, conforme implementação. |
| CTA final | Encaminhar para contato ou orçamento. |

Essa estrutura torna o catálogo mais específico do que uma simples grade de produtos. A página precisa permitir procura, filtragem, comparação inicial e avanço para detalhe.

## Conteúdo mínimo do card de produto

Cada card de produto deve apresentar, quando houver dado real disponível:

| Campo | Função |
|---|---|
| Imagem | Apoiar reconhecimento visual do produto. |
| Categoria | Indicar agrupamento comercial. |
| Nome do produto | Identificar o item consultado. |
| SKU ou código interno | Apoiar referência em contato comercial. |
| Descrição curta | Explicar rapidamente a utilidade do produto. |
| Link de detalhe | Direcionar para aprofundamento. |

O SKU deve ser tratado como campo opcional. Ele aparece no wireframe como referência de produto, mas depende de validação com a Bamak.

## Conteúdo previsto no detalhe do produto

A continuidade no PAC 8 deve prever uma página ou modal de detalhe. Essa tela precisa aprofundar o item sem criar fluxo de compra.

Informações previstas:

| Campo | Função |
|---|---|
| Nome do produto | Identificação principal. |
| Imagens | Apoio visual ao entendimento. |
| Categoria | Organização do catálogo. |
| Descrição | Explicação do produto e do uso esperado. |
| Aplicação | Contexto operacional, quando disponível. |
| Segmentos relacionados | Conexão com áreas atendidas pela Bamak. |
| Soluções relacionadas | Conexão com frentes comerciais. |
| Código/SKU | Referência para contato. |
| Chamada para contato | Envio do visitante para formulário ou canal direto. |

O detalhe do produto deve responder à pergunta “este item faz sentido para minha necessidade?” e depois orientar o contato.

## Escopo funcional do catálogo

O catálogo deve contemplar:

- listagem de produtos;
- busca textual;
- filtros principais no topo;
- painel lateral de filtros no desktop;
- ordenação;
- contagem de resultados;
- visualização em grade;
- visualização em lista, se for mantida na implementação;
- paginação ou expansão de resultados;
- cards com imagem, categoria, título e SKU opcional;
- acesso ao detalhe do produto;
- CTA para contato ou solicitação de orçamento;
- relação com segmentos e soluções, quando houver conteúdo real validado.

## O que fica excluído

O catálogo não deve incluir:

- carrinho de compras;
- botão “Comprar”;
- botão “Adicionar ao carrinho”;
- checkout;
- pagamento online;
- cálculo automático de frete;
- estoque em tempo real;
- preço obrigatório;
- pedido fechado pelo site;
- geração automática de proposta comercial;
- negociação automatizada.

Esses itens exigiriam regras de preço, logística, disponibilidade, impostos, condições comerciais, integrações e operação contínua. Esse conjunto pertence a outro tipo de sistema e não responde ao problema trabalhado no PAC VII.

## Diretrizes de interface

A linguagem da página deve reforçar consulta e contato comercial.

Chamadas adequadas:

- “Ver detalhes”
- “Solicitar orçamento”
- “Falar com a Bamak”
- “Tenho interesse”
- “Consultar aplicação”
- “Enviar dúvida sobre este produto”

Chamadas inadequadas para este recorte:

- “Comprar”
- “Adicionar ao carrinho”
- “Finalizar pedido”
- “Pagar agora”
- “Calcular frete”

O CTA principal deve encaminhar para contato. O link de detalhe deve aprofundar a informação do produto.

## Impacto no módulo administrativo

O módulo administrativo deve permitir manutenção do catálogo exibido na área pública.

Operações previstas:

- cadastrar produto;
- editar produto;
- ocultar ou publicar produto;
- definir categoria;
- associar imagem;
- preencher descrição curta;
- preencher descrição detalhada;
- informar SKU ou código interno, se a Bamak usar esse dado;
- associar segmentos, quando aplicável;
- associar soluções, quando aplicável;
- ordenar ou destacar produtos, se necessário;
- consultar mensagens relacionadas a produto, caso o formulário registre essa origem.

O painel não precisa controlar estoque, venda, pedido, financeiro ou emissão de proposta.

## Impacto na modelagem de dados

Entidades prováveis para continuidade:

| Entidade | Papel |
|---|---|
| `Product` | Representa o produto exibido no catálogo. |
| `ProductCategory` | Agrupa produtos por tipo ou linha. |
| `Segment` | Representa contextos atendidos. |
| `Solution` | Representa frentes de solução. |
| `ContactMessage` | Registra mensagens enviadas pelo visitante. |

Campos prováveis em `Product`:

| Campo | Observação |
|---|---|
| `id` | Identificador interno. |
| `name` | Nome público do produto. |
| `slug` | URL amigável para detalhe. |
| `shortDescription` | Texto curto para card. |
| `description` | Texto detalhado. |
| `sku` | Código opcional. |
| `imageUrl` | Imagem principal. |
| `categoryId` | Categoria do produto. |
| `isPublished` | Controle de publicação. |
| `createdAt` | Registro de criação. |
| `updatedAt` | Registro de atualização. |

Relacionamentos possíveis:

```txt
Product → ProductCategory
Product ↔ Segment
Product ↔ Solution
ContactMessage → Product opcional
```

O vínculo entre mensagem e produto deve ser opcional. O visitante pode entrar em contato a partir de páginas institucionais, FAQ, catálogo ou formulário geral.

## Consequências

### Ganhos

- catálogo alinhado ao comportamento B2B;
- consulta mais útil do que uma lista estática;
- busca e filtros coerentes com o wireframe;
- abertura para páginas de detalhe no PAC 8;
- menor complexidade que uma loja virtual;
- integração clara com segmentos, soluções, FAQ e contato;
- manutenção viável via painel administrativo.

### Limitações assumidas

- o portal não fecha vendas;
- o impacto comercial não será medido automaticamente nesta etapa;
- preços e condições comerciais continuam dependentes da Bamak;
- filtros reais dependem de validação do catálogo da empresa;
- detalhes reais dos produtos precisarão ser levantados no PAC 8.

## Critério de validação no PAC 8

A decisão estará cumprida se o catálogo permitir que um visitante:

1. entenda quais produtos a Bamak apresenta;
2. busque produtos por termo;
3. refine a listagem por filtros;
4. identifique categoria, nome e código do item;
5. acesse detalhes do produto;
6. avance para contato comercial sem confundir o portal com loja virtual.

## Artefatos relacionados

- `docs/03-escopo/escopo-pac-vii.md`
- `docs/03-escopo/fora-escopo.md`
- `docs/03-escopo/requisitos-consolidados.md`
- `docs/03-escopo/inventario-telas.md`
- `docs/04-arquitetura-informacao/fluxo-descoberta-contato.md`
- `docs/07-wireframes-lo-fi/wf-05-catalogo.png`
