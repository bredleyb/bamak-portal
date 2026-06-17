# 0004 — Recorte sem funcionalidades transacionais

## Status

Aceita.

## Decisão

O portal da Bamak será delimitado como solução institucional-comercial, sem funcionalidades transacionais.

Ficam fora do projeto:

- e-commerce;
- carrinho;
- checkout;
- pagamento online;
- cálculo de frete;
- orçamento automatizado;
- fechamento de pedido;
- CRM;
- ERP;
- área de cliente;
- automações comerciais;
- indicadores de impacto comercial em produção.

O portal deve organizar informação, apoiar consulta e encaminhar contato. A negociação permanece nos canais comerciais da empresa.

## Contexto do projeto

O diagnóstico do PAC VII apontou que o problema principal da Bamak está na presença digital pouco articulada. O site precisa explicar melhor:

- quem é a empresa;
- quais segmentos atende;
- quais soluções oferece;
- quais produtos podem ser consultados;
- quais dúvidas comerciais precisam ser esclarecidas antes do contato;
- como o visitante inicia uma conversa com a empresa.

Esse problema é anterior à transação. O visitante precisa entender a Bamak antes de comprar, pedir orçamento ou negociar.

## Motivo do recorte

Funcionalidades transacionais exigem definições que o projeto atual não possui e que não pertencem ao objetivo do PAC VII.

Exemplos:

| Funcionalidade | Dependências que criaria |
|---|---|
| E-commerce | preço, estoque, frete, pedido, pagamento, termos comerciais e suporte operacional. |
| Checkout | gateway de pagamento, segurança, regras fiscais e tratamento de falhas. |
| Orçamento automatizado | regras de preço, variação por quantidade, região, aplicação, disponibilidade e exceções comerciais. |
| CRM | cadastro de clientes, etapas de negociação, histórico comercial e rotina de acompanhamento. |
| Área de cliente | login de cliente, permissões, dados sensíveis, histórico e suporte pós-venda. |
| ERP | integração com operação interna, financeiro, estoque, emissão e gestão administrativa. |

Essas dependências deslocariam o projeto para uma solução de operação comercial. O escopo do PAC VII foi definido como base de proposta, arquitetura e prototipação.

## O que permanece no projeto

Mesmo sem transação online, o portal mantém função comercial clara.

Permanecem no escopo:

- apresentação institucional;
- segmentos atendidos;
- soluções;
- catálogo consultivo;
- FAQ sobre orçamento, pedidos e contato;
- formulário de contato;
- notícias;
- agenda;
- módulo administrativo;
- mensagens recebidas pelo formulário;
- arquitetura preparada para evolução no PAC 8.

O foco é qualificar o contato, reduzindo a dispersão de informações antes da conversa comercial.

## Fluxo adotado

O fluxo principal continua sendo:

```txt
Descoberta
→ Entendimento institucional
→ Segmentos e soluções
→ Catálogo
→ FAQ
→ Contato comercial
```

Esse fluxo organiza a etapa anterior ao orçamento. O visitante chega ao contato com mais informações sobre empresa, oferta e formas de acionamento.

## Impacto na experiência do visitante

A interface deve evitar padrões visuais de loja virtual.

Evitar:

- botão “Comprar”;
- botão “Adicionar ao carrinho”;
- preço como elemento central obrigatório;
- contagem de estoque;
- simulação de frete;
- login de cliente;
- área de pedidos.

Usar chamadas compatíveis com contato B2B:

- “Solicitar orçamento”
- “Entrar em contato”
- “Falar com a Bamak”
- “Consultar produto”
- “Tenho interesse”
- “Enviar dúvida”

## Impacto na FAQ

A FAQ ganha papel importante no recorte.

Ela deve antecipar dúvidas que normalmente surgiriam antes do orçamento, por exemplo:

- como solicitar orçamento;
- quais informações enviar no contato;
- se a empresa atende determinado tipo de demanda;
- como funciona o retorno comercial;
- quais canais podem ser usados;
- como obter mais detalhes sobre produtos.

A FAQ reduz contato repetitivo e prepara o visitante para escrever uma mensagem mais objetiva.

## Impacto no formulário de contato

O formulário deve ser simples e comercialmente útil.

Campos prováveis:

| Campo | Finalidade |
|---|---|
| Nome | Identificar o remetente. |
| Empresa | Entender o vínculo comercial. |
| E-mail | Permitir retorno. |
| Telefone/WhatsApp | Apoiar contato direto. |
| Assunto | Classificar a mensagem. |
| Produto de interesse | Registrar contexto, quando houver. |
| Mensagem | Receber a demanda. |

O formulário não gera orçamento automático. Ele encaminha ou registra a demanda para atendimento humano.

## Impacto no módulo administrativo

O painel deve registrar mensagens e permitir manutenção de conteúdo. Ele não deve controlar negociação.

Funções administrativas mantidas:

- gerenciar catálogo;
- gerenciar FAQ;
- gerenciar notícias;
- gerenciar agenda;
- editar conteúdos institucionais;
- consultar mensagens de contato.

Funções administrativas excluídas:

- pipeline comercial;
- conversão de mensagem em oportunidade;
- cadastro completo de cliente;
- propostas comerciais;
- pedidos;
- faturamento;
- estoque;
- relatórios financeiros.

## Impacto na arquitetura

A arquitetura fica mais enxuta.

Containers previstos:

```txt
Aplicação Web Frontend
API Backend
Banco de Dados
Serviço externo de e-mail
```

Não entram containers ou integrações específicas para:

- gateway de pagamento;
- sistema de frete;
- ERP;
- CRM;
- antifraude;
- área de cliente;
- automação de marketing.

Essa decisão reduz complexidade e mantém o sistema implementável dentro da continuidade acadêmica.

## Consequências

### Ganhos

- escopo mais viável;
- aderência ao problema identificado;
- menor risco técnico;
- menos dependências externas;
- arquitetura mais clara;
- continuidade mais realista no PAC 8;
- portal alinhado à venda consultiva da Bamak.

### Limitações assumidas

- o portal não mede conversão comercial real sozinho;
- o atendimento continua dependente da empresa;
- o orçamento continua fora do sistema;
- o impacto comercial só poderá ser avaliado depois de implementação, uso e validação com a Bamak.

## Critério de validação no PAC 8

A decisão estará cumprida se o portal implementado:

1. apresentar a empresa e sua oferta com clareza;
2. permitir consulta ao catálogo sem fluxo de compra;
3. orientar dúvidas por FAQ;
4. encaminhar o visitante ao contato;
5. permitir manutenção de conteúdo pelo admin;
6. preservar negociação, orçamento e venda fora do sistema.

## Artefatos relacionados

- `docs/03-escopo/fora-escopo.md`
- `docs/03-escopo/escopo-pac-vii.md`
- `docs/03-escopo/requisitos-consolidados.md`
- `docs/04-arquitetura-informacao/fluxo-descoberta-contato.md`
- `docs/05-arquitetura-tecnica/arquitetura-web-apps.md`
- `docs/06-decisoes/0001-catalogo-consultivo.md`
- `docs/06-decisoes/0002-modulo-administrativo-editorial.md`
