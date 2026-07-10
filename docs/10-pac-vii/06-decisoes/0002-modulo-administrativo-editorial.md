# 0002 — Módulo administrativo editorial

## Status

Aceita.

## Decisão

O módulo administrativo do portal da Bamak será uma área autenticada para manutenção editorial e comercial dos conteúdos publicados no site.

A função do painel é permitir atualização controlada de conteúdos estruturados: notícias, agenda, FAQ, catálogo, segmentos, soluções, blocos institucionais, cards de destaque, CTAs e mensagens recebidas pelo formulário.

O painel não será editor livre de layout, CRM, ERP ou sistema de operação comercial.

## Contexto do projeto

O PAC VII consolidou a proposta de um portal público com páginas de função clara e um módulo administrativo para manter os conteúdos atualizáveis.

Os wireframes de baixa fidelidade detalharam a área pública com uma estrutura mais ampla do que páginas estáticas simples. A Home apresenta várias seções com cards, links, CTAs, notícias, agenda, FAQ e blocos de contato. A página “A Bamak” prevê indicadores, linha do tempo e blocos institucionais. Segmentos e Soluções usam cards com imagem, rótulo e acesso a detalhes. Catálogo, Notícias e Agenda possuem listagens, filtros, paginação e itens detalháveis. FAQ usa acordeões. Contato possui formulário, dados de contato e blocos auxiliares.

Esses elementos exigem um painel capaz de manter conteúdos estruturados, preservando o layout definido pela aplicação.

## Escopo do módulo administrativo

Áreas previstas:

| Área | Finalidade |
|---|---|
| Login administrativo | Restringir acesso ao painel. |
| Painel inicial | Dar acesso rápido às áreas de manutenção. |
| Home | Manter blocos de destaque, chamadas, cards e CTAs da página inicial. |
| Conteúdos institucionais | Editar textos controlados da página “A Bamak”. |
| Indicadores | Manter números ou dados institucionais exibidos na página “A Bamak”. |
| Linha do tempo | Gerenciar marcos históricos da empresa. |
| Segmentos | Manter listagem, descrições, imagens e detalhes dos segmentos atendidos. |
| Soluções | Manter listagem, descrições, imagens e detalhes das soluções. |
| Catálogo | Gerenciar produtos exibidos na área pública. |
| FAQ | Atualizar perguntas e respostas comerciais recorrentes. |
| Notícias | Cadastrar, editar, publicar e ocultar notícias. |
| Agenda | Manter eventos, feiras e datas relevantes. |
| Mensagens de contato | Consultar registros enviados pelo formulário. |

A administração deve ser objetiva. O usuário esperado é alguém da empresa que precisa manter o portal atualizado sem alterar código, componentes ou estrutura visual.

## O que o painel não deve virar

O módulo administrativo não deve incluir:

- CRM;
- ERP;
- funil de vendas;
- automação comercial;
- gestão financeira;
- controle de estoque;
- emissão de pedido;
- emissão de nota;
- controle de clientes;
- atendimento interno completo;
- dashboard de indicadores comerciais complexos;
- construtor visual de páginas;
- editor livre de layout.

Essas funções aumentariam o escopo e deslocariam o projeto para operação interna. O painel do portal precisa manter conteúdo publicado, mensagens e informações comerciais de apoio ao contato.

## Justificativa

O painel editorial resolve uma necessidade direta: manter o portal útil depois da publicação.

No caso da Bamak, conteúdos que tendem a mudar ou precisar de correção são:

- produtos do catálogo;
- categorias e informações de produto;
- segmentos atendidos;
- soluções apresentadas;
- dúvidas frequentes;
- notícias institucionais;
- agenda de eventos e feiras;
- indicadores institucionais;
- textos da página “A Bamak”;
- chamadas e cards da Home;
- mensagens recebidas por contato.

A empresa já possui materiais visuais, atuação em feiras/eventos e oferta comercial específica. O painel precisa sustentar essa comunicação pública com atualização controlada.

## Papel no fluxo público

O módulo administrativo sustenta as informações que o visitante consulta.

```txt
Administrador atualiza conteúdo estruturado
→ API valida e grava no banco
→ Área pública exibe conteúdo atualizado
→ Visitante consulta empresa, segmentos, soluções, catálogo, FAQ, notícias ou agenda
→ Visitante inicia contato mais preparado
```

O painel não aparece para o visitante, mas afeta diretamente a qualidade da navegação pública.

## Decisão sobre conteúdo estruturado

O painel deve trabalhar com tipos de conteúdo definidos pela aplicação.

Exemplos:

| Tipo de conteúdo | Campos prováveis |
|---|---|
| Produto | nome, categoria, SKU opcional, descrição, imagem, status, relações. |
| Segmento | título, descrição, imagem, cards, status, slug. |
| Solução | título, descrição, imagem, cards, status, slug. |
| FAQ | pergunta, resposta, ordem, status. |
| Notícia | título, resumo, conteúdo, categoria, data, imagem, status. |
| Evento | título, data, localização, categoria, descrição, imagem, status. |
| Indicador | rótulo, valor, descrição curta, ordem. |
| Marco histórico | ano, título, descrição, ordem. |
| Bloco da Home | título, texto, link, CTA, imagem, ordem, status. |
| Mensagem | nome, empresa, contato, assunto, mensagem, origem, data. |

A empresa edita campos. A aplicação controla como esses campos aparecem na interface.

## Decisão sobre edição de layout

O painel não deve permitir que o administrador monte páginas livremente.

O que pode ser editado:

- textos;
- imagens;
- cards;
- itens de listagem;
- ordem de exibição;
- status publicado/oculto;
- links internos controlados;
- CTAs previstos no layout.

O que deve permanecer sob controle da aplicação:

- grid;
- espaçamento;
- menu;
- rodapé;
- responsividade;
- estilo visual;
- componentes;
- hierarquia da página;
- comportamento de acordeões, filtros, cards e paginação.

Essa decisão reduz risco de quebra visual e mantém consistência com os wireframes lo-fi e com o futuro refinamento visual do PAC 8.

## Regras de acesso

Regras mínimas:

- apenas usuários autenticados acessam o painel;
- login administrativo deve ser obrigatório;
- criação, edição e exclusão lógica de conteúdos exigem autenticação;
- mensagens de contato devem ficar restritas ao ambiente administrativo;
- rotas administrativas não devem ser indexadas como páginas públicas;
- conteúdos podem ter status `rascunho`, `publicado` ou `oculto`, se essa granularidade for mantida.

No PAC 8, o controle pode começar com um perfil único de administrador. Perfis avançados só entram se a Bamak demonstrar necessidade real.

## Operações previstas por área

### Home

- editar blocos de destaque;
- alterar cards exibidos;
- definir links de seção;
- editar CTAs;
- organizar ordem dos blocos controlados.

### Conteúdos institucionais

- editar textos da página “A Bamak”;
- atualizar blocos de apresentação;
- manter informações institucionais usadas no rodapé ou em chamadas internas.

### Indicadores e linha do tempo

- cadastrar indicador;
- editar rótulo, valor e descrição;
- ordenar indicadores;
- cadastrar marco histórico;
- editar ano, título e descrição;
- ocultar marcos que não devam aparecer.

### Segmentos

- criar segmento;
- editar título, descrição e imagem;
- publicar ou ocultar;
- preparar página de detalhe no PAC 8;
- relacionar produtos ou soluções, se a modelagem for mantida.

### Soluções

- criar solução;
- editar título, descrição e imagem;
- publicar ou ocultar;
- preparar página de detalhe no PAC 8;
- relacionar produtos ou segmentos, se a modelagem for mantida.

### Catálogo

- criar produto;
- editar informações;
- associar categoria;
- associar imagem;
- preencher SKU opcional;
- publicar ou ocultar;
- preparar vínculo com segmentos ou soluções.

### FAQ

- criar pergunta;
- editar resposta;
- organizar ordem;
- ativar ou desativar item;
- agrupar por tema, se necessário.

### Notícias

- criar notícia;
- editar título, resumo, conteúdo, imagem, categoria, data e status;
- publicar ou ocultar;
- listar por data;
- acessar prévia.

### Agenda

- criar evento;
- editar data, localização, categoria, descrição e imagem;
- separar eventos futuros e histórico, se essa estrutura for mantida;
- destacar evento futuro;
- ocultar evento antigo ou irrelevante.

### Mensagens de contato

- listar mensagens recebidas;
- visualizar dados do remetente;
- identificar origem da mensagem, quando aplicável;
- registrar data de envio;
- manter histórico básico;
- permitir marcação simples de leitura, se necessário.

## Impacto na arquitetura

O módulo administrativo exige:

- autenticação por JWT;
- rotas protegidas no frontend;
- endpoints protegidos na API;
- modelos de dados para conteúdos administráveis;
- validações no backend;
- banco relacional para persistência;
- serviço de e-mail para mensagens de contato, quando aplicável.

A aplicação web pode manter área pública e admin na mesma base Next.js, com separação por rotas.

Exemplo de divisão:

```txt
/
  home pública

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

## Consequências

### Ganhos

- reduz dependência de alteração direta no código;
- mantém páginas públicas atualizáveis;
- cobre conteúdos que aparecem nos wireframes;
- melhora continuidade depois do PAC 8;
- preserva o portal como produto administrável;
- evita construtor visual complexo;
- mantém escopo técnico viável.

### Limitações assumidas

- o painel começa com foco editorial e comercial;
- indicadores comerciais avançados ficam fora;
- perfis e permissões complexas não são prioridade inicial;
- o dashboard administrativo será aprofundado visualmente no PAC 8;
- campos reais dependem de validação de conteúdo com a Bamak.

## Critério de validação no PAC 8

A decisão estará cumprida se um administrador conseguir:

1. acessar o painel por login;
2. criar e editar conteúdos centrais;
3. publicar ou ocultar itens;
4. manter catálogo, FAQ, notícias, agenda, segmentos e soluções;
5. visualizar mensagens de contato;
6. atualizar a área pública sem mexer no código;
7. preservar layout e componentes sob controle da aplicação.

## Artefatos relacionados

- `docs/03-escopo/escopo-pac-vii.md`
- `docs/03-escopo/requisitos-consolidados.md`
- `docs/03-escopo/inventario-telas.md`
- `docs/04-arquitetura-informacao/sitemap-administrativo.png`
- `docs/04-arquitetura-informacao/wireflow-administrativo.png`
- `docs/05-arquitetura-tecnica/arquitetura-web-apps.md`
- `docs/07-wireframes-lo-fi/wf-01-home.png`
- `docs/07-wireframes-lo-fi/wf-02-a-bamak.png`
- `docs/07-wireframes-lo-fi/wf-03-segmentos.png`
- `docs/07-wireframes-lo-fi/wf-04-solucoes.png`
- `docs/07-wireframes-lo-fi/wf-05-catalogo.png`
- `docs/07-wireframes-lo-fi/wf-06-faq.png`
- `docs/07-wireframes-lo-fi/wf-07-contato.png`
- `docs/07-wireframes-lo-fi/wf-08-noticias.png`
- `docs/07-wireframes-lo-fi/wf-09-agenda.png`
- `docs/08-planejamento-pac-8/backlog-inicial.md`
