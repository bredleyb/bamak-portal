import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUserAccessService } from './admin-user-access.service';

const databaseUrl = process.env.BAMAK_TEST_DATABASE_URL;

const describeDatabase = databaseUrl
  ? describe
  : describe.skip;

describeDatabase('AdminUserAccessService com PostgreSQL real', () => {
  const ids = [
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222222',
  ];

  let prisma: PrismaService;
  let subject: AdminUserAccessService;

  jest.setTimeout(30000);

  beforeAll(async () => {
    if (!databaseUrl) {
      throw new Error('Banco de integracao nao configurado.');
    }

    const parsed = new URL(databaseUrl);

    if (
      parsed.hostname !== '127.0.0.1' ||
      parsed.pathname !== '/bamak_admin_access_test' ||
      parsed.username !== 'bamak_test' ||
      !parsed.port
    ) {
      throw new Error(
        'Teste permitido somente no PostgreSQL local descartavel.',
      );
    }

    const config = new ConfigService({
      DATABASE_URL: databaseUrl,
    });

    prisma = new PrismaService(config);
    await prisma.$connect();

    subject = new AdminUserAccessService(prisma);
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  async function resetAdministrators() {
    await prisma.adminAccessEvent.deleteMany({
      where: {
        OR: [
          { actorId: { in: ids } },
          { targetUserId: { in: ids } },
        ],
      },
    });

    await prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    await prisma.user.createMany({
      data: [
        {
          id: ids[0],
          name: 'Administrador A',
          email: 'admin-a@example.invalid',
          passwordHash: 'hash-ficticio-teste-a',
          role: 'ADMINISTRATOR',
          isActive: true,
        },
        {
          id: ids[1],
          name: 'Administrador B',
          email: 'admin-b@example.invalid',
          passwordHash: 'hash-ficticio-teste-b',
          role: 'ADMINISTRATOR',
          isActive: true,
        },
      ],
    });
  }

  async function assertSingleActiveAdministrator() {
    const activeCount = await prisma.user.count({
      where: {
        role: 'ADMINISTRATOR',
        isActive: true,
      },
    });

    expect(activeCount).toBe(1);
  }

  it('preserva administrador ativo em desativacoes cruzadas', async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      await resetAdministrators();

      const outcomes = await Promise.allSettled([
        subject.setActive(ids[0], false, ids[1]),
        subject.setActive(ids[1], false, ids[0]),
      ]);

      expect(
        outcomes.filter((outcome) => outcome.status === 'fulfilled'),
      ).toHaveLength(1);

      const failures = outcomes.filter(
        (outcome): outcome is PromiseRejectedResult =>
          outcome.status === 'rejected',
      );

      expect(failures).toHaveLength(1);
      expect(failures[0].reason).toBeInstanceOf(
        UnauthorizedException,
      );

      await assertSingleActiveAdministrator();

      expect(
        await prisma.adminAccessEvent.count({
          where: { eventType: 'DEACTIVATED' },
        }),
      ).toBe(1);
    }
  });

  it('preserva administrador ativo em rebaixamentos cruzados', async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      await resetAdministrators();

      const outcomes = await Promise.allSettled([
        subject.changeRole(ids[0], 'OPERATOR', ids[1]),
        subject.changeRole(ids[1], 'OPERATOR', ids[0]),
      ]);

      expect(
        outcomes.filter((outcome) => outcome.status === 'fulfilled'),
      ).toHaveLength(1);

      const failures = outcomes.filter(
        (outcome): outcome is PromiseRejectedResult =>
          outcome.status === 'rejected',
      );

      expect(failures).toHaveLength(1);
      expect(failures[0].reason).toBeInstanceOf(
        ForbiddenException,
      );

      await assertSingleActiveAdministrator();

      expect(
        await prisma.adminAccessEvent.count({
          where: { eventType: 'ROLE_CHANGED' },
        }),
      ).toBe(1);
    }
  });

  it('serializa duas desativacoes da mesma conta', async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      await resetAdministrators();

      const outcomes = await Promise.allSettled([
        subject.setActive(ids[0], false, ids[1]),
        subject.setActive(ids[0], false, ids[1]),
      ]);

      expect(
        outcomes.every((result) => result.status === 'fulfilled'),
      ).toBe(true);

      await assertSingleActiveAdministrator();

      expect(
        await prisma.adminAccessEvent.count({
          where: { targetUserId: ids[0] },
        }),
      ).toBe(1);
    }
  });

  it('serializa dois rebaixamentos da mesma conta', async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      await resetAdministrators();

      const outcomes = await Promise.allSettled([
        subject.changeRole(ids[0], 'OPERATOR', ids[1]),
        subject.changeRole(ids[0], 'OPERATOR', ids[1]),
      ]);

      expect(
        outcomes.every((result) => result.status === 'fulfilled'),
      ).toBe(true);

      await assertSingleActiveAdministrator();

      expect(
        await prisma.adminAccessEvent.count({
          where: { targetUserId: ids[0] },
        }),
      ).toBe(1);
    }
  });
  it('permite alteracao valida e omite hash na resposta', async () => {
    await resetAdministrators();

    const result = await subject.changeRole(ids[0], 'OPERATOR', ids[1]);

    expect(result.role).toBe('OPERATOR');
    expect(result.id).toBe(ids[0]);
    expect(result).not.toHaveProperty('passwordHash');

    await assertSingleActiveAdministrator();
  });

  it('persiste autor e mudanca no banco descartavel', async () => {
    await resetAdministrators();

    await subject.changeRole(
      ids[0],
      'OPERATOR',
      ids[1],
    );

    const events = await prisma.adminAccessEvent.findMany({
      where: { targetUserId: ids[0] },
    });

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      actorId: ids[1],
      targetUserId: ids[0],
      eventType: 'ROLE_CHANGED',
      previousRole: 'ADMINISTRATOR',
      newRole: 'OPERATOR',
    });
    expect(events[0].createdAt).toBeInstanceOf(Date);
  });

  it('desfaz a alteracao se o INSERT de auditoria falhar', async () => {
    await resetAdministrators();

    await prisma.$executeRawUnsafe(`
      CREATE FUNCTION bamak_test_reject_access_event()
      RETURNS trigger AS $$
      BEGIN
        RAISE EXCEPTION 'BAMAK_TEST_AUDIT_FAILURE';
      END;
      $$ LANGUAGE plpgsql
    `);

    try {
      await prisma.$executeRawUnsafe(`
        CREATE TRIGGER bamak_test_reject_access_event_trigger
        BEFORE INSERT ON "AdminAccessEvent"
        FOR EACH ROW
        EXECUTE FUNCTION bamak_test_reject_access_event()
      `);

      await expect(
        subject.changeRole(ids[0], 'OPERATOR', ids[1]),
      ).rejects.toThrow();

      const stored = await prisma.user.findUnique({
        where: { id: ids[0] },
        select: { role: true, isActive: true },
      });

      expect(stored).toEqual({
        role: 'ADMINISTRATOR',
        isActive: true,
      });

      expect(
        await prisma.adminAccessEvent.count({
          where: { targetUserId: ids[0] },
        }),
      ).toBe(0);
    } finally {
      await prisma.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS
          bamak_test_reject_access_event_trigger
        ON "AdminAccessEvent"
      `);

      await prisma.$executeRawUnsafe(`
        DROP FUNCTION IF EXISTS
          bamak_test_reject_access_event()
      `);
    }
  });
  it('nao cria evento quando o acesso permanece inalterado', async () => {
    await resetAdministrators();

    await subject.changeRole(
      ids[0],
      'ADMINISTRATOR',
      ids[1],
    );

    await subject.setActive(ids[0], true, ids[1]);

    const events = await prisma.adminAccessEvent.count({
      where: { targetUserId: ids[0] },
    });

    expect(events).toBe(0);
  });

  it('audita a desativacao com valores anterior e novo', async () => {
    await resetAdministrators();

    await subject.setActive(ids[0], false, ids[1]);

    const stored = await prisma.user.findUnique({
      where: { id: ids[0] },
      select: { isActive: true },
    });

    expect(stored?.isActive).toBe(false);

    const events = await prisma.adminAccessEvent.findMany({
      where: { targetUserId: ids[0] },
    });

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      actorId: ids[1],
      targetUserId: ids[0],
      eventType: 'DEACTIVATED',
      previousIsActive: true,
      newIsActive: false,
    });
  });
  it('impede alterar a propria conta', async () => {
    await resetAdministrators();

    await expect(
      subject.changeRole(ids[1], 'OPERATOR', ids[1]),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await expect(
      subject.setActive(ids[1], false, ids[1]),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(
      await prisma.adminAccessEvent.count(),
    ).toBe(0);
  });

  it('revalida permissoes apos rebaixamento ou desativacao', async () => {
    await resetAdministrators();

    await subject.changeRole(ids[0], 'OPERATOR', ids[1]);

    await expect(
      subject.setActive(ids[1], false, ids[0]),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await resetAdministrators();

    await subject.setActive(ids[0], false, ids[1]);

    await expect(
      subject.changeRole(ids[1], 'OPERATOR', ids[0]),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    const remaining = await prisma.user.findUniqueOrThrow({
      where: { id: ids[1] },
      select: { role: true, isActive: true },
    });

    expect(remaining).toEqual({
      role: 'ADMINISTRATOR',
      isActive: true,
    });
  });

  it('rejeita autor inexistente antes de alterar dados', async () => {
    await resetAdministrators();

    const missingActor =
      '33333333-3333-4333-8333-333333333333';

    await expect(
      subject.changeRole(ids[0], 'OPERATOR', missingActor),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(
      await prisma.adminAccessEvent.count(),
    ).toBe(0);

    const target = await prisma.user.findUniqueOrThrow({
      where: { id: ids[0] },
      select: { role: true },
    });

    expect(target.role).toBe('ADMINISTRATOR');
  });
  it('retorna NotFoundException para usuario inexistente', async () => {
    await resetAdministrators();

    const missingId = '33333333-3333-4333-8333-333333333333';

    await expect(
      subject.changeRole(missingId, 'OPERATOR', ids[1]),
    ).rejects.toBeInstanceOf(NotFoundException);

    await expect(
      subject.setActive(missingId, false, ids[1]),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
