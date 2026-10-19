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

origem=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

for arquivo in \
  backup-postgres.sh \
  bamak-postgres-backup.service \
  bamak-postgres-backup.timer
do
  [ -f "$origem/$arquivo" ] || falhar "Arquivo ausente: $arquivo"
  [ ! -L "$origem/$arquivo" ] || falhar "Link simbolico nao permitido: $arquivo"
done

install -d -m 700 -o root -g root /var/backups/bamak-portal
install -d -m 700 -o root -g root /var/backups/bamak-portal/postgres

install -m 750 -o root -g root \
  "$origem/backup-postgres.sh" \
  /usr/local/sbin/bamak-backup-postgres

install -m 644 -o root -g root \
  "$origem/bamak-postgres-backup.service" \
  /etc/systemd/system/bamak-postgres-backup.service

install -m 644 -o root -g root \
  "$origem/bamak-postgres-backup.timer" \
  /etc/systemd/system/bamak-postgres-backup.timer

systemctl daemon-reload

systemd-analyze verify \
  /etc/systemd/system/bamak-postgres-backup.service \
  /etc/systemd/system/bamak-postgres-backup.timer ||
  falhar "Validacao das unidades systemd falhou."

echo "Arquivos instalados e unidades verificadas."
echo "Agendamento nao ativado."
