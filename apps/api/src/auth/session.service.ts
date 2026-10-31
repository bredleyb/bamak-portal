import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionTokenService } from './session-token.service';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionTokens: SessionTokenService,
  ) {}

  async createSession(
    userId: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const { token, tokenHash } = this.sessionTokens.createToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await this.prisma.session.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { token, expiresAt };
  }

  async validateSession(
    token: string,
  ): Promise<{
    userId: string;
    role: 'ADMINISTRATOR' | 'OPERATOR';
  } | null> {
    const tokenHash = this.sessionTokens.hashToken(token);

    if (!tokenHash) {
      return null;
    }

    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      select: {
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            id: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (
      !session ||
      session.revokedAt !== null ||
      session.expiresAt.getTime() <= Date.now() ||
      !session.user.isActive
    ) {
      return null;
    }

    return {
      userId: session.user.id,
      role: session.user.role,
    };
  }

  async revokeSession(token: string): Promise<boolean> {
    const tokenHash = this.sessionTokens.hashToken(token);

    if (!tokenHash) {
      return false;
    }

    const now = new Date();

    const result = await this.prisma.session.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      data: {
        revokedAt: now,
      },
    });

    return result.count > 0;
  }
}