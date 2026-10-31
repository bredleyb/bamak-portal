import {
  ConflictException,
  NotFoundException,
  type INestApplication,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { createRequestValidationPipe } from '../common/validation/request-validation.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUserAccessService } from './admin-user-access.service';
import { AdminUsersModule } from './admin-users.module';
import { SessionService } from './session.service';

describe('Alteracao de acessos administrativos via HTTP', () => {
  const actorId = '11111111-1111-4111-8111-111111111111';
  const targetId = '22222222-2222-4222-8222-222222222222';
  const cookie = 'bamak_admin_session=token-ficticio-alteracao';

  const rolePath = `/api/admin/users/${targetId}/role`;
  const activePath = `/api/admin/users/${targetId}/active`;

  const updatedUser = {
    id: targetId,
    name: 'Usuario Exemplo',
    email: 'usuario@example.invalid',
    role: 'OPERATOR',
    isActive: true,
    createdAt: '2026-10-22T10:00:00.000Z',
    updatedAt: '2026-10-22T10:00:00.000Z',
  };

  let app: INestApplication;
  let validateSession: jest.Mock;
  let changeRole: jest.Mock;
  let setActive: jest.Mock;

  function sendPatch(
    path: string,
    payload: Record<string, unknown>,
    options: {
      cookie?: boolean;
      origin?: string | null;
    } = {},
  ) {
    const req = request(app.getHttpServer()).patch(path);

    if (options.cookie !== false) {
      req.set('Cookie', cookie);
    }

    if (options.origin !== null) {
      req.set(
        'Origin',
        options.origin ?? 'http://localhost:3000',
      );
    }

    return req.send(payload);
  }

  beforeEach(async () => {
    validateSession = jest.fn().mockResolvedValue({
      userId: actorId,
      role: 'ADMINISTRATOR',
    });

    changeRole = jest.fn().mockResolvedValue(updatedUser);

    setActive = jest.fn().mockResolvedValue({
      ...updatedUser,
      isActive: false,
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AdminUsersModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(SessionService)
      .useValue({ validateSession })
      .overrideProvider(AdminUserAccessService)
      .useValue({ changeRole, setActive })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(createRequestValidationPipe());

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('rejeita ambas as alteracoes sem sessao', async () => {
    const roleResponse = await sendPatch(
      rolePath,
      { role: 'OPERATOR' },
      { cookie: false },
    );

    const activeResponse = await sendPatch(
      activePath,
      { isActive: false },
      { cookie: false },
    );

    expect(roleResponse.status).toBe(401);
    expect(activeResponse.status).toBe(401);
    expect(validateSession).not.toHaveBeenCalled();
    expect(changeRole).not.toHaveBeenCalled();
    expect(setActive).not.toHaveBeenCalled();
  });

  it('nega ambas as alteracoes ao operador', async () => {
    validateSession.mockResolvedValue({
      userId: actorId,
      role: 'OPERATOR',
    });

    const roleResponse = await sendPatch(
      rolePath,
      { role: 'ADMINISTRATOR' },
    );

    const activeResponse = await sendPatch(
      activePath,
      { isActive: false },
    );

    expect(roleResponse.status).toBe(403);
    expect(activeResponse.status).toBe(403);
    expect(changeRole).not.toHaveBeenCalled();
    expect(setActive).not.toHaveBeenCalled();
  });

  it('permite ao administrador alterar o perfil', async () => {
    const response = await sendPatch(
      rolePath,
      { role: 'OPERATOR' },
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user: updatedUser });
    expect(changeRole).toHaveBeenCalledWith(
      targetId,
      'OPERATOR',
      actorId,
    );
    expect(response.headers['cache-control']).toContain(
      'no-store',
    );
  });

  it('permite ao administrador desativar uma conta', async () => {
    const response = await sendPatch(
      activePath,
      { isActive: false },
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { ...updatedUser, isActive: false },
    });
    expect(setActive).toHaveBeenCalledWith(targetId, false, actorId);
    expect(response.headers['cache-control']).toContain(
      'no-store',
    );
  });

  it('nao permite falsificar papel por cabecalhos', async () => {
    validateSession.mockResolvedValue({
      userId: actorId,
      role: 'OPERATOR',
    });

    const response = await request(app.getHttpServer())
      .patch(rolePath)
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:3000')
      .set('X-Admin-Role', 'ADMINISTRATOR')
      .set('X-User-Role', 'ADMINISTRATOR')
      .send({ role: 'ADMINISTRATOR' });

    expect(response.status).toBe(403);
    expect(changeRole).not.toHaveBeenCalled();
  });

  it('rejeita origens ausentes ou externas nas duas rotas', async () => {
    const cases = [
      { path: rolePath, body: { role: 'OPERATOR' } },
      { path: activePath, body: { isActive: false } },
    ];

    for (const entry of cases) {
      for (const origin of [
        null,
        'https://externo.example.invalid',
      ]) {
        const response = await sendPatch(
          entry.path,
          entry.body,
          { origin },
        );

        expect(response.status).toBe(403);
      }
    }

    expect(changeRole).not.toHaveBeenCalled();
    expect(setActive).not.toHaveBeenCalled();
  });

  it('rejeita papeis invalidos e campos adicionais', async () => {
    const invalidPayloads = [
      {},
      { role: 'SUPERADMIN' },
      { role: 123 },
      { role: null },
      { role: 'OPERATOR', unexpected: true },
    ];

    for (const payload of invalidPayloads) {
      const response = await sendPatch(rolePath, payload);

      expect(response.status).toBe(400);
    }

    expect(changeRole).not.toHaveBeenCalled();
  });

  it('rejeita estado ativo invalido e campos adicionais', async () => {
    const invalidPayloads = [
      {},
      { isActive: 'false' },
      { isActive: 0 },
      { isActive: null },
      { isActive: false, unexpected: true },
    ];

    for (const payload of invalidPayloads) {
      const response = await sendPatch(activePath, payload);

      expect(response.status).toBe(400);
    }

    expect(setActive).not.toHaveBeenCalled();
  });

  it('rejeita identificadores de usuario invalidos', async () => {
    const roleResponse = await sendPatch(
      '/api/admin/users/identificador-invalido/role',
      { role: 'OPERATOR' },
    );

    const activeResponse = await sendPatch(
      '/api/admin/users/identificador-invalido/active',
      { isActive: false },
    );

    expect(roleResponse.status).toBe(400);
    expect(activeResponse.status).toBe(400);
    expect(changeRole).not.toHaveBeenCalled();
    expect(setActive).not.toHaveBeenCalled();
  });

  it('retorna 404 quando o usuario nao existe', async () => {
    changeRole.mockRejectedValue(
      new NotFoundException('Usuario nao encontrado.'),
    );
    setActive.mockRejectedValue(
      new NotFoundException('Usuario nao encontrado.'),
    );

    const roleResponse = await sendPatch(
      rolePath,
      { role: 'OPERATOR' },
    );
    const activeResponse = await sendPatch(
      activePath,
      { isActive: false },
    );

    expect(roleResponse.status).toBe(404);
    expect(activeResponse.status).toBe(404);
    expect(changeRole).toHaveBeenCalledWith(
      targetId,
      'OPERATOR',
      actorId,
    );
    expect(setActive).toHaveBeenCalledWith(
      targetId,
      false,
      actorId,
    );
  });

  it('retorna 409 ao tentar remover o ultimo administrador', async () => {
    changeRole.mockRejectedValue(
      new ConflictException('Ultimo administrador ativo.'),
    );
    setActive.mockRejectedValue(
      new ConflictException('Ultimo administrador ativo.'),
    );

    const roleResponse = await sendPatch(
      rolePath,
      { role: 'OPERATOR' },
    );
    const activeResponse = await sendPatch(
      activePath,
      { isActive: false },
    );

    expect(roleResponse.status).toBe(409);
    expect(activeResponse.status).toBe(409);
  });

  it('reavalia permissoes entre requisicoes', async () => {
    validateSession
      .mockResolvedValueOnce({
        userId: actorId,
        role: 'ADMINISTRATOR',
      })
      .mockResolvedValueOnce({
        userId: actorId,
        role: 'OPERATOR',
      });

    const first = await sendPatch(
      rolePath,
      { role: 'OPERATOR' },
    );

    const second = await sendPatch(
      rolePath,
      { role: 'OPERATOR' },
    );

    expect(first.status).toBe(200);
    expect(second.status).toBe(403);
    expect(changeRole).toHaveBeenCalledTimes(1);
    expect(validateSession).toHaveBeenCalledTimes(2);
  });
});
