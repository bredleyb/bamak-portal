import {
  ConflictException,
  type INestApplication,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { createRequestValidationPipe } from '../common/validation/request-validation.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUserCreationService } from './admin-user-creation.service';
import { AdminUsersModule } from './admin-users.module';
import { SessionService } from './session.service';

describe('Criacao administrativa de usuarios via HTTP', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const cookie = 'bamak_admin_session=token-ficticio-criacao';

  const payload = {
    name: '  Nova Operadora  ',
    email: '  NOVA@EXAMPLE.INVALID  ',
    password: 'SenhaFicticia123!',
    role: 'OPERATOR',
  };

  const createdUser = {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Nova Operadora',
    email: 'nova@example.invalid',
    role: 'OPERATOR',
    isActive: true,
    createdAt: '2026-10-22T10:00:00.000Z',
    updatedAt: '2026-10-22T10:00:00.000Z',
  };

  let app: INestApplication;
  let validateSession: jest.Mock;
  let createUser: jest.Mock;

  const administrator = {
    userId,
    role: 'ADMINISTRATOR',
  };

  const operator = {
    userId,
    role: 'OPERATOR',
  };

  beforeEach(async () => {
    validateSession = jest.fn();
    createUser = jest.fn().mockResolvedValue(createdUser);

    const moduleRef = await Test.createTestingModule({
      imports: [AdminUsersModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(SessionService)
      .useValue({ validateSession })
      .overrideProvider(AdminUserCreationService)
      .useValue({ createUser })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(createRequestValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('rejeita criacao sem sessao', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/admin/users')
      .set('Origin', 'http://localhost:3000')
      .send(payload);

    expect(response.status).toBe(401);
    expect(createUser).not.toHaveBeenCalled();
  });

  it('nega criacao ao operador', async () => {
    validateSession.mockResolvedValue(operator);

    const response = await request(app.getHttpServer())
      .post('/api/admin/users')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:3000')
      .send(payload);

    expect(response.status).toBe(403);
    expect(createUser).not.toHaveBeenCalled();
  });

  it('nao permite falsificar papel por cabecalhos HTTP', async () => {
    validateSession.mockResolvedValue(operator);

    const response = await request(app.getHttpServer())
      .post('/api/admin/users')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:3000')
      .set('X-Admin-Role', 'ADMINISTRATOR')
      .set('X-User-Role', 'ADMINISTRATOR')
      .send(payload);

    expect(response.status).toBe(403);
    expect(createUser).not.toHaveBeenCalled();
  });

  it('rejeita origens ausentes ou externas', async () => {
    validateSession.mockResolvedValue(administrator);

    for (const origin of [null, 'https://externo.example.invalid']) {
      let req = request(app.getHttpServer())
        .post('/api/admin/users')
        .set('Cookie', cookie);

      if (origin !== null) {
        req = req.set('Origin', origin);
      }

      const response = await req.send(payload);

      expect(response.status).toBe(403);
    }

    expect(createUser).not.toHaveBeenCalled();
  });

  it('cria conta validada como administrador', async () => {
    validateSession.mockResolvedValue(administrator);

    const response = await request(app.getHttpServer())
      .post('/api/admin/users')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:3000')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ user: createdUser });

    expect(createUser).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Nova Operadora',
        email: 'nova@example.invalid',
        password: 'SenhaFicticia123!',
        role: 'OPERATOR',
      }),
      userId,
    );

    expect(JSON.stringify(response.body)).not.toContain(
      'passwordHash',
    );
    expect(JSON.stringify(response.body)).not.toContain(
      'SenhaFicticia123!',
    );
  });

  it('rejeita dados invalidos e campos inesperados', async () => {
    validateSession.mockResolvedValue(administrator);

    const invalidPayloads = [
      { ...payload, name: '   ' },
      { ...payload, email: 'email-invalido' },
      { ...payload, password: '' },
      { ...payload, password: 'a'.repeat(1025) },
      { ...payload, role: 'SUPERADMIN' },
      { ...payload, password: undefined },
      { ...payload, campoInesperado: 'valor' },
    ];

    for (const invalidPayload of invalidPayloads) {
      const response = await request(app.getHttpServer())
        .post('/api/admin/users')
        .set('Cookie', cookie)
        .set('Origin', 'http://localhost:3000')
        .send(invalidPayload);

      expect(response.status).toBe(400);
    }

    expect(createUser).not.toHaveBeenCalled();
  });

  it('retorna HTTP 409 em conflito de email', async () => {
    validateSession.mockResolvedValue(administrator);
    createUser.mockRejectedValue(
      new ConflictException('Conta ja existente.'),
    );

    const response = await request(app.getHttpServer())
      .post('/api/admin/users')
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:3000')
      .send(payload);

    expect(response.status).toBe(409);
    expect(createUser).toHaveBeenCalledTimes(1);
  });
});