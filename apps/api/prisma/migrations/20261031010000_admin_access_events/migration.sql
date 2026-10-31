-- Historico interno de alteracoes de acessos administrativos.
-- Nenhuma senha, token, e-mail ou dado de sessao e armazenado.

CREATE TYPE "AdminAccessEventType" AS ENUM (
    'ROLE_CHANGED',
    'ACTIVATED',
    'DEACTIVATED'
);

CREATE TABLE "AdminAccessEvent" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "targetUserId" UUID NOT NULL,
    "eventType" "AdminAccessEventType" NOT NULL,
    "previousRole" "UserRole",
    "newRole" "UserRole",
    "previousIsActive" BOOLEAN,
    "newIsActive" BOOLEAN,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAccessEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminAccessEvent_targetUserId_createdAt_idx"
    ON "AdminAccessEvent"("targetUserId", "createdAt");

CREATE INDEX "AdminAccessEvent_actorId_createdAt_idx"
    ON "AdminAccessEvent"("actorId", "createdAt");

ALTER TABLE "AdminAccessEvent"
ADD CONSTRAINT "AdminAccessEvent_actorId_fkey"
FOREIGN KEY ("actorId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "AdminAccessEvent"
ADD CONSTRAINT "AdminAccessEvent_targetUserId_fkey"
FOREIGN KEY ("targetUserId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
