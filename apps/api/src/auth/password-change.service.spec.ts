import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordChangeService } from './password-change.service';
import { PasswordService } from './password.service';

describe('PasswordChangeService', () => {
  const USER_ID = '11111111-1111-4111-8111-111111111111';
  const OLD_PASSWORD = 'SenhaAntiga123!';
  const NEW_PASSWORD = 'SenhaNovaSegura456!';
  const STORED_HASH = 'hash-antigo-ficticio';
  const NEW_HASH = 'hash-novo-ficticio';

  type ExistingUser = {
    passwordHash: string;
    isActive: boolean;
  };

  function setup(
    existing: ExistingUser | null = {
      passwordHash: STORED_HASH,
      isActive: true,
    },
  ) {
    const findUnique = jest.fn().mockResolvedValue(existing);

    const updateUser = jest.fn().mockResolvedValue({
      count: 1,
    });

    const revokeSessions = jest.fn().mockResolvedValue({
      count: 2,
    });

    const tx = {
      user: { updateMany: updateUser },
      session: { updateMany: revokeSessions },
    };

    const transaction = jest.fn(
      async (
        callback: (client: typeof tx) => Promise<unknown>,
      ) => callback(tx),
    );

    const verifyPassword = jest.fn().mockImplementation(
      async (candidate: string) =>
        candidate === OLD_PASSWORD,
    );

    const hashPassword = jest.fn().mockResolvedValue(
      NEW_HASH,
    );

    const prisma = {
      user: { findUnique },
      $transaction: transaction,
    } as unknown as PrismaService;

    const passwords = {
      verifyPassword,
      hashPassword,
    } as unknown as PasswordService;

    const subject = new PasswordChangeService(
      prisma,
      passwords,
    );

    return {
      subject,
      findUnique,
      transaction,
      verifyPassword,
      hashPassword,
      updateUser,
      revokeSessions,
    };
  }

  it('troca o hash e revoga todas as sessoes na mesma transacao', async () => {
    const {
      subject,
      findUnique,
      transaction,
      verifyPassword,
      hashPassword,
      updateUser,
      revokeSessions,
    } = setup();

    await expect(
      subject.changeOwnPassword(
        USER_ID,
        OLD_PASSWORD,
        NEW_PASSWORD,
      ),
    ).resolves.toBeUndefined();

    expect(findUnique).toHaveBeenCalledWith({
      where: { id: USER_ID },
      select: {
        passwordHash: true,
        isActive: true,
      },
    });

    expect(verifyPassword).toHaveBeenNthCalledWith(
      1,
      OLD_PASSWORD,
      STORED_HASH,
    );

    expect(verifyPassword).toHaveBeenNthCalledWith(
      2,
      NEW_PASSWORD,
      STORED_HASH,
    );

    expect(hashPassword).toHaveBeenCalledWith(
      NEW_PASSWORD,
    );

    expect(transaction).toHaveBeenCalledTimes(1);

    expect(updateUser).toHaveBeenCalledWith({
      where: {
        id: USER_ID,
        passwordHash: STORED_HASH,
        isActive: true,
      },
      data: { passwordHash: NEW_HASH },
    });

    expect(revokeSessions).toHaveBeenCalledWith({
      where: {
        userId: USER_ID,
        revokedAt: null,
      },
      data: {
        revokedAt: expect.any(Date),
      },
    });

    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(revokeSessions).toHaveBeenCalledTimes(1);
  });

  it('rejeita senha atual incorreta', async () => {
    const {
      subject,
      hashPassword,
      transaction,
    } = setup();

    await expect(
      subject.changeOwnPassword(
        USER_ID,
        'SenhaErrada123!',
        NEW_PASSWORD,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(hashPassword).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
  });

  it('rejeita usuario inexistente', async () => {
    const {
      subject,
      verifyPassword,
      transaction,
    } = setup(null);

    await expect(
      subject.changeOwnPassword(
        USER_ID,
        OLD_PASSWORD,
        NEW_PASSWORD,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(verifyPassword).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
  });

  it('rejeita conta desativada', async () => {
    const {
      subject,
      verifyPassword,
      transaction,
    } = setup({
      passwordHash: STORED_HASH,
      isActive: false,
    });

    await expect(
      subject.changeOwnPassword(
        USER_ID,
        OLD_PASSWORD,
        NEW_PASSWORD,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(verifyPassword).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
  });

  it('rejeita senha nova igual a atual', async () => {
    const {
      subject,
      hashPassword,
      transaction,
    } = setup();

    await expect(
      subject.changeOwnPassword(
        USER_ID,
        OLD_PASSWORD,
        OLD_PASSWORD,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(hashPassword).not.toHaveBeenCalled();
    expect(transaction).not.toHaveBeenCalled();
  });

  it('nao inicia transacao quando geracao do hash falha', async () => {
    const {
      subject,
      hashPassword,
      transaction,
    } = setup();

    hashPassword.mockRejectedValue(
      new Error('Falha ficticia no hash.'),
    );

    await expect(
      subject.changeOwnPassword(
        USER_ID,
        OLD_PASSWORD,
        NEW_PASSWORD,
      ),
    ).rejects.toThrow('Falha ficticia no hash.');

    expect(transaction).not.toHaveBeenCalled();
  });

  it('rejeita alteracao concorrente do hash existente', async () => {
    const {
      subject,
      updateUser,
      revokeSessions,
    } = setup();

    updateUser.mockResolvedValue({ count: 0 });

    await expect(
      subject.changeOwnPassword(
        USER_ID,
        OLD_PASSWORD,
        NEW_PASSWORD,
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(revokeSessions).not.toHaveBeenCalled();
  });

  it('propaga falha na revogacao para impedir commit parcial', async () => {
    const {
      subject,
      transaction,
      updateUser,
      revokeSessions,
    } = setup();

    revokeSessions.mockRejectedValue(
      new Error('Falha ficticia na revogacao.'),
    );

    await expect(
      subject.changeOwnPassword(
        USER_ID,
        OLD_PASSWORD,
        NEW_PASSWORD,
      ),
    ).rejects.toThrow(
      'Falha ficticia na revogacao.',
    );

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(revokeSessions).toHaveBeenCalledTimes(1);
  });

  it('revoga sessoes somente depois da atualizacao condicional', async () => {
    const {
      subject,
      updateUser,
      revokeSessions,
    } = setup();

    await subject.changeOwnPassword(
      USER_ID,
      OLD_PASSWORD,
      NEW_PASSWORD,
    );

    expect(
      updateUser.mock.invocationCallOrder[0],
    ).toBeLessThan(
      revokeSessions.mock.invocationCallOrder[0],
    );
  });
});