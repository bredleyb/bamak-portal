# Operação das migrações Prisma em produção — Portal Bamak

## Objetivo

Estabelecer o procedimento de publicação segura das migrações Prisma do Portal Bamak, distinguindo testes, autorização de mudanças e comprovação do estado real do banco de produção.

A implantação das primeiras migrações de domínio da Issue #95 integra o histórico operacional. Novas versões exigem verificações e autorização próprias, conforme a versão efetivamente publicada.

## Componentes

- `compose.production.yaml`: serviço `migrate`, isolado pelo
  perfil `migrations`.
- `apps/api/Dockerfile`: estágios separados `migration` e `production`.
- `infra/deploy/prepare-domain-migrations.sh`: exige backup,
  valida checksum, constrói o migrador e executa as migrações.
- `infra/deploy/bamak-deploy.sh`: coordena preparação e publicação.
- `infra/backup/backup-postgres.sh`: produz dump PostgreSQL,
  verifica sua leitura com `pg_restore --list` e gera SHA-256.
- `infra/backup/install-backup.sh`: instala o executor de backup.
- `infra/deploy/ssh-gate.sh`: encaminha o comando autorizado ao
  executável instalado em `/usr/local/sbin/bamak-deploy`.

## Autorização explícita de publicação

O workflow de produção exige duas variáveis de repositório do GitHub:

- `PRODUCTION_DEPLOY_ENABLED=true`: habilita a possibilidade de deploy.
- `PRODUCTION_DEPLOY_APPROVED_SHA`: deve corresponder exatamente ao
  SHA de 40 caracteres do commit associado à execução de CI aprovada.

Sem correspondência exata, o job de deploy não é iniciado,
mesmo quando a CI da `main` é aprovada.

A autorização é específica para um commit. A publicação de
outro commit exige nova autorização, evitando que uma permissão
antiga libere alterações posteriores.

A configuração da variável não instala nem atualiza executores
na VPS. Antes de autorizar qualquer SHA com migrações, é
obrigatório confirmar a versão de `/usr/local/sbin/bamak-deploy`,
o backup instalado, a estratégia de recuperação e os demais
pré-requisitos operacionais.

Se o workflow automático já tiver sido ignorado antes da
autorização, utilizar o acionamento manual `workflow_dispatch`
na branch `main`. O job manual confere que o SHA solicitado
é o HEAD atual da `main` e que existe uma execução de CI de
`push` concluída com sucesso para esse mesmo commit.

A execução manual continua exigindo
`PRODUCTION_DEPLOY_ENABLED=true` e correspondência exata de
`PRODUCTION_DEPLOY_APPROVED_SHA`. A habilitação dessas
variáveis não deve ocorrer antes da autorização operacional.

Esta política introduz uma etapa manual por versão e deve
ser mantida enquanto não existir um mecanismo equivalente
de pré-verificação da infraestrutura de produção.

## Preparação e controle antes de novas publicações

A Issue #95 foi integrada à `main` e suas cinco migrações iniciais estão aplicadas na VPS, conforme inspeção de 02/11/2026. As condições abaixo aplicam-se a publicações futuras que incluam migrações.

O workflow `.github/workflows/deploy.yml` pode iniciar uma publicação após CI bem-sucedida na `main` somente quando a autorização por SHA e a habilitação de produção forem satisfeitas.

Antes de autorizar uma nova versão, o responsável operacional deve:

1. Confirmar o SHA, os testes e a análise estática do commit a publicar.
2. Identificar a versão implantada, as migrações aplicadas e as diferenças em relação ao commit aprovado.
3. Conferir a integridade e a compatibilidade dos executores instalados na VPS, inclusive `/usr/local/sbin/bamak-deploy` e `/usr/local/sbin/bamak-backup-postgres`.
4. Confirmar Docker Compose, volume persistente do PostgreSQL e isolamento do perfil `migrations`.
5. Verificar backup recente, checksum, estratégia de recuperação e impacto de alterações de esquema.
6. Estabelecer autorização explícita do SHA exato e uma janela apropriada de publicação.

Instalações e verificações administrativas na VPS exigem autorização própria e não devem ser executadas nos jobs de CI destinados a testes.

## Instalação dos executores

Alterar os arquivos versionados no Git não atualiza
automaticamente programas instalados em `/usr/local/sbin`.

O executor de deploy invocado pelo SSH é uma cópia instalada.
Ele precisa receber a versão revisada por um procedimento
administrativo controlado, com verificação de integridade.

O backup também depende de uma instalação administrativa.
O instalador `infra/backup/install-backup.sh` instala o
executável e as unidades systemd, mas não ativa automaticamente
o agendamento do timer.

Não presumir que esses procedimentos já foram realizados.
Verificar o estado real antes da primeira publicação com migrações.

## Sequência de publicação autorizada

1. Obter o commit exato aprovado para publicação.
2. Validar a integridade do checkout e o estado do deploy.
3. Detectar mudanças em `apps/api/prisma/migrations`
   relativamente à última versão publicada com sucesso.
4. Quando existirem alterações, executar backup PostgreSQL.
5. Exigir dump existente, leitura válida e checksum SHA-256.
6. Construir a imagem de migração do commit autorizado.
7. Executar `prisma migrate deploy` com o PostgreSQL saudável.
8. Somente após sucesso, publicar API e Web.
9. Confirmar healthchecks e registrar o commit publicado.

Não imprimir segredos, URLs contendo senhas ou conteúdo
de dumps nos logs de publicação.

## Isolamento durante a publicação

A publicação normal especifica explicitamente `db api web proxy`
no comando `docker compose up`. O serviço `migrate` nunca deve
ser incluído nessa lista, mesmo quando `COMPOSE_PROFILES` estiver
configurado no ambiente do servidor.

O comando controlado de migração utiliza `run --no-deps` para
não iniciar ou recriar dependências automaticamente. Isso
também significa que ele não aplica a espera por saúde
definida em `depends_on`. O PostgreSQL deve estar operacional:
o backup executado anteriormente comprova conectividade
naquele momento, e uma indisponibilidade posterior deve
fazer a migração falhar e bloquear a publicação.

## Falhas e recuperação

- Falha no backup: não executar migrações nem publicar.
- Falha de checksum: bloquear migração e publicação.
- Falha de build do migrador: bloquear migração e publicação.
- Falha na migração: interromper a publicação e investigar
  o estado do banco; alterações SQL podem ter sido aplicadas
  parcialmente.
- Falha na aplicação após migrações: não executar rollback
  automático do código sem avaliação de compatibilidade.
- Falha em publicação sem alterações de migração: manter
  a política atual de recuperação técnica, conforme os
  testes do executor de deploy.

Restaurar um commit Git anterior não reverte o esquema SQL.
Restaurar um dump exige procedimento específico, autorização
e avaliação das alterações ocorridas depois do backup.

## Registro operacional de 21/10/2026 (histórico)

O estado abaixo corresponde à preparação e à autorização anteriores ao deploy efetivado em 21/10/2026. As afirmações sobre PR aberta e ausência de migrações em produção descrevem apenas aquele momento.

Verificacoes efetivamente realizadas:

- Executor `/usr/local/sbin/bamak-deploy` atualizado na VPS,
  com SHA-256 conferido e copia privada da versao anterior.
- Executor de backup instalado e agendamento systemd
  identificados como ativos.
- Backup PostgreSQL de producao com checksum SHA-256 valido
  e metadados reconhecidos por `pg_restore`.
- Restauracao do backup concluida com sucesso em PostgreSQL
  descartavel, sem rede e sem volumes de producao.
- Container de restauracao removido ao final do ensaio.
- Cinco migracoes aplicadas e validadas em PostgreSQL 17
  isolado, sem migracoes pendentes nesse ambiente de testes.
- CI do PR #116 aprovada no commit `bed5fa3`, com cinco jobs,
  incluindo Actionlint e ambos os Quality Gates.
- Workflow de deploy manual validado estaticamente pelo
  Actionlint e integrado ao fluxo de CI.

Situacao de autorizacao:

- `PRODUCTION_DEPLOY_ENABLED=false`, conforme verificacao
  informada pelo responsavel do repositorio.
- `PRODUCTION_DEPLOY_APPROVED_SHA` ainda nao configurada.
- PR #116 aberto, sem merge.
- Nenhuma migracao desta Issue aplicada ao banco de producao.

## Estado verificado da versão publicada em 02/11/2026

A última publicação bem-sucedida examinada no GitHub Actions ocorreu em 21/10/2026. A execução do job, o checkout da VPS e o registro de último deploy bem-sucedido apontaram o commit `d752d599fb71ba0adad66624a7fca999125e300b`. As execuções posteriores consultadas não publicaram novos commits.

Na inspeção de 02/11/2026, o PostgreSQL de produção apresentava cinco migrações Prisma concluídas, enquanto a `main` consultada continha nove migrações versionadas. Quatro migrações permaneciam pendentes de publicação. Nenhuma migração foi executada durante a inspeção.

Na versão da `main` consultada, havia nove migrações Prisma versionadas, com quatro ainda pendentes na VPS em 02/11/2026. Nenhuma migração foi executada durante a inspeção.

Na inspeção de 02/11/2026, os serviços estavam ativos e os healthchecks disponíveis apresentavam resultado satisfatório. As medições pontuais de recursos não constituem testes de desempenho sob carga.

A configuração de retenção e rotação dos logs permanece sujeita à revisão operacional, em conjunto com a implementação de observabilidade prevista na [Issue #103](https://github.com/bredleyb/bamak-portal/issues/103).

## Verificações após a publicação autorizada

Após cada publicação, verificar o commit efetivamente implantado, o estado das migrações Prisma e os healthchecks dos serviços. Registrar os resultados reais e investigar eventuais divergências antes de considerar a implantação concluída.

## Limites das evidencias

A restauracao isolada realizada em 19/10/2026 validou a
recuperacao daquele dump, cujo banco restaurado apresentou
zero tabelas publicas. O teste nao comprova a recuperacao de
dados de negocio existentes em backups posteriores.

Os testes de migracao e os cenarios simulados de deploy
nao substituem a verificacao real de cada publicacao em
producao. O Actionlint valida workflows estaticamente, sem
comprovar a execucao do deploy nem o estado final dos servicos.

Revisoes por pares e testes cruzados academicos permanecem
separados da revisao tecnica individual e dependem das
orientacoes da disciplina.
