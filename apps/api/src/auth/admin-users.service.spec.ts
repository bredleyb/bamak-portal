import { PrismaService } from '../prisma/prisma.service';
import { AdminUsersService } from './admin-users.service';

describe('AdminUsersService', () => {
  const users = [
    {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Administrador Exemplo',
      email: 'admin@example.invalid',
      role: 'ADMINISTRATOR',
      isActive: true,
      createdAt: new Date('2026-10-22T10:00:00.000Z'),
      updatedAt: new Date('2026-10-22T10:00:00.000Z'),
    },
  ];

  function setup() {
    const findMany = jest.fn().mockResolvedValue(users);

    const prisma = {
      user: { findMany },
    } as unknown as PrismaService;

    return {
      subject: new AdminUsersService(prisma),
      findMany,
    };
  }

  it('consulta somente colunas administrativas permitidas', async () => {
    const { subject, findMany } = setup();

    await subject.listUsers();

    expect(findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
    });

    const query = JSON.stringify(findMany.mock.calls[0][0]);

    expect(query).not.toContain('passwordHash');
    expect(query).not.toContain('tokenHash');
    expect(query).not.toContain('sessions');
  });

  it('retorna a lista obtida pelo Prisma', async () => {
    const { subject, findMany } = setup();

    await expect(subject.listUsers()).resolves.toEqual(users);

    expect(findMany).toHaveBeenCalledTimes(1);
  });
});