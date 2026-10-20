-- Alinha o limite com 10 MB decimais do requisito.
-- A migracao anterior permanece imutavel.

ALTER TABLE "Attachment"
DROP CONSTRAINT "Attachment_size_range_check";

ALTER TABLE "Attachment"
ADD CONSTRAINT "Attachment_size_range_check"
CHECK ("sizeBytes" BETWEEN 1 AND 10000000);
