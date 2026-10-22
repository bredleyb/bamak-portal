import { UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';
import { PasswordService } from './password.service';

describe('LoginService', () => {
  const user = {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'admin@example.invalid',
    passwordHash: 'hash-ficticio',
    isActive: true,
  };

  const createdSession = {
    token: 'token-ficticio-de-teste',
    expiresAt: new Date('2030-01-01T12:00:00.000Z'),
  };

  function setup() {
    const findUnique = jest.fn().mockResolvedValue(user);
    const verifyPassword = jest.fn().mockResolvedValue(true);
    const createSession = jest.fn().mockResolvedValue(createdSession);

    const subject = new LoginService(
      { user: { findUnique } } as never,
      { verifyPassword } as never,
      { createSession } as never,
    );

    return {
      subject,
      findUnique,
      verifyPassword,
      createSession,
    };
  }

  it('autentica credenciais corretas e cria uma sessao', async () => {
    const {
      subject,
      findUnique,
      verifyPassword,
      createSession,
    } = setup();

    await expect(
      subject.login(
        '  ADMIN@example.invalid  ',
        'SenhaFicticia123!',
      ),
    ).resolves.toEqual(createdSession);

    expect(findUnique).toHaveBeenCalledWith({
      where: { email: 'admin@example.invalid' },
      select: {
        id: true,
        passwordHash: true,
        isActive: true,
      },
    });

    expect(verifyPassword).toHaveBeenCalledWith(
      'SenhaFicticia123!',
      user.passwordHash,
    );

    expect(createSession).toHaveBeenCalledWith(user.id);
  });

  it('rejeita senha incorreta sem criar sessao', async () => {
    const { subject, verifyPassword, createSession } = setup();

    verifyPassword.mockResolvedValue(false);

    await expect(
      subject.login('admin@example.invalid', 'SenhaErrada123!'),
    ).rejects.toThrow(UnauthorizedException);

    expect(createSession).not.toHaveBeenCalled();
  });

  it('rejeita usuario inexistente com verificacao de senha', async () => {
    const {
      subject,
      findUnique,
      verifyPassword,
      createSession,
    } = setup();

    findUnique.mockResolvedValue(null);
    verifyPassword.mockResolvedValue(false);

    await expect(
      subject.login('ausente@example.invalid', 'SenhaFicticia123!'),
    ).rejects.toThrow(UnauthorizedException);

    expect(verifyPassword).toHaveBeenCalledWith(
      'SenhaFicticia123!',
      expect.any(String),
    );

    expect(createSession).not.toHaveBeenCalled();
  });

  it('rejeita usuario desativado mesmo com senha correta', async () => {
    const {
      subject,
      findUnique,
      verifyPassword,
      createSession,
    } = setup();

    findUnique.mockResolvedValue({
      ...user,
      isActive: false,
    });

    await expect(
      subject.login('admin@example.invalid', 'SenhaFicticia123!'),
    ).rejects.toThrow(UnauthorizedException);

    expect(verifyPassword).toHaveBeenCalled();

    expect(createSession).not.toHaveBeenCalled();
  });

  it('rejeita email invalido sem consultar o banco', async () => {
    const {
      subject,
      findUnique,
      createSession,
    } = setup();

    await expect(
      subject.login('email-invalido', 'SenhaFicticia123!'),
    ).rejects.toThrow(UnauthorizedException);

    expect(findUnique).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it('executa verificacao criptografica real para usuario inexistente', async () => {
    const findUnique = jest.fn().mockResolvedValue(null);
    const createSession = jest.fn();

    const realPasswords = new PasswordService();

    const verifyPassword = jest.fn(
      async (password: string, encodedHash: string) => {
        expect(encodedHash).toMatch(
          /^scrypt-v1\$16384\$8\$1\$[0-9a-f]{32}\$[0-9a-f]{128}$/,
        );

        return realPasswords.verifyPassword(password, encodedHash);
      },
    );

    const subject = new LoginService(
      { user: { findUnique } } as never,
      { verifyPassword } as never,
      { createSession } as never,
    );

    await expect(
      subject.login(
        'inexistente@example.invalid',
        'SenhaFicticia123!',
      ),
    ).rejects.toThrow(UnauthorizedException);

    expect(findUnique).toHaveBeenCalledTimes(1);
    expect(verifyPassword).toHaveBeenCalledTimes(1);
    expect(createSession).not.toHaveBeenCalled();
  });
});