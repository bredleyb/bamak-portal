import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from './auth.controller';
import { LoginRateLimitService } from './login-rate-limit.service';
import { LoginService } from './login.service';
import { SessionService } from './session.service';

describe('AuthController HTTP', () => {
  const token = 'A'.repeat(43);
  const expiresAt = new Date('2030-01-01T12:00:00.000Z');

  let app: INestApplication;
  let login: jest.Mock;
  let revokeSession: jest.Mock;
  let validateSession: jest.Mock;
  let consumeAttempt: jest.Mock;

  beforeEach(async () => {
    login = jest.fn().mockResolvedValue({ token, expiresAt });
    let attemptCount = 0;

    consumeAttempt = jest.fn(async () => {
      attemptCount += 1;

      return attemptCount <= 5
        ? { allowed: true, retryAfterSeconds: null }
        : { allowed: false, retryAfterSeconds: 900 };
    });
    revokeSession = jest.fn().mockResolvedValue(true);
    validateSession = jest.fn().mockResolvedValue({
      userId: '00000000-0000-4000-8000-000000000001',
      role: 'ADMINISTRATOR',
    });

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginService,
          useValue: { login },
        },
        {
          provide: SessionService,
          useValue: { revokeSession, validateSession },
        },
        {
          provide: LoginRateLimitService,
          useValue: { consumeAttempt },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/auth/login define cookie seguro sem expor token no corpo', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'admin@example.invalid',
        password: 'SenhaFicticia123!',
      });

    expect(response.status).toBe(200);
    expect(login).toHaveBeenCalledWith(
      'admin@example.invalid',
      'SenhaFicticia123!',
    );

    expect(response.body).toEqual({
      expiresAt: expiresAt.toISOString(),
    });

    expect(JSON.stringify(response.body)).not.toContain(token);

    const cookies = ([] as string[])
      .concat(response.headers['set-cookie'] ?? [])
      .join('; ');

    expect(cookies).toContain(`bamak_admin_session=${token}`);
    expect(cookies).toContain('HttpOnly');
    expect(cookies).toContain('SameSite=Strict');
    expect(cookies).toContain('Path=/api');
    expect(cookies).toContain('Max-Age=43200');
  });

  it('POST /api/auth/login rejeita credenciais incorretas sem cookie', async () => {
    login.mockRejectedValue(
      new UnauthorizedException('Credenciais invalidas.'),
    );

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'admin@example.invalid',
        password: 'SenhaErrada123!',
      });

    expect(response.status).toBe(401);
    expect(response.headers['set-cookie']).toBeUndefined();
    expect(JSON.stringify(response.body)).not.toContain(token);
  });

  it('POST /api/auth/logout revoga a sessao e limpa o cookie', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Origin', 'http://localhost:3000')
      .set('Cookie', `bamak_admin_session=${token}`);

    expect(response.status).toBe(204);
    expect(revokeSession).toHaveBeenCalledWith(token);

    const cookies = ([] as string[])
      .concat(response.headers['set-cookie'] ?? [])
      .join('; ');

    expect(cookies).toContain('bamak_admin_session=');
    expect(cookies).toContain('Max-Age=0');
    expect(cookies).toContain('HttpOnly');
    expect(cookies).toContain('Path=/api');
  });

  it('GET /api/auth/me retorna a identidade de uma sessao valida', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', `bamak_admin_session=${token}`);

    expect(response.status).toBe(200);
    expect(validateSession).toHaveBeenCalledWith(token);
    expect(response.body).toEqual({
      userId: '00000000-0000-4000-8000-000000000001',
      role: 'ADMINISTRATOR',
    });
  });

  it('GET /api/auth/me rejeita sessao invalida ou ausente', async () => {
    validateSession.mockResolvedValue(null);

    const invalid = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', `bamak_admin_session=${token}`);

    expect(invalid.status).toBe(401);

    const absent = await request(app.getHttpServer())
      .get('/api/auth/me');

    expect(absent.status).toBe(401);
  });

  it('rejeita login com origem ausente ou externa', async () => {
    const origins = [
      undefined,
      'https://externo.invalid',
      'http://localhost:3000.evil.invalid',
      'null',
    ];

    for (const origin of origins) {
      const operation = request(app.getHttpServer())
        .post('/api/auth/login');

      if (origin !== undefined) {
        operation.set('Origin', origin);
      }

      const response = await operation.send({
        email: 'admin@example.invalid',
        password: 'SenhaFicticia123!',
      });

      expect(response.status).toBe(403);
      expect(response.headers['set-cookie']).toBeUndefined();
    }

    expect(login).not.toHaveBeenCalled();
  });

  it('rejeita logout com origem ausente ou externa', async () => {
    const origins = [
      undefined,
      'https://externo.invalid',
      'http://localhost:3000.evil.invalid',
      'null',
    ];

    for (const origin of origins) {
      const operation = request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Cookie', `bamak_admin_session=${token}`);

      if (origin !== undefined) {
        operation.set('Origin', origin);
      }

      const response = await operation;

      expect(response.status).toBe(403);
      expect(response.headers['set-cookie']).toBeUndefined();
    }

    expect(revokeSession).not.toHaveBeenCalled();
  });

  it('limita tentativas repetidas de login', async () => {
    login.mockRejectedValue(
      new UnauthorizedException('Credenciais invalidas.'),
    );

    for (let attempt = 0; attempt < 5; attempt++) {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:3000')
        .send({
          email: 'admin@example.invalid',
          password: 'SenhaIncorreta123!',
        });

      expect(response.status).toBe(401);
    }

    const blocked = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'admin@example.invalid',
        password: 'SenhaIncorreta123!',
      });

    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);
    expect(login).toHaveBeenCalledTimes(5);
    expect(consumeAttempt).toHaveBeenCalledTimes(6);

    const uniqueIps = new Set(
      consumeAttempt.mock.calls.map(
        (args: unknown[]) => args[0],
      ),
    );

    expect(uniqueIps.size).toBe(1);
  });

  it('impede contorno do limite variando email ou cabecalho de IP', async () => {
    login.mockRejectedValue(
      new UnauthorizedException('Credenciais invalidas.'),
    );

    for (let attempt = 0; attempt < 5; attempt++) {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:3000')
        .set('X-Forwarded-For', `203.0.113.${attempt + 1}`)
        .send({
          email: `usuario${attempt}@example.invalid`,
          password: 'SenhaIncorreta123!',
        });

      expect(response.status).toBe(401);
    }

    const blocked = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .set('X-Forwarded-For', '203.0.113.250')
      .send({
        email: 'outro@example.invalid',
        password: 'SenhaIncorreta123!',
      });

    expect(blocked.status).toBe(429);
    expect(login).toHaveBeenCalledTimes(5);
    expect(consumeAttempt).toHaveBeenCalledTimes(6);

    const uniqueIps = new Set(
      consumeAttempt.mock.calls.map(
        (args: unknown[]) => args[0],
      ),
    );

    expect(uniqueIps.size).toBe(1);
  });

  it('isola tentativas por IP atras de um proxy confiavel', async () => {
    const expressApp = app.getHttpAdapter().getInstance() as {
      set(setting: string, value: number): void;
    };

    // Simula o unico salto entre Caddy e NestJS.
    expressApp.set('trust proxy', 1);

    const attemptsByIp = new Map<string, number>();

    consumeAttempt.mockImplementation(async (ip: string) => {
      const attempts = (attemptsByIp.get(ip) ?? 0) + 1;
      attemptsByIp.set(ip, attempts);

      return attempts <= 5
        ? { allowed: true, retryAfterSeconds: null }
        : { allowed: false, retryAfterSeconds: 900 };
    });

    login.mockRejectedValue(
      new UnauthorizedException('Credenciais invalidas.'),
    );

    const sendAttempt = (clientIp: string) =>
      request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:3000')
        .set('X-Forwarded-For', clientIp)
        .send({
          email: 'admin@example.invalid',
          password: 'SenhaIncorreta123!',
        });

    for (let attempt = 0; attempt < 5; attempt++) {
      const response = await sendAttempt('198.51.100.20');
      expect(response.status).toBe(401);
    }

    const blocked = await sendAttempt('198.51.100.20');

    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);

    const otherClient = await sendAttempt('198.51.100.21');

    expect(otherClient.status).toBe(401);

    expect(attemptsByIp.get('198.51.100.20')).toBe(6);
    expect(attemptsByIp.get('198.51.100.21')).toBe(1);

    expect(
      consumeAttempt.mock.calls.map(
        (args: unknown[]) => args[0],
      ),
    ).toEqual([
      '198.51.100.20',
      '198.51.100.20',
      '198.51.100.20',
      '198.51.100.20',
      '198.51.100.20',
      '198.51.100.20',
      '198.51.100.21',
    ]);

    expect(login).toHaveBeenCalledTimes(6);
  });
});