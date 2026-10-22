import {
  BadRequestException,
  ConflictException,
  type INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { createRequestValidationPipe } from '../common/validation/request-validation.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth.module';
import { PasswordChangeService } from './password-change.service';
import { SessionService } from './session.service';

describe('Troca de senha administrativa via HTTP', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const otherUserId = '22222222-2222-4222-8222-222222222222';
  const cookie = 'bamak_admin_session=token-ficticio-senha';

  const path = '/api/auth/change-password';

  const body = {
    currentPassword: 'SenhaAtualFicticia123!',
    newPassword: 'SenhaNovaFicticia456!',
  };

  let app: INestApplication;
  let validateSession: jest.Mock;
  let changeOwnPassword: jest.Mock;

  function sendChange(
    payload: Record<string, unknown> = body,
    options: {
      cookie?: string | null;
      origin?: string | null;
    } = {},
  ) {
    const req = request(app.getHttpServer()).post(path);

    const cookieValue =
      options.cookie === undefined
        ? cookie
        : options.cookie;

    if (cookieValue !== null) {
      req.set('Cookie', cookieValue);
    }

    const origin =
      options.origin === undefined
        ? 'http://localhost:3000'
        : options.origin;

    if (origin !== null) {
      req.set('Origin', origin);
    }

    return req.send(payload);
  }

  beforeEach(async () => {
    validateSession = jest.fn().mockResolvedValue({
      userId,
      role: 'ADMINISTRATOR',
    });

    changeOwnPassword = jest.fn().mockResolvedValue(
      undefined,
    );

    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(SessionService)
      .useValue({ validateSession })
      .overrideProvider(PasswordChangeService)
      .useValue({ changeOwnPassword })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(createRequestValidationPipe());

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('rejeita requisicao sem cookie de sessao', async () => {
    const response = await sendChange(body, {
      cookie: null,
    });

    expect(response.status).toBe(401);
    expect(changeOwnPassword).not.toHaveBeenCalled();
  });

  it('rejeita sessao invalida ou revogada', async () => {
    validateSession.mockResolvedValue(null);

    const response = await sendChange();

    expect(response.status).toBe(401);
    expect(changeOwnPassword).not.toHaveBeenCalled();
  });

  it('rejeita cookies de sessao duplicados', async () => {
    const response = await sendChange(body, {
      cookie: `${cookie}; ${cookie}`,
    });

    expect(response.status).toBe(401);
    expect(changeOwnPassword).not.toHaveBeenCalled();
  });

  it('permite ao administrador trocar a propria senha', async () => {
    const response = await sendChange();

    expect(response.status).toBe(204);
    expect(response.text).toBe('');

    expect(changeOwnPassword).toHaveBeenCalledTimes(1);
    expect(changeOwnPassword).toHaveBeenCalledWith(
      userId,
      body.currentPassword,
      body.newPassword,
    );

    expect(response.headers['cache-control']).toContain(
      'no-store',
    );

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();

    const combined = (
      Array.isArray(cookies) ? cookies : [cookies]
    ).join('; ');

    expect(combined).toContain('bamak_admin_session=');
    expect(combined).toMatch(/Max-Age=0/i);
    expect(combined).toMatch(/HttpOnly/i);
    expect(combined).toMatch(/SameSite=Strict/i);
    expect(combined).toMatch(/Path=\/api/i);
  });

  it('permite ao operador trocar a propria senha', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'OPERATOR',
    });

    const response = await sendChange();

    expect(response.status).toBe(204);
    expect(changeOwnPassword).toHaveBeenCalledWith(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  });

  it('rejeita origens ausentes ou externas', async () => {
    for (const origin of [
      null,
      'https://externo.example.invalid',
    ]) {
      const response = await sendChange(body, {
        origin,
      });

      expect(response.status).toBe(403);
    }

    expect(changeOwnPassword).not.toHaveBeenCalled();
  });

  it('rejeita dados invalidos e campos inesperados', async () => {
    const invalidPayloads: Record<string, unknown>[] = [
      {},
      { ...body, currentPassword: '' },
      { ...body, currentPassword: 123 },
      { ...body, currentPassword: 'x'.repeat(1025) },
      { ...body, newPassword: '' },
      { ...body, newPassword: 'curta' },
      { ...body, newPassword: 'x'.repeat(1025) },
      { ...body, newPassword: 'é'.repeat(513) },
      { ...body, newPassword: 123 },
      { ...body, newPassword: null },
      { ...body, unexpected: true },
    ];

    for (const invalidBody of invalidPayloads) {
      const response = await sendChange(invalidBody);

      expect(response.status).toBe(400);
    }

    expect(changeOwnPassword).not.toHaveBeenCalled();
  });

  it('retorna 401 para senha atual incorreta', async () => {
    changeOwnPassword.mockRejectedValue(
      new UnauthorizedException(
        'Credenciais invalidas.',
      ),
    );

    const response = await sendChange();

    expect(response.status).toBe(401);
    expect(changeOwnPassword).toHaveBeenCalledTimes(1);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('retorna 400 quando a senha nova e igual a atual', async () => {
    changeOwnPassword.mockRejectedValue(
      new BadRequestException(
        'A nova senha deve ser diferente.',
      ),
    );

    const response = await sendChange({
      currentPassword: body.currentPassword,
      newPassword: body.currentPassword,
    });

    expect(response.status).toBe(400);
    expect(changeOwnPassword).toHaveBeenCalledTimes(1);
  });

  it('retorna 409 em conflito de alteracao concorrente', async () => {
    changeOwnPassword.mockRejectedValue(
      new ConflictException(
        'Credenciais alteradas em outra requisicao.',
      ),
    );

    const response = await sendChange();

    expect(response.status).toBe(409);
    expect(changeOwnPassword).toHaveBeenCalledTimes(1);
  });

  it('ignora tentativas de falsificar a identidade por cabecalhos', async () => {
    const response = await request(app.getHttpServer())
      .post(path)
      .set('Cookie', cookie)
      .set('Origin', 'http://localhost:3000')
      .set('X-User-Id', otherUserId)
      .set('X-Admin-Role', 'ADMINISTRATOR')
      .send(body);

    expect(response.status).toBe(204);
    expect(changeOwnPassword).toHaveBeenCalledWith(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  });

  it('exige nova validacao da sessao apos a troca', async () => {
    validateSession
      .mockResolvedValueOnce({
        userId,
        role: 'ADMINISTRATOR',
      })
      .mockResolvedValueOnce(null);

    const changed = await sendChange();

    expect(changed.status).toBe(204);

    const subsequentRequest = await request(
      app.getHttpServer(),
    )
      .get('/api/auth/me')
      .set('Cookie', cookie);

    expect(subsequentRequest.status).toBe(401);
    expect(validateSession).toHaveBeenCalledTimes(2);
    expect(changeOwnPassword).toHaveBeenCalledTimes(1);
  });
});