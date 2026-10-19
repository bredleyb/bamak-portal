#!/bin/sh
set -eu

base=$(mktemp -d)
trap 'rm -rf "$base"' EXIT
trap 'exit 1' HUP INT TERM

diretorio=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
origem="$diretorio/backup-postgres.sh"
[ -f "$origem" ] || { echo "Script de backup nao encontrado." >&2; exit 1; }

mkdir -p "$base/repo" "$base/bin"
: > "$base/repo/compose.production.yaml"
: > "$base/repo/.env.production"

sed \
  -e "s|/opt/bamak-portal|$base/repo|g" \
  -e "s|/var/backups/bamak-portal/postgres|$base/backups|g" \
  "$origem" > "$base/backup.sh"

cat > "$base/bin/docker" <<'MOCK'
#!/bin/sh
set -eu
case "$*" in
  *"exec -T db sh -ec"*)
    if [ "${TEST_DUMP_FAIL:-0}" = 1 ]; then
      echo "Falha simulada no pg_dump" >&2
      exit 30
    fi
    printf '%s\n' 'arquivo-de-teste'
    ;;
  *"exec -T db pg_restore --list"*)
    if [ "${TEST_VALIDATE_FAIL:-0}" = 1 ]; then
      echo "Falha simulada na leitura do backup" >&2
      exit 31
    fi
    grep -qx 'arquivo-de-teste'
    ;;
  *)
    echo "Comando Docker inesperado" >&2
    exit 32
    ;;
esac
MOCK

chmod 700 "$base/bin/docker"
PATH="$base/bin:$PATH"
export PATH

falhar() {
  echo "TESTE FALHOU: $*" >&2
  exit 1
}

executar() {
  sh "$base/backup.sh" > "$base/saida.log" 2>&1
}

quantidade() {
  find "$base/backups" -maxdepth 1 -type f -name 'postgres-*.dump' | wc -l | tr -d ' '
}

executar || { cat "$base/saida.log" >&2; falhar "Backup normal deveria funcionar."; }
[ "$(quantidade)" -eq 1 ] || falhar "Backup final nao foi gerado."

arquivo=$(find "$base/backups" -maxdepth 1 -type f -name 'postgres-*.dump' -print)

[ "$(stat -c %a "$arquivo")" = 600 ] || falhar "Backup sem permissoes restritas."
[ "$(stat -c %a "$base/backups")" = 700 ] || falhar "Diretorio sem permissoes restritas."

(
  cd "$base/backups"
  sha256sum -c "$(basename "$arquivo").sha256" > /dev/null
) || falhar "Checksum invalido."

echo "OK: backup simulado, permissoes e SHA-256"

TEST_DUMP_FAIL=1
export TEST_DUMP_FAIL
if executar; then falhar "Falha do pg_dump nao foi detectada."; fi
unset TEST_DUMP_FAIL

[ "$(quantidade)" -eq 1 ] || falhar "Falha do pg_dump deixou dump final."
[ -z "$(find "$base/backups" -maxdepth 1 -name '.postgres.*' -print)" ] || falhar "Arquivo temporario nao foi removido."

echo "OK: falha do pg_dump impede publicacao"

TEST_VALIDATE_FAIL=1
export TEST_VALIDATE_FAIL
if executar; then falhar "Falha do pg_restore nao foi detectada."; fi
unset TEST_VALIDATE_FAIL

[ "$(quantidade)" -eq 1 ] || falhar "Falha de validacao deixou dump final."
[ -z "$(find "$base/backups" -maxdepth 1 -name '.postgres.*' -print)" ] || falhar "Arquivo temporario nao foi removido."

echo "OK: falha da validacao impede publicacao"

mv "$base/backups" "$base/backups-original"
ln -s "$base/backups-original" "$base/backups"

if executar; then falhar "Diretorio simbolico deveria ser bloqueado."; fi

echo "OK: diretorio simbolico rejeitado"
echo "Testes do script de backup: aprovados (simulacao)."
