#!/bin/sh
set -eu
umask 077
PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH

falhar() {
  echo "ERRO: $*" >&2
  exit 1
}

[ "$(id -u)" -eq 0 ] ||
  falhar "Execucao administrativa necessaria."

repositorio=/opt/bamak-portal
compose="$repositorio/compose.production.yaml"
ambiente="$repositorio/.env.production"
backup=/usr/local/sbin/bamak-backup-postgres
destino=/var/backups/bamak-portal/postgres

[ -f "$compose" ] ||
  falhar "Compose de producao ausente."
[ -f "$ambiente" ] ||
  falhar "Ambiente de producao ausente."
[ -x "$backup" ] && [ ! -L "$backup" ] ||
  falhar "Backup instalado ausente ou inseguro."
[ -d "$destino" ] && [ ! -L "$destino" ] ||
  falhar "Diretorio de backups ausente ou inseguro."

# O script instalado valida o dump com pg_restore antes de publica-lo.
if ! saida=$("$backup"); then
  falhar "Backup pre-migracao falhou; migracao bloqueada."
fi

arquivo=$(printf '%s\n' "$saida" |
  sed -n 's/^Backup PostgreSQL concluido: \(postgres-[0-9][0-9]*T[0-9][0-9]*Z-[0-9][0-9]*\.dump\)$/\1/p')

[ -n "$arquivo" ] ||
  falhar "Backup nao informou nome valido; migracao bloqueada."

case "$arquivo" in
  *'
'*) falhar "Mais de um backup informado." ;;
esac

[ -f "$destino/$arquivo" ] && [ ! -L "$destino/$arquivo" ] ||
  falhar "Arquivo de backup inexistente."
[ -f "$destino/$arquivo.sha256" ] &&
  [ ! -L "$destino/$arquivo.sha256" ] ||
  falhar "Checksum do backup inexistente."

(
  cd "$destino"
  sha256sum -c "$arquivo.sha256" >/dev/null
) || falhar "Checksum do backup invalido."

echo "Backup confirmado: $arquivo"

docker compose --env-file "$ambiente" -f "$compose" \
  --profile migrations build migrate ||
  falhar "Build do migrador falhou; migracao bloqueada."

# O banco precisa estar em execucao; nao reiniciar dependencias.
docker compose --env-file "$ambiente" -f "$compose" \
  --profile migrations run --rm --no-deps -T migrate ||
  falhar "Migracao falhou; intervencao necessaria, sem rollback automatico do banco."

echo "Migracoes concluidas; publicacao pode prosseguir."
