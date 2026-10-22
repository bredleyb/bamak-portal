import {
  Controller,
  Get,
  Req,
  UseGuards,
  type INestApplication,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Request } from 'express';
import request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { AdminAccessGuard } from './admin-access.guard';
import { AuthModule } from './auth.module';
import { RequireRoles } from './require-roles.decorator';
import { SessionService } from './session.service';

type Role = 'ADMINISTRATOR' | 'OPERATOR';

type AuthenticatedRequest = Request & {
  adminIdentity?: {
    userId: string;
    role: Role;
  };
};

@Controller('admin/rbac-test')
@UseGuards(AdminAccessGuard)
class RbacTestController {
  @Get('workspace')
  workspace(@Req() req: AuthenticatedRequest) {
    return {
      userId: req.adminIdentity?.userId,
      role: req.adminIdentity?.role,
    };
  }

  @Get('users')
  @RequireRoles('ADMINISTRATOR')
  users(@Req() req: AuthenticatedRequest) {
    return {
      access: 'users',
      role: req.adminIdentity?.role,
    };
  }
}

describe('RBAC integrado ao HTTP', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const token = 'token-ficticio-rbac';
  const cookie = `bamak_admin_session=${token}`;

  let app: INestApplication;
  let validateSession: jest.Mock;

  beforeEach(async () => {
    validateSession = jest.fn();

    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [RbacTestController],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(SessionService)
      .useValue({ validateSession })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('rejeita acesso direto a rota administrativa sem sessao', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/admin/rbac-test/users');

    expect(response.status).toBe(401);
    expect(validateSession).not.toHaveBeenCalled();
  });

  it('rejeita cookies de sessao duplicados', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/admin/rbac-test/users')
      .set('Cookie', `${cookie}; bamak_admin_session=outro`);

    expect(response.status).toBe(401);
    expect(validateSession).not.toHaveBeenCalled();
  });

  it('rejeita sessao expirada ou invalida', async () => {
    validateSession.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .get('/api/admin/rbac-test/workspace')
      .set('Cookie', cookie);

    expect(response.status).toBe(401);
    expect(validateSession).toHaveBeenCalledWith(token);
  });

  it('permite ao operador acessar uma rota administrativa comum', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'OPERATOR',
    });

    const response = await request(app.getHttpServer())
      .get('/api/admin/rbac-test/workspace')
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      userId,
      role: 'OPERATOR',
    });
  });

  it('nega acesso direto do operador a gestao de usuarios', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'OPERATOR',
    });

    const response = await request(app.getHttpServer())
      .get('/api/admin/rbac-test/users')
      .set('Cookie', cookie)
      .set('X-Admin-Role', 'ADMINISTRATOR')
      .set('X-User-Role', 'ADMINISTRATOR');

    expect(response.status).toBe(403);
    expect(response.body).not.toHaveProperty('access');
  });

  it('permite ao administrador acessar gestao de usuarios', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'ADMINISTRATOR',
    });

    const response = await request(app.getHttpServer())
      .get('/api/admin/rbac-test/users')
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      access: 'users',
      role: 'ADMINISTRATOR',
    });
  });

  it('revoga permissao administrativa apos mudanca de perfil', async () => {
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
      .get('/api/admin/rbac-test/users')
      .set('Cookie', cookie);

    const second = await request(app.getHttpServer())
      .get('/api/admin/rbac-test/users')
      .set('Cookie', cookie);

    expect(first.status).toBe(200);
    expect(second.status).toBe(403);
    expect(validateSession).toHaveBeenCalledTimes(2);
  });

  it('bloqueia usuario desativado durante a sessao', async () => {
    validateSession
      .mockResolvedValueOnce({
        userId,
        role: 'OPERATOR',
      })
      .mockResolvedValueOnce(null);

    const first = await request(app.getHttpServer())
      .get('/api/admin/rbac-test/workspace')
      .set('Cookie', cookie);

    const second = await request(app.getHttpServer())
      .get('/api/admin/rbac-test/workspace')
      .set('Cookie', cookie);

    expect(first.status).toBe(200);
    expect(second.status).toBe(401);
    expect(validateSession).toHaveBeenCalledTimes(2);
  });
});