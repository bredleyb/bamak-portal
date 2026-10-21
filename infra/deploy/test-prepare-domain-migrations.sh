#!/bin/sh
set -eu

base=$(mktemp -d)
trap 'rm -rf "$base"' EXIT
trap 'exit 1' HUP INT TERM

origem=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)/prepare-domain-migrations.sh

mkdir -p "$base/bin" "$base/repo" "$base/backups"
: > "$base/repo/compose.production.yaml"
: > "$base/repo/.env.production"

sed \
  -e "s|^PATH=/usr/sbin:/usr/bin:/sbin:/bin$|PATH=$base/bin:/usr/sbin:/usr/bin:/sbin:/bin|" \
  -e "s|/opt/bamak-portal|$base/repo|g" \
  -e "s|/usr/local/sbin/bamak-backup-postgres|$base/bin/backup|g" \
  -e "s|/var/backups/bamak-portal/postgres|$base/backups|g" \
  "$origem" > "$base/runner.sh"

cat > "$base/bin/backup" <<'MOCK'
#!/bin/sh
set -eu

echo backup >> "$TEST_TRACE"

[ "${TEST_FAIL_BACKUP:-0}" != 1 ] || exit 42

arquivo=postgres-20261020T120000Z-1234.dump
printf 'dump-ficticio\n' > "$TEST_BACKUP_DIR/$arquivo"

(
  cd "$TEST_BACKUP_DIR"
  sha256sum "$arquivo" > "$arquivo.sha256"
)

if [ "${TEST_BAD_HASH:-0}" = 1 ]; then
  printf 'alteracao-ficticia\n' >> "$TEST_BACKUP_DIR/$arquivo"
fi

printf 'Backup PostgreSQL concluido: %s\n' "$arquivo"
printf 'Retencao local: 14 dias\n'
MOCK

cat > "$base/bin/docker" <<'MOCK'
#!/bin/sh
set -eu

case " $* " in
  *" build migrate "*)
    echo build >> "$TEST_TRACE"
    [ "${TEST_FAIL_BUILD:-0}" != 1 ] || exit 51
    ;;
  *" run --rm --no-deps -T migrate "*)
    echo migrate >> "$TEST_TRACE"
    [ "${TEST_FAIL_MIGRATE:-0}" != 1 ] || exit 52
    ;;
  *)
    echo "Comando Docker inesperado" >&2
    exit 53
    ;;
esac
MOCK

chmod 700 "$base/bin/backup" "$base/bin/docker"

TEST_TRACE="$base/trace"
TEST_BACKUP_DIR="$base/backups"
export TEST_TRACE TEST_BACKUP_DIR

reiniciar() {
  : > "$TEST_TRACE"
  rm -f "$TEST_BACKUP_DIR"/postgres-*.dump
  rm -f "$TEST_BACKUP_DIR"/postgres-*.sha256
}

falhar() {
  echo "TESTE FALHOU: $*" >&2
  cat "$base/output" >&2
  exit 1
}

reiniciar
sh "$base/runner.sh" > "$base/output" 2>&1 ||
  falhar "Fluxo normal."

[ "$(tr '\n' ',' < "$TEST_TRACE")" = 'backup,build,migrate,' ] ||
  falhar "Ordem normal."

echo "OK 1/6: backup, build e migracao na ordem correta."

reiniciar
if TEST_FAIL_BACKUP=1 sh "$base/runner.sh" > "$base/output" 2>&1; then
  falhar "Backup falho aceito."
fi

[ "$(cat "$TEST_TRACE")" = 'backup' ] ||
  falhar "Migracao iniciou apos falha do backup."

echo "OK 2/6: falha no backup interrompe deploy."

reiniciar
if TEST_BAD_HASH=1 sh "$base/runner.sh" > "$base/output" 2>&1; then
  falhar "Checksum falho aceito."
fi

[ "$(cat "$TEST_TRACE")" = 'backup' ] ||
  falhar "Migracao iniciou com checksum invalido."

echo "OK 3/6: checksum invalido bloqueia migracao."

reiniciar
if TEST_FAIL_BUILD=1 sh "$base/runner.sh" > "$base/output" 2>&1; then
  falhar "Build falho aceito."
fi

[ "$(tr '\n' ',' < "$TEST_TRACE")" = 'backup,build,' ] ||
  falhar "Migracao iniciou apos build falho."

echo "OK 4/6: falha de build bloqueia migracao."

reiniciar
if TEST_FAIL_MIGRATE=1 sh "$base/runner.sh" > "$base/output" 2>&1; then
  falhar "Migracao falha aceita."
fi

[ "$(tr '\n' ',' < "$TEST_TRACE")" = 'backup,build,migrate,' ] ||
  falhar "Migracao falha nao rastreada."

echo "OK 5/6: falha da migracao impede publicacao."

reiniciar
mv "$base/bin/backup" "$base/bin/backup.disabled"

if sh "$base/runner.sh" > "$base/output" 2>&1; then
  falhar "Backup nao instalado aceito."
fi

[ ! -s "$TEST_TRACE" ] ||
  falhar "Comandos executados sem backup instalado."

echo "OK 6/6: backup nao instalado bloqueia preparacao."
echo "RESULTADO: 6 cenarios simulados aprovados."
