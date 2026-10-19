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

Na Web, os próprios arquivos de teste são excluídos da cobertura. O layout ainda não possui testes específicos.

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

A execução e aprovação dessas etapas no GitHub Actions ainda precisam ser confirmadas por um Pull Request. As metas finais de cobertura não são bloqueios automáticos nesta configuração inicial.

A análise estática e de segurança SonarCloud permanece independente de lint, testes e `npm audit`.

## Dependências e segurança

Em 19/10/2026, o `npm audit --omit=dev --audit-level=high` da Web não identificou vulnerabilidades nas dependências de produção.

A auditoria incluindo dependências de desenvolvimento identificou cinco alertas de severidade alta associados à cadeia de ferramentas ESLint/Next.js. A correção sugerida pelo npm envolveria alteração incompatível de versão. Os alertas permanecem pendentes de avaliação específica; não foi aplicado `npm audit fix --force`.

## Evolução planejada

- Confirmar os testes e artefatos de cobertura na CI.
- Estabelecer padrões incrementais para testes de componentes, validação de entradas, autorização e contratos da API.
- Preparar testes de integração e cenários E2E para FL-01, FL-02 e FL-03 à medida que forem implementados.
- Monitorar as metas de 75% no backend e 25% no frontend.
- Registrar bugs reproduzíveis como Issues e distinguir revisão própria de revisão por pares.

Referência: Issue #90.
