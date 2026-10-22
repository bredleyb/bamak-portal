import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';

@Injectable()
export class PasswordChangeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
  ) {}

  async changeOwnPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        passwordHash: true,
        isActive: true,
      },
    });

    // Nao permitir alteracoes por contas inexistentes
    // ou desativadas.
    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'Nao foi possivel validar as credenciais.',
      );
    }

    const currentPasswordMatches =
      await this.passwords.verifyPassword(
        currentPassword,
        user.passwordHash,
      );

    if (!currentPasswordMatches) {
      throw new UnauthorizedException(
        'Nao foi possivel validar as credenciais.',
      );
    }

    const newPasswordMatchesCurrent =
      await this.passwords.verifyPassword(
        newPassword,
        user.passwordHash,
      );

    if (newPasswordMatchesCurrent) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da atual.',
      );
    }

    // Gerar o novo hash antes de iniciar a transacao,
    // evitando manter conexoes bloqueadas durante scrypt.
    const newPasswordHash =
      await this.passwords.hashPassword(newPassword);

    await this.prisma.$transaction(async (tx) => {
      // Compare-and-swap: a alteracao so ocorre se a
      // conta ainda estiver ativa e o hash nao tiver
      // sido modificado por outra requisicao.
      const updated = await tx.user.updateMany({
        where: {
          id: userId,
          passwordHash: user.passwordHash,
          isActive: true,
        },
        data: {
          passwordHash: newPasswordHash,
        },
      });

      if (updated.count !== 1) {
        throw new ConflictException(
          'As credenciais foram alteradas durante a operacao.',
        );
      }

      // Revogar todas as sessoes nao revogadas.
      // Esta operacao faz parte da mesma transacao
      // da atualizacao do hash.
      await tx.session.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    });
  }
}