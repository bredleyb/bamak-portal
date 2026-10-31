import { SessionTokenService } from './session-token.service';

describe('SessionTokenService', () => {
  let service: SessionTokenService;

  beforeEach(() => {
    service = new SessionTokenService();
  });

  it('gera token aleatorio de 256 bits e hash SHA-256', () => {
    const { token, tokenHash } = service.createToken();

    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(Buffer.from(token, 'base64url')).toHaveLength(32);

    expect(tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenHash).not.toBe(token);

    expect(service.hashToken(token)).toBe(tokenHash);
  });

  it('gera tokens independentes em emissoes consecutivas', () => {
    const first = service.createToken();
    const second = service.createToken();

    expect(first.token).not.toBe(second.token);
    expect(first.tokenHash).not.toBe(second.tokenHash);
  });

  it('rejeita tokens com formato invalido', () => {
    const invalidTokens = [
      '',
      'abc',
      'a'.repeat(44),
      'token+invalido/',
      'x'.repeat(43) + '=',
    ];

    for (const token of invalidTokens) {
      expect(service.hashToken(token)).toBeNull();
    }
  });
});