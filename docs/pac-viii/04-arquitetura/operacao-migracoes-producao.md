# Operação das migrações Prisma em produção — Portal Bamak

## Objetivo

Estabelecer o procedimento de publicação segura das migrações de
domínio da Issue #95, sem confundir a aprovação dos testes locais
com a autorização para alterar o banco de produção.

Este documento é um procedimento operacional. Sua criação não
comprova que os pré-requisitos estejam instalados na VPS.

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

## Bloqueio antes do merge

Não integrar a Issue #95 à `main` enquanto não estiver
confirmado que o executor instalado na VPS entende as migrações.

O workflow `.github/workflows/deploy.yml` pode iniciar uma
publicação após CI bem-sucedida na `main`, quando
`PRODUCTION_DEPLOY_ENABLED=true`.

Antes de autorizar o merge, o responsável operacional deve:

1. Confirmar os resultados do Pull Request e da análise estática.
2. Controlar a automação de produção para impedir uma publicação
   prematura durante a preparação operacional.
3. Confirmar que `/usr/local/sbin/bamak-deploy` será atualizado
   com a versão revisada antes da próxima publicação.
4. Confirmar que `/usr/local/sbin/bamak-backup-postgres` está
   instalado, executável e corresponde a uma versão revisada.
5. Confirmar que o Docker Compose da VPS está operacional e
   que o PostgreSQL possui volume persistente.
6. Confirmar que `COMPOSE_PROFILES` não habilita globalmente
   o perfil `migrations`.
7. Registrar a versão atualmente publicada e verificar o
   mecanismo de recuperação disponível.

A instalação e as verificações na VPS exigem acesso
administrativo autorizado. Não executá-las no CI de testes.

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

## Estado operacional verificado em 21/10/2026

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

## Pendencias para a primeira publicacao das migracoes

- Integrar o PR com autorizacao explicita e confirmar a
  CI de `push` do commit definitivo da `main`.
- Confirmar a janela de publicacao e a condicao de
  recuperacao em caso de falha.
- Autorizar o SHA exato de producao e habilitar
  pontualmente o acionamento de deploy.
- Executar a publicacao pelo GitHub Actions, sem substituir
  o pipeline por comandos manuais de implantacao.
- Confirmar migracoes, healthchecks, versao publicada
  e registros operacionais na VPS.

## Limites das evidencias

A restauracao isolada validou o mecanismo de recuperacao
do backup atual, cujo banco restaurado apresentou zero
tabelas publicas. Isso nao comprova a recuperacao de
dados de negocio futuros.

Os testes de migracao e os cenarios simulados de deploy
nao substituem a primeira aplicacao em producao. O
Actionlint valida os workflows estaticamente, mas nao
equivale a uma execucao real de deploy manual.

Revisoes por pares e testes cruzados academicos permanecem
separados da revisao tecnica individual e dependem das
orientacoes da disciplina.
