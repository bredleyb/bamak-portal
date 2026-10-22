import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordChangeService } from './password-change.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { SessionTokenService } from './session-token.service';

const databaseUrl = process.env.BAMAK_TEST_DATABASE_URL;
const databaseSuite = databaseUrl ? describe : describe.skip;

databaseSuite('Troca de senha com PostgreSQL real', () => {
  const USER_ID = '44444444-4444-4444-8444-444444444444';
  const OLD_PASSWORD = 'SenhaAntigaFicticia123!';
  const NEW_PASSWORD = 'SenhaNovaFicticia456!';

  let prisma: PrismaService;
  let passwords: PasswordService;
  let sessions: SessionService;
  let tokens: SessionTokenService;
  let subject: PasswordChangeService;

  jest.setTimeout(45000);

  beforeAll(async () => {
    if (!databaseUrl) {
      throw new Error('Banco de testes nao configurado.');
    }

    const url = new URL(databaseUrl);

    if (
      url.hostname !== '127.0.0.1' ||
      url.username !== 'bamak_test' ||
      url.pathname !== '/bamak_password_test' ||
      !url.port
    ) {
      throw new Error(
        'Integracao permitida somente no banco local descartavel.',
      );
    }

    prisma = new PrismaService(
      new ConfigService({ DATABASE_URL: databaseUrl }),
    );

    await prisma.$connect();

    passwords = new PasswordService();
    tokens = new SessionTokenService();
    sessions = new SessionService(prisma, tokens);
    subject = new PasswordChangeService(prisma, passwords);
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  async function seedAccount() {
    await prisma.user.deleteMany({
      where: { id: USER_ID },
    });

    const originalHash = await passwords.hashPassword(
      OLD_PASSWORD,
    );

    await prisma.user.create({
      data: {
        id: USER_ID,
        name: 'Administrador de Teste',
        email: 'senha-teste@example.invalid',
        passwordHash: originalHash,
        role: 'ADMINISTRATOR',
        isActive: true,
      },
    });

    const first = tokens.createToken();
    const second = tokens.createToken();

    await prisma.session.createMany({
      data: [first, second].map(({ tokenHash }) => ({
        userId: USER_ID,
        tokenHash,
        expiresAt: new Date(Date.now() + 3600000),
      })),
    });

    return {
      originalHash,
      tokens: [first.token, second.token],
    };
  }

  async function storedPasswordHash() {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: USER_ID },
      select: { passwordHash: true },
    });

    return user.passwordHash;
  }

  it('atualiza o hash e invalida todas as sessoes', async () => {
    const data = await seedAccount();

    for (const token of data.tokens) {
      expect(await sessions.validateSession(token))
        .not.toBeNull();
    }

    await subject.changeOwnPassword(
      USER_ID,
      OLD_PASSWORD,
      NEW_PASSWORD,
    );

    const newHash = await storedPasswordHash();

    expect(newHash).not.toBe(data.originalHash);
    expect(
      await passwords.verifyPassword(OLD_PASSWORD, newHash),
    ).toBe(false);
    expect(
      await passwords.verifyPassword(NEW_PASSWORD, newHash),
    ).toBe(true);

    for (const token of data.tokens) {
      expect(await sessions.validateSession(token))
        .toBeNull();
    }

    const stillActive = await prisma.session.count({
      where: {
        userId: USER_ID,
        revokedAt: null,
      },
    });

    expect(stillActive).toBe(0);
  });

  it('preserva senha e sessoes quando a senha atual esta errada', async () => {
    const data = await seedAccount();

    await expect(
      subject.changeOwnPassword(
        USER_ID,
        'SenhaAtualIncorreta123!',
        NEW_PASSWORD,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(await storedPasswordHash())
      .toBe(data.originalHash);

    for (const token of data.tokens) {
      expect(await sessions.validateSession(token))
        .not.toBeNull();
    }
  });

  it('desfaz a troca de senha se a revogacao falhar', async () => {
    const data = await seedAccount();

    await prisma.$executeRawUnsafe(`
      CREATE FUNCTION bamak_test_reject_revocation()
      RETURNS trigger AS $$
      BEGIN
        RAISE EXCEPTION 'BAMAK_TEST_REVOCATION_FAILURE';
      END;
      $$ LANGUAGE plpgsql
    `);

    try {
      await prisma.$executeRawUnsafe(`
        CREATE TRIGGER bamak_test_reject_revocation_trigger
        BEFORE UPDATE OF "revokedAt" ON "Session"
        FOR EACH ROW
        EXECUTE FUNCTION bamak_test_reject_revocation()
      `);

      await expect(
        subject.changeOwnPassword(
          USER_ID,
          OLD_PASSWORD,
          NEW_PASSWORD,
        ),
      ).rejects.toThrow();

      expect(await storedPasswordHash())
        .toBe(data.originalHash);

      for (const token of data.tokens) {
        expect(await sessions.validateSession(token))
          .not.toBeNull();
      }
    } finally {
      await prisma.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS
        bamak_test_reject_revocation_trigger
        ON "Session"
      `);

      await prisma.$executeRawUnsafe(`
        DROP FUNCTION IF EXISTS
        bamak_test_reject_revocation()
      `);
    }
  });

  it('permite somente uma das duas trocas simultaneas', async () => {
    const data = await seedAccount();
    const firstNew = 'SenhaConcorrentePrimeira123!';
    const secondNew = 'SenhaConcorrenteSegunda456!';

    const outcomes = await Promise.allSettled([
      subject.changeOwnPassword(
        USER_ID,
        OLD_PASSWORD,
        firstNew,
      ),
      subject.changeOwnPassword(
        USER_ID,
        OLD_PASSWORD,
        secondNew,
      ),
    ]);

    const successes = outcomes.filter(
      (result) => result.status === 'fulfilled',
    );

    const failures = outcomes.filter(
      (result) => result.status === 'rejected',
    );

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);

    const failure = failures[0] as PromiseRejectedResult;

    expect(failure.reason)
      .toBeInstanceOf(ConflictException);

    const hash = await storedPasswordHash();

    expect(
      await passwords.verifyPassword(OLD_PASSWORD, hash),
    ).toBe(false);

    const firstMatches = await passwords.verifyPassword(
      firstNew,
      hash,
    );

    const secondMatches = await passwords.verifyPassword(
      secondNew,
      hash,
    );

    expect(Number(firstMatches) + Number(secondMatches))
      .toBe(1);

    for (const token of data.tokens) {
      expect(await sessions.validateSession(token))
        .toBeNull();
    }
  });
});