-- Integridade das sessoes administrativas.
-- Executar exclusivamente no banco descartavel bamak_sessions_test.
-- Todos os dados utilizados sao ficticios.

BEGIN;

SET LOCAL statement_timeout = '15s';
SET LOCAL lock_timeout = '3s';

DO $tests$
DECLARE
  test_user uuid := '00000000-0000-4000-8000-000000000096';
  test_session uuid := '00000000-0000-4000-8000-000000000097';
  received_constraint text;
BEGIN
  IF current_database() <> 'bamak_sessions_test' THEN
    RAISE EXCEPTION 'Banco nao autorizado para testes';
  END IF;

  IF to_regclass('public."Session"') IS NULL THEN
    RAISE EXCEPTION 'Tabela Session ausente';
  END IF;

  IF to_regclass('public."Session_tokenHash_key"') IS NULL
    OR to_regclass('public."Session_userId_expiresAt_idx"') IS NULL
    OR to_regclass('public."Session_expiresAt_idx"') IS NULL
  THEN
    RAISE EXCEPTION 'Indices obrigatorios ausentes';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = '"Session"'::regclass
      AND conname = 'Session_userId_fkey'
      AND confdeltype = 'c'
  ) THEN
    RAISE EXCEPTION 'Chave estrangeira CASCADE ausente';
  END IF;

  RAISE NOTICE 'OK: tabela, indices e chave estrangeira';

  INSERT INTO "User"
    ("id", "name", "email", "passwordHash", "updatedAt")
  VALUES
    (test_user, 'Usuario Ficticio',
     'session-test@example.invalid',
     'hash-ficticio-sem-validade', now());

  INSERT INTO "Session"
    ("id", "userId", "tokenHash", "expiresAt")
  VALUES
    (test_session, test_user, repeat('a', 64),
     now() + interval '12 hours');

  IF NOT EXISTS (
    SELECT 1
    FROM "Session"
    WHERE "id" = test_session
      AND "userId" = test_user
      AND "revokedAt" IS NULL
      AND "expiresAt" > now()
  ) THEN
    RAISE EXCEPTION 'Persistencia da sessao falhou';
  END IF;

  RAISE NOTICE 'OK: persistencia e validade da sessao';

  BEGIN
    INSERT INTO "Session"
      ("id", "userId", "tokenHash", "expiresAt")
    VALUES
      ('00000000-0000-4000-8000-000000000098',
       test_user, repeat('a', 64),
       now() + interval '12 hours');

    RAISE EXCEPTION 'Hash duplicado foi aceito';

  EXCEPTION WHEN unique_violation THEN
    GET STACKED DIAGNOSTICS
      received_constraint = CONSTRAINT_NAME;

    IF received_constraint <> 'Session_tokenHash_key' THEN
      RAISE EXCEPTION 'Restricao inesperada: %',
        received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: unicidade dos hashes';

  BEGIN
    INSERT INTO "Session"
      ("id", "userId", "tokenHash", "expiresAt")
    VALUES
      ('00000000-0000-4000-8000-000000000099',
       '00000000-0000-4000-8000-999999999999',
       repeat('b', 64),
       now() + interval '12 hours');

    RAISE EXCEPTION 'Sessao sem usuario foi aceita';

  EXCEPTION WHEN foreign_key_violation THEN
    GET STACKED DIAGNOSTICS
      received_constraint = CONSTRAINT_NAME;

    IF received_constraint <> 'Session_userId_fkey' THEN
      RAISE EXCEPTION 'Restricao inesperada: %',
        received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: integridade referencial';

  UPDATE "Session"
  SET "revokedAt" = now()
  WHERE "id" = test_session;

  IF NOT EXISTS (
    SELECT 1
    FROM "Session"
    WHERE "id" = test_session
      AND "revokedAt" IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Registro de revogacao falhou';
  END IF;

  RAISE NOTICE 'OK: registro de revogacao';

  DELETE FROM "User"
  WHERE "id" = test_user;

  IF EXISTS (
    SELECT 1
    FROM "Session"
    WHERE "id" = test_session
  ) THEN
    RAISE EXCEPTION 'Exclusao em cascata falhou';
  END IF;

  RAISE NOTICE 'OK: exclusao em cascata';
  RAISE NOTICE 'INTEGRIDADE DAS SESSOES APROVADA';
END;
$tests$;

ROLLBACK;