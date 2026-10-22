-- Contadores persistentes para limitar tentativas de login.
-- A chave e um digest SHA-256, sem armazenamento do IP original.

CREATE TABLE "LoginAttemptBucket" (
    "key" CHAR(64) NOT NULL,
    "windowStart" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttemptBucket_pkey" PRIMARY KEY ("key"),
    CONSTRAINT "LoginAttemptBucket_attempts_check"
        CHECK ("attempts" >= 0)
);

CREATE INDEX "LoginAttemptBucket_updatedAt_idx"
    ON "LoginAttemptBucket"("updatedAt");