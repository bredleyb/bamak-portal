import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUserAccessService } from './admin-user-access.service';
import { AdminUserCreationService } from './admin-user-creation.service';
import { PasswordService } from './password.service';

const databaseUrl = process.env.BAMAK_TEST_DATABASE_URL;
const describeDatabase = databaseUrl ? describe : describe.skip;

describeDatabase('Criacao administrativa com PostgreSQL real', () => {
  const actorA = '66666666-6666-4666-8666-666666666666';
  const actorB = '77777777-7777-4777-8777-777777777777';
  const missingActor = '99999999-9999-4999-8999-999999999999';
  const actorIds = [actorA, actorB];
  const email = 'criacao-integracao@example.invalid';

  const input = {
    name: 'Nova Conta de Integracao',
    email,
    password: 'SenhaFicticiaIntegracao123!',
    role: 'OPERATOR' as const,
  };

  let prisma: PrismaService;
  let subject: AdminUserCreationService;
  let access: AdminUserAccessService;

  jest.setTimeout(30000);

  function createSubject(
    hashPassword: jest.Mock = jest
      .fn()
      .mockResolvedValue('scrypt-v1$hash-ficticio'),
  ) {
    return new AdminUserCreationService(
      prisma,
      { hashPassword } as unknown as PasswordService,
    );
  }

  async function resetFixtures() {
    await prisma.adminAccessEvent.deleteMany({
      where: {
        actorId: { in: actorIds },
      },
    });

    await prisma.user.deleteMany({
      where: {
        OR: [
          { id: { in: actorIds } },
          { email },
        ],
      },
    });

    await prisma.user.createMany({
      data: [
        {
          id: actorA,
          name: 'Administrador Criacao A',
          email: 'admin-criacao-a@example.invalid',
          passwordHash: 'hash-ficticio-a',
          role: 'ADMINISTRATOR',
          isActive: true,
        },
        {
          id: actorB,
          name: 'Administrador Criacao B',
          email: 'admin-criacao-b@example.invalid',
          passwordHash: 'hash-ficticio-b',
          role: 'ADMINISTRATOR',
          isActive: true,
        },
      ],
    });
  }

  async function countCreatedAccounts() {
    return prisma.user.count({
      where: { email },
    });
  }

  async function countCreationEvents() {
    return prisma.adminAccessEvent.count({
      where: {
        actorId: actorA,
        eventType: 'CREATED',
      },
    });
  }

  beforeAll(async () => {
    if (!databaseUrl) {
      throw new Error('Banco de integracao nao configurado.');
    }

    const url = new URL(databaseUrl);

    if (
      url.protocol !== 'postgresql:' ||
      url.hostname !== '127.0.0.1' ||
      url.username !== 'bamak_test' ||
      url.pathname !== '/bamak_admin_access_test' ||
      !url.port
    ) {
      throw new Error(
        'Integracao restrita ao PostgreSQL descartavel de acessos.',
      );
    }

    prisma = new PrismaService(
      new ConfigService({ DATABASE_URL: databaseUrl }),
    );

    await prisma.$connect();
    access = new AdminUserAccessService(prisma);
  });

  beforeEach(async () => {
    await resetFixtures();
    subject = createSubject();
  });

  afterAll(async () => {
    if (prisma) {
      try {
        await prisma.adminAccessEvent.deleteMany({
          where: { actorId: { in: actorIds } },
        });

        await prisma.user.deleteMany({
          where: {
            OR: [
              { id: { in: actorIds } },
              { email },
            ],
          },
        });
      } finally {
        await prisma.$disconnect();
      }
    }
  });

  it('cria conta e evento atomico com autor e perfil inicial', async () => {
    const user = await subject.createUser(input, actorA);

    expect(user.email).toBe(email);
    expect(user.role).toBe('OPERATOR');
    expect(user.isActive).toBe(true);
    expect(user).not.toHaveProperty('passwordHash');

    const events = await prisma.adminAccessEvent.findMany({
      where: { targetUserId: user.id },
    });

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      actorId: actorA,
      targetUserId: user.id,
      eventType: 'CREATED',
      previousRole: null,
      newRole: 'OPERATOR',
      previousIsActive: null,
      newIsActive: true,
    });

    expect(events[0].createdAt).toBeInstanceOf(Date);
  });

  it('audita a criacao de outro administrador', async () => {
    const user = await subject.createUser(
      { ...input, role: 'ADMINISTRATOR' },
      actorA,
    );

    expect(user.role).toBe('ADMINISTRATOR');

    const event = await prisma.adminAccessEvent.findFirstOrThrow({
      where: { targetUserId: user.id },
    });

    expect(event.eventType).toBe('CREATED');
    expect(event.newRole).toBe('ADMINISTRATOR');
  });

  it('rejeita criacao apos rebaixamento durante o hash', async () => {
    let releaseHash!: () => void;
    let signalHash!: () => void;

    const hashReleased = new Promise<void>((resolve) => {
      releaseHash = resolve;
    });

    const hashingStarted = new Promise<void>((resolve) => {
      signalHash = resolve;
    });

    subject = createSubject(
      jest.fn().mockImplementation(async () => {
        signalHash();
        await hashReleased;
        return 'scrypt-v1$hash-ficticio';
      }),
    );

    const pending = subject.createUser(input, actorA);

    await hashingStarted;

    try {
      await access.changeRole(actorA, 'OPERATOR', actorB);
    } finally {
      releaseHash();
    }

    await expect(pending).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    expect(await countCreatedAccounts()).toBe(0);
    expect(await countCreationEvents()).toBe(0);
  });

  it('rejeita criacao apos desativacao durante o hash', async () => {
    let releaseHash!: () => void;
    let signalHash!: () => void;

    const hashReleased = new Promise<void>((resolve) => {
      releaseHash = resolve;
    });

    const hashingStarted = new Promise<void>((resolve) => {
      signalHash = resolve;
    });

    subject = createSubject(
      jest.fn().mockImplementation(async () => {
        signalHash();
        await hashReleased;
        return 'scrypt-v1$hash-ficticio';
      }),
    );

    const pending = subject.createUser(input, actorA);

    await hashingStarted;

    try {
      await access.setActive(actorA, false, actorB);
    } finally {
      releaseHash();
    }

    await expect(pending).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    expect(await countCreatedAccounts()).toBe(0);
    expect(await countCreationEvents()).toBe(0);
  });

  it('rejeita operador e autor inexistente', async () => {
    await access.changeRole(actorA, 'OPERATOR', actorB);

    await expect(
      subject.createUser(input, actorA),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await expect(
      subject.createUser(input, missingActor),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(await countCreatedAccounts()).toBe(0);
    expect(await countCreationEvents()).toBe(0);
  });

  it('nao duplica conta ou auditoria em email repetido', async () => {
    await subject.createUser(input, actorA);

    await expect(
      subject.createUser(input, actorA),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(await countCreatedAccounts()).toBe(1);
    expect(await countCreationEvents()).toBe(1);
  });

  it('reverte a criacao quando a auditoria falha', async () => {
    await prisma.$executeRawUnsafe(`
      CREATE FUNCTION bamak_test_reject_created_event()
      RETURNS trigger AS $$
      BEGIN
        RAISE EXCEPTION 'BAMAK_TEST_CREATED_AUDIT_FAILURE';
      END;
      $$ LANGUAGE plpgsql
    `);

    try {
      await prisma.$executeRawUnsafe(`
        CREATE TRIGGER bamak_test_reject_created_event_trigger
        BEFORE INSERT ON "AdminAccessEvent"
        FOR EACH ROW
        WHEN (NEW."eventType" = 'CREATED')
        EXECUTE FUNCTION bamak_test_reject_created_event()
      `);

      await expect(
        subject.createUser(input, actorA),
      ).rejects.toThrow();

      expect(await countCreatedAccounts()).toBe(0);
      expect(await countCreationEvents()).toBe(0);
    } finally {
      await prisma.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS
          bamak_test_reject_created_event_trigger
        ON "AdminAccessEvent"
      `);

      await prisma.$executeRawUnsafe(`
        DROP FUNCTION IF EXISTS
          bamak_test_reject_created_event()
      `);
    }
  });
});
