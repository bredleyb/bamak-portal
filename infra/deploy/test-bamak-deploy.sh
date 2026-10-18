#!/bin/sh
set -eu

base=/tmp/bamak-test
estado=/var/lib/bamak-deploy
repositorio=/opt/bamak-portal
alvo=0123456789abcdef0123456789abcdef01234567
anterior=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb

mkdir -p "$base/bin" "$repositorio/.git" "$estado"
: > "$repositorio/.env.production"

sed 's@^PATH=/usr/sbin:/usr/bin:/sbin:/bin$@PATH=/tmp/bamak-test/bin:/usr/sbin:/usr/bin:/sbin:/bin@' \
  /work/infra/deploy/bamak-deploy.sh > "$base/script.sh"

cat > "$base/bin/git" <<'MOCK'
#!/bin/sh
base=/tmp/bamak-test
[ "$1" = "-C" ] && [ "$2" = "/opt/bamak-portal" ] || exit 90
shift 2
operacao=$1
shift
case "$operacao" in
  fetch) exit 0 ;;
  rev-parse)
    case "$1" in
      FETCH_HEAD) cat "$base/remote" ;;
      HEAD) cat "$base/head" ;;
      *) exit 91 ;;
    esac
    ;;
  status)
    if [ -f "$base/dirty" ]; then
      echo " M arquivo"
    fi
    ;;
  symbolic-ref)
    [ -f "$base/branch" ] || exit 1
    cat "$base/branch"
    ;;
  checkout)
    if [ "$1" = "--detach" ]; then
      printf '%s\n' "$2" > "$base/head"
      rm -f "$base/branch"
      echo "checkout $2" >> "$base/trace"
    elif [ "$1" = "main" ]; then
      cat "$base/previous" > "$base/head"
      echo main > "$base/branch"
      echo "checkout main" >> "$base/trace"
    else
      exit 92
    fi
    ;;
  *) exit 93 ;;
esac
MOCK

cat > "$base/bin/docker" <<'MOCK'
#!/bin/sh
base=/tmp/bamak-test
operacao=
for argumento do
  case "$argumento" in
    config|up) operacao=$argumento ;;
  esac
done
case "$operacao" in
  config) exit 0 ;;
  up)
    head=$(cat "$base/head")
    modo=$(cat "$base/mode")
    echo "up $head" >> "$base/trace"
    [ "$modo" = "fail-all" ] && exit 50
    if [ "$modo" = "fail-target" ] &&
       [ "$head" = "$(cat "$base/target")" ]; then
      exit 51
    fi
    exit 0
    ;;
  *) exit 94 ;;
esac
MOCK

chmod 700 "$base/bin/git" "$base/bin/docker"
printf '%s\n' "$alvo" > "$base/target"
printf '%s\n' "$anterior" > "$base/previous"

reiniciar() {
  rm -f "$estado/last-successful" "$base/dirty" "$base/trace"
  printf '%s\n' "$alvo" > "$base/remote"
  printf '%s\n' "$anterior" > "$base/head"
  printf '%s\n' main > "$base/branch"
  printf '%s\n' normal > "$base/mode"
}

falha_esperada() {
  descricao=$1
  mensagem=$2
  if sh "$base/script.sh" "$alvo" > "$base/saida" 2>&1; then
    echo "FALHA: $descricao deveria ser rejeitado." >&2
    exit 1
  fi
  if ! grep -F "$mensagem" "$base/saida" >/dev/null; then
    echo "FALHA: mensagem inesperada em $descricao." >&2
    cat "$base/saida" >&2
    exit 1
  fi
}

reiniciar
printf '%s\n' "$anterior" > "$base/remote"
falha_esperada "SHA desatualizado" "SHA solicitado difere"
[ "$(cat "$base/head")" = "$anterior" ]
echo "OK 1/6: SHA desatualizado rejeitado."

reiniciar
touch "$base/dirty"
falha_esperada "diretorio alterado" "alteracoes locais"
[ "$(cat "$base/head")" = "$anterior" ]
echo "OK 2/6: alteracoes locais protegidas."

reiniciar
sh "$base/script.sh" "$alvo" > "$base/saida" 2>&1 || {
  cat "$base/saida" >&2
  exit 1
}
[ "$(cat "$estado/last-successful")" = "$alvo" ]
[ "$(cat "$base/head")" = "$alvo" ]
echo "OK 3/6: publicacao simulada concluida."

reiniciar
printf '%s\n' "$anterior" > "$estado/last-successful"
echo fail-target > "$base/mode"
falha_esperada "deploy com rollback" "ultima versao conhecida foi restaurada"
[ "$(cat "$base/head")" = "$anterior" ]
[ "$(cat "$estado/last-successful")" = "$anterior" ]
[ "$(grep -c '^up ' "$base/trace")" -eq 2 ]
echo "OK 4/6: ultima versao restaurada apos falha."

reiniciar
echo fail-target > "$base/mode"
falha_esperada "primeiro deploy" "Primeiro deploy falhou"
[ "$(cat "$base/head")" = "$anterior" ]
[ "$(cat "$base/branch")" = main ]
[ ! -f "$estado/last-successful" ]
echo "OK 5/6: checkout anterior restaurado no primeiro deploy."

reiniciar
printf '%s\n' "$anterior" > "$estado/last-successful"
echo fail-all > "$base/mode"
falha_esperada "recuperacao malsucedida" "Deploy e recuperacao falharam"
[ "$(cat "$base/head")" = "$anterior" ]
echo "OK 6/6: falha dupla identificada."

echo "RESULTADO: 6 cenarios simulados aprovados."
