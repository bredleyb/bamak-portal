import 'reflect-metadata';
import {
  ForbiddenException,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminAccessGuard } from './admin-access.guard';
import {
  ADMIN_ROLES_KEY,
  RequireRoles,
} from './require-roles.decorator';
import { SessionService } from './session.service';

type Role = 'ADMINISTRATOR' | 'OPERATOR';

describe('AdminAccessGuard', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const cookieName = 'bamak_admin_session';
  const token = 'token-ficticio-de-teste';

  let validateSession: jest.Mock;
  let guard: AdminAccessGuard;

  function makeContext(
    cookie?: string,
    roles?: Role[],
  ) {
    const request: {
      headers: { cookie?: string };
      adminIdentity?: { userId: string; role: Role };
    } = {
      headers: cookie ? { cookie } : {},
    };

    const handler = () => undefined;

    class TestController {}

    if (roles !== undefined) {
      Reflect.defineMetadata(
        ADMIN_ROLES_KEY,
        roles,
        handler,
      );
    }

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => handler,
      getClass: () => TestController,
    } as unknown as ExecutionContext;

    return { context, request };
  }

  beforeEach(() => {
    validateSession = jest.fn();

    guard = new AdminAccessGuard(
      new Reflector(),
      {
        validateSession,
      } as unknown as SessionService,
    );
  });

  it('rejeita requisicao sem cookie de sessao', async () => {
    const { context } = makeContext();

    await expect(
      guard.canActivate(context),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(validateSession).not.toHaveBeenCalled();
  });

  it('rejeita cookies de sessao duplicados', async () => {
    const { context } = makeContext(
      `${cookieName}=${token}; ${cookieName}=outro-token`,
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(validateSession).not.toHaveBeenCalled();
  });

  it('rejeita uma sessao invalida ou expirada', async () => {
    validateSession.mockResolvedValue(null);

    const { context } = makeContext(
      `${cookieName}=${token}`,
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(validateSession).toHaveBeenCalledWith(token);
  });

  it('permite ao administrador acessar operacao restrita', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'ADMINISTRATOR',
    });

    const { context, request } = makeContext(
      `${cookieName}=${token}`,
      ['ADMINISTRATOR'],
    );

    await expect(
      guard.canActivate(context),
    ).resolves.toBe(true);

    expect(request.adminIdentity).toEqual({
      userId,
      role: 'ADMINISTRATOR',
    });
  });

  it('nega ao operador uma operacao exclusiva do administrador', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'OPERATOR',
    });

    const { context } = makeContext(
      `${cookieName}=${token}`,
      ['ADMINISTRATOR'],
    );

    await expect(
      guard.canActivate(context),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('permite ao operador uma operacao administrativa comum', async () => {
    validateSession.mockResolvedValue({
      userId,
      role: 'OPERATOR',
    });

    const { context, request } = makeContext(
      `${cookieName}=${token}`,
    );

    await expect(
      guard.canActivate(context),
    ).resolves.toBe(true);

    expect(request.adminIdentity).toEqual({
      userId,
      role: 'OPERATOR',
    });
  });

  it('aplica imediatamente a alteracao do papel do usuario', async () => {
    validateSession
      .mockResolvedValueOnce({
        userId,
        role: 'ADMINISTRATOR',
      })
      .mockResolvedValueOnce({
        userId,
        role: 'OPERATOR',
      });

    const first = makeContext(
      `${cookieName}=${token}`,
      ['ADMINISTRATOR'],
    );

    const second = makeContext(
      `${cookieName}=${token}`,
      ['ADMINISTRATOR'],
    );

    await expect(
      guard.canActivate(first.context),
    ).resolves.toBe(true);

    await expect(
      guard.canActivate(second.context),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(validateSession).toHaveBeenCalledTimes(2);
  });

  it('nega acesso imediatamente apos desativacao da conta', async () => {
    validateSession
      .mockResolvedValueOnce({
        userId,
        role: 'OPERATOR',
      })
      .mockResolvedValueOnce(null);

    const first = makeContext(`${cookieName}=${token}`);
    const second = makeContext(`${cookieName}=${token}`);

    await expect(
      guard.canActivate(first.context),
    ).resolves.toBe(true);

    await expect(
      guard.canActivate(second.context),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('nao confia em identidade previamente atribuida a requisicao', async () => {
    const { context, request } = makeContext();

    request.adminIdentity = {
      userId,
      role: 'ADMINISTRATOR',
    };

    await expect(
      guard.canActivate(context),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(validateSession).not.toHaveBeenCalled();
  });

  it('registra metadados de papeis com o decorator', () => {
    class ProtectedController {
      @RequireRoles('ADMINISTRATOR')
      manageUsers(this: void) {
        return true;
      }
    }

    const roles = Reflect.getMetadata(
      ADMIN_ROLES_KEY,
      ProtectedController.prototype.manageUsers,
    );

    expect(roles).toEqual(['ADMINISTRATOR']);
  });
});