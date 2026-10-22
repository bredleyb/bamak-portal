import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';

const TOKEN_LENGTH = 32;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export interface SessionToken {
  token: string;
  tokenHash: string;
}

@Injectable()
export class SessionTokenService {
  createToken(): SessionToken {
    const bytes = randomBytes(TOKEN_LENGTH);

    return {
      token: bytes.toString('base64url'),
      tokenHash: createHash('sha256')
        .update(bytes)
        .digest('hex'),
    };
  }

  hashToken(token: string): string | null {
    if (
      typeof token !== 'string' ||
      !TOKEN_PATTERN.test(token)
    ) {
      return null;
    }

    const bytes = Buffer.from(token, 'base64url');

    if (
      bytes.length !== TOKEN_LENGTH ||
      bytes.toString('base64url') !== token
    ) {
      return null;
    }

    return createHash('sha256')
      .update(bytes)
      .digest('hex');
  }
}