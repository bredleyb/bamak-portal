-- Teste de integridade do dominio Bamak.
-- Executar exclusivamente em banco isolado com a migracao inicial aplicada.
-- Os dados ficticios sao revertidos ao final.

BEGIN;
SET LOCAL statement_timeout = '15s';
SET LOCAL lock_timeout = '3s';

DO $tests$
DECLARE
  received_constraint text;
BEGIN
  INSERT INTO "User"
    ("id", "name", "email", "passwordHash", "updatedAt")
  VALUES
    ('00000000-0000-4000-8000-000000000001',
     'Usuario Ficticio', 'issue95@example.invalid',
     'hash-ficticio-sem-uso-para-autenticacao', now());

  INSERT INTO "AttendanceStatus"
    ("id", "code", "name", "updatedAt")
  VALUES
    ('00000000-0000-4000-8000-000000000002',
     'ISSUE95_TEST', 'Estado ficticio', now());

  INSERT INTO "Attendance"
    ("id", "type", "statusId", "updatedAt")
  VALUES
    ('00000000-0000-4000-8000-000000000003',
     'CABLEWAY_REQUEST',
     '00000000-0000-4000-8000-000000000002',
     now());

  INSERT INTO "CablewayRequest"
    ("id", "attendanceId", "contactName", "contactInfo",
     "installationContext", "locationDescription",
     "consentRecordedAt", "consentTextVersion")
  VALUES
    ('00000000-0000-4000-8000-000000000004',
     '00000000-0000-4000-8000-000000000003',
     'Contato Ficticio', 'contato@example.invalid',
     'Simulacao de solicitacao',
     'Localizacao exclusivamente ficticia', now(), 'teste-v1');

  UPDATE "CablewayRequest"
  SET "latitude" = -26.490000, "longitude" = -49.120000
  WHERE "id" = '00000000-0000-4000-8000-000000000004';

  RAISE NOTICE 'OK: persistencia valida de Cabo Aereo';

  BEGIN
    UPDATE "CablewayRequest"
    SET "latitude" = 90.000001
    WHERE "id" = '00000000-0000-4000-8000-000000000004';
    RAISE EXCEPTION 'Latitude invalida foi aceita';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'CablewayRequest_latitude_range_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  BEGIN
    UPDATE "CablewayRequest"
    SET "longitude" = -180.000001
    WHERE "id" = '00000000-0000-4000-8000-000000000004';
    RAISE EXCEPTION 'Longitude invalida foi aceita';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'CablewayRequest_longitude_range_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  BEGIN
    UPDATE "CablewayRequest"
    SET "latitude" = NULL
    WHERE "id" = '00000000-0000-4000-8000-000000000004';
    RAISE EXCEPTION 'Par incompleto de coordenadas foi aceito';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'CablewayRequest_coordinates_pair_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: limites e paridade das coordenadas';

  INSERT INTO "Attachment"
    ("id", "cablewayRequestId", "originalName",
     "mimeType", "sizeBytes", "storageKey")
  VALUES
    ('00000000-0000-4000-8000-000000000005',
     '00000000-0000-4000-8000-000000000004',
     'imagem-ficticia.jpg', 'image/jpeg', 1024,
     'issue95/teste/imagem-ficticia');

  BEGIN
    UPDATE "Attachment"
    SET "sizeBytes" = 0
    WHERE "id" = '00000000-0000-4000-8000-000000000005';
    RAISE EXCEPTION 'Anexo vazio foi aceito';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'Attachment_size_range_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  BEGIN
    UPDATE "Attachment"
    SET "sizeBytes" = 10000001
    WHERE "id" = '00000000-0000-4000-8000-000000000005';
    RAISE EXCEPTION 'Anexo maior que 10 MB foi aceito';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'Attachment_size_range_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  BEGIN
    UPDATE "Attachment"
    SET "mimeType" = 'application/pdf'
    WHERE "id" = '00000000-0000-4000-8000-000000000005';
    RAISE EXCEPTION 'Formato de anexo invalido foi aceito';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'Attachment_mime_type_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  -- Exatamente 10 MB decimais deve ser aceito.
  UPDATE "Attachment"
  SET "sizeBytes" = 10000000
  WHERE "id" = '00000000-0000-4000-8000-000000000005';

  IF NOT EXISTS (
    SELECT 1 FROM "Attachment"
    WHERE "id" = '00000000-0000-4000-8000-000000000005'
      AND "sizeBytes" = 10000000
  ) THEN
    RAISE EXCEPTION 'Anexo de exatamente 10 MB foi rejeitado';
  END IF;

  RAISE NOTICE 'OK: fronteira decimal de 10 MB';

  RAISE NOTICE 'OK: tamanho e tipo dos anexos';

  INSERT INTO "GeneratedDocument"
    ("id", "cablewayRequestId", "version",
     "fileName", "storageKey", "generatedById")
  VALUES
    ('00000000-0000-4000-8000-000000000006',
     '00000000-0000-4000-8000-000000000004',
     1, 'documento-ficticio.pdf',
     'issue95/teste/documento-ficticio',
     '00000000-0000-4000-8000-000000000001');

  BEGIN
    UPDATE "GeneratedDocument"
    SET "version" = 0
    WHERE "id" = '00000000-0000-4000-8000-000000000006';
    RAISE EXCEPTION 'Versao de documento invalida foi aceita';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'GeneratedDocument_version_positive_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: versao dos documentos';

  INSERT INTO "CommunicationPost"
    ("id", "type", "title", "slug", "content",
     "authorId", "updatedAt")
  VALUES
    ('00000000-0000-4000-8000-000000000007',
     'NEWS', 'Publicacao ficticia',
     'issue95-publicacao-ficticia', 'Conteudo ficticio',
     '00000000-0000-4000-8000-000000000001', now());

  BEGIN
    UPDATE "CommunicationPost"
    SET "status" = 'PUBLISHED'
    WHERE "id" = '00000000-0000-4000-8000-000000000007';
    RAISE EXCEPTION 'Publicacao sem data foi aceita';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'CommunicationPost_published_at_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: data obrigatoria para publicacao';

  BEGIN
    INSERT INTO "AttendanceStatus"
      ("id", "code", "name", "updatedAt")
    VALUES
      ('00000000-0000-4000-8000-000000000008',
       'ISSUE95_TEST', 'Duplicado ficticio', now());
    RAISE EXCEPTION 'Codigo duplicado foi aceito';
  EXCEPTION WHEN unique_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'AttendanceStatus_code_key' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: unicidade dos estados';

  BEGIN
    INSERT INTO "Attachment"
      ("id", "cablewayRequestId", "originalName",
       "mimeType", "sizeBytes", "storageKey")
    VALUES
      ('00000000-0000-4000-8000-000000000009',
       '00000000-0000-4000-8000-999999999999',
       'orfao.jpg', 'image/jpeg', 100,
       'issue95/teste/anexo-orfao');
    RAISE EXCEPTION 'Anexo sem solicitacao foi aceito';
  EXCEPTION WHEN foreign_key_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;
    IF received_constraint <> 'Attachment_cablewayRequestId_fkey' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: integridade referencial dos anexos';
  -- Um atendimento do tipo Contato Geral aceita seu formulario.
  INSERT INTO "Attendance"
    ("id", "type", "statusId", "updatedAt")
  VALUES
    ('00000000-0000-4000-8000-000000000010',
     'GENERAL_CONTACT',
     '00000000-0000-4000-8000-000000000002',
     now());

  INSERT INTO "GeneralContact"
    ("id", "attendanceId", "name", "contactInfo",
     "subject", "message",
     "consentRecordedAt", "consentTextVersion")
  VALUES
    (gen_random_uuid(),
     '00000000-0000-4000-8000-000000000010',
     'Contato Ficticio',
     'contato-geral@example.invalid',
     'Assunto ficticio',
     'Mensagem exclusivamente ficticia',
     now(), 'teste-v1');

  RAISE NOTICE 'OK: formulario compativel com Contato Geral';

  -- Um contato geral nao pode pertencer a um Cabo Aereo.
  BEGIN
    INSERT INTO "GeneralContact"
      ("id", "attendanceId", "name", "contactInfo",
       "subject", "message",
       "consentRecordedAt", "consentTextVersion")
    VALUES
      (gen_random_uuid(),
       '00000000-0000-4000-8000-000000000003',
       'Contato Invalido',
       'invalido@example.invalid',
       'Assunto ficticio',
       'Mensagem ficticia',
       now(), 'teste-v1');

    RAISE EXCEPTION 'Contato com tipo incompatível foi aceito';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;

    IF received_constraint <> 'GeneralContact_attendance_type_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: tipo de Contato Geral protegido';

  -- Um Cabo Aereo nao pode pertencer a um Contato Geral.
  BEGIN
    INSERT INTO "CablewayRequest"
      ("id", "attendanceId", "contactName", "contactInfo",
       "installationContext", "locationDescription",
       "consentRecordedAt", "consentTextVersion")
    VALUES
      (gen_random_uuid(),
       '00000000-0000-4000-8000-000000000010',
       'Contato Invalido',
       'invalido@example.invalid',
       'Instalacao ficticia',
       'Localizacao ficticia',
       now(), 'teste-v1');

    RAISE EXCEPTION 'Cabo Aereo com tipo incompatível foi aceito';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;

    IF received_constraint <> 'CablewayRequest_attendance_type_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: tipo de Cabo Aereo protegido';

  -- O tipo do atendimento e imutavel depois de registrado.
  BEGIN
    UPDATE "Attendance"
    SET "type" = 'GENERAL_CONTACT'
    WHERE "id" = '00000000-0000-4000-8000-000000000003';

    RAISE EXCEPTION 'Alteracao do tipo de atendimento foi aceita';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;

    IF received_constraint <> 'Attendance_type_immutable_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: tipo de atendimento imutavel';

  -- Ja existe um anexo valido nesta solicitacao.
  -- Inserir outros quatro deve atingir exatamente o limite.
  FOR attachment_number IN 2..5 LOOP
    INSERT INTO "Attachment"
      ("id", "cablewayRequestId", "originalName",
       "mimeType", "sizeBytes", "storageKey")
    VALUES
      (gen_random_uuid(),
       '00000000-0000-4000-8000-000000000004',
       'imagem-ficticia.png',
       'image/png',
       1024,
       'issue95/teste/limite-' || attachment_number);
  END LOOP;

  IF (
    SELECT COUNT(*)
    FROM "Attachment"
    WHERE "cablewayRequestId" =
      '00000000-0000-4000-8000-000000000004'
  ) <> 5 THEN
    RAISE EXCEPTION 'Cinco anexos validos nao foram persistidos';
  END IF;

  -- A sexta imagem deve ser bloqueada no banco.
  BEGIN
    INSERT INTO "Attachment"
      ("id", "cablewayRequestId", "originalName",
       "mimeType", "sizeBytes", "storageKey")
    VALUES
      (gen_random_uuid(),
       '00000000-0000-4000-8000-000000000004',
       'sexta-imagem.png',
       'image/png',
       1024,
       'issue95/teste/sexta-imagem');

    RAISE EXCEPTION 'Sexto anexo foi aceito';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS received_constraint = CONSTRAINT_NAME;

    IF received_constraint <> 'Attachment_count_limit_check' THEN
      RAISE EXCEPTION 'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  IF (
    SELECT COUNT(*)
    FROM "Attachment"
    WHERE "cablewayRequestId" =
      '00000000-0000-4000-8000-000000000004'
  ) <> 5 THEN
    RAISE EXCEPTION 'Quantidade de anexos alterada apos bloqueio';
  END IF;

  RAISE NOTICE 'OK: limite de cinco anexos';

  -- Teste 1: Contato Geral sem formulario deve falhar
  -- quando as restricoes diferidas forem verificadas.

  BEGIN
    INSERT INTO "Attendance"
      ("id", "type", "statusId", "updatedAt")
    VALUES
      ('00000000-0000-4000-8000-000000000020',
       'GENERAL_CONTACT',
       '00000000-0000-4000-8000-000000000002',
       now());

    SET CONSTRAINTS ALL IMMEDIATE;

    RAISE EXCEPTION 'Contato Geral incompleto foi aceito';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS
      received_constraint = CONSTRAINT_NAME;

    IF received_constraint <> 'Attendance_required_form_check' THEN
      RAISE EXCEPTION
        'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: Contato Geral exige formulario';

  -- Teste 2: Cabo Aereo sem formulario tambem deve falhar.

  BEGIN
    INSERT INTO "Attendance"
      ("id", "type", "statusId", "updatedAt")
    VALUES
      ('00000000-0000-4000-8000-000000000021',
       'CABLEWAY_REQUEST',
       '00000000-0000-4000-8000-000000000002',
       now());

    SET CONSTRAINTS ALL IMMEDIATE;

    RAISE EXCEPTION 'Cabo Aereo incompleto foi aceito';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS
      received_constraint = CONSTRAINT_NAME;

    IF received_constraint <> 'Attendance_required_form_check' THEN
      RAISE EXCEPTION
        'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  RAISE NOTICE 'OK: Cabo Aereo exige formulario';

  -- Teste 3: excluir o formulario de um atendimento
  -- existente nao pode deixar o registro incompleto.
  --
  -- O contato geral valido de ID ...0010 foi criado
  -- anteriormente neste mesmo teste SQL.

  BEGIN
    DELETE FROM "GeneralContact"
    WHERE "attendanceId" =
      '00000000-0000-4000-8000-000000000010';

    IF FOUND IS FALSE THEN
      RAISE EXCEPTION
        'Formulario necessario ao teste nao encontrado';
    END IF;

    SET CONSTRAINTS ALL IMMEDIATE;

    RAISE EXCEPTION 'Exclusao do formulario foi aceita';
  EXCEPTION WHEN check_violation THEN
    GET STACKED DIAGNOSTICS
      received_constraint = CONSTRAINT_NAME;

    IF received_constraint <> 'Attendance_required_form_check' THEN
      RAISE EXCEPTION
        'Restricao inesperada: %', received_constraint;
    END IF;
  END;

  -- A tentativa rejeitada nao pode remover o formulario.
  IF NOT EXISTS (
    SELECT 1
    FROM "GeneralContact"
    WHERE "attendanceId" =
      '00000000-0000-4000-8000-000000000010'
  ) THEN
    RAISE EXCEPTION
      'Formulario desapareceu apos a exclusao rejeitada';
  END IF;

  -- As duas insercoes incompletas tambem devem
  -- ter sido revertidas pelos respectivos subblocos.
  IF EXISTS (
    SELECT 1
    FROM "Attendance"
    WHERE "id" IN (
      '00000000-0000-4000-8000-000000000020',
      '00000000-0000-4000-8000-000000000021'
    )
  ) THEN
    RAISE EXCEPTION
      'Atendimento incompleto permaneceu na transacao';
  END IF;

  RAISE NOTICE 'OK: exclusao indevida de formulario bloqueada';
  RAISE NOTICE 'OK: formulario obrigatorio ao fechar transacao';

  RAISE NOTICE 'Todos os testes de integridade passaram';
END
$tests$;

ROLLBACK;

DO $verify$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "User"
    WHERE "email" = 'issue95@example.invalid'
  ) OR EXISTS (
    SELECT 1 FROM "AttendanceStatus"
    WHERE "code" = 'ISSUE95_TEST'
  ) THEN
    RAISE EXCEPTION 'Dados ficticios permaneceram apos o rollback';
  END IF;

  RAISE NOTICE 'OK: rollback confirmado; nenhum dado de teste persistido';
END
$verify$;
