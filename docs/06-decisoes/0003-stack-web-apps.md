# 0003 — Stack Web Apps

## Status

Aceita.

## Decisão

A continuidade técnica do portal da Bamak seguirá a linha Web Apps, com frontend próprio, backend próprio, banco de dados relacional, autenticação administrativa e ambiente padronizado por Docker.

Stack definida:

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js + TypeScript |
| Interface | Tailwind CSS + shadcn/ui |
| Backend | NestJS + TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT |
| Ambiente | Docker |

## Contexto do projeto

O portal da Bamak precisa sustentar duas frentes:

1. área pública institucional-comercial;
2. módulo administrativo autenticado.

Os wireframes do PAC VII detalham páginas públicas com navegação responsiva, cards, CTAs, listagens, filtros, paginação, acordeões, formulários, indicadores, linha do tempo e páginas de detalhe previstas. O módulo administrativo precisa alimentar esses conteúdos de forma estruturada.

A stack precisa permitir implementação real no PAC 8, com separação entre interface, regras de negócio e dados.

## Justificativa da linha Web Apps

A linha Web Apps é adequada porque o projeto precisa demonstrar uma aplicação web completa, com:

- interface própria;
- rotas públicas;
- rotas administrativas protegidas;
- API backend;
- persistência;
- autenticação;
- integração com serviço externo de e-mail;
- capacidade de evolução dos wireframes lo-fi para telas funcionais;
- controle sobre filtros, listagens, cards, formulários e conteúdos administráveis.

Soluções puramente estáticas enfraqueceriam o módulo administrativo. Ferramentas no-code reduziriam a rastreabilidade técnica do projeto. Um CMS pronto resolveria parte da edição de conteúdo, porém deixaria menos explícita a arquitetura própria exigida pela proposta acadêmica e pela continuidade em Engenharia de Software.

## Frontend: Next.js + TypeScript

O frontend será responsável por:

- páginas públicas;
- navegação institucional-comercial;
- menu desktop e mobile;
- listagens;
- páginas de detalhe;
- cards reutilizáveis;
- filtros e busca no catálogo;
- paginação em catálogo, notícias e agenda;
- acordeões de FAQ;
- formulários de contato;
- CTAs;
- acesso ao módulo administrativo;
- consumo da API backend.

Next.js foi escolhido porque permite organizar o portal em rotas claras e evoluir a aplicação sem separar a área pública e administrativa em projetos distintos no início.

TypeScript reduz ambiguidade entre frontend e backend, especialmente em entidades como produto, segmento, solução, notícia, evento, FAQ e mensagem de contato.

Rotas públicas previstas:

```txt
/
/a-bamak
/segmentos
/segmentos/[slug]
/solucoes
/solucoes/[slug]
/catalogo
/catalogo/[slug]
/faq
/contato
/noticias
/noticias/[slug]
/agenda
/agenda/[slug]
```

Rotas administrativas previstas:

```txt
/admin/login
/admin/dashboard
/admin/home
/admin/conteudos
/admin/indicadores
/admin/linha-do-tempo
/admin/segmentos
/admin/solucoes
/admin/catalogo
/admin/faq
/admin/noticias
/admin/agenda
/admin/mensagens
```

## Interface: Tailwind CSS + shadcn/ui

Tailwind CSS será usado para construir a interface com controle direto sobre espaçamento, hierarquia, responsividade e componentes.

shadcn/ui será usado como base de componentes editáveis, principalmente para:

- botões;
- cards;
- formulários;
- inputs;
- selects;
- tabelas;
- diálogos;
- dropdowns;
- paginação;
- acordeões;
- abas;
- navegação administrativa;
- feedbacks de interface.

Essa combinação é útil porque o projeto ainda passará de wireframes lo-fi para telas refinadas no PAC 8. A interface precisa aceitar a identidade visual da Bamak sem depender de tema fechado.

## Componentes exigidos pelos wireframes

A camada de interface deve prever componentes reutilizáveis para:

| Componente | Uso no portal |
|---|---|
| Header desktop | Navegação principal e CTA. |
| Header mobile | Logo, CTA e menu recolhido. |
| Footer | Informações institucionais, colunas e links legais. |
| Breadcrumb | Trilha de navegação nas páginas internas. |
| Hero interno | Título, slogan e descrição de página. |
| Card de destaque | Home, segmentos, soluções, notícias e agenda. |
| Card de produto | Catálogo consultivo. |
| Filtro | Catálogo, notícias e agenda. |
| Busca | Catálogo. |
| Ordenação | Catálogo. |
| Paginação | Catálogo, notícias e agenda. |
| Acordeão | FAQ. |
| Formulário | Contato. |
| CTA final | Encaminhamento para contato em páginas públicas. |
| Indicador | Página “A Bamak”. |
| Linha do tempo | Página “A Bamak”. |
| Abas | Agenda, caso seja mantida a divisão entre “Em breve” e “Histórico”. |

Esses componentes reforçam a escolha por uma stack de frontend componentizada.

## Backend: NestJS + TypeScript

O backend será responsável por:

- autenticação administrativa;
- validação de dados;
- regras de publicação;
- CRUD de conteúdos;
- recebimento de mensagens de contato;
- integração com e-mail;
- comunicação com o banco via Prisma.

NestJS foi escolhido pela organização modular. O portal pode ser dividido em módulos próximos ao domínio do projeto:

```txt
auth
users
home-sections
institutional-content
indicators
timeline
segments
solutions
products
product-categories
faq
news
events
contact-messages
mail
```

Essa divisão mantém o backend alinhado às áreas reais do portal e evita controladores genéricos concentrando responsabilidades demais.

## Banco de dados: PostgreSQL

PostgreSQL será usado porque o portal lida com dados relacionais e administráveis.

Entidades previstas:

| Entidade | Uso |
|---|---|
| Usuário administrativo | Login e manutenção do painel. |
| Bloco da Home | Chamadas, cards e CTAs da página inicial. |
| Conteúdo institucional | Textos controlados sobre a empresa. |
| Indicador | Dados institucionais exibidos em “A Bamak”. |
| Marco histórico | Linha do tempo da empresa. |
| Segmento | Contextos atendidos. |
| Solução | Frentes de atuação. |
| Produto | Catálogo consultivo. |
| Categoria de produto | Organização de produtos. |
| FAQ | Perguntas e respostas comerciais. |
| Notícia | Publicações institucionais. |
| Categoria de notícia | Organização de notícias, se necessário. |
| Evento | Agenda pública. |
| Mensagem de contato | Registros enviados pelo formulário. |

O banco relacional atende esse cenário porque o portal precisa manter relações entre produtos, categorias, segmentos, soluções e mensagens.

## ORM: Prisma

Prisma será usado para:

- modelar entidades;
- criar migrations;
- tipar consultas;
- reduzir divergência entre banco e aplicação;
- facilitar manutenção no PAC 8.

A escolha combina com TypeScript no backend e reduz erro em operações recorrentes de conteúdo.

Exemplo de entidades que tendem a aparecer no schema:

```txt
User
HomeSection
InstitutionalContent
Indicator
TimelineItem
Segment
Solution
Product
ProductCategory
FaqItem
NewsPost
NewsCategory
Event
ContactMessage
```

## Autenticação: JWT

JWT será usado para proteger o módulo administrativo.

Aplicações previstas:

- login administrativo;
- acesso a rotas protegidas;
- criação e edição de conteúdos;
- publicação e ocultação de itens;
- visualização de mensagens;
- validação de sessão no frontend.

O acesso público ao portal não exige login. A autenticação existe para preservar a manutenção dos conteúdos.

## Ambiente: Docker

Docker será usado para padronizar o ambiente de desenvolvimento no PAC 8.

Uso previsto:

- subir banco PostgreSQL local;
- padronizar dependências;
- facilitar execução em diferentes máquinas;
- reduzir problemas de ambiente entre desenvolvimento, testes e entrega.

No PAC VII, o repositório permanece documental. Arquivos como `docker-compose.yml`, `package.json`, `src/`, `frontend/` e `backend/` só devem entrar quando a implementação começar no PAC 8.

## Separação entre frontend e backend

A arquitetura deve manter responsabilidades separadas:

| Camada | Responsabilidade |
|---|---|
| Frontend | Exibição, navegação, formulários, filtros, listagens e experiência do usuário. |
| Backend | Regras, validações, autenticação e operações de conteúdo. |
| Banco | Persistência dos dados. |
| E-mail | Encaminhamento de mensagens de contato. |

O frontend não deve gravar diretamente no banco. Toda operação administrativa deve passar pela API.

## Relação entre wireframes e implementação

Os wireframes criam exigências práticas para a implementação:

| Wireframe | Exigência técnica |
|---|---|
| Home | Componentes reutilizáveis de seção, cards, links e CTAs. |
| A Bamak | Indicadores e linha do tempo alimentáveis por dados. |
| Segmentos | Cards e páginas de detalhe por slug. |
| Soluções | Cards e páginas de detalhe por slug. |
| Catálogo | Busca, filtros, ordenação, grade/lista, SKU, paginação e detalhe. |
| FAQ | Acordeões e ordenação de perguntas. |
| Contato | Formulário validado e envio/registro de mensagem. |
| Notícias | Filtro, cards, categoria, data, paginação e detalhe. |
| Agenda | Abas, filtro, data, localização, paginação e detalhe. |

Essa relação reforça a escolha de Next.js, NestJS, PostgreSQL e Prisma como base para uma aplicação administrável, e não apenas para páginas estáticas.

## Consequências

### Ganhos

- arquitetura compatível com Web Apps;
- base técnica adequada para área pública e admin;
- stack coerente com TypeScript nas duas pontas;
- facilidade para evoluir dos wireframes para implementação;
- separação clara entre interface, API e dados;
- componentes compatíveis com as páginas já desenhadas;
- boa rastreabilidade para documentação acadêmica.

### Custos assumidos

- exige implementação de backend próprio;
- exige modelagem de banco;
- exige autenticação;
- exige componentização cuidadosa no frontend;
- exige mais organização do que um site estático;
- aumenta a responsabilidade sobre segurança e validação no painel.

Esses custos são aceitáveis porque o projeto prevê módulo administrativo, conteúdo persistente, filtros, páginas de detalhe e manutenção recorrente.

## Critério de validação no PAC 8

A decisão estará cumprida se a implementação inicial demonstrar:

1. frontend com rotas públicas;
2. layout responsivo desktop/mobile;
3. componentes para cards, filtros, formulários, acordeões e paginação;
4. área administrativa protegida;
5. API backend modular;
6. banco PostgreSQL persistindo conteúdos;
7. Prisma gerenciando modelos e migrations;
8. autenticação por JWT;
9. execução local padronizada.

## Artefatos relacionados

- `docs/05-arquitetura-tecnica/arquitetura-web-apps.md`
- `docs/05-arquitetura-tecnica/stack-tecnologica.md`
- `docs/05-arquitetura-tecnica/c1-contexto.png`
- `docs/05-arquitetura-tecnica/c2-containers.png`
- `docs/03-escopo/requisitos-consolidados.md`
- `docs/07-wireframes-lo-fi/README.md`
- `docs/08-planejamento-pac-8/backlog-inicial.md`
