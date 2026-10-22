import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUserCreationService } from './admin-user-creation.service';
import { PasswordService } from './password.service';

describe('AdminUserCreationService', () => {
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

  function setup() {
    const create = jest.fn().mockResolvedValue(createdUser);
    const hashPassword = jest
      .fn()
      .mockResolvedValue('scrypt-v1$hash-ficticio');

    const prisma = {
      user: { create },
    } as unknown as PrismaService;

    const passwords = {
      hashPassword,
    } as unknown as PasswordService;

    const subject = new AdminUserCreationService(
      prisma,
      passwords,
    );

    return { subject, create, hashPassword };
  }

  it('normaliza os dados e grava somente o hash da senha', async () => {
    const { subject, create, hashPassword } = setup();

    await expect(
      subject.createUser(validInput),
    ).resolves.toEqual(createdUser);

    expect(hashPassword).toHaveBeenCalledTimes(1);
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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const persistenceArguments = JSON.stringify(
      create.mock.calls[0][0],
    );

    expect(persistenceArguments).not.toContain(
      'SenhaFicticia123!',
    );
    expect(persistenceArguments).not.toContain(
      'tokenHash',
    );
  });

  it('permite criar usuario com perfil administrador', async () => {
    const { subject, create } = setup();

    await subject.createUser({
      name: 'Administrador Exemplo',
      email: 'admin@example.invalid',
      password: 'OutraSenhaFicticia123!',
      role: 'ADMINISTRATOR',
    });

    expect(create.mock.calls[0][0].data.role).toBe(
      'ADMINISTRATOR',
    );
    expect(create.mock.calls[0][0].data.isActive).toBe(true);
  });

  it('converte conflito de email unico em ConflictException', async () => {
    const { subject, create } = setup();

    create.mockRejectedValue({
      code: 'P2002',
      meta: { target: ['email'] },
    });

    await expect(
      subject.createUser(validInput),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(create).toHaveBeenCalledTimes(1);
  });

  it('nao tenta gravar usuario quando o hash falha', async () => {
    const { subject, create, hashPassword } = setup();

    hashPassword.mockRejectedValue(
      new Error('Falha ficticia ao gerar hash'),
    );

    await expect(
      subject.createUser(validInput),
    ).rejects.toThrow('Falha ficticia ao gerar hash');

    expect(create).not.toHaveBeenCalled();
  });

  it('nao mascara falhas inesperadas do banco', async () => {
    const { subject, create } = setup();

    create.mockRejectedValue(
      new Error('Falha ficticia de persistencia'),
    );

    await expect(
      subject.createUser(validInput),
    ).rejects.toThrow('Falha ficticia de persistencia');
  });
});