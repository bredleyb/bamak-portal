import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUserAccessService } from './admin-user-access.service';

type Role = 'ADMINISTRATOR' | 'OPERATOR';

describe('AdminUserAccessService', () => {
  const userId = '11111111-1111-4111-8111-111111111111';

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

    const findUnique = jest.fn().mockResolvedValue(existing);
    const count = jest.fn().mockResolvedValue(activeAdminCount);

    const update = jest.fn().mockImplementation(
      async ({ data }: { data: Record<string, unknown> }) => ({
        ...existing,
        ...data,
      }),
    );

    const tx = {
      $queryRaw: queryRaw,
      user: { findUnique, count, update },
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
    };
  }

  it('promove operador a administrador', async () => {
    const operator = {
      ...admin,
      role: 'OPERATOR' as Role,
    };

    const { subject, update, count } = setup(operator);

    const result = await subject.changeRole(
      userId,
      'ADMINISTRATOR',
    );

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

    const result = await subject.changeRole(
      userId,
      'OPERATOR',
    );

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
      subject.changeRole(userId, 'OPERATOR'),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(update).not.toHaveBeenCalled();
  });

  it('impede desativar o ultimo administrador ativo', async () => {
    const { subject, update } = setup(admin, 1);

    await expect(
      subject.setActive(userId, false),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(update).not.toHaveBeenCalled();
  });

  it('permite desativar administrador quando outro permanece ativo', async () => {
    const { subject, update, count } = setup(admin, 2);

    const result = await subject.setActive(userId, false);

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

    const result = await subject.setActive(userId, false);

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

    const result = await subject.setActive(userId, true);

    expect(result.isActive).toBe(true);
    expect(count).not.toHaveBeenCalled();
  });

  it('retorna NotFoundException quando usuario nao existe', async () => {
    const { subject, update } = setup(null);

    await expect(
      subject.changeRole(userId, 'OPERATOR'),
    ).rejects.toBeInstanceOf(NotFoundException);

    await expect(
      subject.setActive(userId, false),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(update).not.toHaveBeenCalled();
  });

  it('evita gravacoes desnecessarias quando nao ha alteracao', async () => {
    const { subject, update, count } = setup(admin);

    await expect(
      subject.changeRole(userId, 'ADMINISTRATOR'),
    ).resolves.toEqual(admin);

    await expect(
      subject.setActive(userId, true),
    ).resolves.toEqual(admin);

    expect(update).not.toHaveBeenCalled();
    expect(count).not.toHaveBeenCalled();
  });

  it('adquire bloqueio transacional antes de consultar o usuario', async () => {
    const { subject, transaction, queryRaw, findUnique } =
      setup(admin, 2);

    await subject.changeRole(userId, 'OPERATOR');

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(findUnique).toHaveBeenCalledTimes(1);

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