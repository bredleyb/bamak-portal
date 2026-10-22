import {
  ConflictException,
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

@Injectable()
export class AdminUserAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async changeRole(userId: string, role: AdminRole) {
    return this.updateAccess(userId, { role });
  }

  async setActive(userId: string, isActive: boolean) {
    return this.updateAccess(userId, { isActive });
  }

  private async updateAccess(
    userId: string,
    data: AccessChange,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Bloqueio global para alteracoes de perfil e ativacao.
      // Todas as operacoes deste servico usam a mesma chave.
      // O PostgreSQL libera o bloqueio ao fim da transacao.
      await tx.$queryRaw<{ locked: string }[]>`
        SELECT pg_advisory_xact_lock(710245, 96)::text
          AS "locked"
      `;

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

      return tx.user.update({
        where: { id: userId },
        data,
        select: PUBLIC_USER_SELECT,
      });
    });
  }
}