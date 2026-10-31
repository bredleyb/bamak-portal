import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import type { AdminRole } from './require-roles.decorator';

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}

const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

function isUniqueConstraintViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

@Injectable()
export class AdminUserCreationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
  ) {}

  async createUser(input: CreateAdminUserInput, actorId: string) {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    // O hash e calculado antes da transacao para minimizar
    // a duracao do bloqueio sobre operacoes administrativas.
    const passwordHash = await this.passwords.hashPassword(
      input.password,
    );

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Mesma chave utilizada pela alteracao de perfil e
        // ativacao. Serializa operacoes sobre permissoes.
        await tx.$queryRaw<{ locked: string }[]>`
          SELECT pg_advisory_xact_lock(710245, 96)::text
            AS "locked"
        `;

        // Revalidar a autorizacao depois de obter o bloqueio.
        // O ator pode ter perdido privilegios durante o hash.
        const actor = await tx.user.findUnique({
          where: { id: actorId },
          select: {
            role: true,
            isActive: true,
          },
        });

        if (!actor || !actor.isActive) {
          throw new UnauthorizedException('Sessao invalida.');
        }

        if (actor.role !== 'ADMINISTRATOR') {
          throw new ForbiddenException('Acesso negado.');
        }

        const user = await tx.user.create({
          data: {
            name,
            email,
            passwordHash,
            role: input.role,
            isActive: true,
          },
          select: PUBLIC_USER_SELECT,
        });

        // A concessao inicial e auditada na mesma transacao.
        // Falha na auditoria desfaz tambem a criacao da conta.
        await tx.adminAccessEvent.create({
          data: {
            actorId,
            targetUserId: user.id,
            eventType: 'CREATED',
            previousRole: null,
            newRole: input.role,
            previousIsActive: null,
            newIsActive: true,
          },
        });

        return user;
      });
    } catch (error: unknown) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException(
          'Ja existe uma conta com os dados informados.',
        );
      }

      throw error;
    }
  }
}
