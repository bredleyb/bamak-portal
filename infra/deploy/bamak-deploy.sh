#!/bin/sh
set -eu
umask 077
PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH

falhar() {
  echo "ERRO: $*" >&2
  exit 1
}

[ "$(id -u)" -eq 0 ] || falhar "Execucao administrativa necessaria."
[ "$#" -eq 1 ] || falhar "Informe exatamente um SHA."

sha=$1
case "$sha" in
  ''|*[!0-9a-f]*) falhar "SHA invalido." ;;
esac
[ "${#sha}" -eq 40 ] || falhar "SHA deve ter 40 caracteres."

repositorio=/opt/bamak-portal
estado=/var/lib/bamak-deploy
compose="$repositorio/compose.production.yaml"
ambiente="$repositorio/.env.production"

[ -d "$repositorio/.git" ] || falhar "Repositorio ausente."
[ -f "$ambiente" ] || falhar "Arquivo de ambiente ausente."

instalar_estado() {
  install -d -m 700 -o root -g root "$estado"
}

git_projeto() {
  git -C "$repositorio" "$@"
}

publicar() {
  docker compose --env-file "$ambiente" -f "$compose" config --quiet &&
  docker compose --env-file "$ambiente" -f "$compose" up -d --build --wait --wait-timeout 180 db api web proxy
}

instalar_estado
exec 9>"$estado/deploy.lock"
flock -n 9 || falhar "Outro deploy esta em andamento."

git_projeto fetch --no-tags origin main
atual=$(git_projeto rev-parse FETCH_HEAD)
[ "$atual" = "$sha" ] || falhar "SHA solicitado difere da main remota."

[ -z "$(git_projeto status --porcelain --untracked-files=all)" ] ||
  falhar "Repositorio possui alteracoes locais."

anterior=$(git_projeto rev-parse HEAD)
ramo_anterior=$(git_projeto symbolic-ref --quiet --short HEAD || true)

ultimo_sucesso=
if [ -f "$estado/last-successful" ]; then
  ultimo_sucesso=$(cat "$estado/last-successful")
  case "$ultimo_sucesso" in
    ''|*[!0-9a-f]*) falhar "Registro de ultimo deploy invalido." ;;
  esac
  [ "${#ultimo_sucesso}" -eq 40 ] ||
    falhar "Registro de ultimo deploy incompleto."
fi

# Comparar com a ultima versao efetivamente publicada.
# Isso evita ignorar migracoes apos uma tentativa malsucedida.
base_migracoes=$anterior
[ -z "$ultimo_sucesso" ] || base_migracoes=$ultimo_sucesso

migracoes_alteradas=$(
  git_projeto diff --name-only \
    "$base_migracoes" "$sha" -- apps/api/prisma/migrations
) || falhar "Nao foi possivel comparar as migracoes."

migracoes=0
[ -z "$migracoes_alteradas" ] || migracoes=1

echo "Iniciando deploy do commit $sha"
git_projeto checkout --detach "$sha"

if [ "$migracoes" -eq 1 ]; then
  preparacao="$repositorio/infra/deploy/prepare-domain-migrations.sh"

  if [ ! -f "$preparacao" ] || [ -L "$preparacao" ]; then
    git_projeto checkout --detach "$anterior" ||
      falhar "Preparacao ausente e checkout anterior nao restaurado."
    falhar "Preparacao de migracoes ausente ou insegura."
  fi

  echo "Migracoes alteradas; exigindo backup e migrador."

  if ! sh "$preparacao"; then
    echo "AVISO: a preparacao pode ter alterado o esquema do banco." >&2

    git_projeto checkout --detach "$anterior" ||
      falhar "Preparacao falhou e checkout anterior nao restaurado."

    falhar "Preparacao das migracoes falhou; publicacao bloqueada."
  fi
fi

if publicar; then
  temporario="$estado/last-successful.$$"
  printf '%s\n' "$sha" > "$temporario"
  mv "$temporario" "$estado/last-successful"
  echo "Deploy confirmado: $sha"
  exit 0
fi

echo "ERRO: publicacao falhou." >&2

if [ "$migracoes" -eq 1 ]; then
  falhar "Publicacao falhou apos migracoes; rollback automatico bloqueado. Intervencao necessaria."
fi

if [ -n "$ultimo_sucesso" ] && [ "$ultimo_sucesso" != "$sha" ]; then
  echo "Tentando recuperar o commit $ultimo_sucesso" >&2
  git_projeto checkout --detach "$ultimo_sucesso" ||
    falhar "Nao foi possivel restaurar o checkout anterior."

  if publicar; then
    falhar "Deploy falhou; ultima versao conhecida foi restaurada."
  fi

  falhar "Deploy e recuperacao falharam. Intervencao necessaria."
fi

echo "Nao existe versao anterior confirmada para rollback." >&2

if [ -n "$ramo_anterior" ]; then
  git_projeto checkout "$ramo_anterior" ||
    falhar "Nao foi possivel restaurar o ramo anterior."
else
  git_projeto checkout --detach "$anterior" ||
    falhar "Nao foi possivel restaurar o commit anterior."
fi

falhar "Primeiro deploy falhou; checkout anterior restaurado."
