#!/bin/sh
set -eu

if [ "$(id -u)" -ne 0 ]; then
  exec sudo -n sh "$0"
fi

base=$(mktemp -d)
compose="$base/compose.yaml"
ambiente="$base/test.env"
destino="$base/backups"
diretorio=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

limpar() {
  docker compose --env-file "$ambiente" -f "$compose" down -v --remove-orphans >/dev/null 2>&1 || true
  rm -rf "$base"
}
trap limpar EXIT
trap 'exit 1' HUP INT TERM

cat > "$ambiente" <<'ENV'
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha-ficticia-apenas-ci
POSTGRES_DB=bamak_teste
ENV

cat > "$compose" <<'YAML'
name: bamak-backup-ci
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 2s
      timeout: 2s
      retries: 30
YAML

sed \
  -e "s|^compose=.*|compose=$compose|" \
  -e "s|^ambiente=.*|ambiente=$ambiente|" \
  -e "s|/var/backups/bamak-portal/postgres|$destino|g" \
  "$diretorio/backup-postgres.sh" > "$base/backup.sh"

echo "Iniciando PostgreSQL descartavel..."
docker compose --env-file "$ambiente" -f "$compose" up -d --wait --wait-timeout 120

docker compose --env-file "$ambiente" -f "$compose" exec -T db \
  psql -U postgres -d bamak_teste -v ON_ERROR_STOP=1 <<'SQL'
CREATE TABLE registros_teste (
  id integer PRIMARY KEY,
  descricao text NOT NULL
);
INSERT INTO registros_teste VALUES
  (1, 'Registro ficticio A'),
  (2, 'Registro ficticio B');
SQL

echo "Executando o script real de backup..."
sh "$base/backup.sh"

arquivo=$(find "$destino" -maxdepth 1 -type f -name 'postgres-*.dump' -print)
[ -n "$arquivo" ] && [ -f "$arquivo" ] || {
  echo "Backup nao encontrado." >&2
  exit 1
}

(
  cd "$destino"
  sha256sum -c "$(basename "$arquivo").sha256"
)

echo "Criando banco isolado para restauracao..."
docker compose --env-file "$ambiente" -f "$compose" exec -T db \
  psql -U postgres -d postgres -v ON_ERROR_STOP=1 \
  -c 'CREATE DATABASE bamak_restaurado;'

docker compose --env-file "$ambiente" -f "$compose" exec -T db \
  pg_restore -U postgres --no-owner --no-acl \
  --exit-on-error -d bamak_restaurado < "$arquivo"

consulta='SELECT id::text || chr(124) || descricao FROM registros_teste ORDER BY id;'

original=$(docker compose --env-file "$ambiente" -f "$compose" exec -T db \
  psql -U postgres -d bamak_teste -Atqc "$consulta")

restaurado=$(docker compose --env-file "$ambiente" -f "$compose" exec -T db \
  psql -U postgres -d bamak_restaurado -Atqc "$consulta")

[ "$original" = "$restaurado" ] || {
  echo "Dados restaurados diferentes dos originais." >&2
  exit 1
}

[ "$(printf '%s\n' "$restaurado" | wc -l | tr -d ' ')" -eq 2 ] || {
  echo "Quantidade de registros inesperada." >&2
  exit 1
}

echo "OK: backup real restaurado e registros conferidos."
echo "Ambiente de teste sera removido automaticamente."
