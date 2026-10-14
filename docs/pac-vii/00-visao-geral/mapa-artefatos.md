# Mapa de artefatos

Este documento organiza os artefatos do repositório do **Portal Web Institucional-Comercial para a Bamak**. A função dele é mostrar onde cada item entra no projeto, qual decisão ele sustenta e qual é seu status no PAC VII.

## 1. Entregáveis acadêmicos

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| Artigo do PAC VII | `final/pac-vii/bamak-pac-vii-artigo.pdf` | Documento acadêmico principal. Registra problema, metodologia, proposta, arquitetura, resultados esperados e continuidade. | Finalizado |
| Pitch do PAC VII | `final/pac-vii/bamak-pac-vii-pitch.pdf` | Material de apresentação da proposta em formato visual. | Finalizado |

## 2. Visão geral

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| Estado atual | `docs/pac-vii/00-visao-geral/estado-atual.md` | Delimita o que o repositório representa no PAC VII e o que ainda não foi implementado. | Atual |
| Mapa de artefatos | `docs/pac-vii/00-visao-geral/mapa-artefatos.md` | Serve como índice técnico da documentação do projeto. | Atual |

## 3. Diagnóstico

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| Problema central | `docs/pac-vii/01-diagnostico/problema-central.md` | Formula o problema do projeto em termos de presença digital, oferta e contato B2B. | Consolidado |
| Diagnóstico do site atual | `docs/pac-vii/01-diagnostico/diagnostico-site-atual.md` | Detalha limitações do site atual da Bamak. | Consolidado |
| Página inicial atual | `docs/pac-vii/01-diagnostico/evidencias-site-atual/bamak-site-atual-pagina-inicial.pdf` | Evidência visual do estado atual da página inicial. | A adicionar |
| Nossa História atual | `docs/pac-vii/01-diagnostico/evidencias-site-atual/bamak-site-atual-nossa-historia.pdf` | Evidência visual da página institucional atual. | A adicionar |
| Contate-nos atual | `docs/pac-vii/01-diagnostico/evidencias-site-atual/bamak-site-atual-contate-nos.pdf` | Evidência visual do caminho atual de contato. | A adicionar |

## 4. Benchmarking

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| Critérios de avaliação | `docs/pac-vii/02-benchmarking/criterios-avaliacao.md` | Explica os critérios usados para comparar artigos, sites e proposta. | Consolidado |
| Matriz comparativa | `docs/pac-vii/02-benchmarking/matriz-comparativa.md` | Compara referências acadêmicas, referências web, site atual da Bamak e proposta. | Consolidado |
| Referências analisadas | `docs/pac-vii/02-benchmarking/referencias-analisadas.md` | Resume o papel de cada referência no projeto. | Consolidado |

## 5. Escopo

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| Escopo do PAC VII | `docs/pac-vii/03-escopo/escopo-pac-vii.md` | Define o que foi tratado nesta etapa. | Consolidado |
| Fora de escopo | `docs/pac-vii/03-escopo/fora-escopo.md` | Registra itens excluídos, como e-commerce, CRM, ERP e orçamento automatizado. | Consolidado |
| Requisitos consolidados | `docs/pac-vii/03-escopo/requisitos-consolidados.md` | Registra requisitos funcionais, não funcionais e regras de recorte. | Consolidado |
| Inventário de telas | `docs/pac-vii/03-escopo/inventario-telas.md` | Lista páginas públicas, páginas de detalhe previstas, telas administrativas e status. | Consolidado |

## 6. Arquitetura da informação

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| Fluxo descoberta-contato | `docs/pac-vii/04-arquitetura-informacao/fluxo-descoberta-contato.md` | Explica o percurso público entre descoberta, entendimento, catálogo, FAQ e contato. | Consolidado |
| Sitemap público | `docs/pac-vii/04-arquitetura-informacao/sitemap-publico.png` | Mapa estrutural das páginas públicas. | A adicionar |
| Sitemap administrativo | `docs/pac-vii/04-arquitetura-informacao/sitemap-admin.png` | Mapa estrutural do módulo administrativo previsto. | A adicionar |
| Wireflow público | `docs/pac-vii/04-arquitetura-informacao/wireflow-publico.png` | Representa o fluxo visual da navegação pública. | A adicionar |
| Wireflow administrativo | `docs/pac-vii/04-arquitetura-informacao/wireflow-admin.png` | Representa o fluxo visual da manutenção administrativa. | A adicionar |

## 7. Arquitetura técnica

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| Arquitetura Web Apps | `docs/pac-vii/05-arquitetura-tecnica/arquitetura-web-apps.md` | Explica frontend, backend, banco e serviço externo de e-mail. | Consolidado |
| Stack tecnológica | `docs/pac-vii/05-arquitetura-tecnica/stack-tecnologica.md` | Justifica Next.js, TypeScript, Tailwind CSS, shadcn/ui, NestJS, PostgreSQL, Prisma, JWT e Docker. | Consolidado |
| Diagrama C1 | `docs/pac-vii/05-arquitetura-tecnica/c1-contexto.png` | Visão de contexto do sistema e atores. | A adicionar |
| Diagrama C2 | `docs/pac-vii/05-arquitetura-tecnica/c2-containers.png` | Visão de containers: frontend, API, banco e e-mail. | A adicionar |

## 8. Decisões de projeto

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| Catálogo consultivo | `docs/pac-vii/06-decisoes/0001-catalogo-consultivo.md` | Registra a decisão de tratar catálogo como consulta, não loja virtual. | A criar |
| Módulo administrativo editorial | `docs/pac-vii/06-decisoes/0002-modulo-administrativo-editorial.md` | Registra a decisão de limitar o painel à manutenção de conteúdo. | A criar |
| Stack Web Apps | `docs/pac-vii/06-decisoes/0003-stack-web-apps.md` | Registra a decisão de usar frontend próprio, backend próprio e banco relacional. | A criar |
| Recorte sem funcionalidades transacionais | `docs/pac-vii/06-decisoes/0004-recorte-sem-funcionalidades-transacionais.md` | Registra a exclusão de e-commerce, checkout, CRM, ERP e automação comercial. | A criar |

## 9. Wireframes lo-fi

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| README dos wireframes | `docs/pac-vii/07-wireframes-lo-fi/README.md` | Explica que as imagens são wireframes lo-fi, não telas finais. | A criar |
| Home | `docs/pac-vii/07-wireframes-lo-fi/wf-01-home.pdf` | Wireframe da porta de entrada do portal. | A adicionar |
| A Bamak | `docs/pac-vii/07-wireframes-lo-fi/wf-02-a-bamak.pdf` | Wireframe da página institucional. | A adicionar |
| Segmentos | `docs/pac-vii/07-wireframes-lo-fi/wf-03-segmentos.pdf` | Wireframe da listagem de segmentos. | A adicionar |
| Soluções | `docs/pac-vii/07-wireframes-lo-fi/wf-04-solucoes.pdf` | Wireframe da listagem de soluções. | A adicionar |
| Catálogo | `docs/pac-vii/07-wireframes-lo-fi/wf-05-catalogo.pdf` | Wireframe do catálogo consultivo. | A adicionar |
| FAQ | `docs/pac-vii/07-wireframes-lo-fi/wf-06-faq.pdf` | Wireframe das dúvidas antes do contato. | A adicionar |
| Contato | `docs/pac-vii/07-wireframes-lo-fi/wf-07-contato.pdf` | Wireframe do formulário e canais comerciais. | A adicionar |
| Notícias | `docs/pac-vii/07-wireframes-lo-fi/wf-08-noticias.pdf` | Wireframe da listagem de notícias. | A adicionar |
| Agenda | `docs/pac-vii/07-wireframes-lo-fi/wf-09-agenda.pdf` | Wireframe da listagem de eventos. | A adicionar |

## 10. Planejamento do PAC 8

| Artefato | Caminho | Função | Status |
|---|---|---|---|
| Cronograma projetado | `docs/pac-vii/08-planejamento-continuidade/cronograma-projetado.md` | Organiza a continuidade por semanas. | Consolidado |
| Backlog inicial | `docs/pac-vii/08-planejamento-continuidade/backlog-inicial.md` | Lista tarefas previstas para transformar proposta em sistema validável. | Consolidado |
| Plano de validação | `docs/pac-vii/08-planejamento-continuidade/plano-validacao.md` | Define como validar navegação pública, contato e módulo administrativo. | Consolidado |

## 11. Artefatos que não entram neste repositório agora

| Item | Motivo |
|---|---|
| `src/` | Ainda não há implementação funcional no PAC VII. |
| `apps/` | Criaria aparência de monorepo implementado. |
| `frontend/` | A frente web ainda não foi criada. |
| `backend/` | A API ainda não foi criada. |
| `prisma/` | O schema ainda não foi implementado. |
| `docker-compose.yml` | Docker foi definido como stack futura, não como ambiente entregue. |
| `package.json` | Não há projeto Node iniciado nesta etapa. |
| `.env.example` | Não há configuração executável ainda. |
| Arquivos `.zip` | Duplicam conteúdo que o Git já versiona por pasta. |

## 12. Leitura de status

Use esta classificação ao revisar o repositório:

| Status | Significado |
|---|---|
| **Finalizado** | Entregável acadêmico concluído. |
| **Atual** | Documento de orientação do repositório. |
| **Consolidado** | Artefato textual já produzido no PAC VII. |
| **A adicionar** | Arquivo visual ou evidência que precisa ser salvo no local correto. |
| **A criar** | Documento complementar previsto para completar a organização. |

## 13. Síntese

O repositório deve provar o estado do PAC VII, não simular uma implementação.

O conjunto mínimo para leitura completa é:

1. artigo;
2. README;
3. estado atual;
4. diagnóstico;
5. benchmarking;
6. escopo;
7. arquitetura da informação;
8. arquitetura técnica;
9. wireframes lo-fi;
10. planejamento do PAC 8.

As decisões e evidências reforçam rastreabilidade. A implementação entra apenas no PAC 8.
