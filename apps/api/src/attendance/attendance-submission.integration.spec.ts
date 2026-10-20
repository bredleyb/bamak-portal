import type { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceSubmissionService } from './attendance-submission.service';

const runIntegration = process.env.RUN_DB_INTEGRATION === '1';
const integrationDescribe = runIntegration ? describe : describe.skip;

integrationDescribe('AttendanceSubmissionService — PostgreSQL real', () => {
  let prisma: PrismaService;
  let service: AttendanceSubmissionService;

  const createdAttendanceIds: string[] = [];

  const generalContact = {
    name: ' Pessoa Ficticia ',
    contactInfo: ' contato-integracao@example.invalid ',
    subject: ' Consulta de equipamento ',
    message: ' Mensagem exclusivamente ficticia. ',
    consent: true,
  };

  const cablewayRequest = {
    contactName: ' Pessoa Ficticia ',
    contactInfo: ' cabo-integracao@example.invalid ',
    installationContext: ' Instalacao ficticia ',
    locationDescription: ' Localizacao exclusivamente ficticia ',
    consent: true,
  };

  beforeAll(async () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL obrigatoria para integracao.');
    }

    const url = new URL(connectionString);

    const localIsolated =
      url.hostname === '127.0.0.1' &&
      url.port === '55432' &&
      url.pathname === '/bamak_issue95' &&
      url.username === 'bamak_issue95';

    const ciIsolated =
      process.env.CI === 'true' &&
      ['127.0.0.1', 'localhost'].includes(url.hostname) &&
      url.port === '5432' &&
      url.pathname === '/bamak' &&
      url.username === 'bamak';

    if (
      url.protocol !== 'postgresql:' ||
      url.searchParams.get('schema') !== 'public' ||
      (!localIsolated && !ciIsolated)
    ) {
      throw new Error('Conexao fora do ambiente de testes permitido.');
    }

    const config = {
      getOrThrow: (key: string) => {
        if (key !== 'DATABASE_URL') {
          throw new Error('Configuracao inesperada.');
        }

        return connectionString;
      },
    } as unknown as ConfigService;

    prisma = new PrismaService(config);
    await prisma.$connect();

    const initialStatus = await prisma.attendanceStatus.findUnique({
      where: { code: 'RECEIVED' },
    });

    if (!initialStatus?.isActive) {
      throw new Error('Estado inicial RECEIVED nao disponivel.');
    }

    service = new AttendanceSubmissionService(prisma);
  });

  afterEach(async () => {
    for (const id of createdAttendanceIds.splice(0)) {
      await prisma.attendance.delete({ where: { id } });
    }
  });

  afterAll(async () => {
    await prisma?.$disconnect();
  });

  it('inicializa modulos NestJS e ciclo de vida Prisma', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    try {
      await testingModule.init();

      const controller = testingModule.get(AppController);

      await expect(controller.getHealth()).resolves.toEqual({
        status: 'ok',
        database: 'ok',
      });
    } finally {
      await testingModule.close();
    }
  });
  it('persiste contato geral e atendimento relacionados', async () => {
    const result = await service.submitGeneralContact(
      generalContact,
      'consent-v1',
    );

    createdAttendanceIds.push(result.attendanceId);

    const saved = await prisma.attendance.findUnique({
      where: { id: result.attendanceId },
      include: {
        status: true,
        generalContact: true,
        cablewayRequest: true,
      },
    });

    expect(saved).not.toBeNull();
    expect(saved?.type).toBe('GENERAL_CONTACT');
    expect(saved?.status.code).toBe('RECEIVED');
    expect(saved?.generalContact?.name).toBe('Pessoa Ficticia');
    expect(saved?.generalContact?.subject).toBe('Consulta de equipamento');
    expect(saved?.generalContact?.consentTextVersion).toBe('consent-v1');
    expect(saved?.generalContact?.consentRecordedAt).toBeInstanceOf(Date);
    expect(saved?.cablewayRequest).toBeNull();
    expect(result.receivedAt).toBeInstanceOf(Date);
  });

  it('persiste Cabo Aereo com coordenadas', async () => {
    const result = await service.submitCablewayRequest(
      {
        ...cablewayRequest,
        coordinates: {
          latitude: -26.49,
          longitude: -49.12,
        },
      },
      'consent-v1',
    );

    createdAttendanceIds.push(result.attendanceId);

    const saved = await prisma.attendance.findUnique({
      where: { id: result.attendanceId },
      include: {
        status: true,
        generalContact: true,
        cablewayRequest: true,
      },
    });

    expect(saved?.type).toBe('CABLEWAY_REQUEST');
    expect(saved?.status.code).toBe('RECEIVED');
    expect(saved?.generalContact).toBeNull();
    expect(saved?.cablewayRequest?.contactName).toBe('Pessoa Ficticia');
    expect(saved?.cablewayRequest?.locationDescription).toBe(
      'Localizacao exclusivamente ficticia',
    );
    expect(saved?.cablewayRequest?.latitude?.toString()).toBe('-26.49');
    expect(saved?.cablewayRequest?.longitude?.toString()).toBe('-49.12');
  });

  it('persiste Cabo Aereo sem coordenadas opcionais', async () => {
    const result = await service.submitCablewayRequest(
      cablewayRequest,
      'consent-v1',
    );

    createdAttendanceIds.push(result.attendanceId);

    const saved = await prisma.cablewayRequest.findUnique({
      where: { attendanceId: result.attendanceId },
    });

    expect(saved).not.toBeNull();
    expect(saved?.latitude).toBeNull();
    expect(saved?.longitude).toBeNull();
  });

  it('faz rollback integral quando o registro filho falha', async () => {
    const countBefore = await prisma.attendance.count();

    await expect(
      service.submitGeneralContact(
        {
          ...generalContact,
          contactInfo: 'rollback-integracao@example.invalid',
          subject: 'X'.repeat(201),
        },
        'consent-v1',
      ),
    ).rejects.toThrow();

    const countAfter = await prisma.attendance.count();
    const orphanContactCount = await prisma.generalContact.count({
      where: { contactInfo: 'rollback-integracao@example.invalid' },
    });

    expect(countAfter).toBe(countBefore);
    expect(orphanContactCount).toBe(0);
  });

  it('serializa inclusoes concorrentes de anexos', async () => {
    const result = await service.submitCablewayRequest(
      cablewayRequest,
      'consent-v1',
    );

    createdAttendanceIds.push(result.attendanceId);

    const request = await prisma.cablewayRequest.findUniqueOrThrow({
      where: { attendanceId: result.attendanceId },
    });

    const prefix = `issue95/concurrency/${request.id}`;

    try {
      await prisma.attachment.createMany({
        data: Array.from({ length: 4 }, (_, index) => ({
          cablewayRequestId: request.id,
          originalName: `initial-${index}.png`,
          mimeType: 'image/png',
          sizeBytes: 1024,
          storageKey: `${prefix}/initial-${index}`,
        })),
      });

      const insertAttachment = (suffix: string) =>
        prisma.attachment.create({
          data: {
            cablewayRequestId: request.id,
            originalName: `${suffix}.png`,
            mimeType: 'image/png',
            sizeBytes: 1024,
            storageKey: `${prefix}/${suffix}`,
          },
        });

      const outcomes = await Promise.allSettled([
        insertAttachment('candidate-a'),
        insertAttachment('candidate-b'),
      ]);

      expect(
        outcomes.filter((outcome) => outcome.status === 'fulfilled'),
      ).toHaveLength(1);

      expect(
        outcomes.filter((outcome) => outcome.status === 'rejected'),
      ).toHaveLength(1);

      const finalCount = await prisma.attachment.count({
        where: { cablewayRequestId: request.id },
      });

      expect(finalCount).toBe(5);
    } finally {
      await prisma.attachment.deleteMany({
        where: { cablewayRequestId: request.id },
      });
    }
  });
});
