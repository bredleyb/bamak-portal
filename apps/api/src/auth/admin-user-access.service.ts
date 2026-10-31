import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AdminRole } from './require-roles.decorator';

const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

type AccessChange =
  | { role: AdminRole }
  | { isActive: boolean };

type AdministrativeActor = {
  role: AdminRole;
  isActive: boolean;
} | null;

function assertCanManageAccess(
  actor: AdministrativeActor,
  actorId: string,
  userId: string,
): void {
  if (!actor?.isActive) {
    throw new UnauthorizedException('Sessao invalida.');
  }

  if (actor.role !== 'ADMINISTRATOR') {
    throw new ForbiddenException('Acesso negado.');
  }

  if (actorId === userId) {
    throw new ForbiddenException(
      'Nao e permitido alterar o proprio acesso.',
    );
  }
}

@Injectable()
export class AdminUserAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async changeRole(
    userId: string,
    role: AdminRole,
    actorId: string,
  ) {
    return this.updateAccess(userId, { role }, actorId);
  }

  async setActive(
    userId: string,
    isActive: boolean,
    actorId: string,
  ) {
    return this.updateAccess(userId, { isActive }, actorId);
  }

  private async updateAccess(
    userId: string,
    data: AccessChange,
    actorId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Bloqueio global para alteracoes de perfil e ativacao.
      // Todas as operacoes deste servico usam a mesma chave.
      // O PostgreSQL libera o bloqueio ao fim da transacao.
      await tx.$queryRaw<{ locked: string }[]>`
        SELECT pg_advisory_xact_lock(710245, 96)::text
          AS "locked"
      `;

      // A autorizacao deve continuar valida depois
      // da aquisicao do bloqueio transacional.
      const actor = await tx.user.findUnique({
        where: { id: actorId },
        select: {
          role: true,
          isActive: true,
        },
      });

      assertCanManageAccess(actor, actorId, userId);

      const existing = await tx.user.findUnique({
        where: { id: userId },
        select: PUBLIC_USER_SELECT,
      });

      if (!existing) {
        throw new NotFoundException(
          'Usuario administrativo nao encontrado.',
        );
      }

      // Nao executar UPDATE quando o valor ja e o desejado.
      if (
        ('role' in data && existing.role === data.role) ||
        ('isActive' in data &&
          existing.isActive === data.isActive)
      ) {
        return existing;
      }

      const removingAdministratorRole =
        'role' in data && data.role === 'OPERATOR';

      const deactivating =
        'isActive' in data && data.isActive === false;

      // Um administrador inativo ou um operador nao integra
      // o conjunto de administradores ativos.
      if (
        existing.role === 'ADMINISTRATOR' &&
        existing.isActive &&
        (removingAdministratorRole || deactivating)
      ) {
        const activeAdministrators = await tx.user.count({
          where: {
            role: 'ADMINISTRATOR',
            isActive: true,
          },
        });

        if (activeAdministrators <= 1) {
          throw new ConflictException(
            'Nao e permitido remover o ultimo administrador ativo.',
          );
        }
      }

      const updated = await tx.user.update({
        where: { id: userId },
        data,
        select: PUBLIC_USER_SELECT,
      });

      const roleChanged = 'role' in data;

      await tx.adminAccessEvent.create({
        data: {
          actorId,
          targetUserId: userId,
          eventType: roleChanged
            ? 'ROLE_CHANGED'
            : data.isActive
              ? 'ACTIVATED'
              : 'DEACTIVATED',
          previousRole: roleChanged ? existing.role : null,
          newRole: roleChanged ? data.role : null,
          previousIsActive: roleChanged
            ? null
            : existing.isActive,
          newIsActive: roleChanged
            ? null
            : data.isActive,
        },
      });

      return updated;
    });
  }
}
