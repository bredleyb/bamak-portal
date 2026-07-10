# Stack tecnológica

## Finalidade

Este documento registra a stack técnica proposta para a continuidade do Portal Web Institucional-Comercial da Bamak no PAC 8.

A stack foi definida para sustentar uma aplicação web com área pública, módulo administrativo, conteúdo persistente, catálogo consultivo, FAQ, contato, notícias, agenda e páginas de detalhe.

## Stack definida

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js + TypeScript |
| Interface | Tailwind CSS + shadcn/ui |
| Backend | NestJS + TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | JWT |
| Ambiente | Docker |

## Critério principal da escolha

A stack precisa sustentar uma aplicação administrável, não apenas páginas estáticas.

Os wireframes do PAC VII indicam necessidades concretas:

- navegação desktop e mobile;
- header, rodapé e breadcrumbs;
- cards reutilizáveis;
- CTAs recorrentes;
- indicadores;
- linha do tempo;
- listagens;
- busca;
- filtros;
- ordenação;
- paginação;
- FAQ em acordeão;
- formulário de contato;
- páginas de detalhe;
- conteúdos mantidos por painel administrativo.

A escolha técnica acompanha essas exigências e mantém o projeto dentro da linha Web Apps.

## Frontend: Next.js + TypeScript

### Papel no projeto

O frontend deve exibir a área pública e o módulo administrativo.

Responsabilidades:

- renderizar páginas públicas;
- organizar rotas;
- controlar navegação responsiva;
- exibir listagens e detalhes;
- consumir dados da API;
- validar formulários no cliente;
- proteger visualmente rotas administrativas;
- montar componentes reutilizáveis;
- aplicar a identidade visual da Bamak no PAC 8.

### Por que Next.js

Next.js é adequado porque o portal possui estrutura de páginas bem definida, com rotas públicas e rotas administrativas na mesma aplicação.

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

A estrutura favorece continuidade: primeiro as páginas principais, depois detalhes públicos e telas administrativas.

### Por que TypeScript no frontend

TypeScript reduz divergência entre o que a interface espera e o que a API entrega.

Entidades que exigem tipagem consistente:

- produto;
- categoria;
- segmento;
- solução;
- pergunta frequente;
- notícia;
- evento;
- indicador;
- item de linha do tempo;
- mensagem de contato;
- usuário administrativo.

Isso reduz erro principalmente em listagens, filtros, formulários e telas administrativas.

## Interface: Tailwind CSS + shadcn/ui

### Papel no projeto

A camada visual precisa evoluir dos wireframes lo-fi para telas refinadas, mantendo controle sobre layout, hierarquia e responsividade.

Tailwind CSS será usado para estruturar a interface com controle direto de:

- grid;
- espaçamento;
- alinhamento;
- responsividade;
- estados visuais;
- composição de seções;
- adaptação desktop/mobile.

shadcn/ui será usado como base para componentes editáveis.

### Componentes necessários

| Componente | Uso |
|---|---|
| Button | CTAs, envio de formulário e ações administrativas. |
| Card | Home, segmentos, soluções, catálogo, notícias e agenda. |
| Input | Busca, login, contato e formulários administrativos. |
| Select | Filtros, ordenação e categorias. |
| Textarea | Mensagens e descrições administrativas. |
| Accordion | FAQ. |
| Tabs | Agenda, caso a divisão “Em breve / Histórico” seja mantida. |
| Dialog | Confirmações e ações administrativas. |
| Table | Listagens no painel administrativo. |
| Pagination | Catálogo, notícias e agenda. |
| Dropdown | Menu, filtros ou ações de admin. |
| Badge | Categorias, status e rótulos. |

### Motivo da escolha

O projeto precisa de componentes reaproveitáveis, mas também precisa preservar liberdade visual. A interface da Bamak não deve ficar presa a um tema fechado.

Tailwind e shadcn/ui permitem construir a identidade final a partir dos wireframes, mantendo a estrutura dos componentes sob controle da aplicação.

## Backend: NestJS + TypeScript

### Papel no projeto

O backend concentra regras, validações e operações de conteúdo.

Responsabilidades:

- autenticar administradores;
- proteger endpoints administrativos;
- validar dados recebidos;
- gerenciar conteúdos públicos;
- registrar mensagens de contato;
- controlar status de publicação;
- acionar serviço externo de e-mail;
- comunicar-se com o banco via Prisma.

### Por que NestJS

NestJS favorece divisão modular, útil para o domínio do portal.

Módulos previstos:

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

Essa organização torna explícito o que o sistema faz. O backend acompanha as áreas reais do portal, sem concentrar tudo em um único módulo genérico.

### Por que TypeScript no backend

TypeScript permite manter consistência entre DTOs, validações, serviços e modelos de dados.

Isso é relevante porque o sistema terá várias entidades administráveis e formulários com campos diferentes.

## Banco de dados: PostgreSQL

### Papel no projeto

O banco de dados armazena conteúdos administráveis e mensagens recebidas.

Entidades previstas:

| Entidade | Função |
|---|---|
| `User` | Administrador do painel. |
| `HomeSection` | Blocos, cards e CTAs da Home. |
| `InstitutionalContent` | Conteúdos da página institucional. |
| `Indicator` | Dados institucionais. |
| `TimelineItem` | Linha do tempo da empresa. |
| `Segment` | Segmentos atendidos. |
| `Solution` | Soluções oferecidas. |
| `Product` | Produtos do catálogo. |
| `ProductCategory` | Categorias de produto. |
| `FaqItem` | Perguntas e respostas. |
| `NewsPost` | Notícias. |
| `NewsCategory` | Categorias de notícias, se necessário. |
| `Event` | Eventos e feiras. |
| `ContactMessage` | Mensagens do formulário. |

### Motivo da escolha

PostgreSQL é adequado porque o portal trabalha com entidades relacionais.

Relações importantes:

```txt
Product → ProductCategory
Product ↔ Segment
Product ↔ Solution
NewsPost → NewsCategory opcional
ContactMessage → Product opcional
ContactMessage → Segment opcional
ContactMessage → Solution opcional
```

Essas relações ajudam a conectar catálogo, segmentos, soluções e contato.

## ORM: Prisma

### Papel no projeto

Prisma será usado para modelagem e acesso ao banco.

Responsabilidades:

- definir schema;
- criar migrations;
- gerar client tipado;
- facilitar consultas;
- reduzir divergência entre código e banco;
- apoiar evolução incremental no PAC 8.

### Motivo da escolha

O projeto terá várias entidades administráveis. Prisma ajuda a manter a modelagem rastreável e coerente com TypeScript.

Exemplo de estrutura esperada:

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

### Papel no projeto

JWT será usado para proteger o módulo administrativo.

Fluxos protegidos:

- acesso ao painel;
- criação de conteúdo;
- edição de conteúdo;
- publicação e ocultação;
- exclusão lógica;
- visualização de mensagens de contato.

A área pública permanece aberta. O visitante não terá login.

### Motivo da escolha

O portal precisa de autenticação administrativa simples e explícita. JWT atende o recorte inicial sem exigir uma estrutura complexa de sessão ou múltiplos perfis.

No PAC 8, a implementação pode começar com um perfil único de administrador.

## Ambiente: Docker

### Papel no projeto

Docker será usado para padronizar o ambiente de desenvolvimento na implementação.

Uso previsto:

- executar PostgreSQL localmente;
- reduzir diferença entre máquinas;
- facilitar setup;
- apoiar testes e validação;
- preparar base para futura publicação.

### Observação sobre o PAC VII

No estado atual, o repositório permanece documental, arquitetural e de prototipação.

Arquivos como estes só devem entrar quando a implementação iniciar no PAC 8:

```txt
src/
apps/
frontend/
backend/
prisma/
docker-compose.yml
package.json
.env.example
```

Incluí-los agora daria a impressão de implementação iniciada.

## Relação entre stack e wireframes

| Wireframe | Exigência técnica | Stack relacionada |
|---|---|---|
| Home | Seções, cards, CTAs, links e blocos administráveis. | Next.js, Tailwind, shadcn/ui, NestJS, PostgreSQL. |
| A Bamak | Indicadores, linha do tempo e conteúdo institucional. | Next.js, Prisma, PostgreSQL. |
| Segmentos | Cards e detalhes por slug. | Next.js, NestJS, PostgreSQL. |
| Soluções | Cards e detalhes por slug. | Next.js, NestJS, PostgreSQL. |
| Catálogo | Busca, filtros, ordenação, grade/lista, SKU, paginação e detalhe. | Next.js, Tailwind, shadcn/ui, NestJS, Prisma. |
| FAQ | Acordeões e ordenação de perguntas. | shadcn/ui, NestJS, PostgreSQL. |
| Contato | Formulário, validação, registro e envio por e-mail. | Next.js, NestJS, PostgreSQL, serviço de e-mail. |
| Notícias | Filtro, cards, categoria, data, paginação e detalhe. | Next.js, NestJS, PostgreSQL. |
| Agenda | Abas, filtro, data, localização, paginação e detalhe. | Next.js, shadcn/ui, NestJS, PostgreSQL. |

## O que a stack não pretende resolver

A stack não foi escolhida para implementar:

- e-commerce;
- carrinho;
- checkout;
- pagamento;
- cálculo de frete;
- CRM;
- ERP;
- área de cliente;
- orçamento automatizado;
- automação comercial;
- dashboard avançado de vendas.

Essas funções pertencem a outro recorte de sistema e não fazem parte da proposta do PAC VII.

## Consequências da escolha

### Ganhos

- stack coerente com Web Apps;
- frontend e backend em TypeScript;
- suporte a conteúdo administrável;
- boa compatibilidade com os wireframes;
- estrutura modular para PAC 8;
- banco relacional adequado ao domínio;
- componentes reutilizáveis para telas públicas e administrativas;
- ambiente local padronizável.

### Custos assumidos

- exige backend próprio;
- exige modelagem de banco;
- exige autenticação;
- exige organização de componentes;
- exige criação de endpoints por domínio;
- exige validações de formulário e conteúdo.

Esses custos são compatíveis com o objetivo do projeto, porque o portal precisa ser mantido pela empresa e não apenas publicado como site estático.

## Critérios de aceite técnico no PAC 8

A stack estará bem aplicada se a implementação demonstrar:

1. rotas públicas em Next.js;
2. layout responsivo desktop/mobile;
3. componentes reutilizáveis para cards, filtros, FAQ, formulários e paginação;
4. rotas administrativas protegidas;
5. API modular em NestJS;
6. entidades modeladas com Prisma;
7. persistência em PostgreSQL;
8. login administrativo com JWT;
9. formulário de contato registrando mensagem;
10. ambiente executável de forma padronizada.

## Artefatos relacionados

- `docs/05-arquitetura-tecnica/arquitetura-web-apps.md`
- `docs/05-arquitetura-tecnica/c1-contexto.png`
- `docs/05-arquitetura-tecnica/c2-containers.png`
- `docs/03-escopo/requisitos-consolidados.md`
- `docs/03-escopo/inventario-telas.md`
- `docs/04-arquitetura-informacao/fluxo-descoberta-contato.md`
- `docs/06-decisoes/0003-stack-web-apps.md`
- `docs/07-wireframes-lo-fi/README.md`
- `docs/08-planejamento-pac-8/backlog-inicial.md`
