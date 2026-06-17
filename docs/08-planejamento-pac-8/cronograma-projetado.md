# Cronograma projetado — PAC 8

## Finalidade

Este cronograma organiza a continuidade do Portal Web Institucional-Comercial da Bamak no PAC 8.

O PAC VII encerra com diagnóstico, escopo, arquitetura, decisões técnicas, wireflows, sitemaps e wireframes lo-fi das páginas públicas principais. O PAC 8 deve transformar essa base em interface refinada, implementação funcional e validação com a Bamak.

## Premissas

- O repositório atual ainda representa o PAC VII, com documentação e prototipação.
- A implementação começa apenas no PAC 8.
- A área pública é prioridade antes do painel administrativo completo.
- O catálogo continua consultivo, sem venda online.
- O módulo administrativo mantém conteúdo; não vira CRM, ERP ou e-commerce.
- Os wireframes atuais estão em PDF na pasta `docs/07-wireframes-lo-fi/`.
- Conteúdo real da Bamak precisa ser validado antes de virar tela final.

## Cronograma por período

| Período | Frente | Foco | Entregáveis esperados |
|---|---|---|---|
| Semanas 1–2 | Replanejamento | Revisar escopo, conteúdo real e prioridades com a Bamak. | Backlog revisado, escopo do semestre confirmado e lista de conteúdos pendentes. |
| Semanas 3–4 | Telas de detalhe públicas | Detalhar páginas internas de segmentos, soluções, produtos, notícias e eventos. | Wireframes ou protótipos das telas de detalhe. |
| Semanas 5–6 | Módulo administrativo | Desenhar e detalhar dashboard, login e telas de gestão de conteúdo. | Wireframes do admin e regras de campos por entidade. |
| Semanas 7–8 | Refinamento de interface | Evoluir lo-fi para interface refinada e componentes visuais. | Guia inicial de interface, componentes base e telas públicas refinadas. |
| Semanas 9–11 | Implementação da área pública | Criar aplicação web, rotas públicas, layout, listagens, formulário e páginas principais. | Versão funcional inicial da área pública. |
| Semanas 12–13 | Implementação administrativa | Implementar login, rotas protegidas e CRUDs centrais. | Versão funcional inicial do admin. |
| Semanas 14–15 | Validação e ajustes | Testar navegação, contato, catálogo, FAQ, notícias, agenda e admin com base no uso esperado. | Registro de validação, problemas encontrados e ajustes aplicados. |
| Semana 16 | Fechamento | Consolidar entrega, documentação, evidências e apresentação final. | Entrega final documentada do PAC 8. |

## Detalhamento por etapa

### Semanas 1–2 — Replanejamento

Atividades:

- revisar com a Bamak o escopo definido no PAC VII;
- confirmar quais páginas entram na primeira versão funcional;
- validar se haverá conteúdo real suficiente para catálogo, segmentos, soluções, notícias e agenda;
- definir se o SKU/código interno será usado no catálogo;
- revisar canais de contato corretos;
- atualizar backlog com base nos wireframes em PDF;
- definir prioridade entre páginas públicas e módulo administrativo.

Entregáveis:

- backlog revisado;
- lista de conteúdos necessários;
- escopo confirmado do PAC 8;
- riscos atualizados.

Critério de conclusão:

- escopo do semestre aprovado;
- dúvidas centrais de conteúdo registradas;
- tarefas priorizadas antes da implementação.

### Semanas 3–4 — Telas de detalhe públicas

Atividades:

- detalhar `/segmentos/[slug]`;
- detalhar `/solucoes/[slug]`;
- detalhar `/catalogo/[slug]`;
- detalhar `/noticias/[slug]`;
- detalhar `/agenda/[slug]`;
- definir quais campos aparecem em cada detalhe;
- revisar CTAs de contato por tipo de página;
- conectar detalhes ao fluxo público.

Entregáveis:

- wireframes ou protótipos das páginas de detalhe;
- atualização do inventário de telas;
- ajustes no backlog.

Critério de conclusão:

- cada listagem pública deve ter caminho claro para detalhe;
- cada detalhe deve ter saída para contato, FAQ ou navegação relacionada.

### Semanas 5–6 — Módulo administrativo

Atividades:

- detalhar login administrativo;
- desenhar dashboard inicial;
- definir listagens administrativas;
- definir formulários de cadastro e edição;
- definir estados de conteúdo: publicado, oculto e, se necessário, rascunho;
- definir campos por entidade;
- priorizar CRUDs essenciais.

Áreas administrativas previstas:

- Home;
- conteúdos institucionais;
- indicadores;
- linha do tempo;
- segmentos;
- soluções;
- catálogo;
- FAQ;
- notícias;
- agenda;
- mensagens de contato.

Entregáveis:

- wireframes do admin;
- mapa de entidades administráveis;
- regras de campos;
- critérios de publicação.

Critério de conclusão:

- o painel deve permitir entender quem atualiza o quê;
- o painel deve manter conteúdo estruturado, sem edição livre de layout.

### Semanas 7–8 — Refinamento de interface

Atividades:

- definir direção visual da Bamak;
- criar componentes base;
- refinar hierarquia visual das páginas públicas;
- refinar responsividade desktop/mobile;
- padronizar cards, botões, filtros, paginação, acordeões e formulários;
- revisar se a interface continua coerente com o fluxo de descoberta até contato.

Entregáveis:

- guia inicial de interface;
- componentes visuais principais;
- telas públicas refinadas;
- ajustes nos wireframes/protótipos do admin, se necessário.

Critério de conclusão:

- as telas devem sair do nível estrutural e passar a comunicar melhor a marca;
- os componentes devem estar prontos para implementação.

### Semanas 9–11 — Implementação da área pública

Atividades:

- criar base da aplicação frontend;
- configurar rotas públicas;
- implementar header, footer e breadcrumb;
- implementar Home, A Bamak, Segmentos, Soluções, Catálogo, FAQ, Contato, Notícias e Agenda;
- implementar páginas de detalhe priorizadas;
- implementar busca/filtros do catálogo em versão inicial;
- implementar FAQ em acordeão;
- implementar formulário de contato;
- preparar integração com API.

Entregáveis:

- versão funcional inicial da área pública;
- páginas públicas navegáveis;
- formulário de contato conectado à API ou preparado para integração;
- catálogo consultivo navegável.

Critério de conclusão:

- visitante consegue navegar pelo fluxo público;
- catálogo não assume comportamento de loja;
- contato funciona em versão inicial ou está tecnicamente preparado para envio.

### Semanas 12–13 — Implementação administrativa

Atividades:

- implementar backend modular;
- configurar banco de dados;
- criar autenticação administrativa;
- implementar rotas protegidas;
- implementar CRUDs prioritários;
- implementar registro de mensagens de contato;
- conectar admin com conteúdos exibidos publicamente.

CRUDs prioritários:

1. produtos do catálogo;
2. FAQ;
3. notícias;
4. agenda;
5. mensagens de contato;
6. segmentos e soluções, se houver tempo;
7. conteúdos institucionais, indicadores e linha do tempo, se houver tempo.

Entregáveis:

- login administrativo;
- painel inicial;
- CRUDs centrais;
- persistência em banco;
- integração entre admin e área pública.

Critério de conclusão:

- administrador consegue alterar conteúdo sem editar código;
- área pública reflete pelo menos parte dos dados administrados.

### Semanas 14–15 — Validação e ajustes

Atividades:

- validar navegação pública com base no fluxo principal;
- testar formulário de contato;
- testar manutenção de conteúdo pelo admin;
- revisar responsividade;
- validar entendimento da Bamak sobre catálogo, FAQ e contato;
- registrar problemas encontrados;
- aplicar ajustes prioritários.

Entregáveis:

- plano de validação executado;
- evidências de teste;
- lista de ajustes;
- correções aplicadas;
- pendências documentadas.

Critério de conclusão:

- os fluxos centrais devem funcionar;
- problemas críticos de navegação, contato e admin devem ser tratados;
- pendências não resolvidas devem estar registradas.

### Semana 16 — Fechamento

Atividades:

- revisar documentação final;
- atualizar README;
- consolidar evidências;
- exportar materiais finais;
- preparar apresentação;
- registrar limitações da entrega;
- registrar próximos passos.

Entregáveis:

- versão final documentada;
- evidências de validação;
- apresentação final;
- relatório/artigo final do PAC 8, se exigido;
- repositório organizado.

Critério de conclusão:

- entrega final deve mostrar continuidade clara entre PAC VII e PAC 8;
- documentação, protótipo/implementação e validação devem contar a mesma história.

## Dependências de conteúdo

Antes da implementação final, será necessário levantar ou validar:

| Conteúdo | Dependência |
|---|---|
| Textos institucionais | Confirmação com a Bamak. |
| Segmentos atendidos | Lista real e descrições curtas. |
| Soluções | Nomes, descrições e relação com produtos. |
| Catálogo | Produtos, categorias, imagens, códigos/SKU e descrições. |
| FAQ | Dúvidas reais sobre orçamento, pedidos e contato. |
| Contato | E-mail, telefone, WhatsApp, endereço e canais corretos. |
| Notícias | Publicações existentes ou decisão de conteúdo inicial. |
| Agenda | Feiras, eventos e histórico relevante. |

## Riscos do PAC 8

| Risco | Impacto | Mitigação |
|---|---|---|
| Falta de conteúdo real | Telas bonitas, mas genéricas. | Levantar conteúdo logo nas semanas 1–2. |
| Catálogo crescer demais | Atraso na implementação. | Começar com campos mínimos e poucos filtros. |
| Admin ficar amplo demais | Desvio para CMS/CRM complexo. | Priorizar CRUDs centrais e conteúdo estruturado. |
| Validação ficar só no fim | Ajustes tardios e caros. | Validar em pequenos blocos ao longo do semestre. |
| Interface perder o recorte B2B | Aparência de loja virtual. | Manter CTAs de contato e evitar padrões de compra. |
| Implementação iniciar sem modelo de dados | Retrabalho no backend. | Definir entidades antes dos CRUDs. |

## Marco de sucesso do PAC 8

O PAC 8 será considerado bem encaminhado se entregar:

- área pública navegável;
- catálogo consultivo funcional;
- FAQ funcional;
- formulário de contato registrando ou enviando mensagem;
- painel administrativo protegido;
- pelo menos os conteúdos centrais administráveis;
- validação registrada com base no uso esperado pela Bamak;
- documentação final coerente com escopo, arquitetura e decisões do PAC VII.
