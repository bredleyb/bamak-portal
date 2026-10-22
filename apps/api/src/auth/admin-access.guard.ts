import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import {
  ADMIN_ROLES_KEY,
  type AdminRole,
} from './require-roles.decorator';
import { SessionService } from './session.service';
import { readSessionToken } from './auth-http-security';

interface AdminIdentity {
  userId: string;
  role: AdminRole;
}

type AdminRequest = Request & {
  adminIdentity?: AdminIdentity;
};

@Injectable()
export class AdminAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessions: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AdminRequest>();

    // Nunca confiar em identidade previamente presente na requisicao.
    delete request.adminIdentity;

    const token = readSessionToken(request);

    if (!token) {
      throw new UnauthorizedException('Sessao invalida.');
    }

    const identity = await this.sessions.validateSession(token);

    if (!identity) {
      throw new UnauthorizedException('Sessao invalida.');
    }

    const allowedRoles =
      this.reflector.getAllAndOverride<AdminRole[]>(
        ADMIN_ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

    // Sem restricao especifica, ambos os papeis autenticados
    // podem acessar a rota protegida.
    if (
      allowedRoles !== undefined &&
      !allowedRoles.includes(identity.role)
    ) {
      throw new ForbiddenException('Acesso negado.');
    }

    request.adminIdentity = identity;

    return true;
  }
}