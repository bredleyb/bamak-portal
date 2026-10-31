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

A branch `feat/admin-auth-rbac`, associada à PR #119, implementa sessões administrativas, controle de perfis, gestão de acessos e auditoria transacional.

Verificações locais confirmadas após o reforço de autorização:

| Verificação | Resultado |
|---|---|
| Testes unitários e HTTP selecionados da gestão de acessos | 28/28 aprovados, em duas suítes |
| Integração real com PostgreSQL 17 descartável | 11/11 aprovados, em uma suíte |
| Migrações aplicadas no banco descartável | 8/8 |
| Oxlint type-aware | Zero erros e zero avisos |
| Build da API e Prisma Client | Aprovados |
| Auditoria funcional local | Desativação e reativação de conta fictícia registradas com autor e ordem confirmados |

Os cenários reais cobrem concorrência, mudança de perfil, bloqueio da própria conta, revalidação de permissões, autor inexistente, ausência de evento em operação sem mudança e rollback quando a persistência do evento falha. O banco de desenvolvimento e o banco de produção não foram utilizados como ambiente dessas suítes.

A CI anterior do commit `51d1587` concluiu cinco jobs com sucesso. Naquela execução, a API registrou 195 testes aprovados e oito ignorados, com cobertura global de linhas de 97,7%. A branch local recebeu cinco etapas para preparar bancos PostgreSQL separados e executar explicitamente os testes de acesso e troca de senha. **A nova configuração ainda aguarda sua primeira execução no GitHub Actions.**

Revisão por pares, testes cruzados acadêmicos e publicação da Issue #96 permanecem pendentes. Os resultados registrados aqui se referem às verificações efetivamente executadas e não atestam o funcionamento dos três fluxos públicos completos.
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
