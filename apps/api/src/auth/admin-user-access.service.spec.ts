import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUserAccessService } from './admin-user-access.service';

type Role = 'ADMINISTRATOR' | 'OPERATOR';

describe('AdminUserAccessService', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const actorId = '22222222-2222-4222-8222-222222222222';

  const admin = {
    id: userId,
    name: 'Administrador Exemplo',
    email: 'admin@example.invalid',
    role: 'ADMINISTRATOR' as Role,
    isActive: true,
    createdAt: new Date('2026-10-22T10:00:00.000Z'),
    updatedAt: new Date('2026-10-22T10:00:00.000Z'),
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

  function setup(
    existing: typeof admin | null = admin,
    activeAdminCount = 2,
  ) {
    const queryRaw = jest.fn().mockResolvedValue([
      { locked: '' },
    ]);

    const findUnique = jest.fn().mockImplementation(
      async ({ where }: { where: { id: string } }) =>
        where.id === actorId
          ? { role: 'ADMINISTRATOR', isActive: true }
          : existing,
    );
    const count = jest.fn().mockResolvedValue(activeAdminCount);

    const update = jest.fn().mockImplementation(
      async ({ data }: { data: Record<string, unknown> }) => ({
        ...existing,
        ...data,
      }),
    );

    const createAudit = jest.fn().mockResolvedValue({
      id: '33333333-3333-4333-8333-333333333333',
    });

    const tx = {
      $queryRaw: queryRaw,
      user: { findUnique, count, update },
      adminAccessEvent: { create: createAudit },
    };

    const transaction = jest.fn(
      async (callback: (client: typeof tx) => Promise<unknown>) =>
        callback(tx),
    );

    const prisma = {
      $transaction: transaction,
    } as unknown as PrismaService;

    const subject = new AdminUserAccessService(prisma);

    return {
      subject,
      transaction,
      queryRaw,
      findUnique,
      count,
      update,
      createAudit,
    };
  }

  it('promove operador a administrador', async () => {
    const operator = {
      ...admin,
      role: 'OPERATOR' as Role,
    };

    const { subject, update, count } = setup(operator);

    const result = await subject.changeRole(userId, 'ADMINISTRATOR', actorId);

    expect(result.role).toBe('ADMINISTRATOR');

    expect(update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { role: 'ADMINISTRATOR' },
      select: publicSelection,
    });

    expect(count).not.toHaveBeenCalled();
  });

  it('rebaixa administrador quando outro permanece ativo', async () => {
    const { subject, count, update } = setup(admin, 2);

    const result = await subject.changeRole(userId, 'OPERATOR', actorId);

    expect(result.role).toBe('OPERATOR');

    expect(count).toHaveBeenCalledWith({
      where: {
        role: 'ADMINISTRATOR',
        isActive: true,
      },
    });

    expect(update).toHaveBeenCalledTimes(1);
  });

  it('impede rebaixar o ultimo administrador ativo', async () => {
    const { subject, update } = setup(admin, 1);

    await expect(
      subject.changeRole(userId, 'OPERATOR', actorId),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(update).not.toHaveBeenCalled();
  });

  it('impede desativar o ultimo administrador ativo', async () => {
    const { subject, update } = setup(admin, 1);

    await expect(
      subject.setActive(userId, false, actorId),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(update).not.toHaveBeenCalled();
  });

  it('permite desativar administrador quando outro permanece ativo', async () => {
    const { subject, update, count } = setup(admin, 2);

    const result = await subject.setActive(userId, false, actorId);

    expect(result.isActive).toBe(false);
    expect(count).toHaveBeenCalledTimes(1);

    expect(update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { isActive: false },
      select: publicSelection,
    });
  });

  it('permite desativar operador sem contar administradores', async () => {
    const operator = {
      ...admin,
      role: 'OPERATOR' as Role,
    };

    const { subject, count, update } = setup(operator);

    const result = await subject.setActive(userId, false, actorId);

    expect(result.isActive).toBe(false);
    expect(count).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(1);
  });

  it('permite reativar operador', async () => {
    const inactiveOperator = {
      ...admin,
      role: 'OPERATOR' as Role,
      isActive: false,
    };

    const { subject, count } = setup(inactiveOperator);

    const result = await subject.setActive(userId, true, actorId);

    expect(result.isActive).toBe(true);
    expect(count).not.toHaveBeenCalled();
  });

  it('retorna NotFoundException quando usuario nao existe', async () => {
    const { subject, update } = setup(null);

    await expect(
      subject.changeRole(userId, 'OPERATOR', actorId),
    ).rejects.toBeInstanceOf(NotFoundException);

    await expect(
      subject.setActive(userId, false, actorId),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(update).not.toHaveBeenCalled();
  });

  it('evita gravacoes desnecessarias quando nao ha alteracao', async () => {
    const { subject, update, count } = setup(admin);

    await expect(
      subject.changeRole(userId, 'ADMINISTRATOR', actorId),
    ).resolves.toEqual(admin);

    await expect(
      subject.setActive(userId, true, actorId),
    ).resolves.toEqual(admin);

    expect(update).not.toHaveBeenCalled();
    expect(count).not.toHaveBeenCalled();
  });

  it('registra o autor e os valores de uma mudanca real', async () => {
    const operator = {
      ...admin,
      role: 'OPERATOR' as Role,
    };

    const { subject, createAudit, update } = setup(operator);

    await subject.changeRole(
      userId,
      'ADMINISTRATOR',
      actorId,
    );

    expect(update).toHaveBeenCalledTimes(1);
    expect(createAudit).toHaveBeenCalledWith({
      data: {
        actorId,
        targetUserId: userId,
        eventType: 'ROLE_CHANGED',
        previousRole: 'OPERATOR',
        newRole: 'ADMINISTRATOR',
        previousIsActive: null,
        newIsActive: null,
      },
    });
  });

  it('nao audita uma operacao sem mudanca', async () => {
    const { subject, createAudit, update } = setup(admin);

    await subject.changeRole(
      userId,
      'ADMINISTRATOR',
      actorId,
    );

    expect(update).not.toHaveBeenCalled();
    expect(createAudit).not.toHaveBeenCalled();
  });

  it('falha quando a gravacao da auditoria falha', async () => {
    const operator = {
      ...admin,
      role: 'OPERATOR' as Role,
    };

    const { subject, createAudit } = setup(operator);

    createAudit.mockRejectedValue(
      new Error('Falha simulada de auditoria'),
    );

    await expect(
      subject.changeRole(userId, 'ADMINISTRATOR', actorId),
    ).rejects.toThrow('Falha simulada de auditoria');
  });

  it('impede alterar o proprio acesso', async () => {
    const { subject, update, createAudit } = setup();

    await expect(
      subject.changeRole(actorId, 'OPERATOR', actorId),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await expect(
      subject.setActive(actorId, false, actorId),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(update).not.toHaveBeenCalled();
    expect(createAudit).not.toHaveBeenCalled();
  });

  it('rejeita ator ausente ou desativado', async () => {
    const { subject, findUnique, update, createAudit } = setup();

    findUnique.mockImplementation(
      async ({ where }: { where: { id: string } }) =>
        where.id === actorId ? null : admin,
    );

    await expect(
      subject.changeRole(userId, 'OPERATOR', actorId),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    findUnique.mockImplementation(
      async ({ where }: { where: { id: string } }) =>
        where.id === actorId
          ? { role: 'ADMINISTRATOR', isActive: false }
          : admin,
    );

    await expect(
      subject.setActive(userId, false, actorId),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(update).not.toHaveBeenCalled();
    expect(createAudit).not.toHaveBeenCalled();
  });

  it('rejeita ator que perdeu o perfil administrativo', async () => {
    const { subject, findUnique, update, createAudit } = setup();

    findUnique.mockImplementation(
      async ({ where }: { where: { id: string } }) =>
        where.id === actorId
          ? { role: 'OPERATOR', isActive: true }
          : admin,
    );

    await expect(
      subject.changeRole(userId, 'OPERATOR', actorId),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(update).not.toHaveBeenCalled();
    expect(createAudit).not.toHaveBeenCalled();
  });
  it('adquire bloqueio transacional antes de consultar o usuario', async () => {
    const { subject, transaction, queryRaw, findUnique } =
      setup(admin, 2);

    await subject.changeRole(userId, 'OPERATOR', actorId);

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(findUnique).toHaveBeenCalledTimes(2);

    expect(
      queryRaw.mock.invocationCallOrder[0],
    ).toBeLessThan(
      findUnique.mock.invocationCallOrder[0],
    );

    const sql = (
      queryRaw.mock.calls[0][0] as string[]
    ).join(' ');

    expect(sql).toMatch(/pg_advisory_xact_lock/i);
  });
});
