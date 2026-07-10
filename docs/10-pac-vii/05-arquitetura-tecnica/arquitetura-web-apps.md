# Arquitetura Web Apps

## Finalidade

Este documento registra a arquitetura técnica prevista para o Portal Web Institucional-Comercial da Bamak.

A proposta parte do recorte definido no PAC VII: área pública institucional-comercial, módulo administrativo autenticado, catálogo consultivo, FAQ, contato, notícias, agenda e conteúdos administráveis. A arquitetura não cobre e-commerce, CRM, ERP, área de cliente, checkout, pagamento ou orçamento automatizado.

## Visão geral

A solução segue uma arquitetura Web Apps com separação entre interface, API, persistência e serviço externo de e-mail.

```txt
Visitante / parceiro comercial
        ↓
Aplicação Web Frontend
        ↓
API Backend
        ↓
Banco de Dados

API Backend
        ↓
Serviço externo de e-mail
```

A aplicação web concentra a experiência pública e o acesso ao painel administrativo. A API concentra autenticação, validações, regras de publicação e operações de conteúdo. O banco armazena dados administráveis. O serviço de e-mail é usado apenas para encaminhar mensagens recebidas pelo formulário.

## Perfis envolvidos

| Perfil | Acesso | Necessidade atendida |
|---|---|---|
| Visitante / parceiro comercial | Área pública | Entender a Bamak, consultar segmentos, soluções, catálogo, FAQ, notícias, agenda e iniciar contato. |
| Administrador da Bamak | Módulo administrativo | Manter conteúdos publicados e consultar mensagens recebidas. |

O visitante não precisa de conta. O login existe apenas para o administrador responsável pela manutenção do portal.

## Containers da solução

### Aplicação Web Frontend

Responsável por:

- renderizar páginas públicas;
- organizar navegação desktop e mobile;
- exibir trilha de navegação nas páginas internas;
- apresentar cards, CTAs, indicadores, linha do tempo e listagens;
- executar busca, filtros, ordenação e paginação na interface;
- exibir FAQ em formato de acordeão;
- validar formulários no lado do cliente;
- consumir a API backend;
- fornecer rotas protegidas para o módulo administrativo.

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

A separação por rotas mantém a área pública e o painel administrativo na mesma base técnica, mas com responsabilidades diferentes.

### API Backend

Responsável por:

- autenticar administradores;
- proteger rotas administrativas;
- validar dados recebidos do frontend;
- aplicar regras de publicação;
- gerenciar conteúdos estruturados;
- persistir dados no banco;
- registrar mensagens de contato;
- acionar serviço externo de e-mail.

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

Essa divisão acompanha as áreas reais do portal e evita que a API vire um conjunto genérico de endpoints sem relação com o domínio do projeto.

### Banco de Dados

Responsável por armazenar os conteúdos administráveis e os registros enviados pelo formulário.

Entidades previstas:

| Entidade | Uso |
|---|---|
| `User` | Administrador com acesso ao painel. |
| `HomeSection` | Blocos, cards, links e CTAs da Home. |
| `InstitutionalContent` | Textos estruturados da página “A Bamak” e blocos institucionais. |
| `Indicator` | Indicadores exibidos na página institucional. |
| `TimelineItem` | Marcos históricos da Bamak. |
| `Segment` | Segmentos atendidos pela empresa. |
| `Solution` | Frentes de solução apresentadas no portal. |
| `Product` | Produtos do catálogo consultivo. |
| `ProductCategory` | Agrupamento dos produtos. |
| `FaqItem` | Perguntas e respostas comerciais. |
| `NewsPost` | Notícias institucionais. |
| `NewsCategory` | Categorias de notícias, se forem mantidas. |
| `Event` | Agenda de eventos e feiras. |
| `ContactMessage` | Mensagens enviadas pelo formulário de contato. |

Relacionamentos prováveis:

```txt
Product → ProductCategory
Product ↔ Segment
Product ↔ Solution
NewsPost → NewsCategory opcional
ContactMessage → Product opcional
ContactMessage → Segment opcional
ContactMessage → Solution opcional
```

Os vínculos com produto, segmento ou solução devem ser opcionais. O visitante pode entrar em contato a partir de qualquer área pública.

### Serviço externo de e-mail

Responsável por encaminhar mensagens do formulário para um canal definido pela Bamak.

O portal não precisa implementar caixa de entrada própria, atendimento interno ou automação comercial. O registro da mensagem fica no banco; o envio por e-mail serve como aviso operacional para a empresa.

## Responsabilidades por página pública

### Home

A Home deve funcionar como síntese do portal e ponto de distribuição para as demais áreas.

Exigências técnicas:

- componentes de seção reutilizáveis;
- cards de destaque;
- links para segmentos, soluções, catálogo, FAQ, notícias e agenda;
- CTAs para contato;
- blocos alimentáveis pelo admin, quando fizer sentido;
- versão desktop e mobile.

### A Bamak

A página institucional deve apresentar a empresa com blocos de conteúdo, indicadores e linha do tempo.

Exigências técnicas:

- conteúdo institucional estruturado;
- indicadores administráveis;
- linha do tempo com marcos ordenados;
- imagens institucionais;
- CTA para contato ou consulta comercial.

### Segmentos

A página de segmentos deve listar contextos atendidos pela Bamak e permitir avanço para detalhes.

Exigências técnicas:

- listagem por cards;
- imagem, título, descrição curta e link de detalhe;
- rota dinâmica por slug;
- relação futura com soluções e produtos.

### Soluções

A página de soluções deve organizar frentes de atuação da empresa.

Exigências técnicas:

- listagem por cards;
- imagem, título, descrição curta e link de detalhe;
- rota dinâmica por slug;
- relação futura com segmentos e produtos.

### Catálogo

O catálogo é consultivo.

Exigências técnicas:

- busca textual;
- filtros superiores;
- painel lateral de filtros no desktop;
- ordenação;
- contagem de resultados;
- alternância grade/lista, se mantida na implementação;
- cards com imagem, categoria, título e SKU opcional;
- link “Ver detalhes”;
- paginação ou expansão de resultados;
- CTA final para contato;
- rota de detalhe por slug.

O catálogo não executa compra, pedido, pagamento ou orçamento automático.

### FAQ

A FAQ deve orientar dúvidas antes do contato.

Exigências técnicas:

- lista de perguntas em acordeão;
- ordenação controlada;
- possibilidade de agrupar por tema, se necessário;
- botão de expansão;
- CTA para contato caso a dúvida permaneça.

### Contato

A página de contato centraliza formulário e canais comerciais.

Exigências técnicas:

- formulário validado;
- campos de identificação e mensagem;
- confirmação de aceite, se aplicável;
- envio para a API;
- registro da mensagem no banco;
- acionamento do serviço de e-mail;
- exibição de dados auxiliares de contato;
- bloco visual ou mapa, se for mantido no refinamento.

Campos prováveis:

| Campo | Finalidade |
|---|---|
| Nome | Identificar o remetente. |
| Empresa | Contextualizar o contato B2B. |
| E-mail | Permitir retorno. |
| Telefone/WhatsApp | Apoiar contato direto. |
| Assunto | Classificar a demanda. |
| Produto de interesse | Registrar contexto, quando houver. |
| Mensagem | Receber a solicitação. |

### Notícias

A página de notícias deve organizar publicações institucionais.

Exigências técnicas:

- cards com imagem, categoria e data;
- filtro;
- paginação ou expansão;
- rota de detalhe por slug;
- status de publicação no admin.

### Agenda

A página de agenda deve apresentar eventos, feiras e acontecimentos relevantes.

Exigências técnicas:

- separação entre eventos futuros e histórico, se mantida;
- filtro;
- data em destaque;
- localização;
- cards com link de detalhe;
- paginação ou expansão;
- status de publicação no admin.

## Responsabilidades do módulo administrativo

O módulo administrativo deve manter conteúdos estruturados, não layout livre.

Áreas previstas:

| Área administrativa | Conteúdo mantido |
|---|---|
| Home | Blocos, cards, links e CTAs. |
| Conteúdos institucionais | Textos controlados da empresa. |
| Indicadores | Dados institucionais exibidos publicamente. |
| Linha do tempo | Marcos históricos. |
| Segmentos | Listagens e detalhes dos segmentos. |
| Soluções | Listagens e detalhes das soluções. |
| Catálogo | Produtos, categorias, descrições, imagens e SKU opcional. |
| FAQ | Perguntas, respostas, ordem e status. |
| Notícias | Publicações, categorias, datas, imagens e status. |
| Agenda | Eventos, datas, localização, imagens e status. |
| Mensagens | Registros recebidos pelo formulário. |

O administrador altera campos. A aplicação controla estrutura visual, componentes e responsividade.

## Regras de autenticação e acesso

Regras mínimas:

- área pública aberta;
- painel administrativo protegido por login;
- operações de criação, edição, publicação e ocultação restritas ao administrador;
- mensagens de contato visíveis apenas no admin;
- rotas administrativas fora da navegação pública;
- frontend validando sessão antes de exibir telas protegidas;
- backend validando token antes de executar operações administrativas.

A autenticação prevista é JWT. O token deve ser tratado como credencial administrativa e validado pela API em rotas protegidas.

## Fluxo de contato

```txt
Visitante preenche formulário
→ Frontend valida campos
→ Frontend envia dados para API
→ API valida dados
→ API grava ContactMessage no banco
→ API aciona serviço externo de e-mail
→ Frontend exibe confirmação
```

O formulário não gera orçamento automático. Ele registra e encaminha a demanda para atendimento humano.

## Fluxo de manutenção de conteúdo

```txt
Administrador acessa /admin/login
→ API valida credenciais
→ Frontend libera área administrativa
→ Administrador cria ou edita conteúdo
→ API valida dados
→ Banco grava alteração
→ Área pública passa a exibir conteúdo atualizado
```

Esse fluxo vale para catálogo, FAQ, notícias, agenda, segmentos, soluções e conteúdos institucionais.

## Regras de publicação

Conteúdos administráveis devem ter controle de visibilidade.

Estados possíveis:

| Estado | Uso |
|---|---|
| Rascunho | Conteúdo em preparo, sem exibição pública. |
| Publicado | Conteúdo visível na área pública. |
| Oculto | Conteúdo mantido no banco, sem exibição pública. |

A implementação pode começar com `publicado` e `oculto`. O estado `rascunho` só deve entrar se houver necessidade real no painel.

## Decisões de fronteira

A arquitetura não inclui:

- gateway de pagamento;
- checkout;
- carrinho;
- cálculo de frete;
- área de cliente;
- CRM;
- ERP;
- pipeline comercial;
- automação de marketing;
- orçamento automático;
- estoque em tempo real.

Essas exclusões preservam o objetivo do portal: organizar informação, apoiar consulta e qualificar o contato comercial.

## Consequências técnicas

### Ganhos

- separação clara entre interface, API e dados;
- arquitetura compatível com o escopo Web Apps;
- suporte a conteúdo administrável;
- aderência aos wireframes públicos;
- base viável para implementação no PAC 8;
- menor risco de expansão indevida para e-commerce ou CRM.

### Custos assumidos

- exige backend próprio;
- exige modelagem de dados;
- exige autenticação administrativa;
- exige tratamento de formulários e validações;
- exige componentização consistente no frontend;
- exige integração mínima com serviço de e-mail.

Esses custos são coerentes com o portal proposto, porque a solução precisa ser atualizável e administrável.

## Critérios de aceite técnico no PAC 8

A arquitetura estará cumprida se a implementação inicial demonstrar:

1. área pública navegável;
2. layout responsivo;
3. catálogo consultivo com busca, filtros ou listagem refinável;
4. FAQ em acordeão;
5. formulário de contato registrando mensagem;
6. painel administrativo protegido;
7. CRUD inicial de conteúdos centrais;
8. API backend separada das telas;
9. persistência em banco relacional;
10. envio ou preparação de envio por serviço externo de e-mail.

## Artefatos relacionados

- `docs/03-escopo/escopo-pac-vii.md`
- `docs/03-escopo/fora-escopo.md`
- `docs/03-escopo/requisitos-consolidados.md`
- `docs/03-escopo/inventario-telas.md`
- `docs/04-arquitetura-informacao/fluxo-descoberta-contato.md`
- `docs/04-arquitetura-informacao/sitemap-publico.png`
- `docs/04-arquitetura-informacao/sitemap-administrativo.png`
- `docs/04-arquitetura-informacao/wireflow-publico.png`
- `docs/04-arquitetura-informacao/wireflow-administrativo.png`
- `docs/05-arquitetura-tecnica/stack-tecnologica.md`
- `docs/05-arquitetura-tecnica/c1-contexto.png`
- `docs/05-arquitetura-tecnica/c2-containers.png`
- `docs/06-decisoes/0001-catalogo-consultivo.md`
- `docs/06-decisoes/0002-modulo-administrativo-editorial.md`
- `docs/06-decisoes/0004-recorte-sem-funcionalidades-transacionais.md`
