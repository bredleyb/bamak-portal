import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

export interface LoginAttemptDecision {
  allowed: boolean;
  retryAfterSeconds: number | null;
}

@Injectable()
export class LoginRateLimitService {
  constructor(private readonly prisma: PrismaService) {}

  async consumeAttempt(ip: string): Promise<LoginAttemptDecision> {
    if (
      typeof ip !== 'string' ||
      ip.trim().length === 0 ||
      Buffer.byteLength(ip, 'utf8') > 256
    ) {
      throw new TypeError('Identificador de IP invalido.');
    }

    const key = createHash('sha256')
      .update(ip)
      .digest('hex');

    const rows = await this.prisma.$queryRaw<
      Array<{ attempts: number; windowStart: Date }>
    >`
      INSERT INTO "LoginAttemptBucket" (
        "key",
        "windowStart",
        "attempts",
        "updatedAt"
      )
      VALUES (
        ${key},
        CURRENT_TIMESTAMP,
        1,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT ("key") DO UPDATE
      SET
        "attempts" = CASE
          WHEN "LoginAttemptBucket"."windowStart"
            <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
          THEN 1
          ELSE "LoginAttemptBucket"."attempts" + 1
        END,
        "windowStart" = CASE
          WHEN "LoginAttemptBucket"."windowStart"
            <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
          THEN CURRENT_TIMESTAMP
          ELSE "LoginAttemptBucket"."windowStart"
        END,
        "updatedAt" = CURRENT_TIMESTAMP
      RETURNING "attempts", "windowStart"
    `;

    const bucket = rows[0];

    if (!bucket) {
      throw new Error('Falha ao registrar tentativa de login.');
    }

    if (bucket.attempts <= MAX_ATTEMPTS) {
      return {
        allowed: true,
        retryAfterSeconds: null,
      };
    }

    const windowEndsAt =
      bucket.windowStart.getTime() +
      WINDOW_SECONDS * 1000;

    const retryAfterSeconds = Math.max(
      1,
      Math.min(
        WINDOW_SECONDS,
        Math.ceil((windowEndsAt - Date.now()) / 1000),
      ),
    );

    return {
      allowed: false,
      retryAfterSeconds,
    };
  }
}