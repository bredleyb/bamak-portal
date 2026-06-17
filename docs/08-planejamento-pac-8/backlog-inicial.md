# Backlog inicial — PAC 8

## Finalidade

Este backlog organiza as tarefas iniciais para continuidade do Portal Web Institucional-Comercial da Bamak no PAC 8.

A lista parte dos artefatos consolidados no PAC VII: escopo, inventário de telas, arquitetura Web Apps, decisões técnicas e wireframes lo-fi em PDF.

## Prioridades

| Prioridade | Sentido no projeto |
|---|---|
| P0 | Necessário para a entrega mínima funcional. |
| P1 | Importante para coerência do portal. |
| P2 | Pode entrar se houver tempo depois do núcleo funcional. |

## Épico 1 — Replanejamento e conteúdo real

### PAC8-BK-001 — Revisar escopo com a Bamak

**Prioridade:** P0  
**Tipo:** Planejamento

Descrição:

Confirmar com a Bamak quais partes do portal entram na primeira versão funcional do PAC 8.

Critérios de aceite:

- páginas públicas priorizadas;
- admin priorizado;
- conteúdo pendente registrado;
- itens fora do escopo reafirmados.

### PAC8-BK-002 — Levantar conteúdo real das páginas públicas

**Prioridade:** P0  
**Tipo:** Conteúdo

Descrição:

Coletar ou validar textos, imagens e dados necessários para substituir placeholders dos wireframes.

Conteúdos mínimos:

- apresentação institucional;
- segmentos;
- soluções;
- produtos;
- FAQ;
- canais de contato;
- notícias;
- eventos ou histórico de agenda.

Critérios de aceite:

- lista de conteúdo recebida ou marcada como pendente;
- placeholders críticos identificados;
- conteúdo mínimo definido para implementação inicial.

### PAC8-BK-003 — Confirmar estrutura do catálogo

**Prioridade:** P0  
**Tipo:** Produto / Conteúdo

Descrição:

Validar com a Bamak como os produtos devem ser organizados.

Pontos a confirmar:

- categorias;
- nomes dos produtos;
- uso de SKU/código interno;
- imagens disponíveis;
- descrição curta;
- aplicação;
- relação com segmentos e soluções;
- filtros necessários.

Critérios de aceite:

- campos mínimos do produto definidos;
- filtros iniciais definidos;
- decisão sobre SKU registrada.

## Épico 2 — Detalhamento das páginas públicas

### PAC8-BK-004 — Detalhar página de segmento

**Prioridade:** P1  
**Tipo:** UX / UI

Descrição:

Criar estrutura de detalhe para `/segmentos/[slug]`.

Critérios de aceite:

- título, descrição e imagem definidos no wireframe;
- relação com soluções e produtos prevista;
- CTA para contato presente;
- retorno para listagem previsto.

### PAC8-BK-005 — Detalhar página de solução

**Prioridade:** P1  
**Tipo:** UX / UI

Descrição:

Criar estrutura de detalhe para `/solucoes/[slug]`.

Critérios de aceite:

- explicação da solução prevista;
- relação com segmentos e produtos prevista;
- CTA para contato presente;
- estrutura reutilizável para diferentes soluções.

### PAC8-BK-006 — Detalhar página de produto

**Prioridade:** P0  
**Tipo:** UX / UI

Descrição:

Criar estrutura de detalhe para `/catalogo/[slug]`.

Critérios de aceite:

- imagem, nome, categoria e SKU opcional previstos;
- descrição e aplicação previstas;
- relação com segmentos/soluções prevista;
- CTA de contato presente;
- ausência de compra, carrinho ou checkout.

### PAC8-BK-007 — Detalhar página de notícia

**Prioridade:** P1  
**Tipo:** UX / UI

Descrição:

Criar estrutura de detalhe para `/noticias/[slug]`.

Critérios de aceite:

- título, categoria, data, imagem e conteúdo previstos;
- navegação para outras notícias prevista;
- retorno para listagem previsto.

### PAC8-BK-008 — Detalhar página de evento

**Prioridade:** P1  
**Tipo:** UX / UI

Descrição:

Criar estrutura de detalhe para `/agenda/[slug]`.

Critérios de aceite:

- título, data, localização, categoria e descrição previstos;
- distinção entre evento futuro e histórico considerada;
- CTA ou orientação de contato prevista, se aplicável.

## Épico 3 — Interface e componentes

### PAC8-BK-009 — Definir guia visual inicial

**Prioridade:** P0  
**Tipo:** UI

Descrição:

Definir base visual da interface a partir da Bamak e dos wireframes lo-fi.

Critérios de aceite:

- paleta inicial definida;
- tipografia definida;
- estilo de botões definido;
- estilo de cards definido;
- padrão de seções definido;
- regras básicas de responsividade definidas.

### PAC8-BK-010 — Criar componentes públicos principais

**Prioridade:** P0  
**Tipo:** Frontend

Descrição:

Implementar componentes reutilizáveis para a área pública.

Componentes:

- header desktop;
- header mobile;
- footer;
- breadcrumb;
- hero interno;
- card de destaque;
- card de produto;
- card de notícia;
- card de evento;
- CTA final;
- paginação;
- filtro;
- campo de busca;
- acordeão de FAQ.

Critérios de aceite:

- componentes usados em mais de uma página;
- comportamento responsivo validado;
- variações mínimas documentadas no código.

### PAC8-BK-011 — Refinar telas públicas principais

**Prioridade:** P0  
**Tipo:** UI

Descrição:

Evoluir os PDFs lo-fi para telas refinadas das páginas públicas principais.

Telas:

- Home;
- A Bamak;
- Segmentos;
- Soluções;
- Catálogo;
- FAQ;
- Contato;
- Notícias;
- Agenda.

Critérios de aceite:

- telas refinadas mantêm a função dos wireframes;
- CTAs de contato continuam claros;
- catálogo continua consultivo;
- visual não sugere e-commerce.

## Épico 4 — Frontend público

### PAC8-BK-012 — Criar base da aplicação frontend

**Prioridade:** P0  
**Tipo:** Frontend

Descrição:

Configurar a aplicação web e estrutura inicial de rotas.

Critérios de aceite:

- projeto frontend criado;
- TypeScript configurado;
- Tailwind configurado;
- estrutura de rotas criada;
- layout base com header e footer.

### PAC8-BK-013 — Implementar Home

**Prioridade:** P0  
**Tipo:** Frontend

Descrição:

Implementar página inicial com chamadas para as áreas principais do portal.

Critérios de aceite:

- seções principais renderizadas;
- links para páginas internas funcionando;
- CTAs de contato presentes;
- versão mobile funcional.

### PAC8-BK-014 — Implementar A Bamak

**Prioridade:** P1  
**Tipo:** Frontend

Descrição:

Implementar página institucional.

Critérios de aceite:

- blocos institucionais renderizados;
- indicadores exibidos;
- linha do tempo exibida;
- CTA presente.

### PAC8-BK-015 — Implementar Segmentos e Soluções

**Prioridade:** P0  
**Tipo:** Frontend

Descrição:

Implementar listagens de segmentos e soluções.

Critérios de aceite:

- cards renderizados;
- links de detalhe preparados;
- conteúdo carregado de mock, API ou fonte temporária;
- CTA de contato presente.

### PAC8-BK-016 — Implementar Catálogo consultivo

**Prioridade:** P0  
**Tipo:** Frontend

Descrição:

Implementar página de catálogo conforme recorte consultivo.

Critérios de aceite:

- busca disponível;
- filtros iniciais disponíveis;
- ordenação ou estrutura preparada;
- cards exibem imagem, categoria, nome e SKU opcional;
- “Ver detalhes” disponível;
- paginação ou expansão disponível;
- nenhum fluxo de compra aparece.

### PAC8-BK-017 — Implementar FAQ

**Prioridade:** P0  
**Tipo:** Frontend

Descrição:

Implementar página de perguntas frequentes.

Critérios de aceite:

- perguntas exibidas em acordeão;
- ordem controlada;
- CTA de contato presente;
- comportamento mobile validado.

### PAC8-BK-018 — Implementar Contato

**Prioridade:** P0  
**Tipo:** Frontend

Descrição:

Implementar página de contato com formulário e dados comerciais.

Critérios de aceite:

- campos mínimos renderizados;
- validação básica no cliente;
- envio para API preparado ou funcional;
- confirmação exibida após envio;
- canais de contato visíveis.

### PAC8-BK-019 — Implementar Notícias e Agenda

**Prioridade:** P1  
**Tipo:** Frontend

Descrição:

Implementar listagens de notícias e eventos.

Critérios de aceite:

- cards com data/categoria renderizados;
- filtro ou estrutura de filtro disponível;
- paginação ou expansão disponível;
- links de detalhe preparados.

## Épico 5 — Backend, banco e autenticação

### PAC8-BK-020 — Criar base do backend

**Prioridade:** P0  
**Tipo:** Backend

Descrição:

Configurar API backend modular.

Critérios de aceite:

- projeto backend criado;
- TypeScript configurado;
- módulos iniciais criados;
- endpoint de saúde ou teste disponível.

### PAC8-BK-021 — Configurar PostgreSQL e Prisma

**Prioridade:** P0  
**Tipo:** Backend / Banco

Descrição:

Configurar banco e ORM.

Critérios de aceite:

- PostgreSQL configurado;
- Prisma configurado;
- primeira migration executada;
- conexão testada.

### PAC8-BK-022 — Modelar entidades centrais

**Prioridade:** P0  
**Tipo:** Banco

Descrição:

Criar modelos iniciais para conteúdos administráveis.

Entidades prioritárias:

- User;
- Product;
- ProductCategory;
- FaqItem;
- NewsPost;
- Event;
- ContactMessage;
- Segment;
- Solution.

Critérios de aceite:

- modelos criados;
- relações principais definidas;
- migrations geradas;
- seed inicial, se necessário.

### PAC8-BK-023 — Implementar autenticação administrativa

**Prioridade:** P0  
**Tipo:** Backend / Segurança

Descrição:

Implementar login administrativo com JWT.

Critérios de aceite:

- login funcional;
- token gerado;
- rotas protegidas validam token;
- credenciais não ficam expostas no frontend.

### PAC8-BK-024 — Implementar API de contato

**Prioridade:** P0  
**Tipo:** Backend

Descrição:

Receber mensagens do formulário de contato.

Critérios de aceite:

- endpoint de contato criado;
- validação de campos;
- mensagem gravada no banco;
- preparação para envio por e-mail;
- resposta clara ao frontend.

### PAC8-BK-025 — Implementar APIs de conteúdo prioritário

**Prioridade:** P0  
**Tipo:** Backend

Descrição:

Criar endpoints para conteúdos centrais.

Prioridade:

1. catálogo;
2. FAQ;
3. notícias;
4. agenda;
5. segmentos;
6. soluções.

Critérios de aceite:

- listagem pública disponível;
- detalhe por slug disponível quando aplicável;
- endpoints administrativos protegidos.

## Épico 6 — Módulo administrativo

### PAC8-BK-026 — Desenhar telas do admin

**Prioridade:** P0  
**Tipo:** UX / UI

Descrição:

Detalhar visualmente login, dashboard e listagens administrativas.

Critérios de aceite:

- login desenhado;
- dashboard desenhado;
- listagens desenhadas;
- formulário de criação/edição desenhado;
- estados vazio, erro e carregamento considerados.

### PAC8-BK-027 — Implementar login e layout admin

**Prioridade:** P0  
**Tipo:** Frontend

Descrição:

Criar estrutura inicial do módulo administrativo.

Critérios de aceite:

- rota de login;
- layout admin;
- proteção de rota;
- navegação interna;
- logout.

### PAC8-BK-028 — Implementar admin do catálogo

**Prioridade:** P0  
**Tipo:** Full stack

Descrição:

Permitir manutenção dos produtos do catálogo.

Critérios de aceite:

- listar produtos;
- criar produto;
- editar produto;
- ocultar/publicar produto;
- informar categoria;
- informar SKU opcional;
- alterar imagem ou URL de imagem, conforme implementação.

### PAC8-BK-029 — Implementar admin de FAQ

**Prioridade:** P0  
**Tipo:** Full stack

Descrição:

Permitir manutenção das perguntas frequentes.

Critérios de aceite:

- listar perguntas;
- criar pergunta;
- editar resposta;
- ordenar ou definir prioridade;
- publicar/ocultar item.

### PAC8-BK-030 — Implementar admin de notícias e agenda

**Prioridade:** P1  
**Tipo:** Full stack

Descrição:

Permitir manutenção de notícias e eventos.

Critérios de aceite:

- listar itens;
- criar item;
- editar conteúdo;
- definir data/categoria;
- publicar/ocultar;
- refletir na área pública.

### PAC8-BK-031 — Implementar visualização de mensagens

**Prioridade:** P0  
**Tipo:** Full stack

Descrição:

Permitir que o administrador veja mensagens enviadas pelo formulário.

Critérios de aceite:

- listar mensagens;
- abrir detalhe da mensagem;
- exibir data, nome, empresa, contato, assunto e mensagem;
- marcar como lida, se houver tempo.

## Épico 7 — Validação e ajustes

### PAC8-BK-032 — Validar fluxo público

**Prioridade:** P0  
**Tipo:** Validação

Descrição:

Testar o fluxo Descoberta → Entendimento → Segmentos/Soluções → Catálogo → FAQ → Contato.

Critérios de aceite:

- rota principal testada;
- dúvidas ou bloqueios registrados;
- ajustes críticos priorizados.

### PAC8-BK-033 — Validar catálogo consultivo

**Prioridade:** P0  
**Tipo:** Validação

Descrição:

Verificar se o catálogo está sendo entendido como consulta, não como loja.

Critérios de aceite:

- usuários entendem que não há compra online;
- busca/filtros ajudam a localizar produtos;
- CTA de contato está claro.

### PAC8-BK-034 — Validar formulário de contato

**Prioridade:** P0  
**Tipo:** Validação

Descrição:

Testar envio de mensagens.

Critérios de aceite:

- validação de campos funciona;
- mensagem é registrada;
- confirmação aparece;
- erro é tratado.

### PAC8-BK-035 — Validar admin

**Prioridade:** P0  
**Tipo:** Validação

Descrição:

Testar manutenção de conteúdo pelo painel.

Critérios de aceite:

- administrador acessa por login;
- cria ou edita conteúdo;
- conteúdo aparece na área pública;
- rotas protegidas não abrem sem autenticação.

### PAC8-BK-036 — Consolidar evidências finais

**Prioridade:** P0  
**Tipo:** Documentação

Descrição:

Registrar evidências de implementação, teste e validação.

Critérios de aceite:

- prints ou registros salvos;
- problemas encontrados documentados;
- ajustes aplicados descritos;
- pendências registradas.

## Entrega mínima recomendada

Se o tempo ficar curto, priorizar:

1. área pública navegável;
2. catálogo consultivo;
3. FAQ;
4. contato;
5. login administrativo;
6. admin de catálogo;
7. admin de FAQ;
8. mensagens de contato;
9. validação registrada.

Notícias, agenda, segmentos e soluções podem começar com conteúdo mais simples, desde que o fluxo principal não seja quebrado.

## Itens que continuam fora do backlog

- e-commerce;
- carrinho;
- checkout;
- pagamento online;
- cálculo de frete;
- orçamento automatizado;
- CRM;
- ERP;
- área de cliente;
- automação comercial;
- indicadores comerciais avançados.
