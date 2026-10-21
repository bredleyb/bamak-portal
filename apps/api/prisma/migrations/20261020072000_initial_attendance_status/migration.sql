-- Estado operacional inicial dos atendimentos.
-- A lista completa permanece configuravel.
-- Nenhum usuario ou dado pessoal e criado.

INSERT INTO "AttendanceStatus" (
    "id",
    "code",
    "name",
    "sortOrder",
    "isActive",
    "createdAt",
    "updatedAt"
)
VALUES (
    gen_random_uuid(),
    'RECEIVED',
    'Recebido',
    0,
    TRUE,
    NOW(),
    NOW()
);
