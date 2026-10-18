#!/bin/sh
set -eu

diretorio=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
temporario=$(mktemp -d)
trap 'rm -rf "$temporario"' EXIT

cat > "$temporario/sudo" <<'MOCK'
#!/bin/sh
printf '%s' "$*" > "$CAPTURE"
MOCK
chmod 700 "$temporario/sudo"

sha=0123456789abcdef0123456789abcdef01234567
captura="$temporario/captura"

CAPTURE="$captura" SSH_ORIGINAL_COMMAND="deploy $sha" PATH="$temporario:$PATH" sh "$diretorio/ssh-gate.sh"

esperado="-n /usr/local/sbin/bamak-deploy $sha"
[ "$(cat "$captura")" = "$esperado" ] || {
  echo "Falha: comando valido nao foi encaminhado corretamente." >&2
  exit 1
}

verificar_rejeicao() {
  requisicao=$1
  rm -f "$captura"

  codigo=0
  CAPTURE="$captura" SSH_ORIGINAL_COMMAND="$requisicao" PATH="$temporario:$PATH" sh "$diretorio/ssh-gate.sh" >/dev/null 2>&1 || codigo=$?

  [ "$codigo" -eq 64 ] || {
    echo "Falha: comando rejeitado com codigo inesperado: $requisicao" >&2
    exit 1
  }

  [ ! -e "$captura" ] || {
    echo "Falha: comando nao autorizado alcancou sudo." >&2
    exit 1
  }
}

verificar_rejeicao ""
verificar_rejeicao "status"
verificar_rejeicao "deploy"
verificar_rejeicao "deploy ${sha}a"
verificar_rejeicao "deploy ${sha} outro"
verificar_rejeicao "deploy ABCDEF0123456789ABCDEF0123456789ABCDEF01"

echo "OK: 1 comando valido e 6 comandos rejeitados."
