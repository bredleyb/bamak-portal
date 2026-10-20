-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMINISTRATOR', 'OPERATOR');

-- CreateEnum
CREATE TYPE "CommunicationType" AS ENUM ('NEWS', 'AGENDA', 'EVENT', 'FAIR', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('GENERAL_CONTACT', 'CABLEWAY_REQUEST');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "summary" VARCHAR(400) NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "summary" VARCHAR(400) NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "altText" VARCHAR(240) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" UUID NOT NULL,
    "question" VARCHAR(500) NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunicationPost" (
    "id" UUID NOT NULL,
    "type" "CommunicationType" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "summary" VARCHAR(500),
    "content" TEXT NOT NULL,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "eventStartsAt" TIMESTAMPTZ(3),
    "eventEndsAt" TIMESTAMPTZ(3),
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CommunicationPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceStatus" (
    "id" UUID NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AttendanceStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" UUID NOT NULL,
    "type" "AttendanceType" NOT NULL,
    "statusId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralContact" (
    "id" UUID NOT NULL,
    "attendanceId" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "contactInfo" VARCHAR(320) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "consentRecordedAt" TIMESTAMPTZ(3) NOT NULL,
    "consentTextVersion" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneralContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceStatusChange" (
    "id" UUID NOT NULL,
    "attendanceId" UUID NOT NULL,
    "fromStatusId" UUID,
    "toStatusId" UUID NOT NULL,
    "changedById" UUID NOT NULL,
    "changedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceStatusChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactNotificationAttempt" (
    "id" UUID NOT NULL,
    "generalContactId" UUID NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "recipientEmail" VARCHAR(320) NOT NULL,
    "attemptedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ(3),
    "errorCode" VARCHAR(100),

    CONSTRAINT "ContactNotificationAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CablewayRequest" (
    "id" UUID NOT NULL,
    "attendanceId" UUID NOT NULL,
    "contactName" VARCHAR(160) NOT NULL,
    "contactInfo" VARCHAR(320) NOT NULL,
    "installationContext" TEXT NOT NULL,
    "locationDescription" TEXT NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "consentRecordedAt" TIMESTAMPTZ(3) NOT NULL,
    "consentTextVersion" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CablewayRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" UUID NOT NULL,
    "cablewayRequestId" UUID NOT NULL,
    "originalName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(80) NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storageKey" VARCHAR(512) NOT NULL,
    "uploadedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedDocument" (
    "id" UUID NOT NULL,
    "cablewayRequestId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "storageKey" VARCHAR(512) NOT NULL,
    "generatedById" UUID NOT NULL,
    "generatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentDeliveryAttempt" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "sentById" UUID NOT NULL,
    "recipientEmail" VARCHAR(320) NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "attemptedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ(3),
    "errorCode" VARCHAR(100),

    CONSTRAINT "DocumentDeliveryAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationToProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ApplicationToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_isActive_idx" ON "User"("role", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Application_slug_key" ON "Application"("slug");

-- CreateIndex
CREATE INDEX "Application_isActive_idx" ON "Application"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_slug_key" ON "ProductCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_isActive_idx" ON "Product"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "FaqItem_isActive_sortOrder_idx" ON "FaqItem"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CommunicationPost_slug_key" ON "CommunicationPost"("slug");

-- CreateIndex
CREATE INDEX "CommunicationPost_status_publishedAt_idx" ON "CommunicationPost"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "CommunicationPost_type_status_idx" ON "CommunicationPost"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceStatus_code_key" ON "AttendanceStatus"("code");

-- CreateIndex
CREATE INDEX "AttendanceStatus_isActive_sortOrder_idx" ON "AttendanceStatus"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "Attendance_type_statusId_createdAt_idx" ON "Attendance"("type", "statusId", "createdAt");

-- CreateIndex
CREATE INDEX "Attendance_createdAt_idx" ON "Attendance"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralContact_attendanceId_key" ON "GeneralContact"("attendanceId");

-- CreateIndex
CREATE INDEX "AttendanceStatusChange_attendanceId_changedAt_idx" ON "AttendanceStatusChange"("attendanceId", "changedAt");

-- CreateIndex
CREATE INDEX "AttendanceStatusChange_changedById_idx" ON "AttendanceStatusChange"("changedById");

-- CreateIndex
CREATE INDEX "ContactNotificationAttempt_generalContactId_attemptedAt_idx" ON "ContactNotificationAttempt"("generalContactId", "attemptedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CablewayRequest_attendanceId_key" ON "CablewayRequest"("attendanceId");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_storageKey_key" ON "Attachment"("storageKey");

-- CreateIndex
CREATE INDEX "Attachment_cablewayRequestId_uploadedAt_idx" ON "Attachment"("cablewayRequestId", "uploadedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedDocument_storageKey_key" ON "GeneratedDocument"("storageKey");

-- CreateIndex
CREATE INDEX "GeneratedDocument_generatedById_idx" ON "GeneratedDocument"("generatedById");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedDocument_cablewayRequestId_version_key" ON "GeneratedDocument"("cablewayRequestId", "version");

-- CreateIndex
CREATE INDEX "DocumentDeliveryAttempt_documentId_attemptedAt_idx" ON "DocumentDeliveryAttempt"("documentId", "attemptedAt");

-- CreateIndex
CREATE INDEX "DocumentDeliveryAttempt_sentById_idx" ON "DocumentDeliveryAttempt"("sentById");

-- CreateIndex
CREATE INDEX "_ApplicationToProduct_B_index" ON "_ApplicationToProduct"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationPost" ADD CONSTRAINT "CommunicationPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "AttendanceStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralContact" ADD CONSTRAINT "GeneralContact_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceStatusChange" ADD CONSTRAINT "AttendanceStatusChange_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceStatusChange" ADD CONSTRAINT "AttendanceStatusChange_fromStatusId_fkey" FOREIGN KEY ("fromStatusId") REFERENCES "AttendanceStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceStatusChange" ADD CONSTRAINT "AttendanceStatusChange_toStatusId_fkey" FOREIGN KEY ("toStatusId") REFERENCES "AttendanceStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceStatusChange" ADD CONSTRAINT "AttendanceStatusChange_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactNotificationAttempt" ADD CONSTRAINT "ContactNotificationAttempt_generalContactId_fkey" FOREIGN KEY ("generalContactId") REFERENCES "GeneralContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CablewayRequest" ADD CONSTRAINT "CablewayRequest_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_cablewayRequestId_fkey" FOREIGN KEY ("cablewayRequestId") REFERENCES "CablewayRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedDocument" ADD CONSTRAINT "GeneratedDocument_cablewayRequestId_fkey" FOREIGN KEY ("cablewayRequestId") REFERENCES "CablewayRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedDocument" ADD CONSTRAINT "GeneratedDocument_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentDeliveryAttempt" ADD CONSTRAINT "DocumentDeliveryAttempt_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "GeneratedDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentDeliveryAttempt" ADD CONSTRAINT "DocumentDeliveryAttempt_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToProduct" ADD CONSTRAINT "_ApplicationToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToProduct" ADD CONSTRAINT "_ApplicationToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Additional domain integrity constraints.
-- These CHECK constraints are maintained in SQL migrations because
-- Prisma schema does not represent PostgreSQL CHECK constraints.

ALTER TABLE "CablewayRequest"
  ADD CONSTRAINT "CablewayRequest_latitude_range_check"
  CHECK ("latitude" IS NULL OR "latitude" BETWEEN -90 AND 90);

ALTER TABLE "CablewayRequest"
  ADD CONSTRAINT "CablewayRequest_longitude_range_check"
  CHECK ("longitude" IS NULL OR "longitude" BETWEEN -180 AND 180);

ALTER TABLE "CablewayRequest"
  ADD CONSTRAINT "CablewayRequest_coordinates_pair_check"
  CHECK (("latitude" IS NULL) = ("longitude" IS NULL));

ALTER TABLE "Attachment"
  ADD CONSTRAINT "Attachment_size_range_check"
  CHECK ("sizeBytes" BETWEEN 1 AND 10485760);

ALTER TABLE "Attachment"
  ADD CONSTRAINT "Attachment_mime_type_check"
  CHECK ("mimeType" IN ('image/jpeg', 'image/png', 'image/webp'));

ALTER TABLE "GeneratedDocument"
  ADD CONSTRAINT "GeneratedDocument_version_positive_check"
  CHECK ("version" > 0);

ALTER TABLE "CommunicationPost"
  ADD CONSTRAINT "CommunicationPost_published_at_check"
  CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);
