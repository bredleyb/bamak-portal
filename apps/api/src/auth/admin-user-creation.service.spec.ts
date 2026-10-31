import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUserCreationService } from './admin-user-creation.service';
import { PasswordService } from './password.service';

describe('AdminUserCreationService', () => {
  const actorId = '22222222-2222-4222-8222-222222222222';
  const createdAt = new Date('2026-10-22T10:00:00.000Z');

  const createdUser = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Operadora Exemplo',
    email: 'operadora@example.invalid',
    role: 'OPERATOR' as const,
    isActive: true,
    createdAt,
    updatedAt: createdAt,
  };

  const validInput = {
    name: '  Operadora Exemplo  ',
    email: '  OPERADORA@EXAMPLE.INVALID  ',
    password: 'SenhaFicticia123!',
    role: 'OPERATOR' as const,
  };

  const publicSelection = {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  function setup() {
    const queryRaw = jest.fn().mockResolvedValue([
      { locked: '' },
    ]);

    const findUnique = jest.fn().mockResolvedValue({
      role: 'ADMINISTRATOR',
      isActive: true,
    });

    const create = jest.fn().mockResolvedValue(createdUser);
    const createAudit = jest.fn().mockResolvedValue({
      id: 'evento-ficticio',
    });

    const hashPassword = jest.fn().mockResolvedValue(
      'scrypt-v1$hash-ficticio',
    );

    const tx = {
      $queryRaw: queryRaw,
      user: { findUnique, create },
      adminAccessEvent: { create: createAudit },
    };

    const transaction = jest.fn(
      async (callback: (client: typeof tx) => Promise<unknown>) =>
        callback(tx),
    );

    const prisma = {
      $transaction: transaction,
    } as unknown as PrismaService;

    const passwords = {
      hashPassword,
    } as unknown as PasswordService;

    const subject = new AdminUserCreationService(
      prisma,
      passwords,
    );

    return {
      subject,
      queryRaw,
      findUnique,
      create,
      createAudit,
      transaction,
      hashPassword,
    };
  }

  it('normaliza dados e grava somente o hash', async () => {
    const {
      subject, create, createAudit, hashPassword,
    } = setup();

    await expect(
      subject.createUser(validInput, actorId),
    ).resolves.toEqual(createdUser);

    expect(hashPassword).toHaveBeenCalledWith(
      'SenhaFicticia123!',
    );

    expect(create).toHaveBeenCalledWith({
      data: {
        name: 'Operadora Exemplo',
        email: 'operadora@example.invalid',
        passwordHash: 'scrypt-v1$hash-ficticio',
        role: 'OPERATOR',
        isActive: true,
      },
      select: publicSelection,
    });

    expect(createAudit).toHaveBeenCalledWith({
      data: {
        actorId,
        targetUserId: createdUser.id,
        eventType: 'CREATED',
        previousRole: null,
        newRole: 'OPERATOR',
        previousIsActive: null,
        newIsActive: true,
      },
    });

    const persisted = JSON.stringify({
      user: create.mock.calls[0][0],
      event: createAudit.mock.calls[0][0],
    });

    expect(persisted).not.toContain('SenhaFicticia123!');
    expect(persisted).not.toContain('tokenHash');
  });

  it('audita a concessao do perfil administrador', async () => {
    const { subject, createAudit } = setup();

    await subject.createUser({
      ...validInput,
      role: 'ADMINISTRATOR',
    }, actorId);

    expect(createAudit.mock.calls[0][0].data).toMatchObject({
      actorId,
      eventType: 'CREATED',
      newRole: 'ADMINISTRATOR',
      newIsActive: true,
    });
  });

  it('adquire o bloqueio antes de autorizar e criar', async () => {
    const {
      subject, queryRaw, findUnique, create, createAudit,
      transaction, hashPassword,
    } = setup();

    await subject.createUser(validInput, actorId);

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: actorId },
      select: { role: true, isActive: true },
    });

    expect(
      hashPassword.mock.invocationCallOrder[0],
    ).toBeLessThan(queryRaw.mock.invocationCallOrder[0]);

    expect(
      queryRaw.mock.invocationCallOrder[0],
    ).toBeLessThan(findUnique.mock.invocationCallOrder[0]);

    expect(
      findUnique.mock.invocationCallOrder[0],
    ).toBeLessThan(create.mock.invocationCallOrder[0]);

    expect(
      create.mock.invocationCallOrder[0],
    ).toBeLessThan(createAudit.mock.invocationCallOrder[0]);

    const sql = (
      queryRaw.mock.calls[0][0] as string[]
    ).join(' ');

    expect(sql).toMatch(/pg_advisory_xact_lock/i);
    expect(sql).toContain('710245');
  });

  it('rejeita autor rebaixado', async () => {
    const { subject, findUnique, create, createAudit } = setup();

    findUnique.mockResolvedValue({
      role: 'OPERATOR',
      isActive: true,
    });

    await expect(
      subject.createUser(validInput, actorId),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(create).not.toHaveBeenCalled();
    expect(createAudit).not.toHaveBeenCalled();
  });

  it('rejeita autor desativado ou inexistente', async () => {
    const { subject, findUnique, create, createAudit } = setup();

    findUnique.mockResolvedValueOnce({
      role: 'ADMINISTRATOR',
      isActive: false,
    }).mockResolvedValueOnce(null);

    await expect(
      subject.createUser(validInput, actorId),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    await expect(
      subject.createUser(validInput, actorId),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(create).not.toHaveBeenCalled();
    expect(createAudit).not.toHaveBeenCalled();
  });

  it('converte conflito de email em HTTP 409', async () => {
    const { subject, create, createAudit } = setup();

    create.mockRejectedValue({
      code: 'P2002',
      meta: { target: ['email'] },
    });

    await expect(
      subject.createUser(validInput, actorId),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(createAudit).not.toHaveBeenCalled();
  });

  it('nao inicia a transacao quando o hash falha', async () => {
    const { subject, transaction, hashPassword } = setup();

    hashPassword.mockRejectedValue(
      new Error('Falha ficticia ao gerar hash'),
    );

    await expect(
      subject.createUser(validInput, actorId),
    ).rejects.toThrow('Falha ficticia ao gerar hash');

    expect(transaction).not.toHaveBeenCalled();
  });

  it('propaga falhas de persistencia sem mascara-las', async () => {
    const { subject, create } = setup();

    create.mockRejectedValue(
      new Error('Falha ficticia de persistencia'),
    );

    await expect(
      subject.createUser(validInput, actorId),
    ).rejects.toThrow('Falha ficticia de persistencia');
  });

  it('propaga falha de auditoria dentro da transacao', async () => {
    const { subject, createAudit } = setup();

    createAudit.mockRejectedValue(
      new Error('Falha ficticia de auditoria'),
    );

    await expect(
      subject.createUser(validInput, actorId),
    ).rejects.toThrow('Falha ficticia de auditoria');
  });
});
