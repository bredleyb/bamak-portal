import { createHash } from 'node:crypto';
import { LoginRateLimitService } from './login-rate-limit.service';

describe('LoginRateLimitService', () => {
  function setup() {
    const queryRaw = jest.fn();

    const subject = new LoginRateLimitService({
      $queryRaw: queryRaw,
    } as never);

    return { subject, queryRaw };
  }

  it('permite ate cinco tentativas e utiliza hash do IP', async () => {
    const { subject, queryRaw } = setup();
    const ip = '198.51.100.20';
    const windowStart = new Date();

    queryRaw
      .mockResolvedValueOnce([{ attempts: 1, windowStart }])
      .mockResolvedValueOnce([{ attempts: 5, windowStart }]);

    await expect(subject.consumeAttempt(ip)).resolves.toEqual({
      allowed: true,
      retryAfterSeconds: null,
    });

    await expect(subject.consumeAttempt(ip)).resolves.toEqual({
      allowed: true,
      retryAfterSeconds: null,
    });

    expect(queryRaw).toHaveBeenCalledTimes(2);

    const expectedKey = createHash('sha256')
      .update(ip)
      .digest('hex');

    expect(queryRaw.mock.calls[0][1]).toBe(expectedKey);

    const queryText = (
      queryRaw.mock.calls[0][0] as string[]
    ).join(' ');

    expect(queryText).toMatch(/INSERT\s+INTO/i);
    expect(queryText).toMatch(
      /ON\s+CONFLICT[\s\S]*DO\s+UPDATE/i,
    );
    expect(queryText).toMatch(/RETURNING/i);
    expect(queryText).not.toContain(ip);
  });

  it('bloqueia a sexta tentativa e informa o tempo restante', async () => {
    const { subject, queryRaw } = setup();

    queryRaw.mockResolvedValue([{
      attempts: 6,
      windowStart: new Date(),
    }]);

    const result = await subject.consumeAttempt(
      '198.51.100.20',
    );

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toEqual(
      expect.any(Number),
    );
    expect(result.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(900);
  });

  it('rejeita identificador de IP ausente sem consultar o banco', async () => {
    const { subject, queryRaw } = setup();

    await expect(
      subject.consumeAttempt(''),
    ).rejects.toThrow();

    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('propaga falha do banco sem liberar outra tentativa', async () => {
    const { subject, queryRaw } = setup();

    queryRaw.mockRejectedValue(
      new Error('Falha ficticia do PostgreSQL'),
    );

    await expect(
      subject.consumeAttempt('198.51.100.20'),
    ).rejects.toThrow('Falha ficticia do PostgreSQL');

    expect(queryRaw).toHaveBeenCalledTimes(1);
  });
});