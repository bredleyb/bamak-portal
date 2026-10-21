#!/bin/sh
set -eu

repo=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
cd "$repo"

contexto=$(mktemp -d)
imagem="bamak-migrator-permissions-ci:${GITHUB_SHA:-local}"

limpar() {
    docker image rm -f "$imagem" >/dev/null 2>&1 || true
    rm -rf "$contexto"
}

trap limpar EXIT
trap 'exit 1' HUP INT TERM

cp apps/api/Dockerfile "$contexto/Dockerfile"
cp apps/api/package.json "$contexto/package.json"
cp apps/api/package-lock.json "$contexto/package-lock.json"
cp apps/api/prisma.config.ts "$contexto/prisma.config.ts"
cp -R apps/api/prisma "$contexto/prisma"

# Reproduz as permissoes restritivas observadas na VPS.
chmod 600 \
    "$contexto/package.json" \
    "$contexto/package-lock.json" \
    "$contexto/prisma.config.ts"

chmod -R go-rwx "$contexto/prisma"

[ "$(stat -c %a "$contexto/package.json")" = 600 ]
[ "$(stat -c %a "$contexto/prisma/schema.prisma")" = 600 ]
[ "$(stat -c %a "$contexto/prisma/migrations")" = 700 ]

echo "Contexto restritivo reproduzido."

docker build \
    --target migration \
    --tag "$imagem" \
    "$contexto"

echo "Verificando leitura por usuario nao privilegiado."

docker run \
    --rm \
    --network none \
    --read-only \
    --cap-drop ALL \
    --security-opt no-new-privileges \
    --entrypoint node \
    "$imagem" \
    -e '
const fs = require("node:fs");

if (process.getuid() !== 1000) {
  throw new Error("Migrador nao esta executando como usuario node.");
}

const arquivos = [
  "/app/package.json",
  "/app/package-lock.json",
  "/app/prisma.config.ts",
  "/app/prisma/schema.prisma"
];

for (const arquivo of arquivos) {
  if (fs.statSync(arquivo).uid !== 1000) {
    throw new Error(`Proprietario incorreto: ${arquivo}`);
  }
  fs.readFileSync(arquivo);
  console.log(`OK: ${arquivo}`);
}

const pasta = "/app/prisma/migrations";

if (fs.statSync(pasta).uid !== 1000) {
  throw new Error("Proprietario incorreto nas migracoes.");
}

const nomes = fs.readdirSync(pasta)
  .filter(nome => /^\d{14}_/.test(nome));

if (nomes.length < 5) {
  throw new Error(`Esperadas ao menos cinco migracoes, encontradas ${nomes.length}.`);
}

for (const nome of nomes) {
  const arquivo = `${pasta}/${nome}/migration.sql`;

  if (fs.statSync(arquivo).uid !== 1000) {
    throw new Error(`Proprietario incorreto: ${arquivo}`);
  }

  fs.readFileSync(arquivo);
  console.log(`OK: ${nome}`);
}

console.log("Permissoes do migrador aprovadas.");
'

echo "Validando inicializacao do Prisma sem banco externo."

docker run \
    --rm \
    --network none \
    --cap-drop ALL \
    --security-opt no-new-privileges \
    --env "DATABASE_URL=postgresql://test:test@localhost:5432/test?schema=public" \
    "$imagem" \
    ./node_modules/.bin/prisma validate

echo "RESULTADO: imagem de migracao aprovada."
