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
autorização, será necessário planejar sua nova execução
controlada no GitHub Actions. Não presumir publicação
automática retroativa.

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

## Verificações pendentes antes da produção

- Confirmar instalação e integridade dos executores na VPS.
- Verificar existência e proteção dos backups reais.
- Ensaiar restauração em banco isolado a partir de um backup
  adequado e autorizado, sem expor dados pessoais.
- Validar conectividade e permissões do serviço migrador.
- Conferir configuração de automação do deploy.
- Confirmar aprovação do CI remoto e revisão do Pull Request.
- Definir janela de publicação e responsável pela recuperação.

O teste automatizado de backup e restauração em PostgreSQL
descartável verifica o mecanismo, mas não substitui um
ensaio operacional com o ambiente e o backup apropriados.

## Limites atuais

Os testes locais validaram as cinco migrações versionadas,
a idempotência do migrador, a inicialização da API de
produção com PostgreSQL isolado e 15 cenários simulados
dos scripts de deploy e preparação.

Essas evidências não demonstram instalação dos executores
na VPS, restauração de dados reais ou autorização para
executar migrações em produção.
