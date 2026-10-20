FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# Imagem especifica para executar migracoes Prisma.
# Nao e iniciada automaticamente pela API.
FROM dependencies AS migration
COPY prisma ./prisma
COPY prisma.config.ts ./
USER node
CMD ["./node_modules/.bin/prisma", "migrate", "deploy"]

# O build da aplicacao compartilha dependencias,
# mas remove as de desenvolvimento na imagem final.
FROM dependencies AS build
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src
RUN npm run build
RUN npm prune --omit=dev && rm -rf node_modules/prisma node_modules/.bin/prisma

FROM node:24-bookworm-slim AS production
ENV NODE_ENV=production
ENV PORT=3001
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3001
CMD ["node", "dist/main.js"]
