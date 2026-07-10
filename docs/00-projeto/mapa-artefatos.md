# Mapa global de artefatos

## 1. Função deste mapa

Este documento é o índice global do repositório. Ele separa o histórico aprovado do PAC VII, a linha de base do Pré-PAC VIII e a execução futura do PAC VIII.

Use este mapa para:

- localizar a fonte correta de cada decisão;
- verificar o status de um artefato;
- evitar duplicação entre fases;
- identificar caminhos planejados;
- orientar links em issues, entregáveis e documentos.

## 2. Regra de leitura

A prioridade entre as fontes do repositório é:

1. documentos atuais do Pré-PAC VIII para o escopo refinado;
2. documentos globais em `docs/00-projeto/` para organização e histórico;
3. materiais do PAC VII como registro da concepção aprovada;
4. documentos do PAC VIII quando a execução funcional iniciar.

Os arquivos do PAC VII não devem ser alterados para incorporar decisões tomadas depois do encerramento da fase.

## 3. Legenda de status

| Status | Uso |
|---|---|
| **Concluído** | Artefato criado e incorporado ao repositório. |
| **Em andamento** | Artefato iniciado, ainda sujeito a complementação. |
| **Planejado** | Caminho e função definidos, conteúdo ainda não produzido. |
| **Reservado** | Estrutura criada para uma fase futura. |
| **Histórico** | Artefato concluído em fase anterior e preservado como registro. |

## 4. Documentos globais

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Mapa global de artefatos | `docs/00-projeto/mapa-artefatos.md` | Concluído | Centralizar caminhos, fases, funções e status. |
| Histórico das fases | `docs/00-projeto/historico-fases.md` | Concluído | Registrar a evolução do PAC VII ao PAC VIII e as regras de transição. |
| README do repositório | `README.md` | Em atualização | Apresentar o projeto, o estado atual e a navegação principal do repositório. |

## 5. PAC VII — concepção aprovada

**Situação:** concluído.

**Uso atual:** fonte histórica da concepção, do diagnóstico, da arquitetura inicial e dos entregáveis acadêmicos.

### 5.1 Visão geral

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Estado da fase | `docs/10-pac-vii/00-visao-geral/estado-atual.md` | Histórico | Resumir o estado final do PAC VII. |
| Mapa da fase | `docs/10-pac-vii/00-visao-geral/mapa-artefatos.md` | Histórico | Indexar os artefatos produzidos no PAC VII. |

### 5.2 Diagnóstico

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Diagnóstico do site | `docs/10-pac-vii/01-diagnostico/diagnostico-site-atual.md` | Histórico | Registrar limitações do site analisado. |
| Problema central | `docs/10-pac-vii/01-diagnostico/problema-central.md` | Histórico | Delimitar o problema que originou a proposta. |
| Página inicial analisada | `docs/10-pac-vii/01-diagnostico/evidencias-site-atual/bamak-site-atual-pagina-inicial.pdf` | Histórico | Evidência visual do site existente. |
| Nossa História analisada | `docs/10-pac-vii/01-diagnostico/evidencias-site-atual/bamak-site-atual-nossa-historia.pdf` | Histórico | Evidência visual da página institucional. |
| Contate-nos analisada | `docs/10-pac-vii/01-diagnostico/evidencias-site-atual/bamak-site-atual-contate-nos.pdf` | Histórico | Evidência visual da página de contato. |

### 5.3 Benchmarking

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Critérios de avaliação | `docs/10-pac-vii/02-benchmarking/criterios-avaliacao.md` | Histórico | Definir critérios usados na comparação. |
| Matriz comparativa | `docs/10-pac-vii/02-benchmarking/matriz-comparativa.md` | Histórico | Comparar referências e proposta. |
| Referências analisadas | `docs/10-pac-vii/02-benchmarking/referencias-analisadas.md` | Histórico | Registrar artigos e portais observados. |

### 5.4 Escopo

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Escopo do PAC VII | `docs/10-pac-vii/03-escopo/escopo-pac-vii.md` | Histórico | Delimitar a proposta aprovada naquela fase. |
| Fora de escopo | `docs/10-pac-vii/03-escopo/fora-escopo.md` | Histórico | Registrar exclusões funcionais. |
| Inventário de telas | `docs/10-pac-vii/03-escopo/inventario-telas.md` | Histórico | Relacionar telas públicas e administrativas previstas. |
| Requisitos consolidados | `docs/10-pac-vii/03-escopo/requisitos-consolidados.md` | Histórico | Registrar requisitos usados na concepção. |

### 5.5 Arquitetura da informação

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Fluxo descoberta–contato | `docs/10-pac-vii/04-arquitetura-informacao/fluxo-descoberta-contato.md` | Histórico | Representar o percurso público inicial. |
| Sitemap público | `docs/10-pac-vii/04-arquitetura-informacao/sitemap-publico.png` | Histórico | Mostrar a navegação pública do PAC VII. |
| Sitemap administrativo | `docs/10-pac-vii/04-arquitetura-informacao/sitemap-admin.png` | Histórico | Mostrar a navegação administrativa do PAC VII. |
| Wireflow público | `docs/10-pac-vii/04-arquitetura-informacao/wireflow-publico.png` | Histórico | Representar transições da área pública. |
| Wireflow administrativo | `docs/10-pac-vii/04-arquitetura-informacao/wireflow-admin.png` | Histórico | Representar transições da área administrativa. |

### 5.6 Arquitetura técnica

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Arquitetura Web Apps | `docs/10-pac-vii/05-arquitetura-tecnica/arquitetura-web-apps.md` | Histórico | Descrever a arquitetura cliente-servidor inicial. |
| Stack tecnológica | `docs/10-pac-vii/05-arquitetura-tecnica/stack-tecnologica.md` | Histórico | Registrar tecnologias previstas. |
| Diagrama C1 | `docs/10-pac-vii/05-arquitetura-tecnica/c1-contexto.png` | Histórico | Mostrar atores e sistema no contexto. |
| Diagrama C2 | `docs/10-pac-vii/05-arquitetura-tecnica/c2-containers.png` | Histórico | Mostrar frontend, backend, banco e serviço externo. |

### 5.7 Decisões

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Catálogo consultivo | `docs/10-pac-vii/06-decisoes/0001-catalogo-consultivo.md` | Histórico | Justificar catálogo sem transação. |
| Módulo administrativo editorial | `docs/10-pac-vii/06-decisoes/0002-modulo-administrativo-editorial.md` | Histórico | Delimitar o painel previsto no PAC VII. |
| Stack Web Apps | `docs/10-pac-vii/06-decisoes/0003-stack-web-apps.md` | Histórico | Registrar a decisão tecnológica. |
| Recorte sem transações | `docs/10-pac-vii/06-decisoes/0004-recorte-sem-funcionalidades-transacionais.md` | Histórico | Excluir e-commerce e automação comercial. |

### 5.8 Wireframes de baixa fidelidade

| Artefato | Caminho | Status |
|---|---|---|
| Índice dos wireframes | `docs/10-pac-vii/07-wireframes-lo-fi/README.md` | Histórico |
| Home | `docs/10-pac-vii/07-wireframes-lo-fi/wf-01-home.pdf` | Histórico |
| A Bamak | `docs/10-pac-vii/07-wireframes-lo-fi/wf-02-a-bamak.pdf` | Histórico |
| Segmentos | `docs/10-pac-vii/07-wireframes-lo-fi/wf-03-segmentos.pdf` | Histórico |
| Soluções | `docs/10-pac-vii/07-wireframes-lo-fi/wf-04-solucoes.pdf` | Histórico |
| Catálogo | `docs/10-pac-vii/07-wireframes-lo-fi/wf-05-catalogo.pdf` | Histórico |
| FAQ | `docs/10-pac-vii/07-wireframes-lo-fi/wf-06-faq.pdf` | Histórico |
| Contato | `docs/10-pac-vii/07-wireframes-lo-fi/wf-07-contato.pdf` | Histórico |
| Notícias | `docs/10-pac-vii/07-wireframes-lo-fi/wf-08-noticias.pdf` | Histórico |
| Agenda | `docs/10-pac-vii/07-wireframes-lo-fi/wf-09-agenda.pdf` | Histórico |

### 5.9 Planejamento de continuidade

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Backlog inicial | `docs/10-pac-vii/08-planejamento-continuidade/backlog-inicial.md` | Histórico | Registrar a continuidade imaginada ao fim do PAC VII. |
| Cronograma projetado | `docs/10-pac-vii/08-planejamento-continuidade/cronograma-projetado.md` | Histórico | Projetar a etapa seguinte segundo a visão daquele momento. |
| Plano de validação | `docs/10-pac-vii/08-planejamento-continuidade/plano-validacao.md` | Histórico | Registrar a proposta inicial de validação. |

### 5.10 Entregáveis

| Artefato | Caminho | Status |
|---|---|---|
| Artigo final | `entregaveis/pac-vii/bamak-pac-vii-artigo.pdf` | Histórico |
| Relatório final | `entregaveis/pac-vii/bamak-pac-vii-relatorio.pdf` | Histórico |
| Pitch final | `entregaveis/pac-vii/bamak-pac-vii-pitch.pdf` | Histórico |
| Fonte do relatório | `entregaveis/pac-vii/fontes/bamak-pac-vii-relatorio.docx` | Histórico |

## 6. Pré-PAC VIII — linha de base

**Situação:** em andamento.

**Uso atual:** fonte do escopo refinado que deverá orientar protótipos, arquitetura, implementação e validação.

### 6.1 Visão geral

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Estado final da linha de base | `docs/20-pre-pac-viii/00-visao-geral/estado-linha-base.md` | Planejado | Consolidar o resultado do Pré-PAC VIII antes da execução. |

### 6.2 Alinhamento e baseline

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Registro de alinhamento com a Bamak | `docs/20-pre-pac-viii/01-alinhamento/registro-bamak.md` | Concluído | Registrar aprovações, limites e pendências da reunião de 08/07/2026. |
| Baseline de presença digital e atendimento | `docs/20-pre-pac-viii/01-alinhamento/baseline-presenca-digital-atendimento.md` | Concluído | Registrar o ponto de partida digital e o limite da participação do portal no atendimento. |

### 6.3 Proposta refinada

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Mudanças do PAC VII para o PAC VIII | `docs/20-pre-pac-viii/02-proposta/mudancas-pac-vii-para-pac-viii.md` | Concluído | Separar elementos mantidos, refinados, pendentes e futuros. |
| RFC v2/adendo | `docs/20-pre-pac-viii/02-proposta/rfc-v2-adendo-pac-viii.md` | Concluído | Consolidar escopo, arquitetura, requisitos, privacidade, métricas e aceite. |

### 6.4 Produto

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Requisitos, user stories, fluxos e métricas | `docs/20-pre-pac-viii/03-produto/requisitos-user-stories-fluxos-metricas.md` | Concluído | Detalhar requisitos verificáveis, critérios de aceite e evidências. |

### 6.5 Arquitetura

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Atualização de arquitetura, decisões e inventário | `docs/20-pre-pac-viii/04-arquitetura/` | Planejado | Revisar diagramas, responsabilidades, entidades, telas e decisões para a linha de base. |

Os nomes dos arquivos internos dessa pasta serão definidos na issue específica de arquitetura.

### 6.6 Design

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Style tile | `docs/20-pre-pac-viii/05-design/style-tile.md` | Planejado | Registrar direção visual inicial, tipografia, cores e referências. |
| Guia visual de interface | `docs/20-pre-pac-viii/05-design/guia-visual-interface.md` | Planejado | Definir componentes, formulários, estados, cards, painel e acessibilidade visual. |

### 6.7 Protótipos

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Protótipos lo-fi | `docs/20-pre-pac-viii/06-prototipos/lo-fi/` | Planejado | Revisar estrutura e fluxos antes do refinamento visual. |
| Protótipos mid fidelity públicos | `docs/20-pre-pac-viii/06-prototipos/mid-fi/publico/` | Planejado | Detalhar as oito áreas públicas e rotas derivadas. |
| Protótipos mid fidelity administrativos | `docs/20-pre-pac-viii/06-prototipos/mid-fi/admin/` | Planejado | Detalhar Painel, Atendimentos, Comunicação e Configurações. |

### 6.8 Validação

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Revisão interna da linha de base | `docs/20-pre-pac-viii/07-validacao/revisao-interna-linha-base.md` | Planejado | Conferir consistência entre RFC, requisitos, arquitetura e protótipos. |
| Validação com a Bamak | `docs/20-pre-pac-viii/07-validacao/validacao-bamak.md` | Planejado | Registrar aprovação e ajustes da linha de base completa. |

### 6.9 Entregáveis

| Artefato | Caminho | Status | Função |
|---|---|---|---|
| Entregáveis consolidados do Pré-PAC VIII | `entregaveis/pre-pac-viii/` | Planejado | Armazenar versões finais quando houver entrega formal. |

## 7. PAC VIII — execução, QA e validação

**Situação:** ainda não iniciado.

A estrutura está reservada. Os arquivos serão definidos quando a disciplina, as NPs e o planejamento oficial forem apresentados.

| Frente | Caminho | Status | Conteúdo esperado |
|---|---|---|---|
| Planejamento | `docs/30-pac-viii/01-planejamento/` | Reservado | Backlog, sprints, NPs e critérios definidos no semestre. |
| Desenvolvimento | `docs/30-pac-viii/02-desenvolvimento/` | Reservado | Registros técnicos, deploy, CI/CD e decisões de implementação. |
| QA e validação | `docs/30-pac-viii/03-qa-validacao/` | Reservado | Code review, testes cruzados, validações e correções. |
| Evidências | `docs/30-pac-viii/04-evidencias/` | Reservado | PRs, issues, testes, demos e registros acadêmicos. |
| Entrega final | `docs/30-pac-viii/05-entrega-final/` | Reservado | Release, aceite, documentação final e Demo Day. |
| Entregáveis finais | `entregaveis/pac-viii/` | Reservado | Arquivos oficiais da conclusão do projeto. |

## 8. Atualização deste mapa

Atualize este arquivo quando ocorrer uma destas situações:

- criação de artefato planejado;
- mudança de caminho;
- substituição formal de documento;
- início do PAC VIII;
- criação de entregável;
- remoção justificada de item do escopo documental.

Não registre como concluído um arquivo que ainda contém apenas `.gitkeep`.
