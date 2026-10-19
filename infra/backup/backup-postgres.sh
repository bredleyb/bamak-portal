#!/bin/sh
set -eu
umask 077

falhar() {
  echo "ERRO: $*" >&2
  exit 1
}

[ "$(id -u)" -eq 0 ] || falhar "Execucao administrativa necessaria."

repositorio=/opt/bamak-portal
compose="$repositorio/compose.production.yaml"
ambiente="$repositorio/.env.production"
destino=/var/backups/bamak-portal/postgres
retencao=14

[ -f "$compose" ] || falhar "Compose de producao ausente."
[ -f "$ambiente" ] || falhar "Ambiente de producao ausente."
[ ! -L "$destino" ] || falhar "Diretorio de backup nao pode ser link simbolico."

install -d -m 700 -o root -g root "$destino"
chmod 700 "$destino"

exec 9>"$destino/.backup.lock"
flock -n 9 || falhar "Outro backup esta em andamento."

data=$(date -u +%Y%m%dT%H%M%SZ)
arquivo="postgres-$data-$$.dump"
temporario=$(mktemp "$destino/.postgres.XXXXXXXX")

trap 'rm -f "$temporario"' EXIT
trap 'exit 1' HUP INT TERM

docker compose \
  --env-file "$ambiente" \
  -f "$compose" \
  exec -T db sh -ec '
    exec pg_dump \
      --format=custom \
      --no-owner \
      --no-acl \
      --username="$POSTGRES_USER" \
      --dbname="$POSTGRES_DB"
  ' > "$temporario"

[ -s "$temporario" ] || falhar "Backup vazio."

docker compose \
  --env-file "$ambiente" \
  -f "$compose" \
  exec -T db pg_restore --list < "$temporario" > /dev/null

chmod 600 "$temporario"
mv "$temporario" "$destino/$arquivo"

(
  cd "$destino"
  sha256sum "$arquivo" > "$arquivo.sha256"
)

find "$destino" -maxdepth 1 -type f \
  -name 'postgres-*.dump*' -mtime +13 -delete

echo "Backup PostgreSQL concluido: $arquivo"
echo "Retencao local: $retencao dias"
