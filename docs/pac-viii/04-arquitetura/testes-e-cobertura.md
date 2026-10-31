# Testes automatizados e cobertura — PAC VIII

## Objetivo

Registrar a infraestrutura de testes do Portal Bamak, os resultados efetivamente obtidos e os critérios de evolução da cobertura, conforme a Issue #90.

Os testes acompanham cada incremento funcional. TDD deverá ser aplicado quando pertinente.

## Ferramentas

| Aplicação | Ferramentas | Comando |
| --- | --- | --- |
| API NestJS | Jest, ts-jest | `npm --prefix apps/api run test -- --runInBand --ci` |
| API — cobertura | Jest | `npm --prefix apps/api run test:cov -- --runInBand --ci` |
| Web Next.js | Vitest, React Testing Library, jsdom | `npm --prefix apps/web run test` |
| Web — cobertura | Vitest, V8 | `npm --prefix apps/web run test:cov` |

Os testes unitários e de componentes atuais não exigem conexão com a VPS ou com o PostgreSQL de produção.

## Resultados locais iniciais — 19/10/2026

| Indicador | API | Web |
| --- | --- | --- |
| Testes aprovados | 2 de 2 | 4 de 4 |
| Suítes aprovadas | 1 de 1 | 1 de 1 |
| Cobertura de instruções | 21,42% | 76,47% |
| Cobertura de linhas | 20,58% | 76,47% |
| Cobertura de funções | 33,33% | 75% |
| Cobertura de ramificações | 25% | 100% |
| Meta acadêmica final | 75% | 25% |

Essas medições são uma linha de base inicial, não evidência do cumprimento definitivo das metas. A cobertura deve ser reavaliada conforme novas funcionalidades forem implementadas.

Na API, arquivos gerados pelo Prisma são excluídos da cobertura. Arquivos próprios da aplicação ainda não testados permanecem na medição.

Na Web, os próprios arquivos de teste são excluídos da cobertura. Nesta medição inicial, o layout ainda não possuía testes específicos.

## Resultado incremental da Web — 19/10/2026

A implementação da Issue #89, na branch `feat/fundamentos-visuais`, ampliou a suíte Web. A última validação local, executada após a integração do cabeçalho e do rodapé ao `RootLayout`, apresentou:

| Indicador | Resultado local |
| --- | --- |
| Testes aprovados | 110 de 110 |
| Suítes aprovadas | 11 de 11 |
| Cobertura de instruções | 100% |
| Cobertura de linhas | 100% |
| Cobertura de funções | 100% |
| Cobertura de ramificações | 98% |
| ESLint | Aprovado |
| TypeScript e build de produção | Aprovados |

A distribuição dos testes é:

| Área | Testes |
| --- | ---: |
| Button, Field, Select, Checkbox, Notification, Badge e ContentCard | 73 |
| SiteHeader | 12 |
| SiteFooter | 16 |
| RootLayout | 5 |
| Página inicial técnica | 4 |
| **Total** | **110** |

Os componentes visuais utilizam os tokens e ativos institucionais definidos para o Portal Bamak. O `SiteHeader` e o `SiteFooter` foram integrados ao layout global com testes para estrutura semântica, navegação compartilhada, preservação do conteúdo e metadados.

A cobertura de 100% refere-se aos arquivos incluídos na medição local atual. Não comprova cobertura de CSS, fidelidade visual, acessibilidade integral ou funcionamento ponta a ponta dos fluxos de negócio.

### Verificação visual exploratória

Foram inspecionadas capturas da página inicial nas larguras de 320, 390, 768, 1024, 1199, 1200 e 1440 px, além de uma observação inicial em monitor ultrawide de 3440 px.

A inspeção identificou quebra inadequada do e-mail institucional no rodapé em 320 px. O breakpoint adicional de até 359 px passou a organizar as seções em uma coluna. A correção foi verificada visualmente e registrada no commit `a29ba19`.

A transição da navegação compacta para a horizontal entre 1199 e 1200 px não apresentou sobreposições evidentes nas capturas. Essas verificações são exploratórias, não testes automatizados de navegador.

Um aviso de divergência de hidratação foi observado durante o desenvolvimento. Após a limpeza do diretório `.next` e a reinicialização do servidor, o problema deixou de ser reproduzido. Sua causa definitiva não foi estabelecida.

### Limites da medição

- A API não foi reavaliada nesta etapa; seus valores permanecem registrados na linha de base inicial.
- A cobertura Web aqui documentada resulta da execução local da branch, não de uma nova análise confirmada no SonarCloud da `main`.
- A página inicial ainda contém conteúdo técnico provisório e pode indicar indisponibilidade da API quando o backend não está acessível.
- As páginas públicas de negócio, os fluxos FL-01, FL-02 e FL-03 e os testes E2E de navegador continuam pendentes.
- Testes por pares, validação institucional da Bamak e aceite final ainda não foram realizados.

Referências: Issues #89 e #90.

## Cenários implementados

### API — GET /health

- Retorno saudável quando a consulta simulada ao banco é bem-sucedida.
- Propagação do erro quando a consulta simulada falha.

### Web — página inicial técnica

- Exibição do estado de carregamento.
- Exibição da resposta saudável da API e do banco.
- Tratamento de resposta HTTP 503.
- Tratamento de falha de conexão.

Esses testes não são testes ponta a ponta nem substituem a verificação de integração real entre API e banco.

## Integração contínua

O workflow `.github/workflows/ci.yml` foi alterado para executar testes e cobertura nos jobs API e Web e publicar relatórios LCOV como artefatos.

No PR #114, o commit `0d2438e` obteve 7/7 checks aprovados. Os artefatos `cobertura-api` e `cobertura-web` foram publicados e disponibilizados aos jobs do SonarCloud. Ambos os Quality Gates passaram, mas ainda exibem 0,0% de cobertura no código novo. Essa aprovação não comprova o alcance de 80% no código novo nem das metas finais de 75% no backend e 25% no frontend.

A análise estática e de segurança SonarCloud permanece independente de lint, testes e `npm audit`.

## Dependências e segurança

Em 19/10/2026, o `npm audit --omit=dev --audit-level=high` da Web não identificou vulnerabilidades nas dependências de produção.

A auditoria incluindo dependências de desenvolvimento identificou cinco alertas de severidade alta associados à cadeia de ferramentas ESLint/Next.js. A correção sugerida pelo npm envolveria alteração incompatível de versão. Os alertas permanecem pendentes de avaliação específica; não foi aplicado `npm audit fix --force`.

## Evidências da Issue #96 — 31/10/2026

A branch `feat/admin-auth-rbac` e a PR #119 implementam autenticação administrativa, autorização por perfil e gestão de acessos. As evidências a seguir distinguem o commit publicado do incremento local posterior.

| Verificação | Resultado |
|---|---|
| Testes unitários/HTTP selecionados após reforço da criação | 44/44 aprovados em quatro suítes |
| Integração PostgreSQL 17 descartável após reforço | 20/20 aprovados em duas suítes |
| Migrações aplicadas no banco descartável | 9/9; schema atualizado |
| Oxlint type-aware | Zero erros e avisos |
| Prisma Validate, geração do Client e build API | Aprovados |
| Actionlint | Aprovado |
| Segurança verificada | Concorrência cruzada, perda de privilégios durante hash, auditoria CREATED e rollback da criação |

A nona migração `20261031043000_admin_access_event_created` acrescenta o tipo CREATED. A conta e seu evento são gravados na mesma transação, após revalidação do Administrador sob bloqueio transacional. O teste simula falha de INSERT da auditoria e confirma que a conta não foi criada.

A CI do commit publicado `6f74226`, [execução #41167176931](https://github.com/bredleyb/bamak-portal/actions/runs/41167176931), concluiu os cinco jobs com sucesso, incluindo os dois jobs SonarQube. API: 201 testes gerais aprovados, 15 ignorados nessa etapa e 97,34% de cobertura de linhas. Web: 274 testes aprovados e 89,79% de cobertura de linhas. Suítes PostgreSQL específicas da CI: 11/11 testes de acessos e 4/4 de troca de senha aprovados.

**Limite temporal:** a nova migração e os testes de criação/concorrência posteriores ao commit `6f74226` possuem evidência local de execução; a validação em CI deve ser conferida para o commit que os incluir. O banco de desenvolvimento e o ambiente de produção não foram utilizados na etapa de integração descartável.

A revisão por pares e os testes cruzados acadêmicos estão temporariamente suspensos, com acompanhamento na Issue #105. Sua retomada dependerá da organização e disponibilidade de revisores, sem impedir as verificações técnicas individuais. Nenhuma revisão externa foi declarada realizada.

## Padrões para os próximos incrementos

### Componentes Web

- Criar testes próximos dos componentes, utilizando arquivos `.test.tsx`.
- Verificar estados de carregamento, sucesso, erro e ausência de dados quando aplicáveis.
- Preferir consultas por papel e nome acessível, evitando seletores dependentes da implementação visual.
- Cobrir interações por teclado, foco e mensagens de validação relevantes.
- Simular chamadas externas em testes unitários; reservar testes de integração para verificar contratos e interações reais quando disponíveis.
- Não declarar como executados testes de componentes que ainda não foram implementados.

### API, validação, autorização e contratos

- Criar arquivos `.spec.ts` junto às unidades NestJS correspondentes.
- Isolar dependências externas nos testes unitários, incluindo Prisma e serviços externos.
- Verificar entradas válidas, inválidas e casos-limite quando DTOs e regras forem implementados.
- Para endpoints protegidos, distinguir ausência de autenticação (401), falta de permissão (403) e acesso autorizado.
- Verificar contratos HTTP: método, rota, status, estrutura das respostas e formato dos erros.
- Utilizar ambiente e dados descartáveis nos futuros testes de integração; nunca o banco de produção.
- Registrar defeitos reproduzíveis como Issues, com passos, resultado esperado e resultado observado.

### Preparação incremental para E2E

A API já dispõe do script `test:e2e`, da configuração `test/jest-e2e.json` e de dependências para testes HTTP com Supertest. Ainda não há cenários E2E funcionais implementados.

A Web dispõe de Vitest para testes de componentes, mas ainda não possui um executor E2E de navegador configurado. Sua adoção será avaliada quando existirem fluxos navegáveis.

Para FL-01, FL-02 e FL-03, os futuros testes deverão:

1. Executar sobre ambiente isolado e reproduzível.
2. Preparar dados fictícios e limpar o estado entre os cenários.
3. Cobrir o percurso principal e pelo menos uma falha relevante por fluxo.
4. Verificar respostas, persistência e permissões conforme cada requisito.
5. Integrar os cenários estáveis à CI sem depender da VPS de produção.

A implementação desses cenários acompanhará as funcionalidades das Issues #98 a #101 e a validação E2E prevista na Issue #104. Esta seção define o procedimento de evolução, não constitui evidência de testes E2E executados.

## Evolução planejada

- Acompanhar os testes, relatórios de cobertura e artefatos a cada novo incremento na CI.
- Estabelecer padrões incrementais para testes de componentes, validação de entradas, autorização e contratos da API.
- Preparar testes de integração e cenários E2E para FL-01, FL-02 e FL-03 à medida que forem implementados.
- Monitorar as metas de 75% no backend e 25% no frontend.
- Registrar bugs reproduzíveis como Issues e distinguir revisão própria de revisão por pares.

Referência: Issue #90.
