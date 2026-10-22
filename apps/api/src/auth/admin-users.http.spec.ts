import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUsersModule } from './admin-users.module';
import { AdminUsersService } from './admin-users.service';
import { SessionService } from './session.service';

describe('Gestao de usuarios integrada ao HTTP', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const token = 'token-ficticio-gestao';
  const cookie = `bamak_admin_session=${token}`;

  const users = [
    {
      id: userId,
      name: 'Administrador Exemplo',
      email: 'admin@example.invalid',
      role: 'ADMINISTRATOR',
      isActive: true,
      createdAt: '2026-10-22T10:00:00.000Z',
      updatedAt: '2026-10-22T10:00:00.000Z',
    },
  ];

  let app: INestApplication;
  let validateSession: jest.Mock;
  let listUsers: jest.Mock;

  beforeEach(async () => {
    validateSession = jest.fn();
    listUsers = jest.fn().mockResolvedValue(users);

    const moduleRef = await Test.createTestingModule({
      imports: [AdminUsersModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(SessionService)
      .useValue({ validateSession })
      .overrideProvider(AdminUsersService)
      .useValue({ listUsers })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('rejeita consulta de usuarios sem sessao', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/admin/users');

    expect(response.status).toBe(401);
    expect(listUsers).not.toHaveBeenCalled();
  });

  it('rejeita cookies de sessao duplicados', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/admin/users')
      .set(
        'Cookie',
        `${cookie}; bamak_admin_session=outro-token`,
      );

    expect(response.status).toBe(401);
    expect(listUsers).not.toHaveBeenCalled();
  });

  it('rejeita sessao invalida ou expirada', async () => {
    validateSession.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .get('/api/admin/users')
      .set('Cookie', cookie);

    expect(response.status).toBe(401);
    expect(listUsers).not.toHaveBeenCalled();
  });

  it('nega ao operador acesso direto a gestao de usuarios', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'OPERATOR',
    });

    const response = await request(app.getHttpServer())
      .get('/api/admin/users')
      .set('Cookie', cookie)
      .set('X-Admin-Role', 'ADMINISTRATOR');

    expect(response.status).toBe(403);
    expect(listUsers).not.toHaveBeenCalled();
  });

  it('permite ao administrador consultar usuarios', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'ADMINISTRATOR',
    });

    const response = await request(app.getHttpServer())
      .get('/api/admin/users')
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ users });
    expect(listUsers).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(response.body)).not.toContain(
      'passwordHash',
    );
  });

  it('nega acesso apos rebaixamento para operador', async () => {
    validateSession
      .mockResolvedValueOnce({
        userId,
        role: 'ADMINISTRATOR',
      })
      .mockResolvedValueOnce({
        userId,
        role: 'OPERATOR',
      });

    const first = await request(app.getHttpServer())
      .get('/api/admin/users')
      .set('Cookie', cookie);

    const second = await request(app.getHttpServer())
      .get('/api/admin/users')
      .set('Cookie', cookie);

    expect(first.status).toBe(200);
    expect(second.status).toBe(403);
    expect(listUsers).toHaveBeenCalledTimes(1);
  });

  it('nega acesso apos desativacao da conta', async () => {
    validateSession
      .mockResolvedValueOnce({
        userId,
        role: 'ADMINISTRATOR',
      })
      .mockResolvedValueOnce(null);

    const first = await request(app.getHttpServer())
      .get('/api/admin/users')
      .set('Cookie', cookie);

    const second = await request(app.getHttpServer())
      .get('/api/admin/users')
      .set('Cookie', cookie);

    expect(first.status).toBe(200);
    expect(second.status).toBe(401);
    expect(listUsers).toHaveBeenCalledTimes(1);
  });

  it('impede armazenamento em cache da lista de usuarios', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'ADMINISTRATOR',
    });

    const response = await request(app.getHttpServer())
      .get('/api/admin/users')
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toContain(
      'no-store',
    );
  });
});