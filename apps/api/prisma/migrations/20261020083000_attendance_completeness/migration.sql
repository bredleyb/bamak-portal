-- Exige formulario compativel ao finalizar a transacao.
-- A validacao e diferida para permitir nested writes do Prisma.

CREATE FUNCTION bamak_assert_complete_attendance(
    p_attendance_id uuid
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    parent_type "AttendanceType";
    general_count integer;
    cableway_count integer;
BEGIN
    SELECT "type" INTO parent_type
    FROM "Attendance"
    WHERE "id" = p_attendance_id;

    -- Excluir um atendimento completo continua permitido.
    IF NOT FOUND THEN
        RETURN;
    END IF;

    SELECT COUNT(*) INTO general_count
    FROM "GeneralContact"
    WHERE "attendanceId" = p_attendance_id;

    SELECT COUNT(*) INTO cableway_count
    FROM "CablewayRequest"
    WHERE "attendanceId" = p_attendance_id;

    IF (
        parent_type = 'GENERAL_CONTACT'::"AttendanceType"
        AND (general_count <> 1 OR cableway_count <> 0)
    ) OR (
        parent_type = 'CABLEWAY_REQUEST'::"AttendanceType"
        AND (cableway_count <> 1 OR general_count <> 0)
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = '23514',
            CONSTRAINT = 'Attendance_required_form_check',
            MESSAGE = 'Atendimento exige um formulario compativel';
    END IF;
END;
$$;

CREATE FUNCTION bamak_check_attendance_completeness()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_TABLE_NAME = 'Attendance' THEN
        PERFORM bamak_assert_complete_attendance(NEW."id");

    ELSIF TG_OP = 'INSERT' THEN
        PERFORM bamak_assert_complete_attendance(
            NEW."attendanceId"
        );

    ELSIF TG_OP = 'DELETE' THEN
        PERFORM bamak_assert_complete_attendance(
            OLD."attendanceId"
        );

    ELSE
        PERFORM bamak_assert_complete_attendance(
            OLD."attendanceId"
        );

        IF NEW."attendanceId" IS DISTINCT
           FROM OLD."attendanceId" THEN
            PERFORM bamak_assert_complete_attendance(
                NEW."attendanceId"
            );
        END IF;
    END IF;

    RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER bamak_attendance_requires_form
AFTER INSERT ON "Attendance"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION bamak_check_attendance_completeness();

CREATE CONSTRAINT TRIGGER bamak_general_contact_preserves_parent
AFTER INSERT OR UPDATE OR DELETE ON "GeneralContact"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION bamak_check_attendance_completeness();

CREATE CONSTRAINT TRIGGER bamak_cableway_preserves_parent
AFTER INSERT OR UPDATE OR DELETE ON "CablewayRequest"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION bamak_check_attendance_completeness();
