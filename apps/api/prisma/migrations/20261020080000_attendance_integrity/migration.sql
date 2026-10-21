-- Integridade complementar dos atendimentos.
-- O PostgreSQL impede inconsistencias independentemente da API.

CREATE FUNCTION bamak_assert_attendance_type()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    parent_type "AttendanceType";
BEGIN
    SELECT "type" INTO parent_type
    FROM "Attendance"
    WHERE "id" = NEW."attendanceId"
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    IF TG_TABLE_NAME = 'GeneralContact'
       AND parent_type <> 'GENERAL_CONTACT'::"AttendanceType" THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            CONSTRAINT = 'GeneralContact_attendance_type_check',
            MESSAGE = 'Tipo de atendimento incompativel com contato geral';
    END IF;

    IF TG_TABLE_NAME = 'CablewayRequest'
       AND parent_type <> 'CABLEWAY_REQUEST'::"AttendanceType" THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            CONSTRAINT = 'CablewayRequest_attendance_type_check',
            MESSAGE = 'Tipo de atendimento incompativel com Cabo Aereo';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER bamak_general_contact_type
BEFORE INSERT OR UPDATE ON "GeneralContact"
FOR EACH ROW
EXECUTE FUNCTION bamak_assert_attendance_type();

CREATE TRIGGER bamak_cableway_request_type
BEFORE INSERT OR UPDATE ON "CablewayRequest"
FOR EACH ROW
EXECUTE FUNCTION bamak_assert_attendance_type();

-- O tipo de atendimento representa sua origem e nao pode mudar.

CREATE FUNCTION bamak_prevent_attendance_type_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW."type" IS DISTINCT FROM OLD."type" THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            CONSTRAINT = 'Attendance_type_immutable_check',
            MESSAGE = 'O tipo de atendimento nao pode ser alterado';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER bamak_attendance_type_immutable
BEFORE UPDATE OF "type" ON "Attendance"
FOR EACH ROW
EXECUTE FUNCTION bamak_prevent_attendance_type_change();

-- Serializar inclusoes de anexos por solicitacao evita que
-- uploads concorrentes ultrapassem o limite de cinco imagens.

CREATE FUNCTION bamak_limit_cableway_attachments()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    existing_count integer;
BEGIN
    PERFORM 1
    FROM "CablewayRequest"
    WHERE "id" = NEW."cablewayRequestId"
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    SELECT COUNT(*) INTO existing_count
    FROM "Attachment"
    WHERE "cablewayRequestId" = NEW."cablewayRequestId"
      AND "id" <> NEW."id";

    IF existing_count >= 5 THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            CONSTRAINT = 'Attachment_count_limit_check',
            MESSAGE = 'Limite de cinco imagens por solicitacao excedido';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER bamak_attachment_count_limit
BEFORE INSERT OR UPDATE OF "cablewayRequestId" ON "Attachment"
FOR EACH ROW
EXECUTE FUNCTION bamak_limit_cableway_attachments();
