import { SessionService } from './session.service';
import { SessionTokenService } from './session-token.service';

describe('SessionService', () => {
  const prisma = {
    session: {
      create: jest.fn(),
    },
  };

  let service: SessionService;

  beforeEach(() => {
    jest.resetAllMocks();

    prisma.session.create.mockResolvedValue({
      id: 'session-id',
    });

    service = new SessionService(
      prisma as never,
      new SessionTokenService(),
    );
  });

  it('persiste o hash e a validade sem armazenar o token original', async () => {
    const userId = '00000000-0000-4000-8000-000000000001';

    const result = await service.createSession(userId);

    expect(result.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(prisma.session.create).toHaveBeenCalledTimes(1);

    const persisted = prisma.session.create.mock.calls[0][0]
      .data as {
        userId: string;
        tokenHash: string;
        expiresAt: Date;
        token?: string;
      };

    expect(persisted.userId).toBe(userId);
    expect(persisted.tokenHash).toBe(
      new SessionTokenService().hashToken(result.token),
    );

    expect(persisted).not.toHaveProperty('token');
    expect(persisted.expiresAt).toBeInstanceOf(Date);

    expect(persisted.expiresAt.getTime()).toBeGreaterThan(
      Date.now(),
    );

    expect(persisted.expiresAt.getTime()).toBeLessThanOrEqual(
      Date.now() + 12 * 60 * 60 * 1000,
    );
  });

  it('autentica uma sessao valida de usuario ativo', async () => {
    const tokens = new SessionTokenService();
    const { token, tokenHash } = tokens.createToken();

    const userId = '00000000-0000-4000-8000-000000000001';

    const findUnique = jest.fn().mockResolvedValue({
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      user: {
        id: userId,
        role: 'ADMINISTRATOR',
        isActive: true,
      },
    });

    const subject = new SessionService(
      { session: { findUnique } } as never,
      tokens,
    );

    await expect(
      subject.validateSession(token),
    ).resolves.toEqual({
      userId,
      role: 'ADMINISTRATOR',
    });

    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tokenHash },
      }),
    );
  });

  it('rejeita sessoes invalidas, expiradas, revogadas e usuarios inativos', async () => {
    const tokens = new SessionTokenService();
    const findUnique = jest.fn();

    const subject = new SessionService(
      { session: { findUnique } } as never,
      tokens,
    );

    await expect(
      subject.validateSession('token-invalido'),
    ).resolves.toBeNull();

    expect(findUnique).not.toHaveBeenCalled();

    const { token } = tokens.createToken();

    const validSession = {
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      user: {
        id: '00000000-0000-4000-8000-000000000001',
        role: 'OPERATOR',
        isActive: true,
      },
    };

    const invalidSessions = [
      {
        ...validSession,
        expiresAt: new Date(Date.now() - 1_000),
      },
      {
        ...validSession,
        revokedAt: new Date(),
      },
      {
        ...validSession,
        user: {
          ...validSession.user,
          isActive: false,
        },
      },
      null,
    ];

    for (const session of invalidSessions) {
      findUnique.mockResolvedValueOnce(session);

      await expect(
        subject.validateSession(token),
      ).resolves.toBeNull();
    }

    expect(findUnique).toHaveBeenCalledTimes(4);
  });

  it('revoga uma sessao valida de forma idempotente', async () => {
    const tokens = new SessionTokenService();
    const { token, tokenHash } = tokens.createToken();

    const updateMany = jest.fn()
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });

    const subject = new SessionService(
      { session: { updateMany } } as never,
      tokens,
    );

    await expect(
      subject.revokeSession(token),
    ).resolves.toBe(true);

    await expect(
      subject.revokeSession(token),
    ).resolves.toBe(false);

    expect(updateMany).toHaveBeenCalledTimes(2);

    expect(updateMany).toHaveBeenCalledWith({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: expect.any(Date),
        },
      },
      data: {
        revokedAt: expect.any(Date),
      },
    });

    for (const [args] of updateMany.mock.calls) {
      expect(args).not.toHaveProperty('token');
      expect(args.where).not.toHaveProperty('token');
    }
  });

  it('rejeita revogacao com token invalido sem acessar o banco', async () => {
    const updateMany = jest.fn();

    const subject = new SessionService(
      { session: { updateMany } } as never,
      new SessionTokenService(),
    );

    await expect(
      subject.revokeSession('token-invalido'),
    ).resolves.toBe(false);

    expect(updateMany).not.toHaveBeenCalled();
  });
});