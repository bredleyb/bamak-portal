#!/bin/sh
set -eu

negar() {
  echo "Comando SSH nao autorizado." >&2
  exit 64
}

requisicao=${SSH_ORIGINAL_COMMAND:-}

case "$requisicao" in
  "deploy "*) sha=${requisicao#deploy } ;;
  *) negar ;;
esac

case "$sha" in
  ''|*[!0-9a-f]*) negar ;;
esac

[ "${#sha}" -eq 40 ] || negar

exec sudo -n /usr/local/sbin/bamak-deploy "$sha"
