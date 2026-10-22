import {
  ConflictException,
  NotFoundException,
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

  function assertOneSuccessOneConflict(
    outcomes: PromiseSettledResult<unknown>[],
  ) {
    const successes = outcomes.filter(
      (result) => result.status === 'fulfilled',
    );

    const failures = outcomes.filter(
      (result) => result.status === 'rejected',
    );

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);

    const failure = failures[0] as PromiseRejectedResult;

    expect(failure.reason).toBeInstanceOf(
      ConflictException,
    );
  }

  it('impede duas desativacoes simultaneas', async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      await resetAdministrators();

      const outcomes = await Promise.allSettled([
        subject.setActive(ids[0], false),
        subject.setActive(ids[1], false),
      ]);

      assertOneSuccessOneConflict(outcomes);
      await assertSingleActiveAdministrator();
    }
  });

  it('impede dois rebaixamentos simultaneos', async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      await resetAdministrators();

      const outcomes = await Promise.allSettled([
        subject.changeRole(ids[0], 'OPERATOR'),
        subject.changeRole(ids[1], 'OPERATOR'),
      ]);

      assertOneSuccessOneConflict(outcomes);
      await assertSingleActiveAdministrator();
    }
  });

  it('permite alteracao valida e omite hash na resposta', async () => {
    await resetAdministrators();

    const result = await subject.changeRole(
      ids[0],
      'OPERATOR',
    );

    expect(result.role).toBe('OPERATOR');
    expect(result.id).toBe(ids[0]);
    expect(result).not.toHaveProperty('passwordHash');

    await assertSingleActiveAdministrator();
  });

  it('retorna NotFoundException para usuario inexistente', async () => {
    await resetAdministrators();

    const missingId = '33333333-3333-4333-8333-333333333333';

    await expect(
      subject.changeRole(missingId, 'OPERATOR'),
    ).rejects.toBeInstanceOf(NotFoundException);

    await expect(
      subject.setActive(missingId, false),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});