import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { createRequestValidationPipe } from '../common/validation/request-validation.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { LoginRateLimitService } from './login-rate-limit.service';
import { PasswordService } from './password.service';

describe('Autenticacao integrada ao AppModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const passwordHash = await new PasswordService().hashPassword(
      'SenhaFicticia123!',
    );

    const user = {
      id: '00000000-0000-4000-8000-000000000001',
      email: 'admin@example.invalid',
      passwordHash,
      role: 'ADMINISTRATOR' as const,
      isActive: true,
    };

    let storedSession: {
      tokenHash: string;
      expiresAt: Date;
      revokedAt: Date | null;
    } | null = null;

    const prisma = {
      user: {
        findUnique: jest.fn(
          async ({ where }: { where: { email: string } }) =>
            where.email === user.email ? user : null,
        ),
      },
      session: {
        create: jest.fn(
          async ({
            data,
          }: {
            data: {
              userId: string;
              tokenHash: string;
              expiresAt: Date;
            };
          }) => {
            if (data.userId !== user.id) {
              throw new Error('Usuario de teste inesperado.');
            }

            storedSession = {
              tokenHash: data.tokenHash,
              expiresAt: data.expiresAt,
              revokedAt: null,
            };

            return { id: 'sessao-ficticia' };
          },
        ),
        findUnique: jest.fn(
          async ({
            where,
          }: {
            where: { tokenHash: string };
          }) => {
            const current = storedSession;

            if (!current || current.tokenHash !== where.tokenHash) {
              return null;
            }

            return {
              ...current,
              user: {
                id: user.id,
                role: user.role,
                isActive: user.isActive,
              },
            };
          },
        ),
        updateMany: jest.fn(
          async ({
            where,
            data,
          }: {
            where: {
              tokenHash: string;
              revokedAt: null;
              expiresAt: { gt: Date };
            };
            data: { revokedAt: Date };
          }) => {
            const current = storedSession;

            if (
              !current ||
              current.tokenHash !== where.tokenHash ||
              current.revokedAt !== null ||
              current.expiresAt.getTime() <=
                where.expiresAt.gt.getTime()
            ) {
              return { count: 0 };
            }

            current.revokedAt = data.revokedAt;

            return { count: 1 };
          },
        ),
      },
      $queryRaw: jest.fn().mockResolvedValue([{ resultado: 1 }]),
    };

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .overrideProvider(LoginRateLimitService)
      .useValue({
        consumeAttempt: jest.fn().mockResolvedValue({
          allowed: true,
          retryAfterSeconds: null,
        }),
      })
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(createRequestValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('executa login, consulta sessao, logout e bloqueia reutilizacao', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'admin@example.invalid',
        password: 'SenhaFicticia123!',
      });

    expect(login.status).toBe(200);
    expect(login.body).toEqual({
      expiresAt: expect.any(String),
    });

    const header = login.headers['set-cookie'];
    const firstCookie = Array.isArray(header) ? header[0] : header;

    expect(firstCookie).toContain('bamak_admin_session=');

    const sessionCookie = firstCookie.split(';')[0];

    const authenticated = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', sessionCookie);

    expect(authenticated.status).toBe(200);
    expect(authenticated.body).toEqual({
      userId: '00000000-0000-4000-8000-000000000001',
      role: 'ADMINISTRATOR',
    });

    const logout = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Origin', 'http://localhost:3000')
      .set('Cookie', sessionCookie);

    expect(logout.status).toBe(204);

    const revoked = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', sessionCookie);

    expect(revoked.status).toBe(401);
  });

  it('nega consulta administrativa sem sessao', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/me');

    expect(response.status).toBe(401);
  });

  it('rejeita campos adicionais no login', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'admin@example.invalid',
        password: 'SenhaFicticia123!',
        campoInesperado: 'valor',
      });

    expect(response.status).toBe(400);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('rejeita senha ausente ou de tipo incorreto', async () => {
    const payloads = [
      { email: 'admin@example.invalid' },
      {
        email: 'admin@example.invalid',
        password: 123,
      },
    ];

    for (const payload of payloads) {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:3000')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.headers['set-cookie']).toBeUndefined();
    }
  });

  it('rejeita email invalido e senha excessivamente longa', async () => {
    const payloads = [
      {
        email: 'email-invalido',
        password: 'SenhaFicticia123!',
      },
      {
        email: 'admin@example.invalid',
        password: 'a'.repeat(1025),
      },
    ];

    for (const payload of payloads) {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('Origin', 'http://localhost:3000')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.headers['set-cookie']).toBeUndefined();
    }
  });
});