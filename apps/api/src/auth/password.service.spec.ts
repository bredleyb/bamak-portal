import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('gera um hash e valida a senha correta', async () => {
    const password = 'Senha-Ficticia-Segura!2026';

    const hash = await service.hashPassword(password);

    expect(hash).toEqual(expect.any(String));
    expect(hash).not.toBe(password);
    expect(hash).not.toContain(password);

    await expect(
      service.verifyPassword(password, hash),
    ).resolves.toBe(true);
  });

  it('rejeita uma senha incorreta', async () => {
    const hash = await service.hashPassword(
      'Senha-Ficticia-Segura!2026',
    );

    await expect(
      service.verifyPassword('Senha-Incorreta!2026', hash),
    ).resolves.toBe(false);
  });

  it('gera hashes diferentes para a mesma senha', async () => {
    const password = 'Senha-Ficticia-Segura!2026';

    const first = await service.hashPassword(password);
    const second = await service.hashPassword(password);

    expect(first).not.toBe(second);

    await expect(
      service.verifyPassword(password, first),
    ).resolves.toBe(true);

    await expect(
      service.verifyPassword(password, second),
    ).resolves.toBe(true);
  });

  it('rejeita hashes invalidos sem autenticar', async () => {
    await expect(
      service.verifyPassword('Senha-Ficticia-Segura!2026', 'hash-invalido'),
    ).resolves.toBe(false);
  });

  it('rejeita senhas vazias e excessivamente longas', async () => {
    await expect(
      service.hashPassword(''),
    ).rejects.toThrow(RangeError);

    await expect(
      service.hashPassword('x'.repeat(1025)),
    ).rejects.toThrow(RangeError);
  });

  it('respeita o limite de bytes UTF-8', async () => {
    await expect(
      service.hashPassword('á'.repeat(513)),
    ).rejects.toThrow(RangeError);
  });

  it('rejeita um hash criptograficamente adulterado', async () => {
    const password = 'Senha-Ficticia-Segura!2026';
    const hash = await service.hashPassword(password);

    const final = hash.slice(-1);
    const alterado = hash.slice(0, -1) +
      (final === 'a' ? 'b' : 'a');

    await expect(
      service.verifyPassword(password, alterado),
    ).resolves.toBe(false);
  });

  it('rejeita formato e parametros de hash manipulados', async () => {
    const password = 'Senha-Ficticia-Segura!2026';
    const hash = await service.hashPassword(password);

    const partes = hash.split('$');

    await expect(
      service.verifyPassword('', hash),
    ).resolves.toBe(false);

    await expect(
      service.verifyPassword(
        password,
        ['scrypt-v2', ...partes.slice(1)].join('$'),
      ),
    ).resolves.toBe(false);

    await expect(
      service.verifyPassword(
        password,
        [partes[0], '1', ...partes.slice(2)].join('$'),
      ),
    ).resolves.toBe(false);
  });
});
